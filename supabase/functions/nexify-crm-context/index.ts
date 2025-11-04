// NeXify AI MASTER - CRM Context Loader
// Zweck: Lädt vollständigen CRM-Kontext (Unternehmen, Kontakte, Adressen)

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

    const { 
      company_code, 
      company_id,
      include_addresses = true, 
      include_contacts = true, 
      include_projects = true,
      include_interactions = true,
      interactions_limit = 20
    } = await req.json();

    // Lade Unternehmen
    let company;
    if (company_code) {
      const { data, error } = await supabase
        .schema("nexify_crm")
        .from("companies")
        .select("*")
        .eq("company_code", company_code)
        .single();
      
      if (error || !data) {
        return new Response(
          JSON.stringify({ error: "Company not found", success: false }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      company = data;
    } else if (company_id) {
      const { data, error } = await supabase
        .schema("nexify_crm")
        .from("companies")
        .select("*")
        .eq("id", company_id)
        .single();
      
      if (error || !data) {
        return new Response(
          JSON.stringify({ error: "Company not found", success: false }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      company = data;
    } else {
      // Lade alle aktiven Unternehmen
      const { data, error } = await supabase
        .schema("nexify_crm")
        .from("companies")
        .select("*")
        .eq("status", "active")
        .order("priority", { ascending: false })
        .order("company_name", { ascending: true });
      
      if (error) {
        return new Response(
          JSON.stringify({ error: error.message, success: false }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Für jedes Unternehmen: Lade Details
      const companiesWithDetails = await Promise.all(
        (data || []).map(async (comp: any) => {
          const [addressesResult, contactsResult, projectsResult] = await Promise.all([
            include_addresses
              ? supabase.schema("nexify_crm").from("addresses").select("*").eq("company_id", comp.id)
              : Promise.resolve({ data: [], error: null }),
            
            include_contacts
              ? supabase.schema("nexify_crm").from("contacts").select("*").eq("company_id", comp.id).eq("status", "active")
              : Promise.resolve({ data: [], error: null }),
            
            include_projects
              ? (async () => {
                  const { data: companyProjects } = await supabase
                    .schema("nexify_crm")
                    .from("company_projects")
                    .select("*")
                    .eq("company_id", comp.id)
                    .eq("status", "active");
                  
                  // Lade Projekt-Details separat
                  if (companyProjects && companyProjects.length > 0) {
                    const projectIds = companyProjects.map((cp: any) => cp.project_id);
                    const { data: projects } = await supabase
                      .schema("nexify_ai_master_knowledge_base")
                      .from("nexify_projects")
                      .select("*")
                      .in("id", projectIds);
                    
                    return {
                      data: companyProjects.map((cp: any) => ({
                        ...cp,
                        project: projects?.find((p: any) => p.id === cp.project_id)
                      }))
                    };
                  }
                  return { data: [] };
                })()
              : Promise.resolve({ data: [], error: null })
          ]);

          return {
            ...comp,
            addresses: addressesResult.data || [],
            contacts: contactsResult.data || [],
            projects: projectsResult.data || []
          };
        })
      );

      return new Response(
        JSON.stringify({
          success: true,
          companies: companiesWithDetails,
          total: companiesWithDetails.length
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const companyId = company.id;

    // Parallel: Lade Addresses, Contacts, Projects, Interactions
    const [addressesResult, contactsResult, projectsResult, interactionsResult] = await Promise.all([
      include_addresses
        ? supabase.schema("nexify_crm").from("addresses").select("*").eq("company_id", companyId)
        : Promise.resolve({ data: [], error: null }),
      
      include_contacts
        ? supabase.schema("nexify_crm").from("contacts").select("*").eq("company_id", companyId).eq("status", "active").order("is_primary", { ascending: false })
        : Promise.resolve({ data: [], error: null }),
      
      include_projects
        ? (async () => {
            const { data: companyProjects } = await supabase
              .schema("nexify_crm")
              .from("company_projects")
              .select("*")
              .eq("company_id", companyId)
              .eq("status", "active");
            
            // Lade Projekt-Details separat
            if (companyProjects && companyProjects.length > 0) {
              const projectIds = companyProjects.map((cp: any) => cp.project_id);
              const { data: projects } = await supabase
                .schema("nexify_ai_master_knowledge_base")
                .from("nexify_projects")
                .select("*")
                .in("id", projectIds);
              
              return {
                data: companyProjects.map((cp: any) => ({
                  ...cp,
                  project: projects?.find((p: any) => p.id === cp.project_id)
                }))
              };
            }
            return { data: [] };
          })()
        : Promise.resolve({ data: [], error: null }),
      
      include_interactions
        ? supabase
            .schema("nexify_crm")
            .from("interactions")
            .select("*")
            .eq("company_id", companyId)
            .order("interaction_date", { ascending: false })
            .limit(interactions_limit)
        : Promise.resolve({ data: [], error: null })
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        company: {
          id: company.id,
          company_name: company.company_name,
          company_code: company.company_code,
          legal_name: company.legal_name,
          company_type: company.company_type,
          website_url: company.website_url,
          status: company.status,
          priority: company.priority,
          tags: company.tags,
          notes: company.notes,
          total_projects: company.total_projects,
          total_contacts: company.total_contacts,
          last_contact_at: company.last_contact_at
        },
        addresses: include_addresses ? addressesResult.data || [] : undefined,
        contacts: include_contacts ? contactsResult.data || [] : undefined,
        projects: include_projects ? projectsResult.data || [] : undefined,
        interactions: include_interactions ? interactionsResult.data || [] : undefined,
        summary: {
          total_addresses: (addressesResult.data || []).length,
          total_contacts: (contactsResult.data || []).length,
          total_projects: (projectsResult.data || []).length,
          total_interactions: (interactionsResult.data || []).length,
          primary_contact: (contactsResult.data || []).find((c: any) => c.is_primary),
          primary_address: (addressesResult.data || []).find((a: any) => a.is_primary)
        }
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

