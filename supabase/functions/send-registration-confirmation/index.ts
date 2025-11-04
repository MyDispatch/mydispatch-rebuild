// ==================================================================================
// SEND REGISTRATION CONFIRMATION - Registrierungsbestätigung
// ==================================================================================
// Erstellt: 2025-01-31
// Zweck: E-Mail nach erfolgreicher Registrierung
// Autor: NeXify AI MASTER
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RegistrationConfirmationInput {
  user_id: string;
  email: string;
  company_name?: string;
  tariff?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const input: RegistrationConfirmationInput = await req.json();

    if (!input.user_id || !input.email) {
      return new Response(
        JSON.stringify({ error: "user_id and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Resend API Key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const resendDomain = Deno.env.get("RESEND_DOMAIN") || "mydispatch.com";
    
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*, companies(*)")
      .eq("user_id", input.user_id)
      .maybeSingle();

    const companyName = input.company_name || profile?.companies?.name || "Ihr Unternehmen";

    // Generate Email Content
    const emailContent = {
      subject: `Willkommen bei MyDispatch - Registrierung erfolgreich`,
      html: `
        <!DOCTYPE html>
        <html lang="de">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 60px 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <td>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.12);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #EADEBD 0%, #d6cbb0 100%); padding: 60px 45px; text-align: center;">
                      <h1 style="color: #323D5E; margin: 0; font-size: 36px; font-weight: 700;">MyDispatch</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 55px 45px;">
                      <h2 style="color: #323D5E; margin: 0 0 20px 0; font-size: 24px;">Willkommen bei MyDispatch!</h2>
                      <p style="color: #2d3748; font-size: 16px; line-height: 1.9; margin: 0 0 20px 0;">
                        Ihre Registrierung für <strong>${companyName}</strong> war erfolgreich!
                      </p>
                      <p style="color: #2d3748; font-size: 16px; line-height: 1.9; margin: 0 0 20px 0;">
                        Sie können sich jetzt mit Ihrer E-Mail-Adresse und Ihrem Passwort anmelden:
                      </p>
                      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #64748b; font-size: 14px;"><strong>E-Mail:</strong> ${input.email}</p>
                        ${input.tariff ? `<p style="margin: 10px 0 0 0; color: #64748b; font-size: 14px;"><strong>Tarif:</strong> ${input.tariff}</p>` : ''}
                      </div>
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${Deno.env.get('SUPABASE_URL') || 'https://mydispatch.app'}/auth" style="display: inline-block; padding: 14px 32px; background: #323D5E; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Jetzt anmelden</a>
                      </div>
                      <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 30px 0 0 0;">
                        <strong>Nächste Schritte:</strong><br>
                        1. Melden Sie sich mit Ihren Zugangsdaten an<br>
                        2. Vervollständigen Sie Ihr Profil<br>
                        3. Starten Sie mit Ihrer ersten Buchung
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 45px 45px;">
                      <div style="border-top: 1px solid #e2e8f0; padding-top: 30px; text-align: center; color: #94a3b8; font-size: 13px;">
                        <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} MyDispatch · Alle Rechte vorbehalten</p>
                        <p style="margin: 0;">Bei Fragen: <a href="mailto:support@my-dispatch.de" style="color: #323D5E; text-decoration: none;">support@my-dispatch.de</a></p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `Willkommen bei MyDispatch!\n\nIhre Registrierung für ${companyName} war erfolgreich.\n\nE-Mail: ${input.email}\n\nJetzt anmelden: ${Deno.env.get('SUPABASE_URL') || 'https://mydispatch.app'}/auth`,
    };

    // Send Email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `MyDispatch <noreply@${resendDomain}>`,
        to: input.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      throw new Error(`Resend API error: ${resendResponse.status}`);
    }

    const resendData = await resendResponse.json();

    // Log Email Sent
    await supabase
      .from("email_logs")
      .insert({
        user_id: input.user_id,
        recipient_email: input.email,
        email_type: "registration_confirmation",
        sent_at: new Date().toISOString(),
        resend_id: resendData.id,
      });

    return new Response(
      JSON.stringify({
        success: true,
        email_id: resendData.id,
        recipient: input.email,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("[SEND-REGISTRATION-CONFIRMATION] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

