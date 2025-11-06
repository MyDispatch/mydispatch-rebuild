// NeXify AI MASTER - Auto Load Context
// Zweck: Lädt automatisch ALLEN Kontext beim Chat-Start

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { user_email, load_projects = true, load_global_knowledge = true } = await req.json();

    // Parallel: Lade Projekte, CRM-Daten und Global Knowledge
    const [projectsResult, companiesResult, learningsResult, issuesResult, componentsResult, bestPracticesResult, codeSnippetsResult] = await Promise.all([
      load_projects
        ? supabase
            .from("nexify_projects")
            .select("id, project_name, project_code, status, priority, last_activity_at, total_sessions, total_tasks")
            .eq("status", "active")
            .order("priority", { ascending: false })
        : Promise.resolve({ data: [], error: null }),
      
      load_global_knowledge
        ? supabase
            .from("ai_learning_patterns")
            .select("*")
            .order("learned_at", { ascending: false })
            .limit(10)
        : Promise.resolve({ data: [], error: null }),
      
      load_global_knowledge
        ? supabase
            .from("known_issues")
            .select("*")
            .eq("resolved", false)
            .order("severity", { ascending: false })
        : Promise.resolve({ data: [], error: null }),
      
      load_global_knowledge
        ? supabase
            .from("component_registry")
            .select("*")
            .eq("verification_status", "active")
            .limit(50)
        : Promise.resolve({ data: [], error: null }),
      
      load_global_knowledge
        ? supabase
            .from("best_practices")
            .select("*")
            .order("usage_count", { ascending: false })
            .limit(20)
        : Promise.resolve({ data: [], error: null }),
      
      load_global_knowledge
        ? supabase
            .from("code_snippets")
            .select("*")
            .order("usage_count", { ascending: false })
            .limit(30)
        : Promise.resolve({ data: [], error: null }),
      
      // CRM-Daten laden
      supabase
        .schema("nexify_crm")
        .from("companies")
        .select("id, company_name, company_code, company_type, status, priority, website_url, total_projects, last_contact_at")
        .eq("status", "active")
        .order("priority", { ascending: false })
        .limit(20)
    ]);

    const projects = projectsResult.data || [];
    const companies = companiesResult.data || [];
    
    // Für jedes Unternehmen: Lade primäre Kontakte
    const companiesWithContacts = await Promise.all(
      companies.map(async (company: any) => {
        const { data: contacts } = await supabase
          .schema("nexify_crm")
          .from("contacts")
          .select("id, full_name, email, phone, job_title, is_primary")
          .eq("company_id", company.id)
          .eq("status", "active")
          .order("is_primary", { ascending: false })
          .limit(3);
        
        return {
          ...company,
          primary_contacts: contacts || []
        };
      })
    );
    
    // Für jedes Projekt: Lade Summary und aktive Tasks
    const projectsWithDetails = await Promise.all(
      projects.map(async (project: any) => {
        const [historyResult, tasksResult] = await Promise.all([
          supabase
            .from("nexify_project_history")
            .select("session_date, session_version, session_title")
            .eq("project_id", project.id)
            .order("session_date", { ascending: false })
            .limit(5),
          
          supabase
            .from("nexify_project_tasks")
            .select("*")
            .eq("project_id", project.id)
            .in("status", ["pending", "in_progress"])
            .order("priority", { ascending: false })
            .limit(10)
        ]);

        return {
          ...project,
          recent_history: historyResult.data || [],
          active_tasks: tasksResult.data || []
        };
      })
    );

    // Lade letzte Session (falls vorhanden)
    const lastSession = null;
    if (user_email) {
      // TODO: Implementiere Session-Resume wenn nexify_master_sessions existiert
    }

    return new Response(
      JSON.stringify({
        success: true,
        active_projects: projectsWithDetails,
        companies: companiesWithContacts,
        global_knowledge: load_global_knowledge ? {
          recent_learnings: learningsResult.data || [],
          critical_issues: issuesResult.data || [],
          components: componentsResult.data || [],
          best_practices: bestPracticesResult.data || [],
          code_snippets: codeSnippetsResult.data || []
        } : undefined,
        session_context: {
          last_session: lastSession,
          recommended_actions: [
            ...(projectsWithDetails.flatMap((p: any) => 
              p.active_tasks.filter((t: any) => t.priority === "critical").map((t: any) => ({
                type: "task",
                project: p.project_code,
                task_id: t.id,
                title: t.task_title,
                priority: t.priority
              }))
            )),
            ...((issuesResult.data || []).filter((i: any) => i.severity === "critical").map((i: any) => ({
              type: "issue",
              issue_id: i.id,
              title: i.issue_type,
              severity: i.severity
            })))
          ]
        },
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
