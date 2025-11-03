// ==================================================================================
// AGENT HEALTH DASHBOARD V18.5.1
// ==================================================================================
// Purpose: Real-Time Agent Health Metrics Dashboard (NeXify, Watchdog-AI, Docs-Agent)
// ==================================================================================

import { Card, CardContent, CardHeader, CardTitle } from "@/lib/compat";
import { Badge } from "@/lib/compat";
import { V28Button } from "@/components/design-system/V28Button";
import { useAgentHealth, triggerHeartbeat } from "@/hooks/use-agent-health";
import { Activity, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { logger } from "@/lib/logger";

export const AgentHealthDashboard = () => {
  const { latestHeartbeat, heartbeatHistory, agentStatus, uptime7d, uptime30d, isLoading } = useAgentHealth();

  const handleManualHeartbeat = async () => {
    try {
      toast.loading("Heartbeat wird gesendet...");
      await triggerHeartbeat();
      toast.success("Heartbeat erfolgreich gesendet!");
    } catch (error) {
      logger.error("[AGENT-HEALTH] Heartbeat failed", error instanceof Error ? error : undefined, { component: 'AgentHealthDashboard' });
      toast.error("Heartbeat fehlgeschlagen");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Prepare chart data
  const chartData = heartbeatHistory?.map((h) => ({
    time: format(new Date(h.timestamp), "HH:mm", { locale: de }),
    uptime: h.uptime_percentage,
    responseTime: h.avg_response_time_ms,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Health Monitor</h2>
          <p className="text-sm text-muted-foreground">
            Echtzeit-Überwachung aller KI-Agenten (NeXify, Watchdog-AI, Docs-Agent)
          </p>
        </div>
        <V28Button onClick={handleManualHeartbeat} variant="secondary" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Heartbeat senden
        </V28Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt-Status</CardTitle>
            {latestHeartbeat?.all_agents_healthy ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestHeartbeat?.all_agents_healthy ? "Gesund" : "Probleme"}
            </div>
            <p className="text-xs text-muted-foreground">
              {latestHeartbeat?.critical_issues || 0} Critical, {latestHeartbeat?.warnings || 0} Warnings
            </p>
          </CardContent>
        </Card>

        {/* Uptime */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestHeartbeat?.uptime_percentage.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              7d: {uptime7d?.toFixed(2)}% | 30d: {uptime30d?.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ø Response Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestHeartbeat?.avg_response_time_ms}ms</div>
            <p className="text-xs text-muted-foreground">Durchschnitt (24h)</p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Status */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentStatus?.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{agent.agent_name}</p>
                  <p className="text-sm text-muted-foreground">Version {agent.version}</p>
                </div>
                <Badge variant={agent.status === "idle" ? "secondary" : agent.status === "working" ? "default" : "destructive"}>
                  {agent.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Uptime Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Uptime-Verlauf (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="uptime" stroke="hsl(var(--primary))" strokeWidth={2} name="Uptime %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Response Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Response Time Verlauf (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="responseTime" stroke="hsl(var(--primary))" strokeWidth={2} name="Response Time (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
