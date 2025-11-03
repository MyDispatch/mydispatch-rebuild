import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const fromEmail = `MyDispatch <noreply@${Deno.env.get("RESEND_DOMAIN") || "resend.dev"}>`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DriverInvitationRequest {
  driverEmail: string;
  driverName: string;
  companyName: string;
  invitationLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { driverEmail, driverName, companyName, invitationLink }: DriverInvitationRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: [driverEmail],
      subject: `Einladung zum Fahrer-Portal - ${companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #EADEBD; padding: 20px; text-align: center; }
              .content { padding: 30px; background: #fff; }
              .button { display: inline-block; padding: 12px 30px; background: #856d4b; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .feature { padding: 10px 0; border-bottom: 1px solid #eee; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="color: #323D5E; margin: 0;">MyDispatch</h1>
              </div>
              <div class="content">
                <h2>Willkommen zum Fahrer-Portal!</h2>
                <p>Hallo ${driverName},</p>
                <p><strong>${companyName}</strong> lädt Sie ein, das MyDispatch Fahrer-Portal zu nutzen.</p>
                
                <h3>Ihre Vorteile:</h3>
                <div class="feature">✅ Schichtzettel digital erfassen</div>
                <div class="feature">✅ Auftragsstatus einsehen</div>
                <div class="feature">✅ Dokumente verwalten</div>
                <div class="feature">✅ Kommunikation mit der Zentrale</div>
                
                <p style="margin-top: 20px;">Klicken Sie auf den Button, um Ihr Konto zu aktivieren:</p>
                <a href="${invitationLink}" class="button">Portal aktivieren</a>
                
                <p>Oder kopieren Sie diesen Link in Ihren Browser:</p>
                <p style="word-break: break-all; color: #856d4b;">${invitationLink}</p>
                
                <p><strong>Dieser Link ist 7 Tage gültig.</strong></p>
                
                <p>Bei Fragen wenden Sie sich bitte an Ihr Unternehmen.</p>
                <p>Mit freundlichen Grüßen,<br>Ihr MyDispatch Team</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} MyDispatch. Alle Rechte vorbehalten.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Driver invitation email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending driver invitation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
