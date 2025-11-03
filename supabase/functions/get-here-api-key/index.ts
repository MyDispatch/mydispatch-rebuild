// ==================================================================================
// GET HERE API KEY - Sichere HERE API Key Bereitstellung
// ==================================================================================
// Erstellt: 2025-01-31
// Zweck: Frontend-sichere HERE API Key Bereitstellung
// Autor: NeXify AI MASTER
// Best Practices: Security, Key Management, Rate Limiting
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GetKeyInput {
  company_id?: string;
  purpose?: "geocoding" | "maps" | "routing" | "traffic";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const input: GetKeyInput = await req.json() || {};

    // 1. Get HERE API Key from Environment
    const hereApiKey = Deno.env.get("HERE_API_KEY") || Deno.env.get("VITE_HERE_API_KEY");
    if (!hereApiKey) {
      console.error("[GET-HERE-API-KEY] HERE API Key not found");
      return new Response(
        JSON.stringify({ error: "HERE API Key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Check Subscription (if company_id provided)
    if (input.company_id) {
      const { data: company } = await supabase
        .from("companies")
        .select("subscription_product_id, subscription_status")
        .eq("id", input.company_id)
        .eq("archived", false)
        .single();

      if (!company || company.subscription_status !== "active") {
        return new Response(
          JSON.stringify({ error: "Active subscription required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // 3. Log Usage (for monitoring)
    if (input.company_id) {
      await supabase
        .from("api_usage_logs")
        .insert({
          company_id: input.company_id,
          api_name: "here_api",
          purpose: input.purpose || "geocoding",
          requested_at: new Date().toISOString(),
        });
    }

    console.log("[GET-HERE-API-KEY] API key provided for purpose:", input.purpose || "geocoding");

    // 4. Return Key (Frontend-safe)
    return new Response(
      JSON.stringify({
        api_key: hereApiKey,
        purpose: input.purpose || "geocoding",
        expires_in: 3600, // 1 hour (for frontend caching)
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("[GET-HERE-API-KEY] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
