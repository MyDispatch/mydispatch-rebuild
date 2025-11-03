/* ==================================================================================
   WIKI-AUTO-SYNC - Automated Documentation Synchronization
   ==================================================================================
   Triggered by GitHub Actions on push to /docs
   Syncs all MD files → knowledge_base table
   Version tracking & deprecation handling
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

    const { docs, trigger } = await req.json();

    console.log(`[WIKI-SYNC] Triggered by: ${trigger}`);
    console.log(`[WIKI-SYNC] Syncing ${docs?.length || 0} documents...`);

    let syncedCount = 0;
    let errorCount = 0;

    if (docs && Array.isArray(docs)) {
      for (const doc of docs) {
        try {
          const { error: upsertError } = await supabase
            .from('knowledge_base')
            .upsert({
              title: doc.title,
              category: doc.category || 'documentation',
              content: doc.content,
              tags: doc.tags || [],
              source_file: doc.source_file,
              doc_version: doc.version || 'V1.0',
              confidence_score: 1.0,
              is_deprecated: false,
              source: 'wiki-auto-sync'
            }, {
              onConflict: 'title',
              ignoreDuplicates: false
            });

          if (upsertError) {
            console.error(`[WIKI-SYNC] Error syncing ${doc.title}:`, upsertError);
            errorCount++;
          } else {
            syncedCount++;
            console.log(`[WIKI-SYNC] ✅ Synced: ${doc.title}`);
          }
        } catch (err) {
          console.error(`[WIKI-SYNC] Exception syncing ${doc.title}:`, err);
          errorCount++;
        }
      }
    }

    // Trigger Knowledge Graph update after sync
    console.log('[WIKI-SYNC] Triggering Knowledge Graph update...');
    const graphResponse = await supabase.functions.invoke('wiki-knowledge-graph');
    
    console.log('[WIKI-SYNC] Graph update result:', graphResponse.data);

    return new Response(
      JSON.stringify({
        success: true,
        synced_count: syncedCount,
        error_count: errorCount,
        trigger,
        graph_update: graphResponse.data,
        message: `Synced ${syncedCount} docs, ${errorCount} errors. Graph updated.`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('[WIKI-SYNC] Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
