import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('[TRIGGER-DB-BACKUP] Request received:', {
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('[TRIGGER-DB-BACKUP] Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey
    });

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { type = 'manual' } = await req.json();

    console.log('[TRIGGER-DB-BACKUP] Backup initiated:', { type });

    // Erstelle Backup-Log-Eintrag
    const { data: backup, error } = await supabase
      .from('master_logs')
      .insert({
        action_type: 'database_backup',
        action_status: 'success',
        metadata: {
          type,
          timestamp: new Date().toISOString(),
          initiated_by: 'master_dashboard'
        }
      })
      .select()
      .single();

    if (error) {
      console.error('[TRIGGER-DB-BACKUP] Database error:', {
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log('[TRIGGER-DB-BACKUP] Success:', {
      backup_id: backup.id,
      type
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Backup erfolgreich gestartet',
        backup_id: backup.id,
        timestamp: backup.created_at
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[TRIGGER-DB-BACKUP] Fatal error:', {
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
