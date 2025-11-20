/* ==================================================================================
   MASTER-DASHBOARD - Terminierungs-E-Mail Edge Function
   ==================================================================================
   Versendet Mahnungen & Erinnerungen an säumige Unternehmen
   ================================================================================== */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { company_id, action_type } = await req.json();

    // Supabase Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Prüfe Master-Account
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    const masterEmails = ["info@simsek.cc", "nexify.login@gmail.com"];
    if (!user || !masterEmails.includes(user.email || "")) {
      return new Response(
        JSON.stringify({ error: "Nur Master-Accounts dürfen diese Funktion nutzen" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Hole Company-Daten
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("name, email, subscription_current_period_end")
      .eq("id", company_id)
      .single();

    if (companyError || !company) {
      throw new Error("Unternehmen nicht gefunden");
    }

    // Template-Auswahl
    let subject = "";
    let htmlContent = "";

    switch (action_type) {
      case "reminder":
        subject = "Erinnerung: Ihr MyDispatch-Abonnement läuft bald ab";
        htmlContent = `
          <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <h2>Sehr geehrte Damen und Herren von ${company.name},</h2>
            <p>Ihr MyDispatch-Abonnement läuft am <strong>${new Date(company.subscription_current_period_end).toLocaleDateString("de-DE")}</strong> ab.</p>
            <p>Um eine unterbrechungsfreie Nutzung sicherzustellen, verlängern Sie bitte rechtzeitig Ihr Abonnement.</p>
            <p><a href="https://mydispatch.de/pricing" style="background-color: #856d4b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Jetzt verlängern</a></p>
            <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
            <p>Mit freundlichen Grüßen,<br>Ihr MyDispatch Team</p>
          </body>
          </html>
        `;
        break;

      case "warning":
        subject = "1. Mahnung: Zahlungsverzug bei MyDispatch";
        htmlContent = `
          <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <h2>Sehr geehrte Damen und Herren von ${company.name},</h2>
            <p><strong>Hiermit mahnen wir die ausstehende Zahlung für Ihr MyDispatch-Abonnement an.</strong></p>
            <p>Fälligkeitsdatum: <strong>${new Date(company.subscription_current_period_end).toLocaleDateString("de-DE")}</strong></p>
            <p>Bitte begleichen Sie den offenen Betrag innerhalb der nächsten <strong>7 Tage</strong>, um eine Sperrung Ihres Accounts zu vermeiden.</p>
            <p><a href="https://mydispatch.de/pricing" style="background-color: #856d4b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Jetzt bezahlen</a></p>
            <p>Bei bereits erfolgter Zahlung bitten wir Sie, diese E-Mail zu ignorieren.</p>
            <p>Mit freundlichen Grüßen,<br>Ihr MyDispatch Team</p>
          </body>
          </html>
        `;
        break;

      case "final":
        subject = "LETZTE MAHNUNG: Account-Sperrung bei MyDispatch";
        htmlContent = `
          <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #d32f2f;">Sehr geehrte Damen und Herren von ${company.name},</h2>
            <p><strong>Dies ist unsere letzte Mahnung vor Sperrung Ihres MyDispatch-Accounts.</strong></p>
            <p>Trotz unserer vorherigen Mahnungen ist die Zahlung weiterhin ausständig.</p>
            <p>Fälligkeitsdatum: <strong>${new Date(company.subscription_current_period_end).toLocaleDateString("de-DE")}</strong></p>
            <p style="color: #d32f2f;"><strong>Bitte bezahlen Sie innerhalb der nächsten 3 Tage, andernfalls wird Ihr Account automatisch gesperrt.</strong></p>
            <p><a href="https://mydispatch.de/pricing" style="background-color: #d32f2f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Jetzt sofort bezahlen</a></p>
            <p>Bei Fragen zur Rechnung oder Zahlungsmodalitäten kontaktieren Sie uns bitte umgehend unter <a href="mailto:billing@mydispatch.de">billing@mydispatch.de</a>.</p>
            <p>Mit freundlichen Grüßen,<br>Ihr MyDispatch Team</p>
          </body>
          </html>
        `;
        break;

      default:
        throw new Error("Ungültiger Aktionstyp");
    }

    // E-Mail senden via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const resendDomain = Deno.env.get("RESEND_DOMAIN");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY nicht konfiguriert");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `MyDispatch <noreply@${resendDomain || "mydispatch.de"}>`,
        to: [company.email],
        subject,
        html: htmlContent,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend API Error:", errorText);
      throw new Error("E-Mail konnte nicht versendet werden");
    }

    console.log(`✅ Terminierungs-E-Mail versendet: ${action_type} → ${company.email}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "E-Mail wurde erfolgreich versendet",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-termination-email:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Ein Fehler ist aufgetreten",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
