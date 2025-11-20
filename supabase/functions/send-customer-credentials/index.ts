/* ==================================================================================
   SEND CUSTOMER CREDENTIALS - EMAIL FÜR PORTAL-ZUGANGSDATEN
   ==================================================================================
   Sendet Zugangsdaten an Kunden, die manuell vom Unternehmer angelegt wurden
   ================================================================================== */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CredentialsEmailRequest {
  customerEmail: string;
  customerName: string;
  companyName: string;
  temporaryPassword: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Unauthorized");

    const { customerEmail, customerName, companyName, temporaryPassword }: CredentialsEmailRequest =
      await req.json();

    console.log("[CREDENTIALS-EMAIL] Sending to:", customerEmail);

    const portalUrl = `${req.headers.get("origin")}/portal/auth`;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "MyDispatch <no-reply@mydispatch.de>",
        to: [customerEmail],
        subject: `Ihre Zugangsdaten für das Kunden-Portal von ${companyName}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #EADEBD; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
            .credentials { background: #f5f5f5; padding: 15px; border-left: 4px solid #EADEBD; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background: #EADEBD; color: #1A1F2C; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; color: #1A1F2C;">Willkommen beim Kunden-Portal</h1>
            </div>
            <div class="content">
              <p>Hallo ${customerName},</p>
              
              <p>Sie wurden erfolgreich als Kunde bei <strong>${companyName}</strong> angelegt und haben nun Zugang zum Online-Buchungsportal.</p>
              
              <div class="credentials">
                <h3 style="margin-top: 0;">Ihre Zugangsdaten:</h3>
                <p><strong>E-Mail:</strong> ${customerEmail}</p>
                <p><strong>Passwort:</strong> ${temporaryPassword}</p>
              </div>
              
              <p><strong>Wichtiger Hinweis:</strong> Bitte ändern Sie Ihr Passwort nach dem ersten Login aus Sicherheitsgründen.</p>
              
              <p style="text-align: center;">
                <a href="${portalUrl}" class="button">Zum Kunden-Portal</a>
              </p>
              
              <h3>Was Sie im Portal tun können:</h3>
              <ul>
                <li>Neue Buchungen erstellen</li>
                <li>Ihre Auftrags-Historie einsehen</li>
                <li>Rechnungen verwalten</li>
                <li>Profil bearbeiten</li>
              </ul>
              
              <p>Bei Fragen wenden Sie sich bitte direkt an ${companyName}.</p>
              
              <p>Mit freundlichen Grüßen,<br>
              Ihr ${companyName} Team</p>
            </div>
            <div class="footer">
              <p>Diese E-Mail wurde automatisch erstellt. Bitte antworten Sie nicht auf diese Nachricht.</p>
              <p>© ${new Date().getFullYear()} MyDispatch.de - Powered by MyDispatch</p>
            </div>
          </div>
        </body>
        </html>
      `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      throw new Error(`Resend API Error: ${JSON.stringify(errorData)}`);
    }

    const emailData = await emailResponse.json();

    console.log("[CREDENTIALS-EMAIL] Email sent:", emailData);

    return new Response(
      JSON.stringify({
        success: true,
        emailResponse: emailData,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("[CREDENTIALS-EMAIL] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
