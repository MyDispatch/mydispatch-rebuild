// NeXify AI MASTER - CRM Auto-Sync
// Zweck: Synchronisiert automatisch CRM-Daten aus verschiedenen Quellen

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

    const { source, data, auto_create = true } = await req.json();

    if (!source || !data) {
      return new Response(
        JSON.stringify({ error: "source and data are required", success: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Quelle: 'contact_form', 'email', 'project', 'manual'
    let result;

    switch (source) {
      case 'contact_form':
        // Beispiel: Kontaktformular von Website
        result = await syncContactForm(supabase, data, auto_create);
        break;
      
      case 'email':
        // Beispiel: E-Mail-Inhalt analysieren
        result = await syncFromEmail(supabase, data, auto_create);
        break;
      
      case 'project':
        // Beispiel: Aus Projekt-Daten
        result = await syncFromProject(supabase, data, auto_create);
        break;
      
      default:
        return new Response(
          JSON.stringify({ error: "Unknown source", success: false }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(
      JSON.stringify({
        success: true,
        ...result
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

async function syncContactForm(supabase: any, data: any, autoCreate: boolean) {
  const { name, email, phone, company, message, subject } = data;

  // Finde oder erstelle Unternehmen
  let companyRecord;
  if (company) {
    const { data: existing } = await supabase
      .schema("nexify_crm")
      .from("companies")
      .select("*")
      .ilike("company_name", `%${company}%`)
      .limit(1)
      .single();

    if (existing) {
      companyRecord = existing;
    } else if (autoCreate) {
      const { data: newCompany } = await supabase
        .schema("nexify_crm")
        .from("companies")
        .insert({
          company_name: company,
          company_type: "prospect",
          status: "prospect",
          source: "contact_form"
        })
        .select()
        .single();
      
      companyRecord = newCompany;
    }
  }

  // Finde oder erstelle Kontakt
  let contactRecord;
  if (email) {
    const { data: existing } = await supabase
      .schema("nexify_crm")
      .from("contacts")
      .select("*")
      .eq("email", email)
      .limit(1)
      .single();

    if (existing) {
      contactRecord = existing;
      
      // Update falls nötig
      if (name && !existing.full_name.includes(name)) {
        await supabase
          .schema("nexify_crm")
          .from("contacts")
          .update({ last_name: name, last_contact_at: new Date().toISOString() })
          .eq("id", existing.id);
      }
    } else if (autoCreate && companyRecord) {
      const nameParts = name?.split(" ") || [];
      const { data: newContact } = await supabase
        .schema("nexify_crm")
        .from("contacts")
        .insert({
          company_id: companyRecord.id,
          first_name: nameParts.slice(0, -1).join(" ") || null,
          last_name: nameParts[nameParts.length - 1] || name || "Unknown",
          email: email,
          phone: phone,
          role: "contact",
          status: "active",
          source: "contact_form"
        })
        .select()
        .single();
      
      contactRecord = newContact;
    }
  }

  // Erstelle Interaktion
  let interactionRecord;
  if (companyRecord || contactRecord) {
    const { data: interaction } = await supabase
      .schema("nexify_crm")
      .from("interactions")
      .insert({
        company_id: companyRecord?.id,
        contact_id: contactRecord?.id,
        interaction_type: "email",
        direction: "inbound",
        subject: subject || "Kontaktformular Anfrage",
        content: message,
        status: "completed",
        created_by: "nexify-ai-master"
      })
      .select()
      .single();
    
    interactionRecord = interaction;
  }

  return {
    company: companyRecord,
    contact: contactRecord,
    interaction: interactionRecord,
    created: {
      company: !companyRecord || companyRecord.id === companyRecord.id,
      contact: !contactRecord || contactRecord.id === contactRecord.id,
      interaction: !!interactionRecord
    }
  };
}

async function syncFromEmail(supabase: any, data: any, autoCreate: boolean) {
  // TODO: Implementiere E-Mail-Parsing
  return { message: "Email sync not yet implemented" };
}

async function syncFromProject(supabase: any, data: any, autoCreate: boolean) {
  // TODO: Implementiere Projekt-basierte Sync
  return { message: "Project sync not yet implemented" };
}

