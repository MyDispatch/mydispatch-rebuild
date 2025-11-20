/* ==================================================================================
   GENERATE-DEPENDENCY-GRAPH - KRONOS V18.0
   ==================================================================================
   Analysiert Entity-Dependencies und erstellt Execution-Plan (Topological Sort)
   ================================================================================== */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Entity {
  id: string;
  entity_type: string;
  name: string;
  dependencies: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("[DEPENDENCY-GRAPH] Fetching entities...");

    // Step 1: Fetch all entities
    const { data: entities, error } = await supabase
      .from("entities_queue")
      .select("id, entity_type, name, dependencies")
      .eq("status", "pending");

    if (error) throw error;
    if (!entities || entities.length === 0) {
      throw new Error("No pending entities found");
    }

    console.log(`[DEPENDENCY-GRAPH] Processing ${entities.length} entities`);

    // Step 2: Build dependency graph
    const graph = new Map<string, Set<string>>();
    const entityMap = new Map<string, Entity>();

    for (const entity of entities as Entity[]) {
      const key = `${entity.entity_type}:${entity.name}`;
      graph.set(key, new Set());
      entityMap.set(key, entity);
    }

    for (const entity of entities as Entity[]) {
      const key = `${entity.entity_type}:${entity.name}`;
      for (const dep of entity.dependencies || []) {
        if (graph.has(dep)) {
          graph.get(key)!.add(dep);
        }
      }
    }

    // Step 3: Topological Sort (Kahn's Algorithm)
    const levels: Array<Array<{ key: string; entity: Entity }>> = [];
    const inDegree = new Map<string, number>();

    // Calculate in-degrees
    for (const key of graph.keys()) {
      inDegree.set(key, 0);
    }
    for (const deps of graph.values()) {
      for (const dep of deps) {
        inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
      }
    }

    // Process levels
    let currentLevel = 0;
    while (inDegree.size > 0) {
      const zeroInDegree: string[] = [];

      for (const [key, degree] of inDegree.entries()) {
        if (degree === 0) {
          zeroInDegree.push(key);
        }
      }

      if (zeroInDegree.length === 0 && inDegree.size > 0) {
        console.error("[DEPENDENCY-GRAPH] Circular dependency detected!");
        break;
      }

      levels.push(
        zeroInDegree.map((key) => ({
          key,
          entity: entityMap.get(key)!,
        }))
      );

      // Remove processed nodes
      for (const key of zeroInDegree) {
        inDegree.delete(key);
        const deps = graph.get(key) || new Set();
        for (const dep of deps) {
          if (inDegree.has(dep)) {
            inDegree.set(dep, inDegree.get(dep)! - 1);
          }
        }
      }

      currentLevel++;
    }

    console.log(`[DEPENDENCY-GRAPH] Created ${levels.length} levels`);

    // Step 4: Update entities with calculated levels
    for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
      const levelEntities = levels[levelIndex];

      for (const { entity } of levelEntities) {
        await supabase.from("entities_queue").update({ level: levelIndex }).eq("id", entity.id);
      }
    }

    // Step 5: Calculate execution estimates
    const estimates = levels.map((level, idx) => ({
      level: idx,
      tasks: level.length,
      estimated_time_seconds: level.length * 5, // ~5 seconds per entity
    }));

    const totalTime = estimates.reduce((sum, e) => sum + e.estimated_time_seconds, 0);

    const executionPlan = {
      total_levels: levels.length,
      total_entities: entities.length,
      estimated_duration: `${Math.ceil(totalTime / 60)} minutes`,
      levels: estimates,
    };

    return new Response(
      JSON.stringify({
        success: true,
        graph: executionPlan,
        message: `Dependency graph created: ${levels.length} levels, ${entities.length} entities`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("[DEPENDENCY-GRAPH] Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
