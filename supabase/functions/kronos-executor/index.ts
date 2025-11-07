/* ==================================================================================
   KRONOS-EXECUTOR - KRONOS V18.0
   ==================================================================================
   Orchestriert parallele Code-Generation Level-by-Level
   Nutzt kronos-code-generator für tatsächliche Code-Synthese
   ================================================================================== */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { mode = 'execute', levels = null, entity_ids = null } = await req.json();

    console.log(`[KRONOS-EXECUTOR] Starting execution (mode: ${mode})`);

    // Create execution run
    const { data: run, error: runError } = await supabase
      .from('execution_runs')
      .insert({
        run_type: entity_ids ? 'single' : levels ? 'level' : 'full',
        status: 'running',
      })
      .select()
      .single();

    if (runError) throw runError;

    const runId = run.id;
    let totalCompleted = 0;
    let totalFailed = 0;
    const totalSkipped = 0;

    try {
      // Determine which levels to execute
      const { data: maxLevelData } = await supabase
        .from('entities_queue')
        .select('level')
        .order('level', { ascending: false })
        .limit(1)
        .single();

      const maxLevel = maxLevelData?.level || 0;
      const levelsToExecute = levels || Array.from({ length: maxLevel + 1 }, (_, i) => i);

      console.log(`[KRONOS-EXECUTOR] Executing levels: ${levelsToExecute.join(', ')}`);

      // Execute level by level
      for (const level of levelsToExecute) {
        console.log(`[KRONOS-EXECUTOR] --- Level ${level} ---`);

        // Update run status
        await supabase
          .from('execution_runs')
          .update({
            current_level: level,
            total_levels: levelsToExecute.length,
          })
          .eq('id', runId);

        // Get entities for this level
        let query = supabase
          .from('entities_queue')
          .select('*')
          .eq('level', level)
          .eq('status', 'pending');

        if (entity_ids) {
          query = query.in('id', entity_ids);
        }

        const { data: entities, error: entitiesError } = await query;

        if (entitiesError) throw entitiesError;
        if (!entities || entities.length === 0) {
          console.log(`[KRONOS-EXECUTOR] No entities for level ${level}`);
          continue;
        }

        console.log(`[KRONOS-EXECUTOR] Level ${level}: ${entities.length} entities`);

        // Execute all entities in parallel
        const promises = entities.map(async (entity) => {
          const startTime = Date.now();

          try {
            // Mark as in_progress
            await supabase
              .from('entities_queue')
              .update({ status: 'in_progress' })
              .eq('id', entity.id);

            // Log start
            await supabase.from('execution_logs').insert({
              entity_id: entity.id,
              action: 'generate_code',
              status: 'started',
              details: { level, entity_type: entity.entity_type, name: entity.name },
            });

            // Call kronos-code-generator
            const generateResponse = await supabase.functions.invoke('kronos-code-generator', {
              body: {
                entity: entity,
                specification: entity.specification,
                name: entity.name,
              },
            });

            const duration = Date.now() - startTime;

            if (generateResponse.error) {
              throw generateResponse.error;
            }

            const result = generateResponse.data;

            // Update entity with result
            await supabase
              .from('entities_queue')
              .update({
                status: 'completed',
                generated_code: result.code,
                file_path: result.file_path,
                execution_time_ms: duration,
              })
              .eq('id', entity.id);

            // Log completion
            await supabase.from('execution_logs').insert({
              entity_id: entity.id,
              action: 'generate_code',
              status: 'completed',
              duration_ms: duration,
              details: result,
            });

            return { success: true, entity: entity.name };

          } catch (error) {
            const duration = Date.now() - startTime;
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            console.error(`[KRONOS-EXECUTOR] Failed: ${entity.name}`, errorMessage);

            // Update entity as failed
            await supabase
              .from('entities_queue')
              .update({
                status: 'failed',
                error_message: errorMessage,
                execution_time_ms: duration,
              })
              .eq('id', entity.id);

            // Log failure
            await supabase.from('execution_logs').insert({
              entity_id: entity.id,
              action: 'generate_code',
              status: 'failed',
              error_message: errorMessage,
              duration_ms: duration,
            });

            return { success: false, entity: entity.name, error: errorMessage };
          }
        });

        // Wait for all entities in this level to complete
        const results = await Promise.allSettled(promises);

        const completed = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
        const failed = results.filter(r => r.status === 'fulfilled' && !r.value.success).length;

        totalCompleted += completed;
        totalFailed += failed;

        console.log(`[KRONOS-EXECUTOR] Level ${level} complete: ${completed} success, ${failed} failed`);
      }

      // Mark run as completed
      await supabase
        .from('execution_runs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          total_entities: totalCompleted + totalFailed + totalSkipped,
          completed_entities: totalCompleted,
          failed_entities: totalFailed,
          skipped_entities: totalSkipped,
        })
        .eq('id', runId);

      return new Response(
        JSON.stringify({
          success: true,
          run_id: runId,
          execution_summary: {
            completed: totalCompleted,
            failed: totalFailed,
            skipped: totalSkipped,
          },
          message: `Execution complete: ${totalCompleted} entities generated`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );

    } catch (executionError) {
      // Mark run as failed
      await supabase
        .from('execution_runs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: executionError instanceof Error ? executionError.message : 'Unknown error',
        })
        .eq('id', runId);

      throw executionError;
    }

  } catch (error) {
    console.error('[KRONOS-EXECUTOR] Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
