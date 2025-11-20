import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("[RUN-SECURITY-SCAN] Request received:", {
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    console.log("[RUN-SECURITY-SCAN] Environment check:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
    });

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("[RUN-SECURITY-SCAN] Scanning system...");

    // Prüfe RLS Policies
    const { data: tables } = await supabase.rpc("check_rls_enabled");

    // Prüfe kritische known_issues
    const { data: issues } = await supabase
      .from("known_issues")
      .select("*")
      .in("severity", ["critical", "high"])
      .eq("resolved", false);

    // Erstelle Scan-Log
    const scanResult = {
      timestamp: new Date().toISOString(),
      tables_without_rls: tables?.filter((t: any) => !t.rls_enabled).length || 0,
      critical_issues: issues?.length || 0,
      status: (issues?.length || 0) > 0 ? "warning" : "success",
    };

    console.log("[RUN-SECURITY-SCAN] Scan completed:", scanResult);

    await supabase.from("master_logs").insert({
      action_type: "security_scan",
      action_status: scanResult.status,
      metadata: scanResult,
    });

    return new Response(
      JSON.stringify({
        success: true,
        scan_result: scanResult,
        critical_issues: issues || [],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[RUN-SECURITY-SCAN] Fatal error:", {
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
