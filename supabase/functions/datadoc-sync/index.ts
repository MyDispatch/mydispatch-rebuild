// ==================================================================================
// DATADOC-SYNC V18.5.1
// ==================================================================================
// Purpose: Design-Tokens, Code-Linage & Metadata Sync to Datadoc API
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DATADOC_API_URL = "https://api.datadoc.io/v1";
const DATADOC_KEY_ID = Deno.env.get("data_doc_key_id") || "";
const DATADOC_API_KEY = Deno.env.get("data_doc_api_key") || "";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!DATADOC_API_KEY || !DATADOC_KEY_ID) {
      throw new Error("Datadoc credentials not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { sync_type = "all" } = await req.json();

    console.log(`[DATADOC-SYNC] Starting sync: ${sync_type}`);

    const results: any = {};

    // 1. Design-Tokens Sync (from index.css / tailwind.config.ts)
    if (sync_type === "all" || sync_type === "design_tokens") {
      results.design_tokens = await syncDesignTokens();
    }

    // 2. Code-Linage Sync (critical files)
    if (sync_type === "all" || sync_type === "code_linage") {
      results.code_linage = await syncCodeLinage();
    }

    // 3. Workflow-Log Sync (completed workflows)
    if (sync_type === "all" || sync_type === "workflow_log") {
      results.workflow_log = await syncWorkflowLog();
    }

    // 4. Expectation Suites Sync (data validation rules)
    if (sync_type === "all" || sync_type === "expectations") {
      results.expectations = await syncExpectationSuites();
    }

    console.log(`[DATADOC-SYNC] Sync complete: ${sync_type}`);

    return new Response(
      JSON.stringify({
        success: true,
        sync_type,
        timestamp: new Date().toISOString(),
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[DATADOC-SYNC] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// ==================================================================================
// SYNC FUNCTIONS
// ==================================================================================

async function syncDesignTokens() {
  console.log("[DATADOC-SYNC] Syncing design tokens...");

  // Hardcoded CI-Colors (SINGLE SOURCE OF TRUTH)
  const designTokens = {
    version: "18.5.1",
    timestamp: new Date().toISOString(),
    colors: {
      CI_COLOR_01: "#EADEBD", // Primary
      CI_COLOR_02: "#323D5E", // Foreground
      CI_COLOR_03: "#FFFFFF", // Background
    },
    semantic_tokens: {
      primary: "hsl(40, 31%, 88%)",
      foreground: "hsl(220, 30%, 28%)",
      background: "hsl(0, 0%, 100%)",
      muted: "hsl(40, 15%, 85%)",
      accent: "hsl(25, 45%, 42%)",
    },
    breakpoints: {
      mobile: "375px",
      tablet: "768px",
      desktop: "1920px",
    },
    touch_targets: {
      min_size: "44px",
    },
  };

  const response = await fetch(`${DATADOC_API_URL}/design_tokens/current`, {
    method: "POST",
    headers: {
      "X-API-Key-ID": DATADOC_KEY_ID,
      "X-API-Key": DATADOC_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(designTokens),
  });

  if (!response.ok) {
    throw new Error(`Datadoc API error: ${response.status}`);
  }

  return { synced: true, tokens_count: Object.keys(designTokens.colors).length };
}

async function syncCodeLinage() {
  console.log("[DATADOC-SYNC] Syncing code linage...");

  // Critical files to track
  const criticalFiles = [
    { file_id: "watchdog-monitor", path: "supabase/functions/watchdog-monitor/index.ts" },
    { file_id: "central-brain", path: "supabase/functions/central-brain/index.ts" },
    { file_id: "datadoc-sync", path: "supabase/functions/datadoc-sync/index.ts" },
    { file_id: "manage-docs", path: "supabase/functions/manage-docs/index.ts" },
    { file_id: "datadoc-client", path: "src/lib/datadoc-client.ts" },
  ];

  const linageData = {
    timestamp: new Date().toISOString(),
    files: criticalFiles.map((file) => ({
      file_id: file.file_id,
      path: file.path,
      last_modified: new Date().toISOString(),
      version: "18.5.1",
      status: "active",
    })),
  };

  for (const file of criticalFiles) {
    await fetch(`${DATADOC_API_URL}/code_linage/${file.file_id}`, {
      method: "POST",
      headers: {
        "X-API-Key-ID": DATADOC_KEY_ID,
        "X-API-Key": DATADOC_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file_id: file.file_id,
        path: file.path,
        last_modified: new Date().toISOString(),
        version: "18.5.1",
      }),
    });
  }

  return { synced: true, files_count: criticalFiles.length };
}

async function syncWorkflowLog() {
  console.log("[DATADOC-SYNC] Syncing workflow log...");

  const workflowLog = {
    timestamp: new Date().toISOString(),
    workflow: "BATCH_7_DATADOC_INTEGRATION",
    status: "in_progress",
    agent: "nexify",
    version: "18.5.1",
    steps: [
      { step: "watchdog_monitor_update", status: "completed" },
      { step: "central_brain_heartbeat", status: "completed" },
      { step: "datadoc_sync_creation", status: "in_progress" },
    ],
  };

  const response = await fetch(`${DATADOC_API_URL}/workflow_log`, {
    method: "POST",
    headers: {
      "X-API-Key-ID": DATADOC_KEY_ID,
      "X-API-Key": DATADOC_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workflowLog),
  });

  if (!response.ok) {
    throw new Error(`Datadoc API error: ${response.status}`);
  }

  return { synced: true, workflow: workflowLog.workflow };
}

async function syncExpectationSuites() {
  console.log("[DATADOC-SYNC] Syncing expectation suites...");

  const expectationSuites = [
    {
      suite_name: "agent_status_validation",
      table: "agent_status",
      expectations: [
        { type: "column_exists", column: "agent_name" },
        {
          type: "column_values_in_set",
          column: "status",
          values: ["idle", "working", "syncing", "error"],
        },
        { type: "column_not_null", column: "version" },
      ],
    },
    {
      suite_name: "monitoring_logs_validation",
      table: "monitoring_logs",
      expectations: [
        { type: "column_exists", column: "severity" },
        {
          type: "column_values_in_set",
          column: "severity",
          values: ["info", "warning", "critical"],
        },
        { type: "column_not_null", column: "message" },
      ],
    },
  ];

  for (const suite of expectationSuites) {
    await fetch(`${DATADOC_API_URL}/expectations`, {
      method: "POST",
      headers: {
        "X-API-Key-ID": DATADOC_KEY_ID,
        "X-API-Key": DATADOC_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(suite),
    });
  }

  return { synced: true, suites_count: expectationSuites.length };
}
