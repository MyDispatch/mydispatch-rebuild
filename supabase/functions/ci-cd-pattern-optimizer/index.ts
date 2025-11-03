import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OptimizationResult {
  pattern_id: string;
  pattern_name: string;
  current_success_rate: number;
  optimization_applied: string;
  expected_improvement: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔧 CI/CD Pattern Optimizer Started');

    // 1. Fetch all active patterns with usage data
    const { data: patterns, error: patternsError } = await supabase
      .from('automation_patterns')
      .select('*')
      .eq('is_active', true)
      .gte('usage_count', 5) // Only optimize patterns used at least 5 times
      .order('success_rate', { ascending: true }); // Worst performers first

    if (patternsError) throw patternsError;

    const optimizations: OptimizationResult[] = [];

    // 2. Analyze each pattern and apply autonomous optimizations
    for (const pattern of patterns || []) {
      const successRate = parseFloat(pattern.success_rate || '0');
      
      // AUTONOMOUS OPTIMIZATION LOGIC
      if (successRate < 70) {
        // Critical: Success rate below 70%
        console.log(`🚨 Critical Pattern: ${pattern.pattern_name} (${successRate}%)`);

        const suggestions: string[] = [];

        // Optimization 1: Increase timeout for slow patterns
        if (pattern.avg_duration_seconds > pattern.expected_duration_seconds * 1.5) {
          const newTimeout = Math.ceil(pattern.avg_duration_seconds * 1.2);
          suggestions.push(`Increase expected_duration to ${newTimeout}s (currently too low)`);
          
          await supabase
            .from('automation_patterns')
            .update({ 
              expected_duration_seconds: newTimeout,
              optimization_suggestions: suggestions
            })
            .eq('id', pattern.id);

          optimizations.push({
            pattern_id: pattern.id,
            pattern_name: pattern.pattern_name,
            current_success_rate: successRate,
            optimization_applied: `Timeout increased to ${newTimeout}s`,
            expected_improvement: 15
          });
        }

        // Optimization 2: Add retry logic for flaky patterns
        if (pattern.failure_count > 5 && !pattern.metadata?.retry_enabled) {
          suggestions.push('Enable retry logic (3 attempts with exponential backoff)');
          
          await supabase
            .from('automation_patterns')
            .update({
              metadata: { ...pattern.metadata, retry_enabled: true, max_retries: 3 },
              optimization_suggestions: suggestions
            })
            .eq('id', pattern.id);

          optimizations.push({
            pattern_id: pattern.id,
            pattern_name: pattern.pattern_name,
            current_success_rate: successRate,
            optimization_applied: 'Retry logic enabled (3 attempts)',
            expected_improvement: 20
          });
        }

        // Optimization 3: Suggest pattern refactoring
        if (pattern.usage_count > 20 && successRate < 60) {
          suggestions.push('CRITICAL: Pattern needs refactoring - too many failures');
          
          await supabase
            .from('automation_patterns')
            .update({ optimization_suggestions: suggestions })
            .eq('id', pattern.id);

          // Create known issue for this pattern
          await supabase.from('known_issues').insert({
            issue_type: 'performance_issue',
            description: `${pattern.pattern_name} fails frequently (${successRate}% success)`,
            solution: `Review and refactor pattern: ${pattern.execution_command}`,
            prevention_checklist: [
              'Check command syntax',
              'Verify dependencies are installed',
              'Test command locally first',
              'Add proper error handling'
            ],
            tags: ['automation', 'ci_cd', pattern.pattern_type],
            severity: 'high',
            resolved: false
          });

          optimizations.push({
            pattern_id: pattern.id,
            pattern_name: pattern.pattern_name,
            current_success_rate: successRate,
            optimization_applied: 'Created known_issue for refactoring',
            expected_improvement: 50
          });
        }

      } else if (successRate >= 95 && pattern.usage_count > 10) {
        // Success: Pattern performing excellently
        console.log(`✅ Excellent Pattern: ${pattern.pattern_name} (${successRate}%)`);
        
        // Add to best_practices if not already there
        const { data: existingPractice } = await supabase
          .from('best_practices')
          .select('id')
          .eq('title', `CI/CD Pattern: ${pattern.pattern_name}`)
          .single();

        if (!existingPractice) {
          await supabase.from('best_practices').insert({
            category: 'automation',
            title: `CI/CD Pattern: ${pattern.pattern_name}`,
            description: pattern.description,
            do_this: pattern.execution_command,
            dont_this: 'Do not run this pattern without proper validation',
            reasoning: `This pattern has ${successRate}% success rate over ${pattern.usage_count} executions`,
            example_code: pattern.code,
            tags: ['automation', 'ci_cd', pattern.pattern_type, 'proven'],
            usage_count: pattern.usage_count
          });

          console.log(`📚 Added ${pattern.pattern_name} to best_practices`);
        }
      }
    }

    // 3. Detect new pattern opportunities
    const { data: recentActions } = await supabase
      .from('ai_actions_log')
      .select('action_type, success')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
      .order('created_at', { ascending: false })
      .limit(100);

    // Count action types to find candidates for new patterns
    const actionCounts = (recentActions || []).reduce((acc, action) => {
      acc[action.action_type] = (acc[action.action_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const newPatternCandidates = Object.entries(actionCounts)
      .filter(([_, count]) => count >= 5) // At least 5 occurrences
      .map(([actionType, count]) => ({
        action_type: actionType,
        occurrences: count
      }));

    console.log(`🔍 Found ${newPatternCandidates.length} candidates for new patterns:`, newPatternCandidates);

    // 4. Log optimization action
    await supabase.from('ai_actions_log').insert({
      action_type: 'ci_cd_optimization',
      task_description: 'Autonomous CI/CD pattern optimization',
      success: true,
      metadata: {
        patterns_analyzed: patterns?.length || 0,
        optimizations_applied: optimizations.length,
        new_pattern_candidates: newPatternCandidates.length
      },
      knowledge_check_performed: true
    });

    console.log(`✅ CI/CD Optimization Complete - ${optimizations.length} optimizations applied`);

    return new Response(JSON.stringify({
      success: true,
      patterns_analyzed: patterns?.length || 0,
      optimizations_applied: optimizations,
      new_pattern_candidates: newPatternCandidates,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ CI/CD Optimizer Error:', error);
    
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
