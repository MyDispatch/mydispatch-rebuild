// ==================================================================================
// CREATE CHECKOUT - Stripe Checkout Session Erstellung
// ==================================================================================
// Erstellt: 2025-01-31
// Zweck: Stripe Checkout Session für Subscriptions erstellen
// Autor: NeXify AI MASTER
// Best Practices: Error Handling, Type Safety, Security, Validation
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateCheckoutInput {
  company_id: string;
  tariff_id: 'starter' | 'business' | 'enterprise';
  billing_period: 'monthly' | 'yearly';
  user_id: string;
  success_url: string;
  cancel_url: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const input: CreateCheckoutInput = await req.json();

    // Input Validation
    if (!input.company_id || !input.tariff_id || !input.user_id) {
      return new Response(
        JSON.stringify({ error: "company_id, tariff_id, and user_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[CREATE-CHECKOUT] Creating checkout for:", input.tariff_id);

    // 1. Get Stripe Secret Key
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("[CREATE-CHECKOUT] Stripe Secret Key not found");
      return new Response(
        JSON.stringify({ error: "Stripe not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // 2. Get Tariff Definitions (from centralized source)
    const { data: tariffData } = await supabase
      .from('tariff_definitions')
      .select('*')
      .eq('id', input.tariff_id)
      .single();

    if (!tariffData) {
      // Fallback: Use hardcoded prices (from subscription-utils.ts)
      // Diese müssen in Supabase Environment Variables gesetzt werden:
      // STRIPE_PRICE_STARTER_MONTHLY, STRIPE_PRICE_STARTER_YEARLY
      // STRIPE_PRICE_BUSINESS_MONTHLY, STRIPE_PRICE_BUSINESS_YEARLY
      // Use hardcoded Price IDs from subscription-utils.ts (PRICE_IDS)
      // Fallback auf Environment Variables wenn gesetzt
      const TARIFF_PRICES: Record<string, { monthly: string; yearly: string }> = {
        starter: {
          monthly: Deno.env.get('STRIPE_PRICE_STARTER_MONTHLY') || 'price_1SIBMrLX5M8TT990zBX6gWOm',
          yearly: Deno.env.get('STRIPE_PRICE_STARTER_YEARLY') || 'price_1SIbRALX5M8TT990B81vhHPT',
        },
        business: {
          monthly: Deno.env.get('STRIPE_PRICE_BUSINESS_MONTHLY') || 'price_1SIBN9LX5M8TT990mxE8owxm',
          yearly: Deno.env.get('STRIPE_PRICE_BUSINESS_YEARLY') || 'price_1SIbRKLX5M8TT990e1vX4ebf',
        },
      };

      const priceId = TARIFF_PRICES[input.tariff_id]?.[input.billing_period];
      if (!priceId) {
        return new Response(
          JSON.stringify({ error: `Invalid tariff or billing period: ${input.tariff_id}/${input.billing_period}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // 3. Get or Create Stripe Customer
      const { data: company } = await supabase
        .from('companies')
        .select('stripe_customer_id, email, name')
        .eq('id', input.company_id)
        .single();

      let customerId = company?.stripe_customer_id;

      if (!customerId) {
        // Create Stripe Customer
        const customer = await stripe.customers.create({
          email: company?.email,
          name: company?.name,
          metadata: {
            company_id: input.company_id,
            supabase_user_id: input.user_id,
          },
        });

        customerId = customer.id;

        // Save to database
        await supabase
          .from('companies')
          .update({ stripe_customer_id: customerId })
          .eq('id', input.company_id);
      }

      // 4. Create Checkout Session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: input.success_url || `${Deno.env.get("VITE_APP_URL")}/dashboard?success=true`,
        cancel_url: input.cancel_url || `${Deno.env.get("VITE_APP_URL")}/pricing?canceled=true`,
        metadata: {
          company_id: input.company_id,
          user_id: input.user_id,
          tariff_id: input.tariff_id,
          billing_period: input.billing_period,
        },
        subscription_data: {
          metadata: {
            company_id: input.company_id,
            tariff_id: input.tariff_id,
          },
        },
        allow_promotion_codes: true,
      });

      console.log("[CREATE-CHECKOUT] Checkout session created:", session.id);

      return new Response(
        JSON.stringify({
          success: true,
          session_id: session.id,
          url: session.url,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // TODO: Implement with tariff_definitions table
    return new Response(
      JSON.stringify({ error: "Tariff definitions table not yet implemented" }),
      { status: 501, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[CREATE-CHECKOUT] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
