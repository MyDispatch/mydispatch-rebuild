/* ==================================================================================
   GPS-TRACKER-WEBHOOK - Externe GPS-Geräte-Integration
   ==================================================================================
   Empfängt GPS-Daten von Hardware-Trackern (Teltonika, Coban, etc.)
   DSGVO-Compliance: Automatischer 24h-Delete via pg_cron
   ================================================================================== */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GPSPayload {
  device_id: string;
  lat: number;
  lng: number;
  timestamp?: string;
  speed?: number;
  heading?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: GPSPayload = await req.json();
    const startTime = Date.now();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Step 1: Lookup Driver by Device-ID
    const { data: device, error: deviceError } = await supabase
      .from("gps_devices")
      .select("driver_id, company_id")
      .eq("device_id", payload.device_id)
      .single();

    if (deviceError || !device) {
      console.error("[GPS-Webhook] Unknown device:", payload.device_id);
      return new Response(
        JSON.stringify({ error: "Unknown device", device_id: payload.device_id }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Step 2: Update Driver Position (mit Retry 3x, 1s delay)
    let retries = 3;
    let success = false;
    let lastError: any = null;

    while (retries > 0 && !success) {
      const { error: updateError } = await supabase.from("driver_positions").upsert(
        {
          driver_id: device.driver_id,
          company_id: device.company_id,
          lat: parseFloat(String(payload.lat)),
          lng: parseFloat(String(payload.lng)),
          speed: payload.speed || 0,
          heading: payload.heading || 0,
          updated_at: payload.timestamp || new Date().toISOString(),
        },
        {
          onConflict: "driver_id",
        }
      );

      if (!updateError) {
        success = true;
      } else {
        lastError = updateError;
        retries--;
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 1s delay
        }
      }
    }

    const executionTime = Date.now() - startTime;

    // Step 3: Log to brain_logs
    await supabase.from("brain_logs").insert({
      company_id: device.company_id,
      agent_action: "gps_tracker_update",
      input_context: {
        device_id: payload.device_id,
        lat: payload.lat,
        lng: payload.lng,
        speed: payload.speed,
        heading: payload.heading,
      },
      output_result: {
        driver_id: device.driver_id,
        updated: success,
        retries_used: 3 - retries,
      },
      confidence: success ? 1.0 : 0.3,
      success,
      error_message: success ? null : lastError?.message,
      execution_time_ms: executionTime,
    });

    console.log("[GPS-Webhook] Success:", {
      device_id: payload.device_id,
      driver_id: device.driver_id,
      retries_used: 3 - retries,
      execution_time: executionTime,
    });

    return new Response(
      JSON.stringify({
        success,
        driver_id: device.driver_id,
        retries_left: retries,
        execution_time_ms: executionTime,
      }),
      {
        status: success ? 200 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("[GPS-Webhook] Critical Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: "GPS-Tracker-Webhook failed",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
