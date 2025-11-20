// ==================================================================================
// ALERT-MANAGER V18.5.1 (RESEND-INTEGRATED)
// ==================================================================================
// Purpose: Email-Benachrichtigung bei CRITICAL Findings (nutzt Resend-Integration)
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AlertPayload {
  alert_type: "critical" | "warning" | "info";
  severity: "critical" | "warning" | "info";
  message: string;
  details?: Record<string, any>;
  source: "watchdog-ai" | "central-brain" | "manual";
  company_id?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
    const resendDomain = Deno.env.get("RESEND_DOMAIN") || "onboarding@resend.dev";
    const resend = new Resend(resendApiKey);

    const payload: AlertPayload = await req.json();

    console.log(`[ALERT-MANAGER] Processing alert: ${payload.alert_type} - ${payload.message}`);

    // 1. Hole Alert-Policies (wer bekommt Benachrichtigungen?)
    const { data: policies, error: policiesError } = await supabase
      .from("alert_policies")
      .select("*")
      .eq("alert_type", payload.alert_type)
      .eq("enabled", true);

    if (policiesError) {
      console.error("[ALERT-MANAGER] Failed to fetch policies:", policiesError);
      throw policiesError;
    }

    if (!policies || policies.length === 0) {
      console.log("[ALERT-MANAGER] No active policies found, skipping email");

      // Log alert ohne Email
      await supabase.from("alert_logs").insert({
        alert_type: payload.alert_type,
        severity: payload.severity,
        message: payload.message,
        details: payload.details || {},
        source: payload.source,
        email_sent: false,
        email_recipients: [],
        email_error: "No active policies found",
      });

      return new Response(
        JSON.stringify({
          success: true,
          alert_logged: true,
          email_sent: false,
          reason: "No active policies",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Sammle alle Recipients
    const allRecipients = new Set<string>();
    for (const policy of policies) {
      policy.email_recipients?.forEach((email: string) => allRecipients.add(email));
    }

    if (allRecipients.size === 0) {
      console.log("[ALERT-MANAGER] No recipients configured");

      await supabase.from("alert_logs").insert({
        alert_type: payload.alert_type,
        severity: payload.severity,
        message: payload.message,
        details: payload.details || {},
        source: payload.source,
        email_sent: false,
        email_recipients: [],
        email_error: "No recipients configured",
      });

      return new Response(
        JSON.stringify({
          success: true,
          alert_logged: true,
          email_sent: false,
          reason: "No recipients",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Erstelle Email-Content
    const emailSubject = `[MyDispatch ${payload.severity.toUpperCase()}] ${payload.message}`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #323D5E; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #EADEBD, #F5E6C1); padding: 30px; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; color: #323D5E; font-size: 24px; }
          .badge { display: inline-block; padding: 6px 12px; border-radius: 4px; font-weight: bold; margin-top: 10px; }
          .badge.critical { background: #dc2626; color: white; }
          .badge.warning { background: #f59e0b; color: white; }
          .badge.info { background: #3b82f6; color: white; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .message { font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 20px; }
          .details { background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #EADEBD; }
          .details-title { font-weight: 600; margin-bottom: 10px; }
          .details-content { font-family: 'Courier New', monospace; font-size: 14px; color: #6b7280; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none; }
          .footer p { margin: 5px 0; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 MyDispatch System-Alert</h1>
            <span class="badge ${payload.severity}">${payload.severity.toUpperCase()}</span>
          </div>
          
          <div class="content">
            <p class="message">${payload.message}</p>
            
            ${
              payload.details
                ? `
              <div class="details">
                <div class="details-title">📋 Details:</div>
                <pre class="details-content">${JSON.stringify(payload.details, null, 2)}</pre>
              </div>
            `
                : ""
            }
            
            <p style="margin-top: 20px;">
              <strong>Quelle:</strong> ${payload.source}<br>
              <strong>Zeitpunkt:</strong> ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}
            </p>
          </div>
          
          <div class="footer">
            <p><strong>MyDispatch Monitoring System</strong></p>
            <p>Diese Nachricht wurde automatisch vom Alert-System generiert.</p>
            <p>© ${new Date().getFullYear()} MyDispatch by RideHub Solutions</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // 4. Sende Email via Resend (BESTEHENDE INTEGRATION!)
    let emailError: string | null = null;
    try {
      const emailResponse = await resend.emails.send({
        from: `MyDispatch Alerts <alerts@${resendDomain.includes("@") ? resendDomain.split("@")[1] : resendDomain}>`,
        to: Array.from(allRecipients),
        subject: emailSubject,
        html: emailHtml,
      });

      console.log("[ALERT-MANAGER] Email sent successfully:", emailResponse);
    } catch (error: any) {
      console.error("[ALERT-MANAGER] Email send failed:", error);
      emailError = error.message || "Unknown email error";
    }

    // 5. Log Alert in Database
    const { error: logError } = await supabase.from("alert_logs").insert({
      alert_type: payload.alert_type,
      severity: payload.severity,
      message: payload.message,
      details: payload.details || {},
      source: payload.source,
      email_sent: !emailError,
      email_recipients: Array.from(allRecipients),
      email_error: emailError,
    });

    if (logError) {
      console.error("[ALERT-MANAGER] Failed to log alert:", logError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        alert_logged: !logError,
        email_sent: !emailError,
        recipients_count: allRecipients.size,
        email_error: emailError,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[ALERT-MANAGER] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
