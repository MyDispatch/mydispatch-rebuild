import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('💰 Starting Pricing & Tariffs Knowledge-Base Sync...');

    // Delete existing tariff entries
    await supabase
      .from('knowledge_base')
      .delete()
      .eq('category', 'tariff_definition');

    // Pricing Data from src/lib/pricing/single-source.ts
    const pricingPlans = [
      {
        category: 'tariff_definition',
        title: 'Starter Tarif',
        content: {
          plan_id: 'starter',
          name: 'Starter',
          price_monthly: 39,
          price_annually: 374.40,
          savings_annually: 93.60,
          limits: {
            drivers: 3,
            vehicles: 3,
            users: 1,
            bookings_per_month: 100,
          },
          features: [
            'Auftrags- & Kundenverwaltung',
            'Einfaches Disposition-System',
            'Basis E-Mail-Support',
            'Monatliche Abrechnung'
          ],
          stripe_product_id: 'prod_TEeg0ykplmGKd0',
          stripe_price_monthly: 'price_1QkbDcC2Q9bhAGYzYf2YH6bm',
          stripe_price_annually: 'price_1QkbDcC2Q9bhAGYzYf2YH6bm',
        },
        tags: ['pricing', 'tariff', 'starter', 'stripe'],
        source: 'docs_sync',
        confidence_score: 1.0,
      },
      {
        category: 'tariff_definition',
        title: 'Business Tarif',
        content: {
          plan_id: 'business',
          name: 'Business',
          price_monthly: 89,
          price_annually: 854.40,
          savings_annually: 213.60,
          limits: {
            drivers: 10,
            vehicles: 10,
            users: 3,
            bookings_per_month: 500,
          },
          features: [
            'Alle Starter-Features',
            'KI-gestützte Disposition',
            'Erweiterte Berichte & Analytics',
            'Schnittstellen-Zugang (API)',
            'Priority E-Mail-Support'
          ],
          stripe_product_id: 'prod_TF5cFE5Fi5rBCz',
          stripe_price_monthly: 'price_1QkejZC2Q9bhAGYzIuPMEW3H',
          stripe_price_annually: 'price_1QkejZC2Q9bhAGYzIuPMEW3H',
          popular: true,
        },
        tags: ['pricing', 'tariff', 'business', 'popular', 'stripe'],
        source: 'docs_sync',
        confidence_score: 1.0,
      },
      {
        category: 'tariff_definition',
        title: 'Enterprise Tarif',
        content: {
          plan_id: 'enterprise',
          name: 'Enterprise',
          price_monthly: null,
          price_annually: null,
          price_type: 'custom',
          limits: {
            drivers: 'unlimited',
            vehicles: 'unlimited',
            users: 'unlimited',
            bookings_per_month: 'unlimited',
          },
          features: [
            'Alle Business-Features',
            'Dedicated Account Manager',
            'Custom Schnittstellen',
            'White-Label-Optionen',
            'SLA-Garantien',
            '24/7 Premium-Support'
          ],
          stripe_product_id: null,
          contact_sales: true,
        },
        tags: ['pricing', 'tariff', 'enterprise', 'custom'],
        source: 'docs_sync',
        confidence_score: 1.0,
      },
      {
        category: 'tariff_definition',
        title: 'Pricing Legal & Rules',
        content: {
          vat_rate: 19,
          currency: 'EUR',
          billing_period: ['monthly', 'annually'],
          payment_methods: ['stripe', 'invoice'],
          trial_period_days: 14,
          discount_annually: 20,
          cancellation_policy: 'Jederzeit kündbar',
          refund_policy: '30 Tage Geld-zurück-Garantie',
          price_includes: 'Alle Preise inkl. 19% MwSt.',
        },
        tags: ['pricing', 'legal', 'rules', 'vat'],
        source: 'docs_sync',
        confidence_score: 1.0,
      },
    ];

    const { data, error } = await supabase
      .from('knowledge_base')
      .insert(pricingPlans)
      .select();

    if (error) {
      throw error;
    }

    console.log(`✅ Synced ${data.length} pricing & tariff definitions`);

    await supabase.from('ai_actions_log').insert({
      action_type: 'knowledge_sync',
      task_description: 'Sync Pricing & Tariffs to Knowledge Base',
      success: true,
      metadata: {
        synced_count: data.length,
        source: 'single-source.ts',
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        synced: data.length,
        message: 'Pricing & tariffs synced successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error syncing pricing:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
