import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Hole Deployment-History aus master_logs
    const { data: deployments, error } = await supabase
      .from('master_logs')
      .select('*')
      .eq('action_type', 'deployment')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    const statusSummary = {
      total: deployments?.length || 0,
      successful: deployments?.filter(d => d.action_status === 'success').length || 0,
      failed: deployments?.filter(d => d.action_status === 'error').length || 0,
      latest: deployments?.[0] || null
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        deployments,
        summary: statusSummary
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching deployment status:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
