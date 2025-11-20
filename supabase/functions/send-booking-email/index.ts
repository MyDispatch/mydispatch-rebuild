// ==================================================================================
// SEND BOOKING EMAIL - Email-Versand für Buchungen (Resend)
// ==================================================================================
// Erstellt: 2025-01-31
// Zweck: Email-Benachrichtigungen für Buchungen
// Autor: NeXify AI MASTER
// Best Practices: Error Handling, Type Safety, Email Templates, Resend Integration
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendBookingEmailInput {
  booking_id: string;
  company_id: string;
  email_type: "confirmation" | "update" | "cancellation" | "reminder";
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

    const input: SendBookingEmailInput = await req.json();

    // Input Validation
    if (!input.booking_id || !input.company_id || !input.email_type) {
      return new Response(
        JSON.stringify({ error: "booking_id, company_id, and email_type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[SEND-BOOKING-EMAIL] Sending email for booking:", input.booking_id);

    // 1. Get Booking Details
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(
        `
        *,
        customer:customers(*),
        driver:drivers(*),
        company:companies(*)
      `
      )
      .eq("id", input.booking_id)
      .eq("company_id", input.company_id)
      .eq("archived", false)
      .single();

    if (bookingError || !booking) {
      console.error("[SEND-BOOKING-EMAIL] Booking not found:", bookingError);
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Determine Recipient Email
    const recipientEmail =
      input.recipient_email ||
      (booking.customer && booking.customer.email) ||
      (booking.company && booking.company.email);

    if (!recipientEmail) {
      return new Response(JSON.stringify({ error: "Recipient email not found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Get Resend API Key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const resendDomain = Deno.env.get("RESEND_DOMAIN") || "mydispatch.com";

    if (!resendApiKey) {
      console.error("[SEND-BOOKING-EMAIL] Resend API Key not found");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. Generate Email Content
    const emailContent = generateEmailContent(booking, input.email_type);

    // 5. Send Email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `MyDispatch <noreply@${resendDomain}>`,
        to: recipientEmail,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error("[SEND-BOOKING-EMAIL] Resend error:", errorData);
      throw new Error(`Resend API error: ${resendResponse.status}`);
    }

    const resendData = await resendResponse.json();

    // 6. Log Email Sent
    await supabase.from("email_logs").insert({
      company_id: input.company_id,
      booking_id: input.booking_id,
      recipient_email: recipientEmail,
      email_type: input.email_type,
      sent_at: new Date().toISOString(),
      resend_id: resendData.id,
    });

    console.log("[SEND-BOOKING-EMAIL] Email sent successfully:", resendData.id);

    return new Response(
      JSON.stringify({
        success: true,
        email_id: resendData.id,
        recipient: recipientEmail,
        email_type: input.email_type,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("[SEND-BOOKING-EMAIL] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// Generate Email Content
function generateEmailContent(
  booking: any,
  emailType: string
): { subject: string; html: string; text: string } {
  const bookingNumber = booking.booking_number || booking.id.slice(0, 8);
  const pickupAddress = booking.pickup_address || "N/A";
  const dropoffAddress = booking.dropoff_address || "N/A";
  const bookingDate = booking.pickup_time
    ? new Date(booking.pickup_time).toLocaleDateString("de-DE")
    : "N/A";

  let subject = "";
  let html = "";
  let text = "";

  switch (emailType) {
    case "confirmation":
      subject = `Buchungsbestätigung #${bookingNumber}`;
      html = `
        <h2>Buchungsbestätigung</h2>
        <p>Ihre Buchung wurde erfolgreich erstellt:</p>
        <ul>
          <li><strong>Buchungsnummer:</strong> #${bookingNumber}</li>
          <li><strong>Abholort:</strong> ${pickupAddress}</li>
          <li><strong>Zielort:</strong> ${dropoffAddress}</li>
          <li><strong>Datum:</strong> ${bookingDate}</li>
        </ul>
      `;
      text = `Buchungsbestätigung #${bookingNumber}\n\nAbholort: ${pickupAddress}\nZielort: ${dropoffAddress}\nDatum: ${bookingDate}`;
      break;

    case "update":
      subject = `Buchungsaktualisierung #${bookingNumber}`;
      html = `
        <h2>Buchung wurde aktualisiert</h2>
        <p>Ihre Buchung #${bookingNumber} wurde aktualisiert.</p>
        <ul>
          <li><strong>Abholort:</strong> ${pickupAddress}</li>
          <li><strong>Zielort:</strong> ${dropoffAddress}</li>
          <li><strong>Datum:</strong> ${bookingDate}</li>
        </ul>
      `;
      text = `Buchungsaktualisierung #${bookingNumber}\n\nAbholort: ${pickupAddress}\nZielort: ${dropoffAddress}\nDatum: ${bookingDate}`;
      break;

    case "cancellation":
      subject = `Buchungsstornierung #${bookingNumber}`;
      html = `
        <h2>Buchung wurde storniert</h2>
        <p>Ihre Buchung #${bookingNumber} wurde storniert.</p>
      `;
      text = `Buchungsstornierung #${bookingNumber}`;
      break;

    case "reminder":
      subject = `Erinnerung: Buchung #${bookingNumber}`;
      html = `
        <h2>Erinnerung</h2>
        <p>Erinnerung an Ihre bevorstehende Buchung:</p>
        <ul>
          <li><strong>Buchungsnummer:</strong> #${bookingNumber}</li>
          <li><strong>Datum:</strong> ${bookingDate}</li>
        </ul>
      `;
      text = `Erinnerung: Buchung #${bookingNumber}\n\nDatum: ${bookingDate}`;
      break;
  }

  return { subject, html, text };
}
