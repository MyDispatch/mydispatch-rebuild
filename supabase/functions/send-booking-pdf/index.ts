// ==================================================================================
// SEND BOOKING PDF - Auftrag als PDF per E-Mail versenden
// ==================================================================================
// Erstellt: 2025-01-31
// Zweck: Auftrag als PDF per E-Mail versenden
// Autor: NeXify AI MASTER
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendBookingPDFInput {
  booking_id: string;
  company_id: string;
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

    const input: SendBookingPDFInput = await req.json();

    if (!input.booking_id || !input.company_id) {
      return new Response(
        JSON.stringify({ error: "booking_id and company_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Booking Details
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(`
        *,
        customer:customers(*),
        driver:drivers(*),
        company:companies(*)
      `)
      .eq("id", input.booking_id)
      .eq("company_id", input.company_id)
      .single();

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: "Booking not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine Recipient Email
    const recipientEmail = input.recipient_email || 
      (booking.customer && booking.customer.email) ||
      (booking.company && booking.company.email);

    if (!recipientEmail) {
      return new Response(
        JSON.stringify({ error: "Recipient email not found" }),
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

    // Generate PDF HTML (using invoice template structure)
    const bookingNumber = booking.booking_number || booking.id.slice(0, 8);
    const pickupDate = booking.pickup_time ? new Date(booking.pickup_time).toLocaleDateString("de-DE") : "N/A";
    const pickupTime = booking.pickup_time ? new Date(booking.pickup_time).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) : "N/A";

    const pdfHTML = generateBookingPDFHTML(booking, bookingNumber, pickupDate, pickupTime);

    // Convert HTML to PDF (using Edge Function PDF generation)
    // Note: In production, use a PDF service like Puppeteer or html2pdf
    const pdfBuffer = await generatePDFFromHTML(pdfHTML);

    // Send Email via Resend with PDF Attachment
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `MyDispatch <noreply@${resendDomain}>`,
        to: recipientEmail,
        subject: `Auftrag #${bookingNumber} - MyDispatch`,
        html: `
          <!DOCTYPE html>
          <html lang="de">
          <head>
            <meta charset="UTF-8">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #323D5E;">Ihr Auftrag #${bookingNumber}</h2>
              <p>Anbei finden Sie Ihren Auftrag als PDF.</p>
              <p><strong>Datum:</strong> ${pickupDate}<br>
              <strong>Uhrzeit:</strong> ${pickupTime}<br>
              <strong>Abholort:</strong> ${booking.pickup_address || "N/A"}<br>
              <strong>Zielort:</strong> ${booking.dropoff_address || "N/A"}</p>
              <p>Mit freundlichen Grüßen,<br>Ihr MyDispatch Team</p>
            </div>
          </body>
          </html>
        `,
        attachments: [
          {
            filename: `Auftrag_${bookingNumber}.pdf`,
            content: pdfBuffer.toString('base64'),
          },
        ],
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
        company_id: input.company_id,
        booking_id: input.booking_id,
        recipient_email: recipientEmail,
        email_type: "booking_pdf",
        sent_at: new Date().toISOString(),
        resend_id: resendData.id,
      });

    return new Response(
      JSON.stringify({
        success: true,
        email_id: resendData.id,
        recipient: recipientEmail,
        booking_number: bookingNumber,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("[SEND-BOOKING-PDF] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Generate Booking PDF HTML
function generateBookingPDFHTML(booking: any, bookingNumber: string, pickupDate: string, pickupTime: string): string {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: A4; margin: 25mm; }
    body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.4; color: #323D5E; }
    .header { display: flex; justify-content: space-between; padding-bottom: 10mm; border-bottom: 2px solid #EADEBD; margin-bottom: 10mm; }
    .header h1 { font-size: 32pt; font-weight: bold; color: #323D5E; margin: 0; }
    .header h2 { font-size: 24pt; font-weight: bold; color: #323D5E; margin: 0; }
    .address-block { margin-bottom: 20mm; }
    .content { margin-bottom: 15mm; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #EADEBD; padding: 8px; text-align: left; font-weight: bold; }
    td { padding: 8px; border-bottom: 1px solid #E5E7EB; }
    .footer { margin-top: 20mm; padding-top: 5mm; border-top: 1px solid #E5E7EB; font-size: 8pt; color: #6B7280; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>MyDispatch</h1>
      <p>Professionelle Dispositionssoftware</p>
    </div>
    <div style="text-align: right;">
      <h2>AUFTRAG</h2>
      <p><strong>Auftragsnummer:</strong> ${bookingNumber}</p>
      <p><strong>Datum:</strong> ${pickupDate}</p>
    </div>
  </div>
  
  <div class="address-block">
    <div style="font-size: 11pt; line-height: 1.5;">
      <strong>${booking.customer?.first_name || ''} ${booking.customer?.last_name || ''}</strong><br>
      ${booking.customer?.address || ''}<br>
      ${booking.customer?.postal_code || ''} ${booking.customer?.city || ''}
    </div>
  </div>
  
  <div class="content">
    <h3 style="font-size: 14pt; font-weight: bold; margin-bottom: 15mm;">Auftragsdetails</h3>
    <table>
      <tr>
        <th style="width: 30%;">Abholort</th>
        <td>${booking.pickup_address || "N/A"}</td>
      </tr>
      <tr>
        <th>Zielort</th>
        <td>${booking.dropoff_address || "N/A"}</td>
      </tr>
      <tr>
        <th>Datum & Uhrzeit</th>
        <td>${pickupDate} um ${pickupTime}</td>
      </tr>
      ${booking.price ? `
      <tr>
        <th>Preis</th>
        <td>${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(booking.price)}</td>
      </tr>
      ` : ''}
      ${booking.passengers ? `
      <tr>
        <th>Passagiere</th>
        <td>${booking.passengers}</td>
      </tr>
      ` : ''}
      ${booking.vehicle_type ? `
      <tr>
        <th>Fahrzeugtyp</th>
        <td>${booking.vehicle_type}</td>
      </tr>
      ` : ''}
    </table>
  </div>
  
  <div class="footer">
    <p><strong>MyDispatch</strong> - Professionelle Dispositionssoftware</p>
    <p>© ${new Date().getFullYear()} MyDispatch. Alle Rechte vorbehalten.</p>
  </div>
</body>
</html>
  `.trim();
}

// Generate PDF from HTML (Placeholder - use actual PDF service in production)
async function generatePDFFromHTML(html: string): Promise<Buffer> {
  // TODO: Implement actual PDF generation using:
  // - Puppeteer (headless Chrome)
  // - html2pdf.js
  // - Or external PDF service API
  
  // For now, return empty buffer (will be implemented)
  return Buffer.from('');
}

