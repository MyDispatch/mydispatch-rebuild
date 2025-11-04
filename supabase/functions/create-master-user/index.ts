// ==================================================================================
// CREATE MASTER USER - Hilfsfunktion zum Erstellen/Resetten des Master-Users
// ==================================================================================
// Erstellt: 2025-01-31
// Zweck: Master-User erstellen oder Passwort zurücksetzen
// Autor: NeXify AI MASTER
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateMasterUserInput {
  email: string;
  password: string;
  action: "create" | "reset" | "check";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const input: CreateMasterUserInput = await req.json();

    if (!input.email || !input.password) {
      return new Response(
        JSON.stringify({ error: "email and password are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedEmail = input.email.toLowerCase().trim();

    // Check if user exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === normalizedEmail);

    if (input.action === "check") {
      return new Response(
        JSON.stringify({
          exists: !!existingUser,
          email: normalizedEmail,
          user_id: existingUser?.id,
          email_confirmed: !!existingUser?.email_confirmed_at,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    if (input.action === "create") {
      if (existingUser) {
        return new Response(
          JSON.stringify({ 
            error: "User already exists",
            user_id: existingUser.id,
            suggestion: "Use 'reset' action to reset password"
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password: input.password,
        email_confirm: true, // Auto-confirm email
      });

      if (createError) throw createError;

      // Create master profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: newUser.user.id,
          first_name: 'Pascal',
          last_name: 'Courbois',
          role: 'master',
          company_id: null, // Master has no company
        });

      if (profileError) {
        console.warn('[CREATE-MASTER-USER] Profile creation failed:', profileError);
      }

      // Create master role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: newUser.user.id,
          role: 'master',
        });

      if (roleError) {
        console.warn('[CREATE-MASTER-USER] Role creation failed:', roleError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Master user created successfully",
          user_id: newUser.user.id,
          email: normalizedEmail,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    if (input.action === "reset") {
      if (!existingUser) {
        return new Response(
          JSON.stringify({ error: "User not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update password
      const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        {
          password: input.password,
          email_confirm: true, // Ensure email is confirmed
        }
      );

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({
          success: true,
          message: "Password reset successfully",
          user_id: existingUser.id,
          email: normalizedEmail,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'create', 'reset', or 'check'" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[CREATE-MASTER-USER] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

