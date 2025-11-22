// ==================================================================================
// STRIPE WEBHOOK HANDLER - Payment Success → Account Creation
// ==================================================================================
// Erstellt: 2025-11-22
// Zweck: Verarbeitet Stripe Webhooks und erstellt Account nach erfolgreicher Zahlung
// Flow: Stripe Payment Success → Webhook → temp_signups lesen → Account erstellen
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeSecretKey || !stripeWebhookSecret) {
      console.error("[STRIPE-WEBHOOK] Missing Stripe credentials");
      return new Response(JSON.stringify({ error: "Configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });

    // Get raw body and signature
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("[STRIPE-WEBHOOK] No signature found");
      return new Response(JSON.stringify({ error: "No signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
    } catch (err) {
      console.error("[STRIPE-WEBHOOK] Signature verification failed", err);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[STRIPE-WEBHOOK] Event received:", event.type);

    // Handle checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("[STRIPE-WEBHOOK] Checkout completed:", session.id);

      // 1. Get temp_signup data via checkout session ID
      const { data: tempSignup, error: tempSignupError } = await supabase
        .from("temp_signups")
        .select("*")
        .eq("stripe_checkout_session_id", session.id)
        .eq("payment_status", "pending")
        .maybeSingle();

      if (tempSignupError || !tempSignup) {
        console.error("[STRIPE-WEBHOOK] No pending signup found for session", session.id);
        return new Response(JSON.stringify({ error: "No signup found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("[STRIPE-WEBHOOK] Found temp signup for email:", tempSignup.email);

      // 2. Create Supabase Auth User
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: tempSignup.email,
        password: tempSignup.password_hash, // Already hashed in frontend
        email_confirm: true, // Auto-confirm email after payment
      });

      if (authError || !authData.user) {
        console.error("[STRIPE-WEBHOOK] User creation failed", authError);
        
        // Update temp_signup status
        await supabase
          .from("temp_signups")
          .update({ payment_status: "failed" })
          .eq("id", tempSignup.id);

        return new Response(JSON.stringify({ error: "User creation failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("[STRIPE-WEBHOOK] User created:", authData.user.id);

      // 3. Create Company
      const companySlug = tempSignup.company_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const { data: company, error: companyError } = await supabase
        .from("companies")
        .insert({
          name: tempSignup.company_name,
          company_slug: companySlug,
          tax_id: tempSignup.tax_id,
          phone: tempSignup.phone || null,
          address: tempSignup.street || null,
          city: tempSignup.city || null,
          postal_code: tempSignup.postal_code || null,
          email: tempSignup.email,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          subscription_product_id: session.metadata?.product_id || null,
          subscription_status: "active",
          subscription_starts_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (companyError || !company) {
        console.error("[STRIPE-WEBHOOK] Company creation failed", companyError);

        // Rollback: Delete auth user
        await supabase.auth.admin.deleteUser(authData.user.id);

        await supabase
          .from("temp_signups")
          .update({ payment_status: "failed" })
          .eq("id", tempSignup.id);

        return new Response(JSON.stringify({ error: "Company creation failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("[STRIPE-WEBHOOK] Company created:", company.id);

      // 4. Create Profile
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: authData.user.id,
        company_id: company.id,
        first_name: tempSignup.first_name,
        last_name: tempSignup.last_name,
        role: "entrepreneur",
      });

      if (profileError) {
        console.error("[STRIPE-WEBHOOK] Profile creation failed", profileError);

        // Rollback
        await supabase.from("companies").delete().eq("id", company.id);
        await supabase.auth.admin.deleteUser(authData.user.id);

        await supabase
          .from("temp_signups")
          .update({ payment_status: "failed" })
          .eq("id", tempSignup.id);

        return new Response(JSON.stringify({ error: "Profile creation failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("[STRIPE-WEBHOOK] Profile created for user:", authData.user.id);

      // 5. Update temp_signup status to completed
      await supabase
        .from("temp_signups")
        .update({
          payment_status: "completed",
          completed_at: new Date().toISOString(),
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        })
        .eq("id", tempSignup.id);

      // 6. Log to brain_logs
      await supabase.from("brain_logs").insert({
        category: "registration",
        action: "payment_first_signup_completed",
        context: `User ${tempSignup.email} completed payment and account was created automatically.`,
        metadata: {
          user_id: authData.user.id,
          company_id: company.id,
          stripe_session_id: session.id,
          stripe_customer_id: session.customer,
          tariff: tempSignup.selected_tariff,
          billing_period: tempSignup.billing_period,
        },
        created_at: new Date().toISOString(),
      });

      // 7. Send welcome email
      try {
        await supabase.functions.invoke("send-registration-confirmation", {
          body: {
            user_id: authData.user.id,
            email: tempSignup.email,
            company_name: tempSignup.company_name,
            tariff: tempSignup.selected_tariff,
          },
        });
      } catch (emailErr) {
        console.warn("[STRIPE-WEBHOOK] Welcome email failed:", emailErr);
        // Don't fail the registration if email fails
      }

      console.log("[STRIPE-WEBHOOK] Signup completed successfully for:", tempSignup.email);

      return new Response(
        JSON.stringify({
          success: true,
          user_id: authData.user.id,
          company_id: company.id,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Handle subscription updates
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;

      const { error } = await supabase
        .from("companies")
        .update({
          subscription_status: subscription.status,
          subscription_ends_at:
            subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
        })
        .eq("stripe_subscription_id", subscription.id);

      if (error) {
        console.error("[STRIPE-WEBHOOK] Subscription update failed", error);
      }
    }

    // Handle subscription deletions
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      const { error } = await supabase
        .from("companies")
        .update({
          subscription_status: "canceled",
          subscription_ends_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);

      if (error) {
        console.error("[STRIPE-WEBHOOK] Subscription deletion update failed", error);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[STRIPE-WEBHOOK] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
