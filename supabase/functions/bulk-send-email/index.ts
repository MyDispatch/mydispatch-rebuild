/**
 * Bulk Email Sending
 * V18.3 - Sprint 37: Bulk-Aktionen
 *
 * Versendet Emails an mehrere Empfänger:
 * - Auftragsbestätigungen
 * - Rechnungen
 * - Zahlungserinnerungen
 * - Custom Messages
 *
 * Verwendet Resend API
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get Resend API key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    // Verify user and get company_id
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Get company_id
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      throw new Error("Profile not found");
    }

    const company_id = profile.company_id;

    // Parse request body
    const {
      entity_type,
      entity_ids,
      email_type, // 'confirmation', 'invoice', 'reminder', 'custom'
      custom_subject,
      custom_message,
    } = await req.json();

    console.log("Bulk Email Send", {
      company_id,
      entity_type,
      count: entity_ids.length,
      email_type,
    });

    // Fetch company data
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("name, email, logo_url, email_signature")
      .eq("id", company_id)
      .single();

    if (companyError) {
      throw new Error(`Failed to fetch company: ${companyError.message}`);
    }

    // Fetch entities with customer data
    let entities: any[] = [];

    if (entity_type === "bookings") {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          *,
          customers (first_name, last_name, email, phone)
        `
        )
        .eq("company_id", company_id)
        .in("id", entity_ids)
        .not("customers.email", "is", null);

      if (error) throw error;
      entities = data || [];
    } else if (entity_type === "invoices") {
      const { data, error } = await supabase
        .from("invoices")
        .select(
          `
          *,
          customers (first_name, last_name, email)
        `
        )
        .eq("company_id", company_id)
        .in("id", entity_ids)
        .not("customers.email", "is", null);

      if (error) throw error;
      entities = data || [];
    }

    // Filter entities with valid email addresses
    const validEntities = entities.filter((e) => e.customers?.email);

    if (validEntities.length === 0) {
      throw new Error("Keine gültigen E-Mail-Adressen gefunden");
    }

    // Send emails
    const results = [];

    for (const entity of validEntities) {
      try {
        const emailContent = generateEmailContent(
          entity,
          company,
          email_type,
          custom_subject,
          custom_message
        );

        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `${company.name} <${company.email || "noreply@mydispatch.app"}>`,
            to: [entity.customers.email],
            subject: emailContent.subject,
            html: emailContent.html,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to send email");
        }

        results.push({
          entity_id: entity.id,
          recipient: entity.customers.email,
          status: "sent",
          email_id: data.id,
        });
      } catch (error) {
        console.error(`Failed to send email for ${entity.id}:`, error);
        results.push({
          entity_id: entity.id,
          recipient: entity.customers.email,
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const successCount = results.filter((r) => r.status === "sent").length;
    const failedCount = results.filter((r) => r.status === "failed").length;

    return new Response(
      JSON.stringify({
        success: true,
        total: validEntities.length,
        sent: successCount,
        failed: failedCount,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in bulk email send:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Generate email content based on type
 */
function generateEmailContent(
  entity: any,
  company: any,
  email_type: string,
  custom_subject?: string,
  custom_message?: string
): { subject: string; html: string } {
  const customerName = `${entity.customers?.first_name || ""} ${entity.customers?.last_name || ""}`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount || 0);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  // Email templates
  const templates: Record<string, any> = {
    confirmation: {
      subject: `Auftragsbestätigung - ${company.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${company.logo_url ? `<img src="${company.logo_url}" alt="${company.name}" style="max-width: 200px; margin-bottom: 20px;">` : ""}
          <h2>Auftragsbestätigung</h2>
          <p>Sehr geehrte/r ${customerName},</p>
          <p>wir bestätigen Ihren Auftrag:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Abholzeit:</strong> ${formatDate(entity.pickup_time)}</p>
            <p><strong>Von:</strong> ${entity.pickup_address}</p>
            <p><strong>Nach:</strong> ${entity.dropoff_address}</p>
            <p><strong>Preis:</strong> ${formatCurrency(entity.price)}</p>
          </div>
          <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
          ${company.email_signature || `<p>Mit freundlichen Grüßen<br>${company.name}</p>`}
        </div>
      `,
    },
    invoice: {
      subject: `Rechnung ${entity.invoice_number} - ${company.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${company.logo_url ? `<img src="${company.logo_url}" alt="${company.name}" style="max-width: 200px; margin-bottom: 20px;">` : ""}
          <h2>Rechnung ${entity.invoice_number}</h2>
          <p>Sehr geehrte/r ${customerName},</p>
          <p>anbei erhalten Sie Ihre Rechnung:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Rechnungsnummer:</strong> ${entity.invoice_number}</p>
            <p><strong>Rechnungsdatum:</strong> ${formatDate(entity.invoice_date)}</p>
            <p><strong>Fälligkeitsdatum:</strong> ${formatDate(entity.due_date)}</p>
            <p><strong>Gesamtbetrag:</strong> ${formatCurrency(entity.total_amount)}</p>
          </div>
          <p>Bitte überweisen Sie den Betrag bis zum angegebenen Fälligkeitsdatum.</p>
          ${company.email_signature || `<p>Mit freundlichen Grüßen<br>${company.name}</p>`}
        </div>
      `,
    },
    reminder: {
      subject: `Zahlungserinnerung - ${company.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${company.logo_url ? `<img src="${company.logo_url}" alt="${company.name}" style="max-width: 200px; margin-bottom: 20px;">` : ""}
          <h2>Zahlungserinnerung</h2>
          <p>Sehr geehrte/r ${customerName},</p>
          <p>wir möchten Sie freundlich an die ausstehende Zahlung erinnern:</p>
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p><strong>Rechnungsnummer:</strong> ${entity.invoice_number}</p>
            <p><strong>Fälligkeitsdatum:</strong> ${formatDate(entity.due_date)}</p>
            <p><strong>Offener Betrag:</strong> ${formatCurrency(entity.total_amount)}</p>
          </div>
          <p>Bitte begleichen Sie den ausstehenden Betrag zeitnah.</p>
          <p>Bei Fragen oder Problemen kontaktieren Sie uns gerne.</p>
          ${company.email_signature || `<p>Mit freundlichen Grüßen<br>${company.name}</p>`}
        </div>
      `,
    },
    custom: {
      subject: custom_subject || `Nachricht von ${company.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${company.logo_url ? `<img src="${company.logo_url}" alt="${company.name}" style="max-width: 200px; margin-bottom: 20px;">` : ""}
          <p>Sehr geehrte/r ${customerName},</p>
          <div style="margin: 20px 0;">
            ${custom_message || ""}
          </div>
          ${company.email_signature || `<p>Mit freundlichen Grüßen<br>${company.name}</p>`}
        </div>
      `,
    },
  };

  return templates[email_type] || templates.custom;
}
