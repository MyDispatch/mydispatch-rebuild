// ==================================================================================
// WATCHDOG SERVICE - CONTINUOUS HEALTH MONITORING
// ==================================================================================
// Purpose: Background service that continuously monitors system health
// Features: Auto-healing, Alert management, Performance monitoring
// ==================================================================================

import { supabase } from "@/integrations/supabase/client";
import { SelfHealing } from "./self-healing";
import { logError, logInfo } from "@/lib/logger";

// Type helper for autonomous tables
/* eslint-disable @typescript-eslint/no-explicit-any */
type AutonomousSupabaseClient = typeof supabase & {
  from(table: "autonomous_tasks"): any;
  from(table: "autonomous_system_config"): any;
  from(table: "autonomous_execution_logs"): any;
  from(table: "autonomous_safety_checks"): any;
  from(table: "autonomous_system_stats"): any;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

const autonomousClient = supabase as AutonomousSupabaseClient;

// ==================================================================================
// CONFIGURATION
// ==================================================================================
const WATCHDOG_INTERVAL = 300000; // 5 minutes
const CRITICAL_FAILURE_THRESHOLD = 10; // Emergency stop after 10 consecutive failures
const ALERT_EMAIL = "courbois1981@gmail.com";

interface WatchdogState {
  running: boolean;
  consecutiveFailures: number;
  lastCheckTime: number;
  intervalId: NodeJS.Timeout | null;
}

const state: WatchdogState = {
  running: false,
  consecutiveFailures: 0,
  lastCheckTime: 0,
  intervalId: null,
};

// ==================================================================================
// HEALTH METRICS
// ==================================================================================
interface HealthMetrics {
  timestamp: string;
  database_connection: boolean;
  edge_function_status: boolean;
  pending_tasks_count: number;
  failed_tasks_rate: number;
  system_config_valid: boolean;
  circuit_breakers_open: number;
  last_successful_execution: string | null;
}

async function collectHealthMetrics(): Promise<HealthMetrics> {
  const metrics: HealthMetrics = {
    timestamp: new Date().toISOString(),
    database_connection: false,
    edge_function_status: false,
    pending_tasks_count: 0,
    failed_tasks_rate: 0,
    system_config_valid: false,
    circuit_breakers_open: 0,
    last_successful_execution: null,
  };

  // Test database connection
  try {
    const { data, error } = await supabase
      .from("autonomous_system_config")
      .select("*")
      .single();

    if (!error && data) {
      metrics.database_connection = true;
      metrics.system_config_valid = data.enabled !== undefined;
    }
  } catch (error) {
    logError({
      message: "Watchdog: Database connection failed",
      context: { error },
    });
  }

  // Check Edge Function status
  try {
    const { error } = await SelfHealing.edgeFunction("ai-agent-poll", {}, { maxRetries: 1 });
    metrics.edge_function_status = !error;
  } catch (error) {
    // Expected if Edge Function is down
  }

  // Count pending tasks
  try {
    const { data } = await supabase
      .from("autonomous_tasks")
      .select("id", { count: "exact" })
      .eq("status", "pending");

    metrics.pending_tasks_count = data?.length || 0;
  } catch (error) {
    // Non-critical
  }

  // Calculate failure rate (last 24h)
  try {
    const { data: recentTasks } = await supabase
      .from("autonomous_tasks")
      .select("status")
      .gte("created_at", new Date(Date.now() - 86400000).toISOString());

    if (recentTasks && recentTasks.length > 0) {
      const failedCount = recentTasks.filter((t) => t.status === "failed").length;
      metrics.failed_tasks_rate = failedCount / recentTasks.length;
    }
  } catch (error) {
    // Non-critical
  }

  // Get last successful execution
  try {
    const { data } = await supabase
      .from("autonomous_execution_logs")
      .select("created_at")
      .eq("step_status", "completed")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (data) {
      metrics.last_successful_execution = data.created_at;
    }
  } catch (error) {
    // Non-critical
  }

  return metrics;
}

// ==================================================================================
// ALERT SYSTEM
// ==================================================================================
async function sendAlert(
  severity: "critical" | "warning" | "info",
  message: string,
  details?: Record<string, unknown>
): Promise<void> {
  console.log(`🚨 [${severity.toUpperCase()}] ${message}`, details);

  // Log to database
  try {
    await autonomousClient.from("autonomous_execution_logs").insert({
      execution_step: `watchdog_alert_${severity}`,
      step_status: severity === "critical" ? "failed" : "completed",
      output_data: {
        message,
        details,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to log alert", error);
  }

  // Send email for critical alerts
  if (severity === "critical") {
    try {
      await supabase.functions.invoke("send-template-email", {
        body: {
          to: ALERT_EMAIL,
          template: "system_alert",
          data: {
            severity,
            message,
            details: JSON.stringify(details, null, 2),
            timestamp: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      console.error("Failed to send alert email", error);
    }
  }
}

// ==================================================================================
// WATCHDOG MAIN LOOP
// ==================================================================================
async function performHealthCheck(): Promise<void> {
  state.lastCheckTime = Date.now();

  try {
    logInfo({ message: "Watchdog: Starting health check" });

    // Collect metrics
    const metrics = await collectHealthMetrics();

    // Check for critical issues
    if (!metrics.database_connection) {
      state.consecutiveFailures++;
      await sendAlert("critical", "Database connection lost", { metrics });

      if (state.consecutiveFailures >= CRITICAL_FAILURE_THRESHOLD) {
        await emergencyStop("Too many consecutive database failures");
        return;
      }
    } else {
      state.consecutiveFailures = 0;
    }

    // Check failure rate
    if (metrics.failed_tasks_rate > 0.8) {
      await sendAlert("critical", `High failure rate: ${(metrics.failed_tasks_rate * 100).toFixed(1)}%`, {
        metrics,
      });
    } else if (metrics.failed_tasks_rate > 0.5) {
      await sendAlert("warning", `Elevated failure rate: ${(metrics.failed_tasks_rate * 100).toFixed(1)}%`, {
        metrics,
      });
    }

    // Check if system is stuck (no activity for > 1 hour)
    if (metrics.last_successful_execution) {
      const lastExecution = new Date(metrics.last_successful_execution).getTime();
      const hoursSinceLastExecution = (Date.now() - lastExecution) / 3600000;

      if (hoursSinceLastExecution > 1 && metrics.pending_tasks_count > 0) {
        await sendAlert("warning", "System appears stuck", {
          hoursSinceLastExecution: hoursSinceLastExecution.toFixed(1),
          pendingTasks: metrics.pending_tasks_count,
        });

        // Trigger auto-healing
        await SelfHealing.autoHeal();
      }
    }

    // Perform auto-healing
    const healingResult = await SelfHealing.autoHeal();

    if (healingResult.healed) {
      await sendAlert("info", "Auto-healing completed", {
        issues: healingResult.issues,
        fixes: healingResult.fixes,
      });
    }

    // Log metrics
    await autonomousClient.from("autonomous_execution_logs").insert({
      execution_step: "watchdog_health_check",
      step_status: "completed",
      output_data: metrics,
    });

    logInfo({ message: "Watchdog: Health check completed", context: { metrics } });
  } catch (error) {
    state.consecutiveFailures++;
    logError({
      message: "Watchdog: Health check failed",
      context: { error, consecutiveFailures: state.consecutiveFailures },
    });

    if (state.consecutiveFailures >= CRITICAL_FAILURE_THRESHOLD) {
      await emergencyStop("Too many consecutive health check failures");
    }
  }
}

// ==================================================================================
// EMERGENCY STOP
// ==================================================================================
async function emergencyStop(reason: string): Promise<void> {
  console.error(`🛑 EMERGENCY STOP: ${reason}`);

  try {
    await supabase
      .from("autonomous_system_config")
      .update({
        emergency_stop: true,
        emergency_stop_reason: reason,
      })
      .eq("id", 1);

    await sendAlert("critical", "EMERGENCY STOP ACTIVATED", {
      reason,
      consecutiveFailures: state.consecutiveFailures,
    });

    stopWatchdog();
  } catch (error) {
    console.error("Failed to activate emergency stop", error);
  }
}

// ==================================================================================
// PUBLIC API
// ==================================================================================
export function startWatchdog(): void {
  if (state.running) {
    console.warn("Watchdog already running");
    return;
  }

  console.log("🐕 Starting Watchdog service...");
  state.running = true;
  state.consecutiveFailures = 0;

  // Immediate first check
  performHealthCheck();

  // Schedule periodic checks
  state.intervalId = setInterval(performHealthCheck, WATCHDOG_INTERVAL);

  logInfo({ message: "Watchdog service started" });
}

export function stopWatchdog(): void {
  if (!state.running) {
    return;
  }

  console.log("🐕 Stopping Watchdog service...");

  if (state.intervalId) {
    clearInterval(state.intervalId);
    state.intervalId = null;
  }

  state.running = false;

  logInfo({ message: "Watchdog service stopped" });
}

export function getWatchdogStatus(): {
  running: boolean;
  consecutiveFailures: number;
  lastCheckTime: number;
  nextCheckIn: number;
} {
  return {
    running: state.running,
    consecutiveFailures: state.consecutiveFailures,
    lastCheckTime: state.lastCheckTime,
    nextCheckIn: state.lastCheckTime
      ? Math.max(0, WATCHDOG_INTERVAL - (Date.now() - state.lastCheckTime))
      : 0,
  };
}

// Auto-start in production
if (import.meta.env.VITE_AUTONOMOUS_MODE === "true" && import.meta.env.PROD) {
  startWatchdog();
}

