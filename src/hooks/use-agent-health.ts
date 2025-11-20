// ==================================================================================
// USE-AGENT-HEALTH HOOK V18.5.1
// ==================================================================================
// Purpose: React Hook for Agent Health Dashboard (Real-Time Metrics)
// ==================================================================================

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { queryKeys } from "@/lib/react-query/query-keys";

export interface AgentHealthMetrics {
  timestamp: string;
  critical_issues: number;
  warnings: number;
  all_agents_healthy: boolean;
  uptime_percentage: number;
  avg_response_time_ms: number;
  agent_health: Array<{
    agent_name: string;
    status: string;
    version: string;
  }>;
}

export const useAgentHealth = () => {
  // 1. Latest Heartbeat
  const { data: latestHeartbeat, isLoading: isLoadingLatest } = useQuery({
    queryKey: queryKeys.agentHealth.latest(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("heartbeat_history")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return {
        ...data,
        agent_health: data.agent_health as unknown as Array<{
          agent_name: string;
          status: string;
          version: string;
        }>,
      } as AgentHealthMetrics;
    },
    refetchInterval: 120000, // Refetch every 2 minutes (reduced from 1min)
  });

  // 2. Heartbeat History (Last 24 hours)
  const { data: heartbeatHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: queryKeys.agentHealth.history(),
    queryFn: async () => {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("heartbeat_history")
        .select("*")
        .gte("timestamp", twentyFourHoursAgo)
        .order("timestamp", { ascending: true });

      if (error) throw error;
      return data.map((item) => ({
        ...item,
        agent_health: item.agent_health as unknown as Array<{
          agent_name: string;
          status: string;
          version: string;
        }>,
      })) as AgentHealthMetrics[];
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // 3. Agent Status (Current)
  const { data: agentStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: queryKeys.agentHealth.status(),
    queryFn: async () => {
      const { data, error } = await supabase.from("agent_status").select("*");

      if (error) throw error;
      return data;
    },
    refetchInterval: 120000, // Refetch every 2 minutes (reduced from 30s)
  });

  // 4. Calculate Uptime Trends (7d, 30d)
  const calculateUptimeTrend = (days: number) => {
    if (!heartbeatHistory) return null;

    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const relevant = heartbeatHistory.filter((h) => new Date(h.timestamp) >= cutoff);

    if (relevant.length === 0) return null;

    const avgUptime =
      relevant.reduce((sum, h) => sum + (h.uptime_percentage || 0), 0) / relevant.length;

    return parseFloat(avgUptime.toFixed(2));
  };

  const uptime7d = calculateUptimeTrend(7);
  const uptime30d = calculateUptimeTrend(30);

  return {
    latestHeartbeat,
    heartbeatHistory,
    agentStatus,
    uptime7d,
    uptime30d,
    isLoading: isLoadingLatest || isLoadingHistory || isLoadingStatus,
  };
};

// ==================================================================================
// HELPER: Trigger Heartbeat manually
// ==================================================================================

export const triggerHeartbeat = async () => {
  const { data, error } = await supabase.functions.invoke("central-brain", {
    body: { action: "heartbeat" },
  });

  if (error) throw error;
  return data;
};
