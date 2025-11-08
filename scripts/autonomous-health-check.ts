/**
 * ==================================================================================
 * AUTONOMOUS SYSTEM HEALTH CHECK
 * ==================================================================================
 * Version: 1.0
 * Created: 2025-11-08
 * Purpose: Monitor autonomous system health and alert on issues
 * Author: NeXify AI System
 * ==================================================================================
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface HealthStatus {
  healthy: boolean;
  checks: {
    name: string;
    status: "ok" | "warning" | "error";
    message: string;
    details?: Record<string, unknown>;
  }[];
  summary: {
    total_tasks: number;
    pending_tasks: number;
    failed_tasks: number;
    success_rate: number;
    last_execution: string | null;
  };
}

/**
 * Run health check
 */
async function runHealthCheck(): Promise<HealthStatus> {
  const checks: HealthStatus["checks"] = [];
  let healthy = true;

  // 1. Check system configuration
  const { data: config, error: configError } = await supabase
    .from("autonomous_system_config")
    .select("*")
    .single();

  if (configError || !config) {
    checks.push({
      name: "System Configuration",
      status: "error",
      message: "Failed to load system configuration",
      details: { error: configError },
    });
    healthy = false;
  } else {
    if (config.emergency_stop) {
      checks.push({
        name: "Emergency Stop",
        status: "warning",
        message: `Emergency stop active: ${config.emergency_stop_reason}`,
        details: { until: config.emergency_stop_until },
      });
      healthy = false;
    } else {
      checks.push({
        name: "Emergency Stop",
        status: "ok",
        message: "No emergency stop active",
      });
    }

    checks.push({
      name: "System Enabled",
      status: config.enabled ? "ok" : "warning",
      message: config.enabled ? "System enabled" : "System disabled",
    });

    checks.push({
      name: "Dry-Run Mode",
      status: config.dry_run_mode ? "warning" : "ok",
      message: config.dry_run_mode
        ? "Dry-run mode active (no changes)"
        : "Dry-run mode disabled (changes active)",
    });
  }

  // 2. Check tasks
  const { data: tasks } = await supabase
    .from("autonomous_tasks")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (!tasks) {
    checks.push({
      name: "Task Status",
      status: "error",
      message: "Failed to load tasks",
    });
    healthy = false;
  } else {
    const pending = tasks.filter((t) => t.status === "pending").length;
    const failed = tasks.filter((t) => t.status === "failed").length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const total = tasks.length;

    const successRate = total > 0 ? (completed / total) * 100 : 0;

    if (failed > 5) {
      checks.push({
        name: "Failed Tasks",
        status: "warning",
        message: `${failed} failed tasks detected`,
        details: { failed, total },
      });
    } else {
      checks.push({
        name: "Failed Tasks",
        status: "ok",
        message: `Only ${failed} failed tasks`,
      });
    }

    if (successRate < 80) {
      checks.push({
        name: "Success Rate",
        status: "warning",
        message: `Success rate below 80%: ${successRate.toFixed(1)}%`,
        details: { success_rate: successRate, completed, total },
      });
    } else {
      checks.push({
        name: "Success Rate",
        status: "ok",
        message: `Success rate: ${successRate.toFixed(1)}%`,
      });
    }

    if (pending > 10) {
      checks.push({
        name: "Pending Tasks",
        status: "warning",
        message: `${pending} pending tasks (backlog)`,
        details: { pending },
      });
    } else {
      checks.push({
        name: "Pending Tasks",
        status: "ok",
        message: `${pending} pending tasks`,
      });
    }
  }

  // 3. Check execution logs
  const { data: logs } = await supabase
    .from("autonomous_execution_logs")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(1);

  const lastExecution = logs?.[0]?.timestamp || null;
  const lastExecutionDate = lastExecution ? new Date(lastExecution) : null;
  const hoursSinceLastExecution = lastExecutionDate
    ? (Date.now() - lastExecutionDate.getTime()) / 1000 / 60 / 60
    : Infinity;

  if (hoursSinceLastExecution > 24) {
    checks.push({
      name: "Last Execution",
      status: "warning",
      message: `No execution in ${hoursSinceLastExecution.toFixed(1)} hours`,
      details: { last_execution: lastExecution },
    });
  } else {
    checks.push({
      name: "Last Execution",
      status: "ok",
      message: `Last execution ${hoursSinceLastExecution.toFixed(1)} hours ago`,
    });
  }

  // 4. Summary
  const summary = {
    total_tasks: tasks?.length || 0,
    pending_tasks: tasks?.filter((t) => t.status === "pending").length || 0,
    failed_tasks: tasks?.filter((t) => t.status === "failed").length || 0,
    success_rate:
      tasks && tasks.length > 0
        ? (tasks.filter((t) => t.status === "completed").length / tasks.length) *
          100
        : 0,
    last_execution: lastExecution,
  };

  return {
    healthy,
    checks,
    summary,
  };
}

/**
 * Send alert
 */
async function sendAlert(status: HealthStatus): Promise<void> {
  const { data: config } = await supabase
    .from("autonomous_system_config")
    .select("notification_email")
    .single();

  const email = config?.notification_email || "courbois1981@gmail.com";

  const hasErrors = status.checks.some((c) => c.status === "error");
  const hasWarnings = status.checks.some((c) => c.status === "warning");

  if (hasErrors || hasWarnings) {
    console.log("📧 Sending alert email...");

    const errorChecks = status.checks.filter((c) => c.status === "error");
    const warningChecks = status.checks.filter((c) => c.status === "warning");

    await supabase.functions.invoke("send-template-email", {
      body: {
        to: email,
        template: "autonomous_health_alert",
        data: {
          status: hasErrors ? "ERROR" : "WARNING",
          healthy: status.healthy,
          error_count: errorChecks.length,
          warning_count: warningChecks.length,
          errors: errorChecks.map((c) => `${c.name}: ${c.message}`).join("\n"),
          warnings: warningChecks
            .map((c) => `${c.name}: ${c.message}`)
            .join("\n"),
          summary: status.summary,
          timestamp: new Date().toISOString(),
        },
      },
    });

    console.log("✅ Alert sent");
  }
}

/**
 * Main
 */
async function main() {
  console.log("🔍 Running autonomous system health check...\n");

  const status = await runHealthCheck();

  console.log("=== HEALTH STATUS ===");
  console.log(`Overall: ${status.healthy ? "✅ HEALTHY" : "❌ UNHEALTHY"}\n`);

  console.log("=== CHECKS ===");
  for (const check of status.checks) {
    const icon = {
      ok: "✅",
      warning: "⚠️",
      error: "❌",
    }[check.status];
    console.log(`${icon} ${check.name}: ${check.message}`);
    if (check.details) {
      console.log(`   Details: ${JSON.stringify(check.details)}`);
    }
  }

  console.log("\n=== SUMMARY ===");
  console.log(`Total Tasks: ${status.summary.total_tasks}`);
  console.log(`Pending: ${status.summary.pending_tasks}`);
  console.log(`Failed: ${status.summary.failed_tasks}`);
  console.log(
    `Success Rate: ${status.summary.success_rate.toFixed(1)}%`
  );
  console.log(
    `Last Execution: ${status.summary.last_execution || "Never"}`
  );

  // Send alert if unhealthy
  await sendAlert(status);

  process.exit(status.healthy ? 0 : 1);
}

main();
