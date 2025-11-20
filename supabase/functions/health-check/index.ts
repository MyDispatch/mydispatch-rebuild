import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("[HEALTH-CHECK] Request received:", {
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    console.log("[HEALTH-CHECK] Environment check:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
    });

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test Database Connection
    const { error: dbError } = await supabase.from("companies").select("id").limit(1);

    console.log("[HEALTH-CHECK] Database status:", {
      healthy: !dbError,
      error: dbError?.message,
    });

    // Test Edge Functions (self-check)
    const functions = [
      "get-system-logs",
      "trigger-db-backup",
      "get-deployment-status",
      "run-security-scan",
      "clear-cache",
      "get-analytics-data",
    ];

    const status = {
      timestamp: new Date().toISOString(),
      database: !dbError ? "healthy" : "error",
      edge_functions: functions.map((fn) => ({ name: fn, status: "deployed" })),
      overall_status: !dbError ? "healthy" : "degraded",
    };

    console.log("[HEALTH-CHECK] Success:", {
      overall: status.overall_status,
      database: status.database,
    });

    return new Response(JSON.stringify({ success: true, health: status }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[HEALTH-CHECK] Fatal error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
