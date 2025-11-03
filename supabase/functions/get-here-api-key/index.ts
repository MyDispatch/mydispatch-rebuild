/* ==================================================================================
   GET-HERE-API-KEY Edge Function V18.5.13
   ==================================================================================
   - Stellt HERE Maps API Key sicher für Frontend bereit
   - Key aus Supabase Secrets (HERE_API_KEY)
   - Public Access (kein JWT required)
   - CORS enabled
   - Deployment: Fixed V18.5.13
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
    const hereApiKey = Deno.env.get('HERE_API_KEY');
    
    if (!hereApiKey) {
      throw new Error('HERE_API_KEY Secret nicht konfiguriert');
    }

    return new Response(
      JSON.stringify({ apiKey: hereApiKey }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600', // 1 Stunde Cache
        },
      }
    );
  } catch (error) {
    console.error('Fehler in get-here-api-key:', error);
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
