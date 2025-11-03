/* ==================================================================================
   Edge Function: send-booking-email
   ==================================================================================
   Sendet E-Mails für Auftragsbestätigungen
   - An Kunden und/oder Fahrer
   - Authentifiziert
   - Multi-Tenant
   ================================================================================== */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user) throw new Error("Nicht authentifiziert");

    const { bookingId, recipientType } = await req.json();

    if (!bookingId || !recipientType) {
      throw new Error("bookingId und recipientType erforderlich");
    }

    // Hole Auftragsdaten
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select(`
        *,
        customers(first_name, last_name, email),
        drivers(first_name, last_name, email),
        vehicles(license_plate),
        companies(name, email)
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError) throw bookingError;

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const resendDomain = Deno.env.get("RESEND_DOMAIN") || "onboarding@resend.dev";

    let recipientEmail = '';
    let recipientName = '';

    if (recipientType === 'customer' && booking.customers) {
      recipientEmail = booking.customers.email;
      recipientName = `${booking.customers.first_name} ${booking.customers.last_name}`;
    } else if (recipientType === 'driver' && booking.drivers) {
      recipientEmail = booking.drivers.email;
      recipientName = `${booking.drivers.first_name} ${booking.drivers.last_name}`;
    }

    if (!recipientEmail) {
      throw new Error("Keine E-Mail-Adresse gefunden");
    }

    const pickupTime = new Date(booking.pickup_time).toLocaleString('de-DE');
    const price = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(booking.price || 0);

    await resend.emails.send({
      from: `${booking.companies.name} <${resendDomain}>`,
      to: [recipientEmail],
      subject: `Auftragsbestätigung - ${booking.pickup_address}`,
      html: `
        <h2>Auftragsbestätigung</h2>
        <p>Hallo ${recipientName},</p>
        <p>Ihr Auftrag wurde bestätigt:</p>
        <hr>
        <p><strong>Von:</strong> ${booking.pickup_address}</p>
        <p><strong>Nach:</strong> ${booking.dropoff_address}</p>
        <p><strong>Abholung:</strong> ${pickupTime}</p>
        <p><strong>Preis:</strong> ${price}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
        ${booking.vehicles ? `<p><strong>Fahrzeug:</strong> ${booking.vehicles.license_plate}</p>` : ''}
        <hr>
        <p>Vielen Dank für Ihr Vertrauen!</p>
        <p><em>${booking.companies.name}</em></p>
      `,
    });

    return new Response(
      JSON.stringify({ message: 'E-Mail erfolgreich versendet' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error('Fehler beim E-Mail-Versand:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});