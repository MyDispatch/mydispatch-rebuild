// ==================================================================================
// AUTO-FIX ISSUES - Automatische Fehlerbehebung (2x täglich)
// ==================================================================================
// Erstellt: 2025-01-31
// Zweck: Automatische Fixes für bekannte Probleme
// Autor: NeXify AI MASTER
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FixResult {
  timestamp: string;
  fixes: Array<{
    issue: string;
    fix: string;
    status: 'fixed' | 'failed' | 'skipped';
    error?: string;
  }>;
  summary: {
    total: number;
    fixed: number;
    failed: number;
    skipped: number;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const result: FixResult = {
      timestamp: new Date().toISOString(),
      fixes: [],
      summary: { total: 0, fixed: 0, failed: 0, skipped: 0 },
    };

    // 1. Fix: Orphaned bookings (ohne company_id)
    try {
      const { data: orphaned, error } = await supabase
        .from('bookings')
        .select('id, customer_id')
        .is('company_id', null)
        .limit(100);

      if (error) throw error;

      if (orphaned && orphaned.length > 0) {
        for (const booking of orphaned) {
          // Try to find company_id from customer
          const { data: customer } = await supabase
            .from('customers')
            .select('company_id')
            .eq('id', booking.customer_id)
            .single();

          if (customer?.company_id) {
            const { error: updateError } = await supabase
              .from('bookings')
              .update({ company_id: customer.company_id })
              .eq('id', booking.id);

            if (!updateError) {
              result.fixes.push({
                issue: `Orphaned booking ${booking.id}`,
                fix: 'Set company_id from customer',
                status: 'fixed',
              });
              result.summary.fixed++;
            } else {
              result.fixes.push({
                issue: `Orphaned booking ${booking.id}`,
                fix: 'Set company_id from customer',
                status: 'failed',
                error: updateError.message,
              });
              result.summary.failed++;
            }
          } else {
            result.fixes.push({
              issue: `Orphaned booking ${booking.id}`,
              fix: 'Set company_id from customer',
              status: 'skipped',
            });
            result.summary.skipped++;
          }
        }
      }
    } catch (error: any) {
      result.fixes.push({
        issue: 'Orphaned bookings check',
        fix: 'Set company_id from customer',
        status: 'failed',
        error: error.message,
      });
      result.summary.failed++;
    }

    // 2. Fix: Missing profiles for users
    try {
      const { data: usersWithoutProfile, error } = await supabase
        .from('auth.users')
        .select('id, email')
        .not('id', 'in', `(SELECT user_id FROM profiles)`);

      if (error) {
        // Query might not work directly, use alternative
        const { data: profiles } = await supabase.from('profiles').select('user_id');
        const profileUserIds = new Set(profiles?.map(p => p.user_id) || []);
        
        // This is a simplified check - in production, use a proper query
        result.fixes.push({
          issue: 'Users without profiles',
          fix: 'Check and create missing profiles',
          status: 'skipped',
        });
        result.summary.skipped++;
      } else if (usersWithoutProfile && usersWithoutProfile.length > 0) {
        result.fixes.push({
          issue: `${usersWithoutProfile.length} users without profiles`,
          fix: 'Create missing profiles',
          status: 'skipped', // Manual action required
        });
        result.summary.skipped++;
      }
    } catch (error: any) {
      result.fixes.push({
        issue: 'Users without profiles check',
        fix: 'Create missing profiles',
        status: 'failed',
        error: error.message,
      });
      result.summary.failed++;
    }

    // 3. Fix: Expired sessions cleanup
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .lt('expires_at', new Date().toISOString());

      if (error) throw error;

      result.fixes.push({
        issue: 'Expired sessions',
        fix: 'Delete expired sessions',
        status: 'fixed',
      });
      result.summary.fixed++;
    } catch (error: any) {
      // Table might not exist, skip
      result.fixes.push({
        issue: 'Expired sessions cleanup',
        fix: 'Delete expired sessions',
        status: 'skipped',
      });
      result.summary.skipped++;
    }

    // 4. Fix: Clean up old logs (keep last 30 days)
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const { error } = await supabase
        .from('ai_actions_log')
        .delete()
        .lt('created_at', thirtyDaysAgo);

      if (error) throw error;

      result.fixes.push({
        issue: 'Old logs cleanup',
        fix: 'Delete logs older than 30 days',
        status: 'fixed',
      });
      result.summary.fixed++;
    } catch (error: any) {
      result.fixes.push({
        issue: 'Old logs cleanup',
        fix: 'Delete logs older than 30 days',
        status: 'failed',
        error: error.message,
      });
      result.summary.failed++;
    }

    result.summary.total = result.fixes.length;

    // Log fixes
    await supabase.from('auto_fix_logs').insert({
      timestamp: result.timestamp,
      fixes: result.fixes,
      summary: result.summary,
    });

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("[AUTO-FIX-ISSUES] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

