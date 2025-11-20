// ==================================================================================
// CREATE GITKRAKEN PATCH - PRODUCTION-SAFE
// ==================================================================================
// Version: 1.0
// Created: 2025-11-08
// Purpose: Create GitKraken Cloud Patches for code review
// Author: NeXify AI System
// Security: Input validation, rate limiting, error handling
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreatePatchInput {
  task_id: string;
  repository: string;
  changes: string;
  description: string;
  priority: number;
  files_affected: string[];
}

interface GitKrakenPatchResponse {
  id: string;
  url: string;
  status: string;
}

// ==================================================================================
// HELPER FUNCTIONS
// ==================================================================================

/**
 * Validate input data
 */
function validateInput(input: CreatePatchInput): { valid: boolean; error?: string } {
  if (!input.task_id) {
    return { valid: false, error: "task_id is required" };
  }

  if (!input.repository || !input.repository.match(/^[\w-]+\/[\w-]+$/)) {
    return { valid: false, error: "Invalid repository format (should be owner/repo)" };
  }

  if (!input.changes || input.changes.length === 0) {
    return { valid: false, error: "No changes provided" };
  }

  if (input.changes.length > 1000000) {
    // 1MB limit
    return { valid: false, error: "Changes too large (max 1MB)" };
  }

  if (!input.description || input.description.length === 0) {
    return { valid: false, error: "Description is required" };
  }

  if (!Array.isArray(input.files_affected) || input.files_affected.length === 0) {
    return { valid: false, error: "files_affected must be a non-empty array" };
  }

  if (input.files_affected.length > 100) {
    return { valid: false, error: "Too many files affected (max 100)" };
  }

  return { valid: true };
}

/**
 * Check rate limiting
 */
async function checkRateLimit(supabase: any, taskId: string): Promise<boolean> {
  // Check if we've created too many patches in the last hour
  const { data, error } = await supabase
    .from("autonomous_execution_logs")
    .select("id")
    .eq("execution_step", "gitkraken_patch_created")
    .gte("timestamp", new Date(Date.now() - 60 * 60 * 1000).toISOString());

  if (error) {
    console.error("[Rate Limit Check] Error:", error);
    return true; // Allow on error (fail-open for availability)
  }

  // Max 10 patches per hour
  return (data?.length || 0) < 10;
}

/**
 * Log execution step
 */
async function logExecution(
  supabase: any,
  taskId: string,
  step: string,
  status: string,
  data?: any,
  error?: any
) {
  await supabase.from("autonomous_execution_logs").insert({
    task_id: taskId,
    execution_step: step,
    step_status: status,
    output_data: data ? JSON.parse(JSON.stringify(data)) : null,
    error_data: error ? JSON.parse(JSON.stringify(error)) : null,
    timestamp: new Date().toISOString(),
    agent_version: "1.0",
    environment: Deno.env.get("ENVIRONMENT") || "production",
  });
}

// ==================================================================================
// MAIN HANDLER
// ==================================================================================

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // 1. Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. Parse input
    const input: CreatePatchInput = await req.json();
    console.log("[GitKraken Patch] Request received for task:", input.task_id);

    // 3. Validate input
    const validation = validateInput(input);
    if (!validation.valid) {
      console.error("[GitKraken Patch] Validation failed:", validation.error);
      await logExecution(supabase, input.task_id, "validation", "failed", null, {
        error: validation.error,
      });

      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. Check system config
    const { data: config } = await supabase.from("autonomous_system_config").select("*").single();

    if (config?.emergency_stop) {
      console.warn("[GitKraken Patch] Emergency stop active");
      return new Response(
        JSON.stringify({
          error: "Emergency stop active",
          reason: config.emergency_stop_reason,
        }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 5. Check rate limiting
    const rateLimitOk = await checkRateLimit(supabase, input.task_id);
    if (!rateLimitOk) {
      console.warn("[GitKraken Patch] Rate limit exceeded");
      return new Response(JSON.stringify({ error: "Rate limit exceeded (max 10 patches/hour)" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 6. Get GitKraken API token
    const gkToken = Deno.env.get("GITKRAKEN_API_TOKEN");
    if (!gkToken) {
      console.error("[GitKraken Patch] API token not configured");
      await logExecution(supabase, input.task_id, "gitkraken_auth", "failed", null, {
        error: "API token not configured",
      });

      return new Response(JSON.stringify({ error: "GitKraken API token not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await logExecution(supabase, input.task_id, "gitkraken_auth", "completed");

    // 7. Create GitKraken Cloud Patch
    console.log("[GitKraken Patch] Creating patch...");

    const patchPayload = {
      repository: input.repository,
      title: `[Autonomous] ${input.description}`,
      description: `
**🤖 Autonomous Agent Patch**

**Task ID:** \`${input.task_id}\`
**Priority:** ${input.priority}/10
**Files Affected:** ${input.files_affected.length}

---

### Description
${input.description}

### Files Changed
${input.files_affected.map((f) => `- ${f}`).join("\n")}

---

**Generated:** ${new Date().toISOString()}
**Agent Version:** 1.0
      `.trim(),
      changes: input.changes,
      labels: ["autonomous", "auto-generated", `priority-${input.priority}`],
    };

    const patchResponse = await fetch("https://api.gitkraken.dev/v1/patches", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${gkToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patchPayload),
    });

    if (!patchResponse.ok) {
      const errorText = await patchResponse.text();
      console.error("[GitKraken Patch] API error:", errorText);

      await logExecution(supabase, input.task_id, "gitkraken_patch_creation", "failed", null, {
        status: patchResponse.status,
        error: errorText,
      });

      throw new Error(`GitKraken API error: ${errorText}`);
    }

    const patch: GitKrakenPatchResponse = await patchResponse.json();
    console.log("[GitKraken Patch] Patch created:", patch.id);

    await logExecution(supabase, input.task_id, "gitkraken_patch_created", "completed", {
      patch_id: patch.id,
      patch_url: patch.url,
    });

    // 8. Update task with patch URL
    await supabase
      .from("autonomous_tasks")
      .update({
        gitkraken_patch_url: patch.url,
        status: "awaiting_review",
        result: {
          patch_id: patch.id,
          patch_url: patch.url,
          files_count: input.files_affected.length,
        },
      })
      .eq("id", input.task_id);

    await logExecution(supabase, input.task_id, "task_updated", "completed");

    // 9. Send notification email
    console.log("[GitKraken Patch] Sending notification...");

    try {
      await supabase.functions.invoke("send-template-email", {
        body: {
          to: config?.notification_email || "courbois1981@gmail.com",
          template: "autonomous_patch_ready",
          data: {
            task_id: input.task_id,
            description: input.description,
            priority: input.priority,
            files_count: input.files_affected.length,
            patch_url: patch.url,
            review_instructions: "Review the patch in GitKraken and approve to merge.",
          },
        },
      });

      await logExecution(supabase, input.task_id, "notification_sent", "completed");
    } catch (emailError) {
      console.error("[GitKraken Patch] Email notification failed:", emailError);
      await logExecution(supabase, input.task_id, "notification_sent", "failed", null, {
        error: String(emailError),
      });
      // Don't fail the whole operation if email fails
    }

    // 10. Return success
    const duration = Date.now() - startTime;
    console.log(`[GitKraken Patch] Completed in ${duration}ms`);

    return new Response(
      JSON.stringify({
        success: true,
        patch: {
          id: patch.id,
          url: patch.url,
          status: patch.status,
        },
        task_id: input.task_id,
        duration_ms: duration,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[GitKraken Patch] Fatal error:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
        duration_ms: Date.now() - startTime,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
