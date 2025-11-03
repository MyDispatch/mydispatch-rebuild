import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address } = await req.json();
    const HERE_API_KEY = Deno.env.get('HERE_API_KEY');

    if (!HERE_API_KEY) {
      throw new Error('HERE_API_KEY nicht konfiguriert');
    }

    if (!address) {
      throw new Error('Keine Adresse angegeben');
    }

    // HERE Geocoding API
    const geocodeResponse = await fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${HERE_API_KEY}`
    );

    const geocodeData = await geocodeResponse.json();

    if (!geocodeData.items || geocodeData.items.length === 0) {
      throw new Error('Adresse nicht gefunden');
    }

    const result = geocodeData.items[0];
    const position = result.position;
    const addressDetails = result.address;

    return new Response(
      JSON.stringify({
        lat: position.lat,
        lng: position.lng,
        formatted_address: result.title,
        address: {
          street: addressDetails.street || '',
          house_number: addressDetails.houseNumber || '',
          postal_code: addressDetails.postalCode || '',
          city: addressDetails.city || '',
          country: addressDetails.countryName || '',
        },
        quality: result.scoring?.queryScore || 1,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Fehler in geocode-address:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unbekannter Fehler',
        lat: null,
        lng: null,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});
