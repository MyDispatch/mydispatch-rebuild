// ==================================================================================
// NEXIFY PROJECT MANAGEMENT - Vollständiges System für Pascal & NeXify AI MASTER
// ==================================================================================
// Erstellt: 2025-01-31
// Zweck: Projekt-Management, Planung, Angebote, Umsetzung, Betrieb
// Autor: NeXify AI MASTER
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProjectInput {
  action: 
    | 'create_project'
    | 'update_project'
    | 'create_discussion'
    | 'create_offer'
    | 'create_implementation_plan'
    | 'update_task_status'
    | 'get_project_status'
    | 'get_all_projects';
  data?: any;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const input: ProjectInput = await req.json();

    console.log("[NEXIFY-PROJECT-MANAGEMENT] Action:", input.action);

    switch (input.action) {
      case 'create_project': {
        // Generiere Projekt-Code
        const { data: projectCode } = await supabase.rpc('generate_project_code');
        
        const { data, error } = await supabase
          .from('nexify_projects')
          .insert({
            project_code: projectCode,
            title: input.data.title,
            description: input.data.description,
            category: input.data.category || 'feature',
            priority: input.data.priority || 'medium',
            status: 'idea',
            idea_source: input.data.idea_source || 'pascal',
            initial_requirements: input.data.requirements || {},
            business_value: input.data.business_value,
            tags: input.data.tags || [],
          })
          .select()
          .single();

        if (error) throw error;

        // Log Session
        await supabase.from('nexify_master_sessions').insert({
          session_type: 'planning',
          project_id: data.id,
          topic: `Projekt erstellt: ${data.title}`,
          pascal_input: JSON.stringify(input.data),
          nexify_response: `Projekt ${data.project_code} erfolgreich erstellt`,
          outcome: 'planning',
          next_steps: ['Planung ausarbeiten', 'Mit Pascal besprechen'],
        });

        return new Response(
          JSON.stringify({ success: true, project: data }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }

      case 'create_discussion': {
        const { data, error } = await supabase
          .from('nexify_project_discussions')
          .insert({
            project_id: input.data.project_id,
            discussion_type: input.data.type || 'planning',
            topic: input.data.topic,
            content: input.data.content,
            initiated_by: input.data.initiated_by || 'pascal',
            decisions: input.data.decisions || [],
            action_items: input.data.action_items || [],
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, discussion: data }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }

      case 'create_offer': {
        // Generiere Angebots-Nummer
        const { data: offerNumber } = await supabase.rpc('generate_offer_number');
        
        const { data, error } = await supabase
          .from('nexify_offers')
          .insert({
            offer_number: offerNumber,
            project_id: input.data.project_id,
            title: input.data.title,
            description: input.data.description,
            scope: input.data.scope,
            deliverables: input.data.deliverables || [],
            exclusions: input.data.exclusions,
            estimated_hours: input.data.estimated_hours,
            estimated_complexity: input.data.complexity || 'medium',
            required_ai_agents: input.data.required_ai_agents || [],
            estimated_timeline_days: input.data.timeline_days,
            risks: input.data.risks || [],
            assumptions: input.data.assumptions || [],
            prerequisites: input.data.prerequisites || [],
            quality_standards: input.data.quality_standards || {},
            testing_approach: input.data.testing_approach,
            documentation_requirements: input.data.documentation_requirements,
            status: 'draft',
          })
          .select()
          .single();

        if (error) throw error;

        // Update Project
        await supabase
          .from('nexify_projects')
          .update({
            offer_created: true,
            offer_document: data,
            status: 'planning',
          })
          .eq('id', input.data.project_id);

        return new Response(
          JSON.stringify({ success: true, offer: data }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }

      case 'create_implementation_plan': {
        const { data, error } = await supabase
          .from('nexify_implementation_plans')
          .insert({
            project_id: input.data.project_id,
            offer_id: input.data.offer_id,
            plan_title: input.data.title,
            phases: input.data.phases || [],
            tasks: input.data.tasks || [],
            dependencies: input.data.dependencies || {},
            assigned_ai_agents: input.data.assigned_ai_agents || [],
            estimated_effort_per_task: input.data.estimated_effort || {},
            quality_gates: input.data.quality_gates || [],
            testing_requirements: input.data.testing_requirements || {},
            documentation_requirements: input.data.documentation_requirements || {},
            start_date: input.data.start_date,
            estimated_end_date: input.data.estimated_end_date,
            milestones: input.data.milestones || [],
            status: 'draft',
          })
          .select()
          .single();

        if (error) throw error;

        // Update Project
        await supabase
          .from('nexify_projects')
          .update({
            implementation_plan: data,
            status: 'approved',
          })
          .eq('id', input.data.project_id);

        return new Response(
          JSON.stringify({ success: true, plan: data }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }

      case 'get_project_status': {
        const { data: project } = await supabase
          .from('nexify_projects')
          .select(`
            *,
            discussions:nexify_project_discussions(*),
            offers:nexify_offers(*),
            implementation_plans:nexify_implementation_plans(*),
            operational_status:nexify_operational_status(*)
          `)
          .eq('id', input.data.project_id)
          .single();

        if (!project) {
          return new Response(
            JSON.stringify({ error: 'Project not found' }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, project }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }

      case 'get_all_projects': {
        const { data, error } = await supabase
          .from('nexify_projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, projects: data }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${input.action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("[NEXIFY-PROJECT-MANAGEMENT] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});











