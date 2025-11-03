// ==================================================================================
// GEOCODE ADDRESS - Adress-Geocoding mit HERE API
// ==================================================================================
// Erstellt: 2025-01-31
// Zweck: Adressen in Koordinaten umwandeln (HERE API)
// Autor: NeXify AI MASTER
// Best Practices: Error Handling, Type Safety, API Key Management, Caching
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GeocodeInput {
  address: string;
  company_id?: string;
  cache?: boolean;
}

interface GeocodeResult {
  address: string;
  lat: number;
  lng: number;
  formatted_address: string;
  city?: string;
  postal_code?: string;
  country?: string;
  confidence?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const input: GeocodeInput = await req.json();

    // Input Validation
    if (!input.address || typeof input.address !== "string") {
      return new Response(
        JSON.stringify({ error: "address is required and must be a string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[GEOCODE-ADDRESS] Geocoding address:", input.address);

    // 1. Check Cache (if enabled)
    if (input.cache !== false && input.company_id) {
      const { data: cached } = await supabase
        .from("geocoding_cache")
        .select("*")
        .eq("address", input.address.toLowerCase().trim())
        .eq("company_id", input.company_id)
        .single();

      if (cached && cached.lat && cached.lng) {
        console.log("[GEOCODE-ADDRESS] Using cached result");
        return new Response(
          JSON.stringify({
            address: cached.address,
            lat: cached.lat,
            lng: cached.lng,
            formatted_address: cached.formatted_address,
            city: cached.city,
            postal_code: cached.postal_code,
            country: cached.country,
            confidence: cached.confidence,
            cached: true,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }
    }

    // 2. Get HERE API Key
    const hereApiKey = Deno.env.get("HERE_API_KEY") || Deno.env.get("VITE_HERE_API_KEY");
    if (!hereApiKey) {
      console.error("[GEOCODE-ADDRESS] HERE API Key not found");
      return new Response(
        JSON.stringify({ error: "HERE API Key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Call HERE Geocoding API
    const hereUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(input.address)}&apiKey=${hereApiKey}`;
    
    const hereResponse = await fetch(hereUrl);
    if (!hereResponse.ok) {
      console.error("[GEOCODE-ADDRESS] HERE API error:", hereResponse.status);
      throw new Error(`HERE API error: ${hereResponse.status}`);
    }

    const hereData = await hereResponse.json();

    // 4. Parse HERE Response
    if (!hereData.items || hereData.items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Address not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const item = hereData.items[0];
    const position = item.position;
    const address = item.address;

    const result: GeocodeResult = {
      address: input.address,
      lat: position.lat,
      lng: position.lng,
      formatted_address: address.label,
      city: address.city,
      postal_code: address.postalCode,
      country: address.countryCode,
      confidence: item.scoring?.fieldScore?.postalCode || 0.5,
    };

    // 5. Cache Result (if enabled and company_id provided)
    if (input.cache !== false && input.company_id) {
      await supabase
        .from("geocoding_cache")
        .upsert({
          company_id: input.company_id,
          address: input.address.toLowerCase().trim(),
          lat: result.lat,
          lng: result.lng,
          formatted_address: result.formatted_address,
          city: result.city,
          postal_code: result.postal_code,
          country: result.country,
          confidence: result.confidence,
          cached_at: new Date().toISOString(),
        }, {
          onConflict: "address,company_id",
        });
    }

    console.log("[GEOCODE-ADDRESS] Successfully geocoded:", result.formatted_address);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("[GEOCODE-ADDRESS] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
