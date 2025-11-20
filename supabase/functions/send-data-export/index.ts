// ==================================================================================
// SEND DATA EXPORT - GDPR-Datenexport per E-Mail
// ==================================================================================
// Erstellt: 2025-01-31
// Zweck: Datenexport (JSON/PDF) per E-Mail versenden
// Autor: NeXify AI MASTER
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendDataExportInput {
  customer_id: string;
  company_id: string;
  format: "JSON" | "PDF";
  recipient_email?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const input: SendDataExportInput = await req.json();

    if (!input.customer_id || !input.company_id || !input.format) {
      return new Response(
        JSON.stringify({ error: "customer_id, company_id, and format are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Customer Data
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("*")
      .eq("id", input.customer_id)
      .eq("company_id", input.company_id)
      .single();

    if (customerError || !customer) {
      return new Response(JSON.stringify({ error: "Customer not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const recipientEmail = input.recipient_email || customer.email;

    if (!recipientEmail) {
      return new Response(JSON.stringify({ error: "Recipient email not found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch All Customer Data (GDPR Export)
    const [bookingsResult, invoicesResult] = await Promise.all([
      supabase
        .from("bookings")
        .select("*")
        .eq("customer_id", input.customer_id)
        .order("created_at", { ascending: false }),
      supabase
        .from("invoices")
        .select("*")
        .eq("customer_id", input.customer_id)
        .order("created_at", { ascending: false }),
    ]);

    const exportData = {
      personal_data: customer,
      bookings: bookingsResult.data || [],
      invoices: invoicesResult.data || [],
      export_date: new Date().toISOString(),
      format: input.format,
    };

    // Get Resend API Key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const resendDomain = Deno.env.get("RESEND_DOMAIN") || "mydispatch.com";

    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Prepare Attachment
    let attachmentContent: string;
    let attachmentFilename: string;
    let attachmentMimeType: string;

    if (input.format === "JSON") {
      attachmentContent = Buffer.from(JSON.stringify(exportData, null, 2)).toString("base64");
      attachmentFilename = `meine-daten-${Date.now()}.json`;
      attachmentMimeType = "application/json";
    } else {
      // PDF Generation (TODO: Implement actual PDF generation)
      attachmentContent = Buffer.from(JSON.stringify(exportData, null, 2)).toString("base64"); // Placeholder
      attachmentFilename = `meine-daten-${Date.now()}.pdf`;
      attachmentMimeType = "application/pdf";
    }

    // Send Email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `MyDispatch <noreply@${resendDomain}>`,
        to: recipientEmail,
        subject: `Ihre Daten - MyDispatch (DSGVO Art. 15)`,
        html: `
          <!DOCTYPE html>
          <html lang="de">
          <head>
            <meta charset="UTF-8">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #323D5E;">Ihre Daten (DSGVO Art. 15)</h2>
              <p>Anbei finden Sie Ihre gespeicherten Daten im Format ${input.format}.</p>
              <p><strong>Export-Datum:</strong> ${new Date().toLocaleDateString("de-DE")}</p>
              <p>Diese E-Mail wurde automatisch generiert gemäß DSGVO Art. 15 (Auskunftsrecht).</p>
              <p>Mit freundlichen Grüßen,<br>Ihr MyDispatch Team</p>
            </div>
          </body>
          </html>
        `,
        attachments: [
          {
            filename: attachmentFilename,
            content: attachmentContent,
          },
        ],
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      throw new Error(`Resend API error: ${resendResponse.status}`);
    }

    const resendData = await resendResponse.json();

    // Log Email Sent
    await supabase.from("email_logs").insert({
      company_id: input.company_id,
      customer_id: input.customer_id,
      recipient_email: recipientEmail,
      email_type: "data_export",
      sent_at: new Date().toISOString(),
      resend_id: resendData.id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        email_id: resendData.id,
        recipient: recipientEmail,
        format: input.format,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("[SEND-DATA-EXPORT] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
