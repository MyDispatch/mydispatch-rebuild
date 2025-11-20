/* ==================================================================================
   SEND DEMO REQUEST - EDGE FUNCTION
   ==================================================================================
   Handles demo request submissions and sends confirmation email via Resend
   ================================================================================== */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DemoRequest {
  name: string;
  email: string;
  company: string;
  phone?: string;
  message?: string;
  requestedAt: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const requestData: DemoRequest = await req.json();

    console.log("[send-demo-request] Processing demo request:", {
      name: requestData.name,
      email: requestData.email,
      company: requestData.company,
    });

    // Send confirmation email via Resend (if configured)
    if (resendApiKey) {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "MyDispatch <info@my-dispatch.de>",
          to: [requestData.email],
          cc: ["info@my-dispatch.de"],
          subject: "Ihre MyDispatch Demo-Anfrage wurde erhalten",
          html: `
            <h1>Vielen Dank für Ihr Interesse, ${requestData.name}!</h1>
            <p>Wir haben Ihre Demo-Anfrage erhalten und werden uns innerhalb von 24 Stunden bei Ihnen melden.</p>
            
            <h2>Ihre Angaben:</h2>
            <ul>
              <li><strong>Name:</strong> ${requestData.name}</li>
              <li><strong>E-Mail:</strong> ${requestData.email}</li>
              <li><strong>Unternehmen:</strong> ${requestData.company}</li>
              ${requestData.phone ? `<li><strong>Telefon:</strong> ${requestData.phone}</li>` : ""}
            </ul>
            
            ${
              requestData.message
                ? `
              <h2>Ihre Nachricht:</h2>
              <p>${requestData.message}</p>
            `
                : ""
            }
            
            <h2>Was passiert als Nächstes?</h2>
            <ol>
              <li>Wir melden uns innerhalb von 24 Stunden</li>
              <li>Gemeinsam vereinbaren wir einen passenden Termin</li>
              <li>Sie erhalten einen Kalender-Eintrag mit Zugangsdaten</li>
              <li>30 Minuten Live-Demo mit Q&A</li>
            </ol>
            
            <p>Wir freuen uns darauf, Ihnen MyDispatch persönlich vorzustellen!</p>
            
            <p>Mit freundlichen Grüßen,<br>
            Ihr MyDispatch Team<br>
            <a href="https://my-dispatch.de">www.my-dispatch.de</a><br>
            Tel: +49 170 8004423</p>
          `,
        }),
      });

      if (!resendResponse.ok) {
        const error = await resendResponse.text();
        console.error("[send-demo-request] Resend error:", error);
        throw new Error(`Email sending failed: ${error}`);
      }

      console.log("[send-demo-request] Confirmation email sent successfully");
    } else {
      console.warn("[send-demo-request] RESEND_API_KEY not configured - skipping email");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Demo-Anfrage erfolgreich versendet",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("[send-demo-request] Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unbekannter Fehler",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
