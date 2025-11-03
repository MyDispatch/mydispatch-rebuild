import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NexifyContactRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
}

async function sendEmail(to: string[], subject: string, html: string, replyTo?: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "MyDispatch NeXify <onboarding@resend.dev>",
      to,
      subject,
      html,
      ...(replyTo && { reply_to: replyTo }),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return await response.json();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, company, service, message }: NexifyContactRequest = await req.json();

    console.log("Processing NeXify contact from:", email);

    const serviceNames: Record<string, string> = {
      landingpage: "MyDispatch Landingpage (ab 590€)",
      widget: "Widget-Integration (99€)",
      database: "Datenbankanbindung (ab 490€)",
      api: "API-Verbindung (ab 699€)",
      automation: "Business Automatisierung",
      other: "Sonstiges / Beratung"
    };

    const serviceName = service ? serviceNames[service] || service : "Nicht ausgewählt";

    // E-Mail an NeXify
    await sendEmail(
      ["support@nexify-automate.com"],
      `Neue NeXify Anfrage von ${name}`,
      `
        <h1>Neue NeXify Anfrage</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
        ${company ? `<p><strong>Unternehmen:</strong> ${company}</p>` : ''}
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      email
    );

    // Bestätigung an Kunden
    await sendEmail(
      [email],
      "Ihre Anfrage bei NeXify wurde empfangen",
      `
        <h1>Anfrage empfangen</h1>
        <p>Hallo ${name},</p>
        <p>vielen Dank für Ihre Anfrage. Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
        <p><strong>Service:</strong> ${serviceName}</p>
        <p>Mit freundlichen Grüßen,<br>Ihr NeXify Team</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          NeXify | Graaf van Loonstraat 1E, 5921 JA Venlo, Niederlande<br>
          Tel: +31 6 133 188 56 | E-Mail: support@nexify-automate.com
        </p>
      `
    );

    console.log("Emails sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
