// ==================================================================================
// FIX MASTER LOGIN - Erstellt/Resettet Master-User für Login
// ==================================================================================
// Erstellt: 2025-01-31
// Zweck: Master-User erstellen/resetten für Login
// Autor: NeXify AI MASTER
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const input = await req.json();
    const email = (input.email || "courbois1981@gmail.com").toLowerCase().trim();
    const password = input.password || "1def!xO2022!!";
    const action = input.action || "create"; // 'create' | 'reset' | 'check'

    // Check if user exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u) => u.email === email);

    if (action === "check") {
      return new Response(
        JSON.stringify({
          exists: !!existingUser,
          email: email,
          user_id: existingUser?.id,
          email_confirmed: !!existingUser?.email_confirmed_at,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    if (action === "create") {
      if (existingUser) {
        // User exists, reset password instead
        const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          {
            password: password,
            email_confirm: true,
          }
        );

        if (updateError) throw updateError;

        // Ensure profile exists
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", existingUser.id)
          .maybeSingle();

        if (!profile) {
          const { error: profileError } = await supabase.from("profiles").insert({
            user_id: existingUser.id,
            first_name: "Pascal",
            last_name: "Courbois",
            role: "master",
            company_id: null,
          });
          if (profileError)
            console.warn("[FIX-MASTER-LOGIN] Profile creation failed:", profileError);
        } else {
          // Update to master role
          await supabase.from("profiles").update({ role: "master" }).eq("user_id", existingUser.id);
        }

        // Ensure master role in user_roles
        const { data: roleCheck } = await supabase
          .from("user_roles")
          .select("*")
          .eq("user_id", existingUser.id)
          .eq("role", "master")
          .maybeSingle();

        if (!roleCheck) {
          await supabase.from("user_roles").insert({
            user_id: existingUser.id,
            role: "master",
          });
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: "Master user password reset successfully",
            user_id: existingUser.id,
            email: email,
            action: "password_reset",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }

      // Create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
      });

      if (createError) throw createError;

      // Create master profile
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: newUser.user.id,
        first_name: "Pascal",
        last_name: "Courbois",
        role: "master",
        company_id: null,
      });

      if (profileError) {
        console.warn("[FIX-MASTER-LOGIN] Profile creation failed:", profileError);
      }

      // Create master role
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: newUser.user.id,
        role: "master",
      });

      if (roleError) {
        console.warn("[FIX-MASTER-LOGIN] Role creation failed:", roleError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Master user created successfully",
          user_id: newUser.user.id,
          email: email,
          action: "created",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    if (action === "reset") {
      if (!existingUser) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update password
      const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        {
          password: password,
          email_confirm: true,
        }
      );

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({
          success: true,
          message: "Password reset successfully",
          user_id: existingUser.id,
          email: email,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'create', 'reset', or 'check'" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[FIX-MASTER-LOGIN] Error:", error);
    return new Response(JSON.stringify({ error: error.message, details: error.toString() }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
