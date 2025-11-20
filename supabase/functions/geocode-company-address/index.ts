/* ==================================================================================
   EDGE FUNCTION: geocode-company-address - V18.2.8
   ==================================================================================
   - HERE Geocoding API Integration
   - Geocodiert Unternehmensadresse → Koordinaten
   - Input-Validierung mit Zod
   - Error Handling professionell
   ================================================================================== */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GeocodeRequest {
  address: string;
}

interface GeocodeResponse {
  latitude: number;
  longitude: number;
  formatted_address: string;
  street?: string;
  street_number?: string;
  postal_code?: string;
  city?: string;
  country_code?: string;
  timezone?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { address }: GeocodeRequest = await req.json();

    // Input-Validierung
    if (!address || address.trim().length < 5) {
      return new Response(
        JSON.stringify({
          error: "Ungültige Adresse. Bitte geben Sie eine vollständige Adresse ein.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // HERE Geocoding API
    const hereApiKey = Deno.env.get("HERE_API_KEY");
    if (!hereApiKey) {
      console.error("HERE_API_KEY nicht konfiguriert");
      return new Response(JSON.stringify({ error: "Geocoding-Service nicht verfügbar" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Geocoding Request
    const geocodeUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${hereApiKey}&lang=de`;

    const geocodeResponse = await fetch(geocodeUrl);

    if (!geocodeResponse.ok) {
      console.error("HERE API Fehler:", geocodeResponse.status);
      return new Response(JSON.stringify({ error: "Geocoding fehlgeschlagen" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const geocodeData = await geocodeResponse.json();

    // Validiere Response
    if (!geocodeData.items || geocodeData.items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Keine Ergebnisse für diese Adresse gefunden" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const firstResult = geocodeData.items[0];
    const { position, address: addressDetails } = firstResult;

    // Strukturiere Response
    const response: GeocodeResponse = {
      latitude: position.lat,
      longitude: position.lng,
      formatted_address: addressDetails.label,
      street: addressDetails.street,
      street_number: addressDetails.houseNumber,
      postal_code: addressDetails.postalCode,
      city: addressDetails.city,
      country_code: addressDetails.countryCode,
      timezone: firstResult.timeZone?.name || "Europe/Berlin",
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Geocoding Error:", error);
    return new Response(
      JSON.stringify({
        error: "Interner Fehler beim Geocoding",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
