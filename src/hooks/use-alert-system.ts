// ==================================================================================
// USE-ALERT-SYSTEM V18.5.1
// ==================================================================================
// Purpose: React Hook für Alert-Management (Latest Alerts, History, Policies)
// ==================================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { queryKeys } from "@/lib/react-query/query-keys";

export interface AlertLog {
  id: string;
  alert_type: "critical" | "warning" | "info";
  severity: "critical" | "warning" | "info";
  message: string;
  details: Record<string, any>;
  source: string;
  email_sent: boolean;
  email_recipients: string[];
  email_error: string | null;
  resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
}

export interface AlertPolicy {
  id: string;
  company_id: string;
  alert_type: "critical" | "warning" | "info";
  email_recipients: string[];
  slack_webhook_url: string | null;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// ==================================================================================
// LATEST ALERTS (Unresolved)
// ==================================================================================

export function useLatestAlerts(limit: number = 10) {
  return useQuery({
    queryKey: queryKeys.alerts.latest(limit),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alert_logs")
        .select("*")
        .eq("resolved", false)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as AlertLog[];
    },
    refetchInterval: 30000, // Refresh every 30s
  });
}

// ==================================================================================
// ALERT HISTORY (Last 7 Days)
// ==================================================================================

export function useAlertHistory(days: number = 7) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - days);

  return useQuery({
    queryKey: queryKeys.alerts.history(days),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alert_logs")
        .select("*")
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as AlertLog[];
    },
    refetchInterval: 60000, // Refresh every 60s
  });
}

// ==================================================================================
// ALERT POLICIES
// ==================================================================================

export function useAlertPolicies() {
  return useQuery({
    queryKey: queryKeys.alerts.policies(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alert_policies")
        .select("*")
        .order("alert_type", { ascending: true });

      if (error) throw error;
      return data as AlertPolicy[];
    },
    refetchInterval: 300000, // Refresh every 5min
  });
}

// ==================================================================================
// RESOLVE ALERT
// ==================================================================================

export function useResolveAlert() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (alertId: string) => {
      const { data, error } = await supabase
        .from("alert_logs")
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("id", alertId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
      toast({
        title: "Alert resolved",
        description: "The alert has been marked as resolved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to resolve alert",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// ==================================================================================
// MANUAL ALERT TRIGGER (for Testing)
// ==================================================================================

export async function triggerManualAlert(
  alertType: "critical" | "warning" | "info",
  message: string,
  details?: Record<string, any>
) {
  const { data, error } = await supabase.functions.invoke("alert-manager", {
    body: {
      alert_type: alertType,
      severity: alertType,
      message,
      details: details || {},
      source: "manual",
    },
  });

  if (error) throw error;
  return data;
}

// ==================================================================================
// ALERT STATISTICS
// ==================================================================================

export function useAlertStatistics(days: number = 7) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - days);

  return useQuery({
    queryKey: queryKeys.alerts.statistics(days),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alert_logs")
        .select("severity, created_at")
        .gte("created_at", sevenDaysAgo.toISOString());

      if (error) throw error;

      const stats = {
        total: data.length,
        critical: data.filter((a) => a.severity === "critical").length,
        warning: data.filter((a) => a.severity === "warning").length,
        info: data.filter((a) => a.severity === "info").length,
      };

      return stats;
    },
    refetchInterval: 60000, // Refresh every 60s
  });
}
