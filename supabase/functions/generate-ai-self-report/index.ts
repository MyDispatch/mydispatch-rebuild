import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SelfReportRequest {
  period: 'last_7_days' | 'last_30_days' | 'last_90_days';
  force?: boolean;
}

interface Metrics {
  hallucination_rate: number;
  knowledge_check_compliance: number;
  pattern_reuse_rate: number;
  auto_fix_success_rate: number;
  documentation_freshness_days: number;
  total_actions: number;
  successful_actions: number;
  failed_actions: number;
}

interface SelfReportResponse {
  success: boolean;
  report_id: string;
  metrics: Metrics;
  identified_gaps: string[];
  improvement_plan: any[];
  new_tools_suggested: string[];
  report_date: string;
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

    const { period = 'last_7_days', force = false }: SelfReportRequest = await req.json().catch(() => ({}));

    console.log('📊 Generating AI Self-Report:', { period, force });

    // Calculate date range
    const intervalMap = {
      last_7_days: '7 days',
      last_30_days: '30 days',
      last_90_days: '90 days',
    };

    const interval = intervalMap[period];

    // 1. Query AI Actions Log for metrics
    const { data: actions, error: actionsError } = await supabase
      .from('ai_actions_log')
      .select('*')
      .gte('created_at', `now() - interval '${interval}'`);

    if (actionsError) throw actionsError;

    const total_actions = actions?.length || 0;
    const successful_actions = actions?.filter(a => a.success).length || 0;
    const failed_actions = total_actions - successful_actions;

    // 2. Calculate Knowledge Check Compliance
    const knowledge_checks = actions?.filter(a => a.knowledge_check_performed).length || 0;
    const knowledge_check_compliance = total_actions > 0 ? knowledge_checks / total_actions : 0;

    // 3. Query Known Issues for Hallucination Rate
    const { data: issues, error: issuesError } = await supabase
      .from('known_issues')
      .select('*')
      .eq('issue_type', 'hallucinated_function')
      .gte('last_occurrence', `now() - interval '${interval}'`);

    if (issuesError) throw issuesError;

    const hallucination_incidents = issues?.length || 0;
    const hallucination_rate = total_actions > 0 ? hallucination_incidents / total_actions : 0;

    // 4. Query Learning Patterns for Pattern Reuse Rate
    const { data: patterns, error: patternsError } = await supabase
      .from('ai_learning_patterns')
      .select('applied_count')
      .gte('learned_at', `now() - interval '${interval}'`);

    if (patternsError) throw patternsError;

    const total_pattern_applications = patterns?.reduce((sum, p) => sum + (p.applied_count || 0), 0) || 0;
    const pattern_reuse_rate = total_actions > 0 ? total_pattern_applications / total_actions : 0;

    // 5. Calculate Auto-Fix Success Rate (from actions with 'auto_fix' type)
    const auto_fix_actions = actions?.filter(a => a.action_type === 'auto_fix') || [];
    const auto_fix_successes = auto_fix_actions.filter(a => a.success).length;
    const auto_fix_success_rate = auto_fix_actions.length > 0 ? auto_fix_successes / auto_fix_actions.length : 0;

    // 6. Check Documentation Freshness
    const { data: knowledge, error: knowledgeError } = await supabase
      .from('knowledge_base')
      .select('updated_at')
      .order('updated_at', { ascending: true })
      .limit(1);

    if (knowledgeError) throw knowledgeError;

    const oldest_update = knowledge?.[0]?.updated_at;
    const documentation_freshness_days = oldest_update
      ? Math.floor((Date.now() - new Date(oldest_update).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Compile Metrics
    const metrics: Metrics = {
      hallucination_rate: Math.round(hallucination_rate * 1000) / 1000,
      knowledge_check_compliance: Math.round(knowledge_check_compliance * 1000) / 1000,
      pattern_reuse_rate: Math.round(pattern_reuse_rate * 1000) / 1000,
      auto_fix_success_rate: Math.round(auto_fix_success_rate * 1000) / 1000,
      documentation_freshness_days,
      total_actions,
      successful_actions,
      failed_actions,
    };

    // 7. Identify Gaps
    const identified_gaps: string[] = [];
    if (knowledge_check_compliance < 1.0) {
      identified_gaps.push(`Knowledge Check Compliance bei ${Math.round(knowledge_check_compliance * 100)}% (Ziel: 100%)`);
    }
    if (hallucination_rate > 0.01) {
      identified_gaps.push(`Hallucination Rate bei ${Math.round(hallucination_rate * 100)}% (Ziel: <1%)`);
    }
    if (pattern_reuse_rate < 0.8) {
      identified_gaps.push(`Pattern Reuse Rate bei ${Math.round(pattern_reuse_rate * 100)}% (Ziel: >80%)`);
    }
    if (documentation_freshness_days > 30) {
      identified_gaps.push(`Dokumentation ${documentation_freshness_days} Tage alt (Ziel: <30 Tage)`);
    }

    // 8. Generate Improvement Plan
    const improvement_plan: any[] = [];
    if (knowledge_check_compliance < 1.0) {
      improvement_plan.push({
        action: 'Enforce Mandatory Knowledge Check',
        priority: 'high',
        description: 'Implementiere Pre-Action-Hook für 100% Compliance',
      });
    }
    if (hallucination_rate > 0.01) {
      improvement_plan.push({
        action: 'Strengthen Validation Layer',
        priority: 'critical',
        description: 'Erweitere component_registry und known_issues Check',
      });
    }

    // 9. Suggest New Tools
    const new_tools_suggested: string[] = [];
    if (failed_actions > total_actions * 0.1) {
      new_tools_suggested.push('Auto-Rollback-Function für fehlgeschlagene Actions');
    }
    if (documentation_freshness_days > 30) {
      new_tools_suggested.push('Automated Documentation Sync Hook');
    }

    // 10. Insert Self-Report into Database
    const { data: report, error: reportError } = await supabase
      .from('ai_self_reports')
      .insert({
        period,
        metrics,
        identified_gaps,
        improvement_plan,
        new_tools_suggested,
        report_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (reportError) throw reportError;

    console.log('✅ Self-Report Generated:', {
      report_id: report.id,
      metrics,
      gaps: identified_gaps.length,
    });

    return new Response(JSON.stringify({
      success: true,
      report_id: report.id,
      metrics,
      identified_gaps,
      improvement_plan,
      new_tools_suggested,
      report_date: report.report_date,
    } as SelfReportResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Self-Report Generation Error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
