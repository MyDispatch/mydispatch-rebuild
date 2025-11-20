// ==================================================================================
// SELF-HEALING AUTONOMOUS SYSTEM V1.0
// ==================================================================================
// Purpose: Automatically detect and fix system issues without human intervention
// Features: Circuit Breaker, Retry Logic, Auto-Recovery, Fallback Strategies
// ==================================================================================

import { supabase } from "@/integrations/supabase/client";
import { logError } from "@/lib/logger";
import type {
  AutonomousTask,
  AutonomousSystemConfig,
  AutonomousTaskUpdate,
  AutonomousSystemConfigUpdate,
  AutonomousExecutionLogInsert,
} from "@/integrations/supabase/types/autonomous";

// Type helper for autonomous tables that aren't in generated Supabase types yet
// These tables exist in database but TypeScript doesn't know about them
// Using explicit `any` here is acceptable because we have proper types defined above
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
// CIRCUIT BREAKER PATTERN
// ==================================================================================
interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  state: "closed" | "open" | "half-open";
}

const circuitBreakers = new Map<string, CircuitBreakerState>();

const CIRCUIT_BREAKER_THRESHOLD = 5; // Open after 5 failures
const CIRCUIT_BREAKER_TIMEOUT = 60000; // Try again after 60 seconds
const CIRCUIT_BREAKER_RESET_TIMEOUT = 300000; // Reset after 5 minutes

function getCircuitBreaker(key: string): CircuitBreakerState {
  if (!circuitBreakers.has(key)) {
    circuitBreakers.set(key, {
      failures: 0,
      lastFailureTime: 0,
      state: "closed",
    });
  }
  return circuitBreakers.get(key)!;
}

function recordSuccess(key: string): void {
  const breaker = getCircuitBreaker(key);
  breaker.failures = 0;
  breaker.state = "closed";
}

function recordFailure(key: string): void {
  const breaker = getCircuitBreaker(key);
  breaker.failures++;
  breaker.lastFailureTime = Date.now();

  if (breaker.failures >= CIRCUIT_BREAKER_THRESHOLD) {
    breaker.state = "open";
    console.warn(`🔴 Circuit breaker OPEN for ${key}`);
  }
}

function canExecute(key: string): boolean {
  const breaker = getCircuitBreaker(key);
  const now = Date.now();

  if (breaker.state === "closed") {
    return true;
  }

  if (breaker.state === "open") {
    if (now - breaker.lastFailureTime > CIRCUIT_BREAKER_TIMEOUT) {
      breaker.state = "half-open";
      console.log(`🟡 Circuit breaker HALF-OPEN for ${key}`);
      return true;
    }
    return false;
  }

  // half-open state
  return true;
}

// ==================================================================================
// RETRY LOGIC WITH EXPONENTIAL BACKOFF
// ==================================================================================
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    multiplier?: number;
    operationName?: string;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    multiplier = 2,
    operationName = "operation",
  } = options;

  let lastError: Error | null = null;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        console.log(
          `⚠️ ${operationName} failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * multiplier, maxDelay);
      }
    }
  }

  throw lastError;
}

// ==================================================================================
// SELF-HEALING DATABASE CONNECTION
// ==================================================================================
export async function selfHealingQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: Error | null }>,
  options: {
    operationName: string;
    fallbackValue?: T;
  }
): Promise<{ data: T | null; error: Error | null; recovered: boolean }> {
  const { operationName, fallbackValue } = options;
  const circuitKey = `db:${operationName}`;

  if (!canExecute(circuitKey)) {
    console.warn(`⏸️ Circuit breaker open, using fallback for ${operationName}`);
    return {
      data: fallbackValue || null,
      error: new Error("Circuit breaker open"),
      recovered: true,
    };
  }

  try {
    const result = await retryWithBackoff(queryFn, {
      maxRetries: 3,
      operationName,
    });

    if (result.error) {
      throw result.error;
    }

    recordSuccess(circuitKey);
    return { ...result, recovered: false };
  } catch (error) {
    recordFailure(circuitKey);
    logError({
      message: `Database query failed: ${operationName}`,
      context: { error },
    });

    // Auto-recovery: Try to reconnect
    await attemptDatabaseRecovery();

    return {
      data: fallbackValue || null,
      error: error as Error,
      recovered: true,
    };
  }
}

async function attemptDatabaseRecovery(): Promise<void> {
  console.log("🔄 Attempting database recovery...");

  try {
    // Test connection with simple query
    const { error } = await supabase.from("profiles").select("id").limit(1);

    if (!error) {
      console.log("✅ Database connection recovered");
      recordSuccess("db:connection");
    }
  } catch (error) {
    console.error("❌ Database recovery failed", error);
  }
}

// ==================================================================================
// SELF-HEALING EDGE FUNCTION CALLS
// ==================================================================================
export async function selfHealingEdgeFunction<T>(
  functionName: string,
  body: Record<string, unknown> = {},
  options: {
    fallbackValue?: T;
    maxRetries?: number;
  } = {}
): Promise<{ data: T | null; error: Error | null; recovered: boolean }> {
  const { fallbackValue, maxRetries = 3 } = options;
  const circuitKey = `edge:${functionName}`;

  if (!canExecute(circuitKey)) {
    console.warn(`⏸️ Circuit breaker open for Edge Function: ${functionName}`);
    return {
      data: fallbackValue || null,
      error: new Error("Circuit breaker open"),
      recovered: true,
    };
  }

  try {
    const result = await retryWithBackoff(
      async () => {
        const { data, error } = await supabase.functions.invoke(functionName, {
          body,
        });

        if (error) throw error;
        return data;
      },
      {
        maxRetries,
        operationName: `Edge Function: ${functionName}`,
      }
    );

    recordSuccess(circuitKey);
    return { data: result as T, error: null, recovered: false };
  } catch (error) {
    recordFailure(circuitKey);
    logError({
      message: `Edge Function failed: ${functionName}`,
      context: { error, body },
    });

    // Auto-recovery: Check Edge Function status
    await checkEdgeFunctionHealth(functionName);

    return {
      data: fallbackValue || null,
      error: error as Error,
      recovered: true,
    };
  }
}

async function checkEdgeFunctionHealth(functionName: string): Promise<void> {
  console.log(`🔍 Checking Edge Function health: ${functionName}`);

  try {
    // Simple health check
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${functionName}`,
      {
        method: "OPTIONS",
      }
    );

    if (response.ok) {
      console.log(`✅ Edge Function ${functionName} is healthy`);
      recordSuccess(`edge:${functionName}`);
    } else {
      console.error(`❌ Edge Function ${functionName} unhealthy: ${response.status}`);
    }
  } catch (error) {
    console.error(`❌ Edge Function health check failed: ${functionName}`, error);
  }
}

// ==================================================================================
// AUTO-HEALING AUTONOMOUS SYSTEM
// ==================================================================================
export async function autoHealAutonomousSystem(): Promise<{
  healed: boolean;
  issues: string[];
  fixes: string[];
}> {
  console.log("🏥 Starting autonomous system auto-healing...");

  const issues: string[] = [];
  const fixes: string[] = [];

  // 1. Check system configuration
  const { data: config, error: configError } = await selfHealingQuery<AutonomousSystemConfig>(
    () => autonomousClient.from("autonomous_system_config").select("*").single(),
    { operationName: "fetch_system_config" }
  );

  if (configError || !config) {
    issues.push("System configuration not accessible");

    // Auto-fix: Create default configuration
    console.log("🔧 Creating default system configuration...");
    const { error: createError } = await autonomousClient.from("autonomous_system_config").upsert({
      id: 1,
      enabled: true,
      dry_run_mode: true,
      autonomy_level: 2,
      max_parallel_tasks: 5,
      notification_email: "courbois1981@gmail.com",
      emergency_stop: false,
    });

    if (!createError) {
      fixes.push("Created default system configuration");
    }
  }

  // 2. Check for stuck tasks
  const { data: stuckTasks } = await selfHealingQuery<AutonomousTask[]>(
    () =>
      autonomousClient
        .from("autonomous_tasks")
        .select("*")
        .eq("status", "in_progress")
        .lt("started_at", new Date(Date.now() - 3600000).toISOString()), // > 1 hour
    { operationName: "fetch_stuck_tasks", fallbackValue: [] }
  );

  if (stuckTasks && stuckTasks.length > 0) {
    issues.push(`${stuckTasks.length} stuck tasks found`);

    // Auto-fix: Reset stuck tasks
    console.log(`🔧 Resetting ${stuckTasks.length} stuck tasks...`);
    for (const task of stuckTasks) {
      await autonomousClient
        .from("autonomous_tasks")
        .update({
          status: "failed",
          error_message: "Task stuck for > 1 hour, auto-reset by self-healing system",
          completed_at: new Date().toISOString(),
        } as AutonomousTaskUpdate)
        .eq("id", task.id);
    }

    fixes.push(`Reset ${stuckTasks.length} stuck tasks`);
  }

  // 3. Check Edge Function availability
  const { error: edgeFunctionError } = await selfHealingEdgeFunction(
    "ai-agent-poll",
    {},
    { maxRetries: 1 }
  );

  if (edgeFunctionError) {
    issues.push("Edge Function ai-agent-poll not responding");
    fixes.push("Circuit breaker activated for Edge Function");
  }

  // 4. Check for excessive failed tasks
  const { data: recentTasks } = await selfHealingQuery<Pick<AutonomousTask, "status">[]>(
    () =>
      autonomousClient
        .from("autonomous_tasks")
        .select("status")
        .gte("created_at", new Date(Date.now() - 86400000).toISOString()), // Last 24h
    { operationName: "fetch_recent_tasks", fallbackValue: [] }
  );

  if (recentTasks && recentTasks.length > 0) {
    const failedCount = recentTasks.filter((t) => t.status === "failed").length;
    const failureRate = failedCount / recentTasks.length;

    if (failureRate > 0.5) {
      issues.push(`High failure rate: ${(failureRate * 100).toFixed(1)}%`);

      // Auto-fix: Enable dry-run mode
      console.log("🔧 Enabling dry-run mode due to high failure rate...");
      await autonomousClient
        .from("autonomous_system_config")
        .update({ dry_run_mode: true } as AutonomousSystemConfigUpdate)
        .eq("id", 1);

      fixes.push("Enabled dry-run mode to prevent further damage");
    }
  }

  // 5. Cleanup old execution logs (prevent database bloat)
  const { data: oldLogs } = await selfHealingQuery<{ id: string }[]>(
    () =>
      autonomousClient
        .from("autonomous_execution_logs")
        .select("id")
        .lt("created_at", new Date(Date.now() - 2592000000).toISOString()), // > 30 days
    { operationName: "fetch_old_logs", fallbackValue: [] }
  );

  if (oldLogs && oldLogs.length > 1000) {
    issues.push(`${oldLogs.length} old logs consuming storage`);

    // Auto-fix: Delete old logs (keep last 30 days)
    console.log(`🔧 Cleaning up ${oldLogs.length} old logs...`);
    await autonomousClient
      .from("autonomous_execution_logs")
      .delete()
      .lt("created_at", new Date(Date.now() - 2592000000).toISOString());

    fixes.push(`Deleted ${oldLogs.length} old logs`);
  }

  const healed = fixes.length > 0;

  if (healed) {
    console.log(`✅ Auto-healing completed: ${fixes.length} fixes applied`);
  } else {
    console.log("✅ System healthy, no healing required");
  }

  return { healed, issues, fixes };
}

// ==================================================================================
// WATCHDOG SERVICE (Call this periodically)
// ==================================================================================
export async function watchdogCheck(): Promise<void> {
  console.log("🐕 Watchdog: Starting health check...");

  try {
    const result = await autoHealAutonomousSystem();

    if (result.healed) {
      // Log healing event
      await autonomousClient.from("autonomous_execution_logs").insert({
        task_id: null,
        execution_step: "watchdog_healing",
        step_status: "completed",
        input_data: null,
        output_data: {
          issues: result.issues,
          fixes: result.fixes,
        },
        error_data: null,
        duration_ms: null,
        agent_version: "1.0",
        git_commit_sha: null,
        environment: "production",
      } as unknown as AutonomousExecutionLogInsert);

      console.log("🐕 Watchdog: System healed successfully");
    } else {
      console.log("🐕 Watchdog: System healthy");
    }
  } catch (error) {
    console.error("🐕 Watchdog: Critical error during health check", error);

    // Last resort: Emergency stop
    await autonomousClient
      .from("autonomous_system_config")
      .update({
        emergency_stop: true,
        emergency_stop_reason: "Watchdog detected critical system failure",
      } as AutonomousSystemConfigUpdate)
      .eq("id", 1);
  }
}

// ==================================================================================
// EXPORTS
// ==================================================================================
export const SelfHealing = {
  query: selfHealingQuery,
  edgeFunction: selfHealingEdgeFunction,
  autoHeal: autoHealAutonomousSystem,
  watchdog: watchdogCheck,
  canExecute,
  recordSuccess,
  recordFailure,
};
