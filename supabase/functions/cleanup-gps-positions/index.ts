/* ==================================================================================
   GPS-POSITIONS AUTO-DELETE CRON-JOB
   ==================================================================================
   - Löscht GPS-Positionen älter als 24h (DSGVO-konform)
   - Läuft automatisch alle 6 Stunden
   - Logging für Monitoring
   ================================================================================== */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Starting GPS cleanup job...");

    // Berechne Zeitstempel für 24 Stunden zurück
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Lösche alte GPS-Positionen
    const { data: deletedPositions, error: deleteError } = await supabase
      .from("vehicle_positions")
      .delete()
      .lt("timestamp", twentyFourHoursAgo.toISOString())
      .select("id");

    if (deleteError) {
      throw deleteError;
    }

    const deletedCount = deletedPositions?.length || 0;

    console.log(`Deleted ${deletedCount} GPS positions older than 24h`);

    // Logging in system_logs
    await supabase.from("system_logs").insert({
      level: "info",
      message: `GPS cleanup: Deleted ${deletedCount} positions`,
      context: {
        deleted_count: deletedCount,
        threshold: twentyFourHoursAgo.toISOString(),
        job: "cleanup-gps-positions",
      },
    });

    // Logging in health_checks
    await supabase.from("health_checks").insert({
      service: "gps-cleanup",
      status: "healthy",
      response_time_ms: 0,
      error_message: null,
    });

    return new Response(
      JSON.stringify({
        success: true,
        deleted_count: deletedCount,
        threshold: twentyFourHoursAgo.toISOString(),
        message: `Successfully deleted ${deletedCount} GPS positions`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("GPS cleanup error:", error);

    // Error logging
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.from("system_logs").insert({
        level: "error",
        message: "GPS cleanup failed",
        context: {
          error: error.message,
          stack: error.stack,
          job: "cleanup-gps-positions",
        },
      });

      await supabase.from("health_checks").insert({
        service: "gps-cleanup",
        status: "error",
        response_time_ms: 0,
        error_message: error.message,
      });
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
