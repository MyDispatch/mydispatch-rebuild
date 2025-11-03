/* ==================================================================================
   Edge Function: clean-old-booking-data
   ==================================================================================
   PBefG § 21 & § 51 Compliance: Löscht Beförderungsdaten nach 30 Tagen
   - Läuft täglich (via Cron-Job)
   - Anonymisiert/Löscht alte Aufträge
   - Protokolliert Löschvorgänge
   ================================================================================== */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Berechne Datums-Grenze: 30 Tage zurück (PBefG § 21)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Hole alle Aufträge älter als 30 Tage
    const { data: oldBookings, error: selectError } = await supabaseClient
      .from('bookings')
      .select('id, company_id, pickup_date, customer_id')
      .lt('pickup_date', thirtyDaysAgo.toISOString())
      .eq('archived', false);

    if (selectError) throw selectError;

    let deletedCount = 0;

    for (const booking of oldBookings || []) {
      // Anonymisiere sensible Daten (PBefG § 21: Betriebspflicht endet nach 30 Tagen)
      const { error: updateError } = await supabaseClient
        .from('bookings')
        .update({
          pickup_address: '[GELÖSCHT - PBefG § 21]',
          dropoff_address: '[GELÖSCHT - PBefG § 21]',
          special_requests: null,
          internal_notes: '[Daten nach 30 Tagen gelöscht]',
          archived: true,
        })
        .eq('id', booking.id);

      if (!updateError) {
        deletedCount++;
        
        // Protokolliere Löschvorgang
        console.log(`[PBefG § 21] Auftrag ${booking.id} anonymisiert (Datum: ${booking.pickup_date})`);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `${deletedCount} Aufträge nach PBefG § 21 anonymisiert`,
        checked: oldBookings?.length || 0,
        threshold: thirtyDaysAgo.toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error('Fehler bei Daten-Löschung:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
