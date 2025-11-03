import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('📊 Daily CI/CD Monitoring Started');
    const monitoringResults: {
      timestamp: string;
      patterns_analyzed: number;
      critical_issues: Array<{
        pattern_name: string;
        success_rate: string;
        usage_count: number;
        failure_count: number;
      }>;
      optimizations_triggered: boolean;
      health_score: number;
    } = {
      timestamp: new Date().toISOString(),
      patterns_analyzed: 0,
      critical_issues: [],
      optimizations_triggered: false,
      health_score: 100
    };

    // 1. Analyze all automation patterns performance
    const { data: patterns, error: patternsError } = await supabase
      .from('automation_patterns')
      .select('*')
      .eq('is_active', true);

    if (patternsError) throw patternsError;

    monitoringResults.patterns_analyzed = patterns?.length || 0;

    // 2. Check for critical failures (success_rate < 50%)
    const criticalPatterns = (patterns || []).filter(p => {
      const successRate = parseFloat(p.success_rate || '0');
      return successRate < 50 && p.usage_count > 5;
    });

    if (criticalPatterns.length > 0) {
      console.log(`🚨 Found ${criticalPatterns.length} critical patterns!`);
      
      for (const pattern of criticalPatterns) {
        monitoringResults.critical_issues.push({
          pattern_name: pattern.pattern_name,
          success_rate: pattern.success_rate,
          usage_count: pattern.usage_count,
          failure_count: pattern.failure_count
        });

        // Create alert
        await supabase.from('alert_logs').insert({
          alert_type: 'automation_failure',
          severity: 'critical',
          source: 'daily-ci-cd-monitor',
          message: `Pattern "${pattern.pattern_name}" has critical failure rate: ${pattern.success_rate}%`,
          details: {
            pattern_id: pattern.id,
            usage_count: pattern.usage_count,
            failure_count: pattern.failure_count,
            last_used: pattern.last_used
          },
          resolved: false
        });
      }

      // Trigger optimizer if failure rate > 10%
      const totalFailureRate = criticalPatterns.length / (patterns?.length || 1) * 100;
      if (totalFailureRate > 10) {
        console.log('🔧 Triggering CI/CD Pattern Optimizer...');
        
        const optimizerResponse = await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/ci-cd-pattern-optimizer`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
            },
            body: JSON.stringify({ triggered_by: 'daily-monitor' })
          }
        );

        if (optimizerResponse.ok) {
          monitoringResults.optimizations_triggered = true;
          console.log('✅ Optimizer triggered successfully');
        }
      }
    }

    // 3. Calculate overall health score
    const avgSuccessRate = (patterns || []).reduce((sum, p) => {
      return sum + parseFloat(p.success_rate || '0');
    }, 0) / (patterns?.length || 1);

    monitoringResults.health_score = Math.round(avgSuccessRate);

    // 4. Check for stale patterns (not used in 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const stalePatterns = (patterns || []).filter(p => 
      !p.last_used || new Date(p.last_used) < thirtyDaysAgo
    );

    if (stalePatterns.length > 0) {
      console.log(`⚠️ Found ${stalePatterns.length} stale patterns (unused for 30+ days)`);
      
      // Deactivate stale patterns
      for (const pattern of stalePatterns) {
        await supabase
          .from('automation_patterns')
          .update({ is_active: false })
          .eq('id', pattern.id);
      }
    }

    // 5. Generate daily report summary
    const reportSummary = {
      date: new Date().toISOString().split('T')[0],
      total_patterns: monitoringResults.patterns_analyzed,
      critical_issues: monitoringResults.critical_issues.length,
      stale_patterns: stalePatterns.length,
      health_score: monitoringResults.health_score,
      optimizations_triggered: monitoringResults.optimizations_triggered
    };

    // 6. Log monitoring action
    await supabase.from('ai_actions_log').insert({
      action_type: 'daily_ci_cd_monitoring',
      task_description: 'Daily CI/CD pipeline health monitoring',
      success: true,
      metadata: reportSummary,
      knowledge_check_performed: true
    });

    // 7. Update agent status
    await supabase
      .from('agent_status')
      .update({
        status: monitoringResults.health_score >= 80 ? 'healthy' : 'degraded',
        last_heartbeat: new Date().toISOString(),
        metadata: {
          health_score: monitoringResults.health_score,
          critical_issues: monitoringResults.critical_issues.length,
          last_monitoring: new Date().toISOString(),
          patterns_analyzed: monitoringResults.patterns_analyzed
        }
      })
      .eq('agent_name', 'CI/CD-Monitor');

    console.log(`✅ Daily Monitoring Complete - Health Score: ${monitoringResults.health_score}%`);

    return new Response(JSON.stringify({
      success: true,
      ...monitoringResults,
      report_summary: reportSummary
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Daily CI/CD Monitor Error:', error);
    
    // Log error
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabase.from('ai_actions_log').insert({
      action_type: 'daily_ci_cd_monitoring',
      task_description: 'Daily CI/CD monitoring failed',
      success: false,
      error_message: errorMessage
    });
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
