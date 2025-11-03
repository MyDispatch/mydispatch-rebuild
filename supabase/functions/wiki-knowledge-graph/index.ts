/* ==================================================================================
   WIKI-KNOWLEDGE-GRAPH - Auto-Link Knowledge Base Entries
   ==================================================================================
   Erstellt automatisch related_knowledge_ids basierend auf:
   - Shared Tags
   - Content-Referenzen (Title-Mentions)
   - File-Path-Referenzen
   - Parent-Child-Relations
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

    console.log('[WIKI-GRAPH] Starting Knowledge Graph Link Generation...');

    // Get all active knowledge base entries
    const { data: allDocs, error: fetchError } = await supabase
      .from('knowledge_base')
      .select('id, title, content, tags, source_file')
      .eq('is_deprecated', false);

    if (fetchError) {
      throw new Error(`Failed to fetch docs: ${fetchError.message}`);
    }

    console.log(`[WIKI-GRAPH] Processing ${allDocs?.length || 0} documents...`);

    let linksCreated = 0;
    let docsProcessed = 0;

    // Process each document
    for (const doc of allDocs || []) {
      const relatedIds: string[] = [];

      // Find related docs
      for (const otherDoc of allDocs || []) {
        if (otherDoc.id === doc.id) continue;

        let score = 0;

        // 1. Shared Tags (high score)
        if (doc.tags && otherDoc.tags) {
          const sharedTags = doc.tags.filter((tag: string) => 
            otherDoc.tags.includes(tag)
          );
          score += sharedTags.length * 3;
        }

        // 2. Title mentioned in content (high score)
        if (doc.content && typeof doc.content === 'object') {
          const contentStr = JSON.stringify(doc.content).toLowerCase();
          if (contentStr.includes(otherDoc.title.toLowerCase())) {
            score += 5;
          }
        }

        // 3. Source file reference
        if (doc.content && typeof doc.content === 'object' && otherDoc.source_file) {
          const contentStr = JSON.stringify(doc.content);
          if (contentStr.includes(otherDoc.source_file)) {
            score += 4;
          }
        }

        // Add if score is high enough
        if (score >= 3) {
          relatedIds.push(otherDoc.id);
        }
      }

      // Limit to top 10 related docs
      const topRelated = relatedIds.slice(0, 10);

      // Update document with related_knowledge_ids
      const { error: updateError } = await supabase
        .from('knowledge_base')
        .update({ related_knowledge_ids: topRelated })
        .eq('id', doc.id);

      if (!updateError) {
        linksCreated += topRelated.length;
        docsProcessed++;
      } else {
        console.error(`[WIKI-GRAPH] Error updating ${doc.title}:`, updateError);
      }
    }

    // Calculate coverage
    const coverage = allDocs?.length 
      ? ((docsProcessed / allDocs.length) * 100).toFixed(1)
      : '0.0';

    console.log(`[WIKI-GRAPH] ✅ Completed! ${linksCreated} links created across ${docsProcessed} docs (${coverage}% coverage)`);

    return new Response(
      JSON.stringify({
        success: true,
        docs_processed: docsProcessed,
        total_docs: allDocs?.length || 0,
        links_created: linksCreated,
        coverage_percent: parseFloat(coverage),
        message: `Knowledge Graph created with ${linksCreated} links`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('[WIKI-GRAPH] Error:', error);
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
