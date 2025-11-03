import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AutoLearnRequest {
  pattern_type: string;
  success: boolean;
  context: {
    files_changed?: string[];
    patterns_used?: string[];
    issues_encountered?: string[];
  };
  learnings: string;
  confidence?: number;
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

    const requestData: AutoLearnRequest = await req.json();
    const {
      pattern_type,
      success,
      context,
      learnings,
      confidence = 0.7
    } = requestData;

    if (!pattern_type) {
      throw new Error('pattern_type is required');
    }

    console.log('🧠 Auto-Learning Started:', { pattern_type, success });

    // 1. Store learning pattern
    const { data: learningData, error: learningError } = await supabase
      .from('ai_learning_patterns')
      .insert({
        pattern_type,
        context,
        success,
        learnings,
        confidence,
        files_changed: context.files_changed || [],
        patterns_used: context.patterns_used || [],
        issues_encountered: context.issues_encountered || []
      })
      .select()
      .single();

    if (learningError) throw learningError;

    // 2. If failure, create/update known issue
    if (!success && context.issues_encountered && context.issues_encountered.length > 0) {
      for (const issue of context.issues_encountered) {
        // Check if issue already exists
        const { data: existingIssue } = await supabase
          .from('known_issues')
          .select('id, occurrences')
          .eq('description', issue)
          .single();

        if (existingIssue) {
          // Increment occurrences
          await supabase
            .from('known_issues')
            .update({
              occurrences: existingIssue.occurrences + 1,
              last_occurrence: new Date().toISOString()
            })
            .eq('id', existingIssue.id);
          
          console.log(`🔄 Updated known issue: ${issue}`);
        } else {
          // Create new issue
          await supabase
            .from('known_issues')
            .insert({
              issue_type: 'type_error', // Default, could be more sophisticated
              description: issue,
              solution: learnings,
              prevention_checklist: ['Check knowledge_base before implementation'],
              tags: [pattern_type],
              severity: 'medium',
              resolved: false
            });
          
          console.log(`✅ Created new known issue: ${issue}`);
        }
      }
    }

    // 3. Update code snippet usage counts if patterns were used
    if (success && context.patterns_used && context.patterns_used.length > 0) {
      for (const patternName of context.patterns_used) {
        const { data: snippet } = await supabase
          .from('code_snippets')
          .select('id')
          .eq('pattern_name', patternName)
          .single();

        if (snippet) {
          await supabase.rpc('increment_snippet_usage', { snippet_id: snippet.id });
          console.log(`📈 Incremented usage for: ${patternName}`);
        }
      }
    }

    // 4. If success with new pattern, consider adding to code_snippets
    if (success && confidence >= 0.9 && learnings.length > 50) {
      console.log('💡 High-confidence success - consider adding to code_snippets');
      // This could be automated further or require manual review
    }

    // 5. Log this learning action
    await supabase.from('ai_actions_log').insert({
      action_type: 'auto_learning',
      task_description: `Learning from ${pattern_type}`,
      success: true,
      metadata: {
        original_pattern_type: pattern_type,
        original_success: success,
        confidence,
        learnings_stored: true
      }
    });

    console.log('✅ Auto-Learning Completed');

    return new Response(JSON.stringify({
      success: true,
      learning_id: learningData.id,
      message: 'Learning pattern stored successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Auto-Learning Error:', error);
    
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
