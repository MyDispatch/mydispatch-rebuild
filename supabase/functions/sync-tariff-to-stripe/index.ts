/* ==================================================================================
   STRIPE TARIFF SYNC EDGE FUNCTION V18.3.24
   ==================================================================================
   Synchronisiert Tarif-Änderungen mit Stripe Product-API
   ================================================================================== */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TariffSyncRequest {
  tariff_id: 'starter' | 'business' | 'enterprise';
  metadata?: Record<string, string>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY nicht konfiguriert');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const { tariff_id, metadata }: TariffSyncRequest = await req.json();

    console.log(`Sync Tariff ${tariff_id} to Stripe...`);

    // Map Tariff-IDs zu Stripe-Product-IDs
    const productIdMap = {
      starter: 'prod_TEeg0ykplmGKd0',
      business: 'prod_TEegHmtpPZOZcG',
      enterprise: 'prod_ENTERPRISE_ID_PLACEHOLDER',
    };

    const productId = productIdMap[tariff_id];
    if (!productId) {
      throw new Error(`Ungültige Tariff-ID: ${tariff_id}`);
    }

    // Update Stripe Product mit Metadaten
    const product = await stripe.products.update(productId, {
      metadata: {
        ...metadata,
        last_sync: new Date().toISOString(),
        source: 'MyDispatch',
      },
    });

    console.log(`Tariff ${tariff_id} erfolgreich synchronisiert:`, product.id);

    return new Response(
      JSON.stringify({
        success: true,
        tariff_id,
        product_id: product.id,
        synced_at: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Fehler beim Tariff-Sync:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unbekannter Fehler',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
