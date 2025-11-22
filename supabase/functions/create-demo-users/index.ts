/**
 * =========================================
 * Create Demo Auth Users - Edge Function
 * =========================================
 * Creates Supabase Auth users for demo accounts
 * Must be run ONCE after migration 20251122000005_seed_demo_accounts.sql
 *
 * Usage:
 * supabase functions invoke create-demo-users --no-verify-jwt
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase Admin Client (with service_role key)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Demo User 1: Starter
    const starterUser = await supabase.auth.admin.createUser({
      email: 'demo.starter@my-dispatch.de',
      password: 'De.25-STR_#mO_!',
      email_confirm: true,
      user_metadata: {
        first_name: 'Demo',
        last_name: 'Starter',
        company_id: '11111111-1111-1111-1111-111111111111',
      },
    });

    if (starterUser.error) {
      console.error('Starter user creation failed:', starterUser.error);
    } else {
      console.log('✅ Starter user created:', starterUser.data.user?.id);

      // Update profile with correct user_id
      await supabase
        .from('profiles')
        .update({ user_id: starterUser.data.user!.id })
        .eq('email', 'demo.starter@my-dispatch.de');
    }

    // Demo User 2: Business
    const businessUser = await supabase.auth.admin.createUser({
      email: 'demo.business@my-dispatch.de',
      password: 'De.BsS_25#mO_!',
      email_confirm: true,
      user_metadata: {
        first_name: 'Demo',
        last_name: 'Business',
        company_id: '22222222-2222-2222-2222-222222222222',
      },
    });

    if (businessUser.error) {
      console.error('Business user creation failed:', businessUser.error);
    } else {
      console.log('✅ Business user created:', businessUser.data.user?.id);

      // Update profile with correct user_id
      await supabase
        .from('profiles')
        .update({ user_id: businessUser.data.user!.id })
        .eq('email', 'demo.business@my-dispatch.de');
    }

    return new Response(
      JSON.stringify({
        success: true,
        users: {
          starter: starterUser.data?.user?.id || null,
          business: businessUser.data?.user?.id || null,
        },
        message: 'Demo users created successfully. You can now login with:\n' +
                 '1. demo.starter@my-dispatch.de (Password: De.25-STR_#mO_!)\n' +
                 '2. demo.business@my-dispatch.de (Password: De.BsS_25#mO_!)',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error creating demo users:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to create demo users',
        details: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
