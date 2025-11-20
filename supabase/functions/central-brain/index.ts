// ==================================================================================
// CENTRAL BRAIN V18.5.1 (DATADOC-INTEGRATED)
// ==================================================================================
// Purpose: Agent Orchestration, Inter-Agent Communication & Heartbeat Management
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Datadoc API Integration
const DATADOC_API_URL = "https://api.datadoc.io/v1";
const DATADOC_KEY_ID = Deno.env.get("data_doc_key_id") || "";
const DATADOC_API_KEY = Deno.env.get("data_doc_api_key") || "";

async function syncToDatadoc(endpoint: string, data: any): Promise<void> {
  if (!DATADOC_API_KEY || !DATADOC_KEY_ID) {
    // Datadoc is optional - silently skip if not configured
    return;
  }

  try {
    const response = await fetch(`${DATADOC_API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "X-API-Key-ID": DATADOC_KEY_ID,
        "X-API-Key": DATADOC_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Silent fail - external service is optional
      return;
    }
  } catch (error) {
    // Silent fail - external service is optional, don't pollute logs
    return;
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AgentStatus {
  agent_name: string;
  status: "idle" | "working" | "syncing" | "error";
  current_task?: string;
  last_sync_at?: string;
  data: Record<string, any>;
  version: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { action, agent_name, payload } = await req.json();

    console.log(`[CENTRAL-BRAIN] Action: ${action}, Agent: ${agent_name || "all"}`);

    let result;

    switch (action) {
      case "sync_agents":
        result = await syncAgents(supabase);
        break;

      case "get_agent_status":
        result = await getAgentStatus(supabase, agent_name);
        break;

      case "update_agent_status":
        result = await updateAgentStatus(supabase, agent_name, payload);
        break;

      case "trigger_watchdog_scan":
        result = await triggerWatchdogScan(supabase, payload?.scan_type || "full");
        break;

      case "orchestrate_task":
        result = await orchestrateTask(supabase, payload);
        break;

      case "heartbeat":
        result = await sendHeartbeat(supabase);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true, action, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[CENTRAL-BRAIN] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// ==================================================================================
// AGENT ORCHESTRATION FUNCTIONS
// ==================================================================================

async function syncAgents(supabase: any) {
  const { data: agents, error } = await supabase.from("agent_status").select("*");

  if (error) throw error;

  const syncStatus = agents.map((agent: AgentStatus) => ({
    agent_name: agent.agent_name,
    status: agent.status,
    last_sync: agent.last_sync_at,
    version: agent.version,
  }));

  // Check for version mismatches
  const expectedVersion = "18.5.1";
  const outdated = agents.filter((a: AgentStatus) => a.version !== expectedVersion);

  if (outdated.length > 0) {
    console.warn(
      `[CENTRAL-BRAIN] ⚠️ Outdated agents: ${outdated.map((a: any) => a.agent_name).join(", ")}`
    );
  }

  // Update last_sync_at for all agents
  for (const agent of agents) {
    await supabase
      .from("agent_status")
      .update({ last_sync_at: new Date().toISOString() })
      .eq("agent_name", agent.agent_name);
  }

  return {
    synced: true,
    agents_count: agents.length,
    all_synced: outdated.length === 0,
    outdated_agents: outdated.map((a: any) => a.agent_name),
    sync_status: syncStatus,
  };
}

async function getAgentStatus(supabase: any, agent_name?: string) {
  let query = supabase.from("agent_status").select("*");

  if (agent_name) {
    query = query.eq("agent_name", agent_name).single();
  }

  const { data, error } = await query;
  if (error) throw error;

  return data;
}

async function updateAgentStatus(supabase: any, agent_name: string, payload: any) {
  const { error } = await supabase
    .from("agent_status")
    .update({
      status: payload.status,
      current_task: payload.current_task,
      data: payload.data || {},
      updated_at: new Date().toISOString(),
    })
    .eq("agent_name", agent_name);

  if (error) throw error;

  return { updated: true, agent_name };
}

async function triggerWatchdogScan(supabase: any, scan_type: string) {
  // Update Watchdog-AI status to "working"
  await supabase
    .from("agent_status")
    .update({
      status: "working",
      current_task: `Running ${scan_type} scan`,
    })
    .eq("agent_name", "watchdog-ai");

  // Trigger watchdog-monitor Edge Function
  const { data, error } = await supabase.functions.invoke("watchdog-monitor", {
    body: { scan_type },
  });

  if (error) {
    console.error("[CENTRAL-BRAIN] Watchdog scan failed:", error);
    await supabase
      .from("agent_status")
      .update({ status: "error", current_task: null })
      .eq("agent_name", "watchdog-ai");
    throw error;
  }

  return { triggered: true, scan_type, result: data };
}

async function orchestrateTask(supabase: any, payload: any) {
  const { task_type, agents_required, priority = "normal" } = payload;

  console.log(
    `[CENTRAL-BRAIN] Orchestrating task: ${task_type}, Agents: ${agents_required.join(", ")}`
  );

  // 1. Check if all required agents are available
  const { data: agents, error } = await supabase
    .from("agent_status")
    .select("*")
    .in("agent_name", agents_required);

  if (error) throw error;

  const busyAgents = agents.filter((a: AgentStatus) => a.status !== "idle");
  if (busyAgents.length > 0) {
    return {
      orchestrated: false,
      reason: "Agents busy",
      busy_agents: busyAgents.map((a: any) => a.agent_name),
    };
  }

  // 2. Assign task to agents
  for (const agent of agents) {
    await supabase
      .from("agent_status")
      .update({
        status: "working",
        current_task: `Task: ${task_type}`,
      })
      .eq("agent_name", agent.agent_name);
  }

  // 3. Execute task (placeholder for actual task execution)
  // In real implementation: Call respective Edge Functions based on task_type

  return {
    orchestrated: true,
    task_type,
    agents: agents_required,
    priority,
    started_at: new Date().toISOString(),
  };
}

async function sendHeartbeat(supabase: any) {
  console.log("[CENTRAL-BRAIN] Sending heartbeat to Datadoc...");

  // 1. Collect health metrics from all agents
  const { data: agents, error } = await supabase.from("agent_status").select("*");
  if (error) throw error;

  // 2. Collect monitoring logs summary (Last 15 minutes)
  const { data: logs, error: logsError } = await supabase
    .from("monitoring_logs")
    .select("severity")
    .gte("created_at", new Date(Date.now() - 15 * 60 * 1000).toISOString());

  if (logsError) throw logsError;

  const criticalCount = logs?.filter((l: any) => l.severity === "critical").length || 0;
  const warningCount = logs?.filter((l: any) => l.severity === "warning").length || 0;

  // 3. Calculate Uptime & Response Time (Last 24h)
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: recentLogs, error: recentLogsError } = await supabase
    .from("monitoring_logs")
    .select("severity, metadata")
    .gte("created_at", twentyFourHoursAgo);

  if (recentLogsError) throw recentLogsError;

  const totalLogs = recentLogs?.length || 1;
  const healthyLogs = recentLogs?.filter((log: any) => log.severity === "info").length || 0;
  const uptimePercentage = parseFloat(((healthyLogs / totalLogs) * 100).toFixed(2));

  const responseTimes =
    recentLogs
      ?.map((log: any) => log.metadata?.response_time_ms)
      .filter((time: any) => time !== undefined && time !== null) || [];
  const avgResponseTime =
    responseTimes.length > 0
      ? Math.round(
          responseTimes.reduce((sum: number, time: number) => sum + time, 0) / responseTimes.length
        )
      : 250;

  // 4. Build heartbeat payload
  const heartbeat = {
    timestamp: new Date().toISOString(),
    agents: agents.map((a: any) => ({
      agent_name: a.agent_name,
      status: a.status,
      version: a.version,
      last_sync: a.last_sync_at,
      current_task: a.current_task,
    })),
    health: {
      critical_issues: criticalCount,
      warnings: warningCount,
      all_agents_healthy: agents.every((a: any) => a.status !== "error"),
    },
    metrics: {
      uptime_percentage: uptimePercentage,
      avg_response_time_ms: avgResponseTime,
    },
  };

  // 4.5. Trigger CRITICAL alerts if health degraded
  if (criticalCount > 0 || !heartbeat.health.all_agents_healthy) {
    console.warn("[CENTRAL-BRAIN] CRITICAL health detected, triggering alert...");

    try {
      const alertPayload = {
        alert_type: "critical",
        severity: "critical",
        message: `System health degraded: ${criticalCount} critical issue(s), ${agents.filter((a: any) => a.status === "error").length} agent(s) in error state`,
        details: {
          critical_issues: criticalCount,
          warnings: warningCount,
          unhealthy_agents: agents
            .filter((a: any) => a.status === "error")
            .map((a: any) => a.agent_name),
          uptime_percentage: uptimePercentage,
        },
        source: "central-brain",
      };

      const { error: alertError } = await supabase.functions.invoke("alert-manager", {
        body: alertPayload,
      });

      if (alertError) {
        console.error("[CENTRAL-BRAIN] Failed to trigger alert:", alertError);
      } else {
        console.log("[CENTRAL-BRAIN] Alert triggered successfully");
      }
    } catch (alertError) {
      console.error("[CENTRAL-BRAIN] Alert trigger error:", alertError);
    }
  }

  // 5. Save to heartbeat_history
  const { error: historyError } = await supabase.from("heartbeat_history").insert({
    agent_health: heartbeat.agents,
    critical_issues: heartbeat.health.critical_issues,
    warnings: heartbeat.health.warnings,
    all_agents_healthy: heartbeat.health.all_agents_healthy,
    uptime_percentage: heartbeat.metrics.uptime_percentage,
    avg_response_time_ms: heartbeat.metrics.avg_response_time_ms,
  });

  if (historyError) {
    console.error("[CENTRAL-BRAIN] Failed to save heartbeat history:", historyError);
  }

  // 6. Sync to Datadoc (Single Source of Truth)
  await syncToDatadoc("/metrics/agent_health", heartbeat);

  // 7. Log inter-agent sync
  await syncToDatadoc("/status/inter_agent_sync", {
    timestamp: new Date().toISOString(),
    agents_synced: agents.map((a: any) => a.agent_name),
    sync_type: "heartbeat",
    success: true,
  });

  return {
    heartbeat_sent: true,
    timestamp: heartbeat.timestamp,
    agents_count: agents.length,
    health: heartbeat.health,
  };
}
