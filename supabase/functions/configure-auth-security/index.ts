/* ==================================================================================
   AUTH SECURITY CONFIGURATION V18.5.0
   ==================================================================================
   Automatische Konfiguration der Supabase Auth Security Settings
   Features:
   - Leaked Password Protection (HIBP Integration)
   - Password Policy Enforcement
   - Multi-Factor Authentication Support
   - Session Management
   ================================================================================== */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[Auth Security] Configuring security settings...");

    // Configure Auth Security via Management API
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/config`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({
        // Password Policy
        password_policy: {
          min_length: 8,
          require_lowercase: true,
          require_uppercase: true,
          require_numbers: true,
          require_symbols: true,
          check_leaked_passwords: true, // ✅ HIBP Integration
        },

        // Session Management
        security: {
          refresh_token_rotation_enabled: true,
          refresh_token_reuse_interval: 10, // seconds
        },

        // JWT Settings
        jwt_exp: 3600, // 1 hour

        // Email Settings (for production)
        mailer_autoconfirm: false, // ⚠️ Disable in production!
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Auth Security] Configuration failed:", errorText);

      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to configure auth security",
          details: errorText,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const result = await response.json();
    console.log("[Auth Security] Configuration successful:", result);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Auth security configured successfully",
        config: {
          password_policy: "enabled",
          leaked_password_check: "enabled",
          refresh_token_rotation: "enabled",
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[Auth Security] Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
