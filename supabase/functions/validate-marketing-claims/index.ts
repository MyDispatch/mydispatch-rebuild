import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FORBIDDEN_CLAIMS = [
  // Kostenlos-Claims
  "Kostenlos testen", "kostenlos testen",
  "Kostenloser", "kostenloser",
  "Gratis", "gratis",
  "Free trial", "free trial",
  "Jetzt kostenlos", "jetzt kostenlos",
  "Geld-zurück-Garantie", "geld-zurück-garantie",
  "Testphase", "testphase",
  "30 Tage kostenlos", "30 tage kostenlos",
  "14 Tage kostenlos", "14 tage kostenlos",
  
  // Absolute Superlative
  "Das Beste", "das beste",
  "Die Nr. 1", "die nr. 1",
  "#1 in Deutschland", "#1 in deutschland",
  "Führend in", "führend in",
  "Marktführer", "marktführer",
  
  // Garantie-Versprechen ohne Beleg
  "100% Garantie", "100% garantie",
  "Garantiert mehr Umsatz", "garantiert mehr umsatz",
  "Unbegrenzt", "unbegrenzt",
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text_content, file_path } = await req.json();
    
    const violations = [];
    
    for (const claim of FORBIDDEN_CLAIMS) {
      const regex = new RegExp(claim, 'gi');
      if (regex.test(text_content)) {
        violations.push({
          claim,
          file: file_path,
          severity: 'critical'
        });
      }
    }
    
    if (violations.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          violations,
          message: 'RECHTLICHE VERSTÖSSE GEFUNDEN!'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Keine Verstöße gefunden' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
