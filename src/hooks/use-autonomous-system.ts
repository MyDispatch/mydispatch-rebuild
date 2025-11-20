// ==================================================================================
// AUTONOMOUS SYSTEM HOOK V2.0 - SELF-HEALING EDITION
// ==================================================================================
// Purpose: Monitor and control autonomous development system with self-healing
// Usage: const { status, tasks, executionLogs, triggerPoll } = useAutonomousSystem();
// Features: Circuit breakers, fallback data, auto-recovery, never-fail guarantee
// ==================================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { handleError, handleSuccess } from "@/lib/error-handler";
import { SelfHealing } from "@/lib/self-healing";
import {
  DEFAULT_SYSTEM_CONFIG,
  getFallbackTasks,
  getFallbackExecutionLogs,
  getFallbackStats,
  smartFallback,
  persistToLocalStorage,
  ultimateFallback,
} from "@/lib/fallback-strategies";
import type {
  AutonomousTask,
  AutonomousSystemConfig,
  AutonomousExecutionLog,
} from "@/integrations/supabase/types/autonomous";

// Type helper for autonomous tables (same as in self-healing.ts)
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

// Re-export types for backward compatibility
export type { AutonomousTask, AutonomousSystemConfig, AutonomousExecutionLog as ExecutionLog };

export interface SystemStats {
  total_tasks: number;
  pending_tasks: number;
  in_progress_tasks: number;
  completed_tasks: number;
  failed_tasks: number;
  last_execution: string | null;
}

/**
 * Hook to monitor and control the autonomous system
 */
export function useAutonomousSystem() {
  const queryClient = useQueryClient();

  // Fetch system configuration (SELF-HEALING)
  const {
    data: config,
    isLoading: configLoading,
    error: configError,
  } = useQuery({
    queryKey: ["autonomous-system-config"],
    queryFn: async () => {
            const result = await SelfHealing.query(
        () => autonomousClient.from("autonomous_system_config").select("*").single(),
        {
          operationName: "fetch_autonomous_config",
          fallbackValue: DEFAULT_SYSTEM_CONFIG,
        }
      );

      if (result.recovered && result.data) {
        persistToLocalStorage("system_config", result.data);
      }

      if (result.error && !result.data) {
        return ultimateFallback("system_config", DEFAULT_SYSTEM_CONFIG);
      }

      return result.data as AutonomousSystemConfig;
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
    retryDelay: 1000,
  });

  // Fetch tasks (SELF-HEALING)
  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["autonomous-tasks"],
    queryFn: async () => {
      const result = await SelfHealing.query<AutonomousTask[]>(
        () =>
          autonomousClient
            .from("autonomous_tasks")
            .select("*")
            .order("priority", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(50),
        {
          operationName: "fetch_autonomous_tasks",
          fallbackValue: getFallbackTasks(),
        }
      );

      if (result.recovered && result.data) {
        persistToLocalStorage("tasks", result.data);
      }

      if (result.error && !result.data) {
        return ultimateFallback("tasks", getFallbackTasks());
      }

      return result.data || [];
    },
    staleTime: 10 * 1000, // 10 seconds
    retry: 3,
    retryDelay: 1000,
  });

  // Fetch execution logs (SELF-HEALING)
  const {
    data: executionLogs,
    isLoading: logsLoading,
    error: logsError,
  } = useQuery({
    queryKey: ["autonomous-execution-logs"],
    queryFn: async () => {
      const result = await SelfHealing.query<AutonomousExecutionLog[]>(
        () =>
          autonomousClient
            .from("autonomous_execution_logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100),
        {
          operationName: "fetch_execution_logs",
          fallbackValue: getFallbackExecutionLogs(),
        }
      );

      if (result.recovered && result.data) {
        persistToLocalStorage("execution_logs", result.data);
      }

      if (result.error && !result.data) {
        return ultimateFallback("execution_logs", getFallbackExecutionLogs());
      }

      return result.data || [];
    },
    staleTime: 15 * 1000, // 15 seconds
    retry: 3,
    retryDelay: 1000,
  });

  // Fetch system statistics (SELF-HEALING)
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["autonomous-system-stats"],
    queryFn: async () => {
            const result = await SelfHealing.query(
        () => autonomousClient.from("autonomous_system_stats").select("*").single(),
        {
          operationName: "fetch_system_stats",
          fallbackValue: getFallbackStats(),
        }
      );

      if (result.recovered && result.data) {
        persistToLocalStorage("stats", result.data);
      }

      if (result.error && !result.data) {
        return ultimateFallback("stats", getFallbackStats());
      }

      return result.data as SystemStats;
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
    retryDelay: 1000,
  });

  // Mutation: Trigger manual poll (SELF-HEALING)
  const triggerPollMutation = useMutation({
    mutationFn: async () => {
      const result = await SelfHealing.edgeFunction("ai-agent-poll", {}, {
        maxRetries: 3,
      });

      if (result.error) {
        throw result.error;
      }

      return result.data;
    },
    onSuccess: (data) => {
      handleSuccess(
        `Autonomous agent executed: ${(data as { processed?: number })?.processed || 0} tasks processed`
      );
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["autonomous-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["autonomous-execution-logs"] });
      queryClient.invalidateQueries({ queryKey: ["autonomous-system-stats"] });
    },
    onError: (error) => {
      handleError(error, "Failed to trigger autonomous agent");
    },
  });

  // Mutation: Create new task
  const createTaskMutation = useMutation({
    mutationFn: async (task: {
      task_type: string;
      description: string;
      priority?: number;
      autonomy_level?: number;
    }) => {
            const { data, error } = await supabase.rpc("create_autonomous_task", {
        p_task_type: task.task_type,
        p_description: task.description,
        p_priority: task.priority || 5,
        p_autonomy_level: task.autonomy_level || 2,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      handleSuccess("Task created successfully");
      queryClient.invalidateQueries({ queryKey: ["autonomous-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["autonomous-system-stats"] });
    },
    onError: (error) => {
      handleError(error, "Failed to create task");
    },
  });

  // Mutation: Update system config
  const updateConfigMutation = useMutation({
    mutationFn: async (updates: Partial<AutonomousSystemConfig>) => {
            const { data, error } = await supabase
        .from("autonomous_system_config")
        .update(updates)
        .eq("id", 1)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      handleSuccess("System configuration updated");
      queryClient.invalidateQueries({ queryKey: ["autonomous-system-config"] });
    },
    onError: (error) => {
      handleError(error, "Failed to update configuration");
    },
  });

  // Mutation: Emergency stop
  const emergencyStopMutation = useMutation({
    mutationFn: async (params: { reason: string; hours?: number }) => {
            const { data, error } = await supabase.rpc("emergency_stop_autonomous_system", {
        p_reason: params.reason,
        p_hours: params.hours || 24,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      handleSuccess("Emergency stop activated");
      queryClient.invalidateQueries({ queryKey: ["autonomous-system-config"] });
      queryClient.invalidateQueries({ queryKey: ["autonomous-tasks"] });
    },
    onError: (error) => {
      handleError(error, "Failed to activate emergency stop");
    },
  });

  // Compute health status
  const computeHealth = () => {
    if (!config || !stats) return "unknown";

    if (config.emergency_stop) return "stopped";
    if (!config.enabled) return "disabled";

    const failureRate = stats.total_tasks > 0
      ? stats.failed_tasks / stats.total_tasks
      : 0;

    if (failureRate > 0.5) return "critical";
    if (failureRate > 0.2) return "warning";
    if (stats.in_progress_tasks > 0) return "active";
    if (stats.pending_tasks > 0) return "idle";

    return "healthy";
  };

  return {
    // Data
    config,
    tasks: tasks || [],
    executionLogs: executionLogs || [],
    stats,
    health: computeHealth(),

    // Loading states
    isLoading: configLoading || tasksLoading || logsLoading || statsLoading,

    // Errors
    error: configError || tasksError || logsError || statsError,

    // Actions
    triggerPoll: triggerPollMutation.mutate,
    createTask: createTaskMutation.mutate,
    updateConfig: updateConfigMutation.mutate,
    emergencyStop: emergencyStopMutation.mutate,

    // Action states
    isTriggering: triggerPollMutation.isPending,
    isCreatingTask: createTaskMutation.isPending,
    isUpdatingConfig: updateConfigMutation.isPending,
    isStoppingEmergency: emergencyStopMutation.isPending,
  };
}
