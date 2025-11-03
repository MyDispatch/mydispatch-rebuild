import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface KnowledgeCheckRequest {
  task_description: string;
  task_type: 'component_creation' | 'bug_fix' | 'feature_implementation' | 'refactoring';
  affected_files?: string[];
}

interface KnowledgeCheckResponse {
  relevant_knowledge: any[];
  code_snippets: any[];
  best_practices: any[];
  known_issues: any[];
  existing_components: any[];
  checklist: string[];
  confidence_score: number;
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

    const { task_description, task_type, affected_files = [] }: KnowledgeCheckRequest = await req.json();

    console.log('🔍 Knowledge Check Started:', { task_description, task_type });

    // Extract keywords from task description
    const keywords = task_description.toLowerCase().split(' ').filter(w => w.length > 3);

    // 1. Query relevant knowledge
    const { data: knowledgeData, error: knowledgeError } = await supabase
      .from('knowledge_base')
      .select('*')
      .or(keywords.map(k => `tags.cs.{${k}}`).join(','))
      .order('confidence_score', { ascending: false })
      .limit(10);

    if (knowledgeError) throw knowledgeError;

    // 2. Query code snippets
    const { data: snippetsData, error: snippetsError } = await supabase
      .from('code_snippets')
      .select('*')
      .or(keywords.map(k => `tags.cs.{${k}}`).join(','))
      .order('usage_count', { ascending: false })
      .limit(5);

    if (snippetsError) throw snippetsError;

    // 3. Query best practices
    const { data: practicesData, error: practicesError } = await supabase
      .from('best_practices')
      .select('*')
      .or(keywords.map(k => `tags.cs.{${k}}`).join(','))
      .order('usage_count', { ascending: false })
      .limit(5);

    if (practicesError) throw practicesError;

    // 3.1 Increment usage_count for returned best practices (PHASE 3: Usage-Tracking)
    if (practicesData && practicesData.length > 0) {
      for (const practice of practicesData) {
        await supabase.rpc('increment_best_practice_usage', { 
          practice_id: practice.id 
        });
      }
      console.log(`📈 Incremented usage_count for ${practicesData.length} best practices`);
    }

    // 4. Query known issues (unresolved only)
    const { data: issuesData, error: issuesError } = await supabase
      .from('known_issues')
      .select('*')
      .eq('resolved', false)
      .or(keywords.map(k => `tags.cs.{${k}}`).join(','))
      .order('severity', { ascending: false })
      .limit(5);

    if (issuesError) throw issuesError;

    // 5. Check existing components
    let componentsData: any[] = [];
    if (task_type === 'component_creation') {
      const componentKeywords = keywords.filter(k => 
        ['button', 'card', 'input', 'form', 'modal', 'table', 'list', 'icon'].includes(k)
      );
      
      if (componentKeywords.length > 0) {
        const { data, error } = await supabase
          .from('component_registry')
          .select('*')
          .or(componentKeywords.map(k => `component_name.ilike.%${k}%`).join(','))
          .eq('verification_status', 'active')
          .limit(5);

        if (!error) componentsData = data || [];
      }
    }

    // 6. Generate checklist based on findings
    const checklist: string[] = [
      '✅ Knowledge-Base-Check durchgeführt',
    ];

    if (task_type === 'component_creation' && componentsData.length > 0) {
      checklist.push(`⚠️ ${componentsData.length} ähnliche Component(s) gefunden - prüfe ob Wiederverwendung möglich!`);
    }

    if (issuesData && issuesData.length > 0) {
      checklist.push(`⚠️ ${issuesData.length} bekannte Issue(s) gefunden - beachte Prevention-Checklist!`);
    }

    if (practicesData && practicesData.length > 0) {
      checklist.push(`✅ ${practicesData.length} Best-Practice(s) verfügbar`);
    }

    if (snippetsData && snippetsData.length > 0) {
      checklist.push(`✅ ${snippetsData.length} Code-Snippet(s) verfügbar`);
    }

    // V28.1 Design System Check
    if (task_type === 'component_creation' || keywords.some(k => ['style', 'color', 'design'].includes(k))) {
      checklist.push('🎨 V28.1 Slate-Palette ONLY - KEINE designTokens verwenden!');
    }

    // Calculate confidence score
    const totalFindings = (knowledgeData?.length || 0) + (snippetsData?.length || 0) + 
                          (practicesData?.length || 0);
    const confidence_score = Math.min(totalFindings / 10, 1.0);

    // Log action
    await supabase.from('ai_actions_log').insert({
      action_type: 'knowledge_check',
      task_description,
      affected_files,
      knowledge_check_performed: true,
      success: true,
      metadata: {
        findings: {
          knowledge: knowledgeData?.length || 0,
          snippets: snippetsData?.length || 0,
          practices: practicesData?.length || 0,
          issues: issuesData?.length || 0,
          components: componentsData.length
        }
      }
    });

    // ✅ V5.0 FIX 4: Auto-Learning nach erfolgreichem Check
    const { error: learningError } = await supabase.functions.invoke('auto-learn-from-actions', {
      body: {
        pattern_type: 'knowledge_check',
        success: true,
        context: {
          files_changed: affected_files,
          patterns_used: practicesData?.map(p => p.title) || [],
          task_type: task_type
        },
        learnings: `Knowledge check completed for ${task_type} with ${totalFindings} findings`,
        confidence: confidence_score
      }
    });

    if (learningError) {
      console.warn('⚠️ Auto-learning failed (non-critical):', learningError);
    } else {
      console.log('✅ Auto-learning triggered successfully');
    }

    const response: KnowledgeCheckResponse = {
      relevant_knowledge: knowledgeData || [],
      code_snippets: snippetsData || [],
      best_practices: practicesData || [],
      known_issues: issuesData || [],
      existing_components: componentsData,
      checklist,
      confidence_score
    };

    console.log('✅ Knowledge Check Completed:', {
      findings: response.checklist.length,
      confidence: confidence_score
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Knowledge Check Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        relevant_knowledge: [],
        code_snippets: [],
        best_practices: [],
        known_issues: [],
        existing_components: [],
        checklist: ['⚠️ Knowledge-Check fehlgeschlagen - Vorsicht bei Implementierung!'],
        confidence_score: 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 to not block workflow
      }
    );
  }
});
