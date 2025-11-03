/* ==================================================================================
   GET-GOOGLE-MAPS-KEY Edge Function
   ==================================================================================
   - Stellt Google Maps API Key sicher für Frontend bereit
   - Key aus Supabase Secrets (GOOGLE_MAPS_API_KEY)
   - Public Access (kein JWT required)
   - CORS enabled
   ================================================================================== */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const googleMapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!googleMapsApiKey) {
      throw new Error('GOOGLE_MAPS_API_KEY Secret nicht konfiguriert');
    }

    return new Response(
      JSON.stringify({ apiKey: googleMapsApiKey }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600', // 1 Stunde Cache
        },
      }
    );
  } catch (error) {
    console.error('Fehler in get-google-maps-key:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
