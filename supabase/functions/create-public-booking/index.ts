/* ==================================================================================
   EDGE FUNCTION: create-public-booking
   ==================================================================================
   - Ermöglicht öffentliche Buchungen über Unternehmer-Landingpage
   - Kein Auth erforderlich (öffentlich zugänglich)
   - DSGVO-konform (§ 21 PBefG, DSGVO Art. 6 Abs. 1 lit. b)
   ================================================================================== */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customer, booking } = await req.json();

    // Service Role Client (Admin-Rechte für öffentliche Buchungen)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1. Prüfen ob Kunde bereits existiert (E-Mail + company_id)
    const { data: existingCustomer } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("email", customer.email)
      .eq("company_id", customer.company_id)
      .single();

    let customerId = existingCustomer?.id;

    // 2. Kunde erstellen falls noch nicht vorhanden
    if (!customerId) {
      const { data: newCustomer, error: customerError } = await supabaseAdmin
        .from("customers")
        .insert(customer)
        .select("id")
        .single();

      if (customerError) throw customerError;
      customerId = newCustomer.id;
    }

    // 3. Buchung erstellen
    const { data: newBooking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .insert({
        ...booking,
        customer_id: customerId,
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // 4. E-Mail-Benachrichtigung senden (optional)
    try {
      await supabaseAdmin.functions.invoke("send-booking-email", {
        body: {
          bookingId: newBooking.id,
          type: "new_booking_public",
        },
      });
    } catch (emailError) {
      console.error("E-Mail-Versand fehlgeschlagen:", emailError);
      // Nicht kritisch, Buchung ist trotzdem erfolgreich
    }

    return new Response(
      JSON.stringify({
        success: true,
        bookingId: newBooking.id,
        customerId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("create-public-booking error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Fehler bei der Buchungserstellung",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
