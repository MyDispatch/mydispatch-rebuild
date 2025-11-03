import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // API Key Authentifizierung
    const apiKey = req.headers.get('x-api-key');
    const expectedKey = Deno.env.get('BOT_API_KEY');

    if (!apiKey || apiKey !== expectedKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { action, params } = await req.json();

    console.log('[BOT-WEBHOOK] Action:', action, 'Params:', params);

    // Action-Routing
    const actions: Record<string, (params: any) => Promise<any>> = {
      'get-companies': async () => {
        const { data } = await supabase
          .from('companies')
          .select('id, name, email, company_status, subscription_status')
          .order('created_at', { ascending: false });
        return { companies: data || [] };
      },

      'get-system-health': async () => {
        // Hole aktuelle System-Metriken
        const { count: totalCompanies } = await supabase
          .from('companies')
          .select('*', { count: 'exact', head: true });

        const { count: activeBookings } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'confirmed');

        return {
          total_companies: totalCompanies || 0,
          active_bookings: activeBookings || 0,
          timestamp: new Date().toISOString()
        };
      },

      'trigger-backup': async () => {
        const { data } = await supabase
          .from('master_logs')
          .insert({
            action_type: 'database_backup',
            action_status: 'success',
            metadata: { initiated_by: 'external_bot', timestamp: new Date().toISOString() }
          })
          .select()
          .single();
        return { backup_id: data?.id, status: 'started' };
      },

      'get-logs': async ({ limit = 20 }) => {
        const { data } = await supabase
          .from('error_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);
        return { logs: data || [] };
      },

      'run-security-scan': async () => {
        const { data: issues } = await supabase
          .from('known_issues')
          .select('*')
          .in('severity', ['critical', 'high'])
          .eq('resolved', false);
        return {
          critical_issues: issues?.length || 0,
          issues: issues || [],
          status: (issues?.length || 0) > 0 ? 'warning' : 'success'
        };
      }
    };

    const handler = actions[action];
    if (!handler) {
      return new Response(
        JSON.stringify({ success: false, error: `Unknown action: ${action}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await handler(params || {});

    // Log Bot-Action
    await supabase
      .from('master_logs')
      .insert({
        action_type: 'bot_webhook',
        action_status: 'success',
        metadata: { action, result_preview: JSON.stringify(result).substring(0, 200) }
      });

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[BOT-WEBHOOK] Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
