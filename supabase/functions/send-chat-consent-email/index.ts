/* ==================================================================================
   CHAT CONSENT EMAIL - DSGVO-konforme Einwilligungs-Email
   ==================================================================================
   Versendet Bestätigungs-Email für Team-Chat-Teilnahme bei manueller Anlage
   ================================================================================== */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatConsentEmailRequest {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  entity_type: "driver" | "customer" | "entrepreneur";
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      user_id,
      email,
      first_name,
      last_name,
      company_name,
      entity_type,
    }: ChatConsentEmailRequest = await req.json();

    console.log("[ChatConsentEmail] Sending consent email to:", email);

    // Supabase Client für Token-Generierung
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Generiere sicheren Confirmation-Token
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // 48h Gültigkeit

    // Speichere Token in chat_consent
    const { error: tokenError } = await supabaseAdmin
      .from("chat_consent")
      .update({
        confirmation_token: token,
        confirmation_token_expires_at: expiresAt.toISOString(),
        confirmation_email_sent: true,
        confirmation_email_sent_at: new Date().toISOString(),
      })
      .eq("user_id", user_id);

    if (tokenError) {
      console.error("[ChatConsentEmail] Token save error:", tokenError);
      throw tokenError;
    }

    // Bestätigungs-URL
    const confirmUrl = `${Deno.env.get("SUPABASE_URL")?.replace("/rest/v1", "")}/confirm-chat?token=${token}`;

    // Entity-spezifische Texte
    const entityText =
      entity_type === "driver" ? "Fahrer" : entity_type === "customer" ? "Kunde" : "Teammitglied";

    // Email versenden
    const emailResponse = await resend.emails.send({
      from: "MyDispatch Team <noreply@my-dispatch.de>",
      to: [email],
      subject: `${company_name} - Einladung zum Team-Chat`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Team-Chat Einladung</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #EADEBD;">
              <h1 style="color: #2c3e50; margin: 0; font-size: 24px; font-weight: 700;">
                ${company_name}
              </h1>
              <p style="color: #7f8c8d; margin: 8px 0 0 0; font-size: 14px;">
                Team-Kommunikation
              </p>
            </div>

            <!-- Content -->
            <div style="margin-bottom: 30px;">
              <h2 style="color: #2c3e50; font-size: 20px; margin: 0 0 20px 0;">
                Hallo ${first_name} ${last_name},
              </h2>
              
              <p style="color: #555; font-size: 16px; line-height: 1.8; margin: 0 0 20px 0;">
                Sie wurden als <strong>${entityText}</strong> bei <strong>${company_name}</strong> registriert 
                und zum internen Team-Chat eingeladen.
              </p>

              <div style="background-color: #f8f9fa; border-left: 4px solid #EADEBD; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 12px 0; color: #2c3e50; font-size: 16px;">
                  🔐 Datenschutz & Einwilligung
                </h3>
                <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.6;">
                  Zur Teilnahme am Team-Chat benötigen wir Ihre ausdrückliche Einwilligung gemäß DSGVO (Art. 6 Abs. 1 lit. a). 
                  Ihre Daten werden ausschließlich für die interne Kommunikation verwendet und nicht an Dritte weitergegeben.
                </p>
              </div>

              <p style="color: #555; font-size: 16px; line-height: 1.8; margin: 20px 0;">
                <strong>Was beinhaltet die Einwilligung?</strong>
              </p>
              <ul style="color: #555; font-size: 14px; line-height: 1.8; margin: 0 0 25px 0;">
                <li>Teilnahme am Unternehmens-Chat</li>
                <li>Senden und Empfangen von Nachrichten</li>
                <li>Anzeige Ihres Namens für Teammitglieder</li>
                <li>Speicherung von Chat-Nachrichten (verschlüsselt)</li>
              </ul>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="${confirmUrl}" 
                   style="display: inline-block; background-color: #EADEBD; color: #1a1a1a; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: background-color 0.3s;">
                  ✅ Team-Chat aktivieren
                </a>
              </div>

              <p style="color: #7f8c8d; font-size: 13px; line-height: 1.6; margin: 25px 0; padding: 15px; background-color: #f8f9fa; border-radius: 6px;">
                <strong>Hinweis:</strong> Dieser Link ist 48 Stunden gültig. Sie können Ihre Einwilligung jederzeit 
                in den Einstellungen (Team-Kommunikation) widerrufen.
              </p>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #7f8c8d; font-size: 12px; margin: 0 0 8px 0;">
                Sie haben keine Einwilligung erteilt? Ignorieren Sie diese E-Mail.
              </p>
              <p style="color: #7f8c8d; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} ${company_name} • Powered by MyDispatch
              </p>
              <p style="color: #7f8c8d; font-size: 11px; margin: 8px 0 0 0;">
                Made in Germany 🇩🇪 • DSGVO-konform
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("[ChatConsentEmail] Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("[ChatConsentEmail] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
