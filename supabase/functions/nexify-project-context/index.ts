// NeXify AI MASTER - Project Context Loader
// Zweck: Lädt vollständigen Projekt-Kontext für ein Projekt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const {
      project_code,
      include_history = true,
      include_tasks = true,
      include_context = true,
      history_limit = 50,
    } = await req.json();

    if (!project_code) {
      return new Response(JSON.stringify({ error: "project_code is required", success: false }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Lade Projekt
    const { data: project, error: projectError } = await supabase
      .from("nexify_projects")
      .select("*")
      .eq("project_code", project_code)
      .single();

    if (projectError || !project) {
      return new Response(JSON.stringify({ error: "Project not found", success: false }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const projectId = project.id;

    // Parallel: Lade History, Tasks, Context
    const [historyResult, tasksResult, contextResult, summaryResult] = await Promise.all([
      include_history
        ? supabase
            .from("nexify_project_history")
            .select("*")
            .eq("project_id", projectId)
            .order("session_date", { ascending: false })
            .limit(history_limit)
        : Promise.resolve({ data: [], error: null }),

      include_tasks
        ? supabase
            .from("nexify_project_tasks")
            .select("*")
            .eq("project_id", projectId)
            .order("created_at", { ascending: false })
        : Promise.resolve({ data: [], error: null }),

      include_context
        ? supabase
            .from("nexify_project_context")
            .select("*")
            .eq("project_id", projectId)
            .order("importance_score", { ascending: false })
        : Promise.resolve({ data: [], error: null }),

      // Summary berechnen
      supabase
        .from("nexify_project_history")
        .select("session_date, session_version")
        .eq("project_id", projectId)
        .order("session_date", { ascending: false })
        .limit(1),
    ]);

    // Erstelle Summary
    const history = historyResult.data || [];
    const tasks = tasksResult.data || [];
    const context = contextResult.data || [];

    // Gruppiere Context nach Typ
    const contextByType: Record<string, any[]> = {};
    context.forEach((item: any) => {
      if (!contextByType[item.context_type]) {
        contextByType[item.context_type] = [];
      }
      contextByType[item.context_type].push({
        key: item.context_key,
        value: item.context_value,
        importance: item.importance_score,
        last_verified: item.last_verified_at,
      });
    });

    const latestSession = summaryResult.data?.[0];
    const summary = {
      total_sessions: history.length,
      total_tasks: tasks.length,
      active_tasks: tasks.filter((t: any) => t.status === "in_progress" || t.status === "pending")
        .length,
      last_activity: project.last_activity_at || latestSession?.session_date,
      current_version: latestSession?.session_version || "unknown",
      total_components: project.total_components || 0,
    };

    return new Response(
      JSON.stringify({
        success: true,
        project: {
          id: project.id,
          project_name: project.project_name,
          project_code: project.project_code,
          project_type: project.project_type,
          description: project.description,
          website_url: project.website_url,
          status: project.status,
          priority: project.priority,
          tech_stack: project.tech_stack,
          client_info: project.client_info,
        },
        history: include_history ? history : undefined,
        tasks: include_tasks ? tasks : undefined,
        context: include_context ? contextByType : undefined,
        summary,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, success: false }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
