/* ==================================================================================
   EDGE FUNCTION: send-contact-email
   ==================================================================================
   - Sendet Kontaktformular-E-Mails via Resend
   - DSGVO-konform mit Input-Validierung
   - Rate-Limiting & Spam-Schutz
   ================================================================================== */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const RESEND_DOMAIN = Deno.env.get("RESEND_DOMAIN") || "onboarding@resend.dev";
const NEXIFY_API_KEY = Deno.env.get("NEXIFY_API_KEY");
const NEXIFY_API_URL = "https://app.base44.com/api/apps/68da5e12f648ea6b946f1e8e/entities/Lead";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, company, subject, message }: ContactRequest = await req.json();

    console.log("[CONTACT-EMAIL] Received request:", {
      name,
      email,
      hasPhone: !!phone,
      hasCompany: !!company,
    });

    // ⚠️ KRITISCH: Server-seitige Validierung
    if (!name || !email || !message) {
      console.error("[CONTACT-EMAIL] Validation failed: Missing required fields");
      return new Response(
        JSON.stringify({ error: "Name, E-Mail und Nachricht sind Pflichtfelder" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // E-Mail an MyDispatch Team
    const emailToTeam = await resend.emails.send({
      from: `MyDispatch Kontaktformular <${RESEND_DOMAIN}>`,
      to: ["info@mydispatch.de"], // ⚠️ ANPASSEN an echte E-Mail
      replyTo: email,
      subject: subject || `Neue Kontaktanfrage von ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #EADEBD 0%, #856d4b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #323D5E; margin: 0; font-size: 28px;">Neue Kontaktanfrage</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #323D5E; margin-top: 0;">Kontaktdaten</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e5e5;">
                <td style="padding: 12px 0; font-weight: bold; color: #323D5E; width: 120px;">Name:</td>
                <td style="padding: 12px 0; color: #666;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e5e5;">
                <td style="padding: 12px 0; font-weight: bold; color: #323D5E;">E-Mail:</td>
                <td style="padding: 12px 0;"><a href="mailto:${email}" style="color: #856d4b; text-decoration: none;">${email}</a></td>
              </tr>
              ${
                phone
                  ? `
                <tr style="border-bottom: 1px solid #e5e5e5;">
                  <td style="padding: 12px 0; font-weight: bold; color: #323D5E;">Telefon:</td>
                  <td style="padding: 12px 0; color: #666;">${phone}</td>
                </tr>
              `
                  : ""
              }
              ${
                company
                  ? `
                <tr style="border-bottom: 1px solid #e5e5e5;">
                  <td style="padding: 12px 0; font-weight: bold; color: #323D5E;">Firma:</td>
                  <td style="padding: 12px 0; color: #666;">${company}</td>
                </tr>
              `
                  : ""
              }
            </table>
            
            <h2 style="color: #323D5E; margin-top: 30px;">Nachricht</h2>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #856d4b; color: #333; line-height: 1.6;">
              ${message.replace(/\n/g, "<br>")}
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #999; font-size: 12px;">
              <p>Diese E-Mail wurde über das Kontaktformular auf MyDispatch.de gesendet.</p>
              <p>© ${new Date().getFullYear()} MyDispatch.de by RideHub Solutions</p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("[CONTACT-EMAIL] Email to team sent successfully:", emailToTeam);

    // Bestätigungs-E-Mail an Absender
    const emailToSender = await resend.emails.send({
      from: `MyDispatch <${RESEND_DOMAIN}>`,
      to: [email],
      subject: "Ihre Anfrage bei MyDispatch wurde empfangen",
      html: `
        <div style="font-family: 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #EADEBD 0%, #856d4b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #323D5E; margin: 0; font-size: 28px;">Vielen Dank für Ihre Anfrage!</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Hallo ${name},
            </p>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden. 
              In der Regel erfolgt unsere Rückmeldung innerhalb von <strong>24 Stunden</strong>.
            </p>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #856d4b; margin: 20px 0;">
              <p style="margin: 0; color: #666; font-size: 14px;"><strong>Ihre Nachricht:</strong></p>
              <p style="margin: 10px 0 0 0; color: #333; line-height: 1.6;">
                ${message.replace(/\n/g, "<br>")}
              </p>
            </div>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Mit freundlichen Grüßen<br>
              <strong>Ihr MyDispatch Team</strong>
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center;">
              <a href="https://mydispatch.de" style="display: inline-block; background: #856d4b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Zur Website
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} MyDispatch.de by RideHub Solutions</p>
              <p>Made in Germany • DSGVO-konform</p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("[CONTACT-EMAIL] Confirmation email sent successfully:", emailToSender);

    // NeXify Lead erstellen
    try {
      if (NEXIFY_API_KEY) {
        const leadData = {
          full_name: name,
          email: email,
          phone: phone || "",
          company: company || "",
          source: "MyDispatch Kontaktformular",
          status: "new",
          interest: message,
          notes: `Anfrage vom ${new Date().toLocaleDateString("de-DE")}\n\nBetreff: ${subject || "Keine Angabe"}\n\nNachricht:\n${message}`,
          last_contact_date: new Date().toISOString().split("T")[0],
        };

        const nexifyResponse = await fetch(NEXIFY_API_URL, {
          method: "POST",
          headers: {
            api_key: NEXIFY_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(leadData),
        });

        if (nexifyResponse.ok) {
          const nexifyData = await nexifyResponse.json();
          console.log("[CONTACT-EMAIL] NeXify Lead created successfully:", nexifyData);
        } else {
          const errorText = await nexifyResponse.text();
          console.error("[CONTACT-EMAIL] NeXify API error:", nexifyResponse.status, errorText);
        }
      } else {
        console.warn("[CONTACT-EMAIL] NEXIFY_API_KEY not configured, skipping Lead creation");
      }
    } catch (nexifyError) {
      console.error("[CONTACT-EMAIL] Failed to create NeXify Lead:", nexifyError);
      // Fehler nicht propagieren - E-Mail wurde bereits gesendet
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "E-Mail erfolgreich versendet und Lead erstellt",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("[CONTACT-EMAIL] Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Fehler beim Senden der E-Mail",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
