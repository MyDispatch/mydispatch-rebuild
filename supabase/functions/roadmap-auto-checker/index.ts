import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AutoCheckRequest {
  current_task_description: string;
  affected_files?: string[];
  affected_pages?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { 
      current_task_description, 
      affected_files = [], 
      affected_pages = [] 
    }: AutoCheckRequest = await req.json();

    console.log('🔍 Roadmap Auto-Check Started:', { current_task_description });

    // Hole alle auto-checkable Tasks mit Status pending/in_progress
    const { data: checkableTasks, error: tasksError } = await supabase
      .from('roadmap_tasks')
      .select('*')
      .eq('auto_checkable', true)
      .in('status', ['pending', 'in_progress'])
      .order('priority', { ascending: true });

    if (tasksError) throw tasksError;

    console.log(`📋 Found ${checkableTasks?.length || 0} auto-checkable tasks`);

    // Matching-Logik
    const opportunisticTasks: any[] = [];

    for (const task of checkableTasks || []) {
      let matchScore = 0;
      let matchReasons: string[] = [];

      // 1. File-Overlap Check
      if (task.affected_files && affected_files.length > 0) {
        const fileMatches = task.affected_files.filter((f: string) => 
          affected_files.some(af => af.includes(f) || f.includes(af))
        );
        if (fileMatches.length > 0) {
          matchScore += 0.4;
          matchReasons.push(`File overlap: ${fileMatches.length}/${task.affected_files.length}`);
        }
      }

      // 2. Page-Overlap Check
      if (task.related_pages && affected_pages.length > 0) {
        const pageMatches = task.related_pages.filter((p: string) => 
          affected_pages.includes(p)
        );
        if (pageMatches.length > 0) {
          matchScore += 0.4;
          matchReasons.push(`Page overlap: ${pageMatches.length}/${task.related_pages.length}`);
        }
      }

      // 3. Keyword-Matching
      const taskKeywords = extractKeywords(task.title + ' ' + (task.description || ''));
      const contextKeywords = extractKeywords(current_task_description);
      const keywordOverlap = taskKeywords.filter((k: string) => contextKeywords.includes(k));
      if (keywordOverlap.length > 0) {
        matchScore += 0.2 * (keywordOverlap.length / Math.max(taskKeywords.length, 1));
        matchReasons.push(`Keywords: ${keywordOverlap.join(', ')}`);
      }

      // Mindestens 60% Match erforderlich
      if (matchScore >= 0.6) {
        opportunisticTasks.push({
          ...task,
          match_score: matchScore,
          match_reason: matchReasons.join(', ')
        });
      }
    }

    // Sortiere nach Match-Score
    opportunisticTasks.sort((a, b) => b.match_score - a.match_score);

    // Log in roadmap_auto_check_log
    await supabase.from('roadmap_auto_check_log').insert({
      current_task_description,
      checked_roadmap_tasks: (checkableTasks || []).map((t: any) => t.task_id),
      opportunistic_tasks_found: opportunisticTasks.map(t => t.task_id),
      execution_time_ms: Date.now() - startTime,
      ai_decision: opportunisticTasks.length > 0 ? 'proceed_with_opportunistic' : 'skip_no_match'
    });

    console.log(`✅ Found ${opportunisticTasks.length} opportunistic tasks`);

    return new Response(JSON.stringify({
      opportunistic_tasks: opportunisticTasks.slice(0, 3), // Max 3 parallel
      total_checked: checkableTasks?.length || 0,
      execution_time_ms: Date.now() - startTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Auto-Check Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});

function extractKeywords(text: string): string[] {
  return text.toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 3)
    .filter(w => !['this', 'that', 'with', 'from', 'have', 'will', 'sind', 'werden', 'können'].includes(w));
}
