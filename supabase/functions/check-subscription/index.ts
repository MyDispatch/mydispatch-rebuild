// ==================================================================================
// CHECK SUBSCRIPTION - Subscription-Status und Feature-Gating Prüfung
// ==================================================================================
// Erstellt: 2025-01-31
// Zweck: Prüfung des Subscription-Status und Feature-Verfügbarkeit
// Autor: NeXify AI MASTER
// Best Practices: Error Handling, Type Safety, RLS, Logging
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscriptionCheckInput {
  company_id: string;
  feature?: string;
}

interface SubscriptionStatus {
  company_id: string;
  subscription_product_id: string | null;
  subscription_status: "active" | "inactive" | "cancelled" | "trial" | null;
  tier: "starter" | "business" | "enterprise" | null;
  features: {
    [key: string]: boolean;
  };
  limits: {
    bookings_per_month?: number;
    drivers?: number;
    customers?: number;
    users?: number;
  };
  usage: {
    bookings_this_month?: number;
    drivers_count?: number;
    customers_count?: number;
    users_count?: number;
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

    const input: SubscriptionCheckInput = await req.json();

    // Input Validation
    if (!input.company_id) {
      return new Response(
        JSON.stringify({ error: "company_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[CHECK-SUBSCRIPTION] Checking subscription for company:", input.company_id);

    // 1. Get Company with Subscription Info
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("*, subscription_product_id, subscription_status")
      .eq("id", input.company_id)
      .eq("archived", false)
      .single();

    if (companyError || !company) {
      console.error("[CHECK-SUBSCRIPTION] Company not found:", companyError);
      return new Response(
        JSON.stringify({ error: "Company not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Determine Tier
    const productId = company.subscription_product_id;
    let tier: "starter" | "business" | "enterprise" | null = null;

    if (productId) {
      // Map Stripe Product IDs to Tiers
      if (productId.includes("starter") || productId.includes("starter")) {
        tier = "starter";
      } else if (productId.includes("business") || productId.includes("business")) {
        tier = "business";
      } else if (productId.includes("enterprise") || productId.includes("enterprise")) {
        tier = "enterprise";
      }
    }

    // 3. Define Features by Tier
    const features: { [key: string]: boolean } = {
      // Starter Features
      basic_booking: true,
      basic_drivers: true,
      basic_customers: true,
      basic_reports: true,

      // Business Features
      advanced_analytics: tier === "business" || tier === "enterprise",
      ai_smart_assignment: tier === "business" || tier === "enterprise",
      ai_support_chat: tier === "business" || tier === "enterprise",
      document_ocr: tier === "business" || tier === "enterprise",
      predictive_analytics: tier === "business" || tier === "enterprise",
      custom_branding: tier === "business" || tier === "enterprise",

      // Enterprise Features
      api_access: tier === "enterprise",
      white_label: tier === "enterprise",
      dedicated_support: tier === "enterprise",
      custom_integrations: tier === "enterprise",
    };

    // 4. Define Limits by Tier
    const limits: SubscriptionStatus["limits"] = {
      bookings_per_month: tier === "starter" ? 100 : tier === "business" ? 1000 : null,
      drivers: tier === "starter" ? 5 : tier === "business" ? 50 : null,
      customers: tier === "starter" ? 100 : tier === "business" ? 1000 : null,
      users: tier === "starter" ? 3 : tier === "business" ? 20 : null,
    };

    // 5. Get Usage
    const usage: SubscriptionStatus["usage"] = {};

    if (limits.bookings_per_month) {
      const { count: bookingsCount } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("company_id", input.company_id)
        .eq("archived", false)
        .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
      usage.bookings_this_month = bookingsCount || 0;
    }

    if (limits.drivers) {
      const { count: driversCount } = await supabase
        .from("drivers")
        .select("*", { count: "exact", head: true })
        .eq("company_id", input.company_id)
        .eq("archived", false)
        .eq("is_active", true);
      usage.drivers_count = driversCount || 0;
    }

    if (limits.customers) {
      const { count: customersCount } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("company_id", input.company_id)
        .eq("archived", false);
      usage.customers_count = customersCount || 0;
    }

    // 6. Check specific feature if requested
    if (input.feature) {
      const hasFeature = features[input.feature] || false;
      return new Response(
        JSON.stringify({
          has_feature: hasFeature,
          tier,
          subscription_status: company.subscription_status,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // 7. Return Full Status
    const status: SubscriptionStatus = {
      company_id: input.company_id,
      subscription_product_id: company.subscription_product_id,
      subscription_status: company.subscription_status,
      tier,
      features,
      limits,
      usage,
    };

    console.log("[CHECK-SUBSCRIPTION] Subscription status:", tier);

    return new Response(
      JSON.stringify(status),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("[CHECK-SUBSCRIPTION] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
