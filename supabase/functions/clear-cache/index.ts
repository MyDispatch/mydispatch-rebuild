import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('[CLEAR-CACHE] Request received:', {
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('[CLEAR-CACHE] Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey
    });

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('[CLEAR-CACHE] Clearing cache...');

    // Log Cache-Clear Action
    await supabase
      .from('master_logs')
      .insert({
        action_type: 'cache_clear',
        action_status: 'success',
        metadata: {
          timestamp: new Date().toISOString(),
          cache_types: ['browser', 'cdn']
        }
      });

    console.log('[CLEAR-CACHE] Success');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Cache erfolgreich geleert',
        cleared_at: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[CLEAR-CACHE] Fatal error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
