// ==================================================================================
// PERFORMANCE MONITORING WIDGET V18.5.1
// ==================================================================================
// Purpose: Real-Time Performance Metrics Display
// Data Source: monitoring_logs, agent_status, heartbeat_history (via use-agent-health)
// ==================================================================================

import { Card, CardContent, CardHeader, CardTitle } from "@/lib/compat";
import { Activity, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";
import { V28Button } from "@/components/design-system/V28Button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAgentHealth } from "@/hooks/use-agent-health";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function PerformanceMonitoringWidget() {
  const navigate = useNavigate();
  const { latestHeartbeat, heartbeatHistory, uptime7d, uptime30d, isLoading } = useAgentHealth();

  // Calculate Performance Metrics
  const avgResponseTime = latestHeartbeat?.avg_response_time_ms || 0;
  const currentUptime = latestHeartbeat?.uptime_percentage || 0;
  const criticalIssues = latestHeartbeat?.critical_issues || 0;
  const warnings = latestHeartbeat?.warnings || 0;
  const allHealthy = latestHeartbeat?.all_agents_healthy ?? true;

  // Chart Data (Last 10 data points for compact view)
  const chartData = (heartbeatHistory || []).slice(-10).map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    responseTime: item.avg_response_time_ms || 0,
    uptime: item.uptime_percentage || 0,
  }));

  // Calculate Trends
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const previousResponseTime = chartData[chartData.length - 2]?.responseTime || avgResponseTime;
  const responseTimeTrend = calculateTrend(avgResponseTime, previousResponseTime);

  const metrics = [
    {
      label: "Response Time",
      value: `${avgResponseTime.toFixed(0)}ms`,
      trend: responseTimeTrend,
      status: avgResponseTime < 500 ? "success" : avgResponseTime < 1000 ? "warning" : "error",
      subLabel: "Durchschnitt",
    },
    {
      label: "Uptime (7d)",
      value: `${(uptime7d || currentUptime).toFixed(1)}%`,
      trend: 0,
      status:
        (uptime7d || currentUptime) > 99
          ? "success"
          : (uptime7d || currentUptime) > 95
            ? "warning"
            : "error",
      subLabel: "Letzte 7 Tage",
    },
    {
      label: "Uptime (30d)",
      value: `${(uptime30d || currentUptime).toFixed(1)}%`,
      trend: 0,
      status:
        (uptime30d || currentUptime) > 99
          ? "success"
          : (uptime30d || currentUptime) > 95
            ? "warning"
            : "error",
      subLabel: "Letzte 30 Tage",
    },
  ];

  if (isLoading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-foreground" />
            Performance Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex items-center justify-center h-40">
            <p className="text-sm text-muted-foreground">Lade Daten...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-foreground" />
            Performance Monitoring
          </CardTitle>
          <V28Button
            variant="secondary"
            size="sm"
            className="h-6 text-[11px] hover:bg-muted px-2"
            onClick={() => navigate("/admin/monitoring")}
          >
            Details →
          </V28Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-3">
        {/* System Health Status */}
        <div
          className={cn(
            "flex items-center justify-between p-2 rounded-lg border",
            allHealthy
              ? "bg-status-success/5 border-status-success/20"
              : "bg-status-error/5 border-status-error/20"
          )}
        >
          <div className="flex items-center gap-2">
            {allHealthy ? (
              <CheckCircle className="h-4 w-4 text-foreground" />
            ) : (
              <AlertCircle className="h-4 w-4 text-foreground" />
            )}
            <span className="text-xs font-medium text-foreground">
              {allHealthy ? "Alle Systeme OK" : "Systemprobleme erkannt"}
            </span>
          </div>
          {(criticalIssues > 0 || warnings > 0) && (
            <div className="flex items-center gap-2 text-[10px]">
              {criticalIssues > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-status-error/10 text-status-error font-semibold">
                  {criticalIssues} Kritisch
                </span>
              )}
              {warnings > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-status-warning/10 text-status-warning font-semibold">
                  {warnings} Warnungen
                </span>
              )}
            </div>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="space-y-1.5">
          {metrics.map((metric, index) => (
            <div key={index} className="p-2 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">
                  {metric.label}
                </span>
                {metric.trend !== 0 && (
                  <div
                    className={cn(
                      "flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-semibold",
                      metric.trend < 0 // For response time, lower is better
                        ? "bg-status-success/10 text-status-success"
                        : "bg-status-error/10 text-status-error"
                    )}
                  >
                    {metric.trend < 0 ? (
                      <TrendingDown className="h-2.5 w-2.5" />
                    ) : (
                      <TrendingUp className="h-2.5 w-2.5" />
                    )}
                    {Math.abs(metric.trend)}%
                  </div>
                )}
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-base font-bold text-foreground">{metric.value}</p>
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    metric.status === "success" && "bg-status-success",
                    metric.status === "warning" && "bg-status-warning",
                    metric.status === "error" && "bg-status-error"
                  )}
                />
              </div>
              <p className="text-[9px] text-muted-foreground mt-0.5">{metric.subLabel}</p>
            </div>
          ))}
        </div>

        {/* Performance Chart */}
        {chartData.length > 0 && (
          <div className="pt-2">
            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Response Time Trend
            </p>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={chartData}>
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 9 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 9 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                  axisLine={false}
                  width={35}
                  unit="ms"
                />
                <Tooltip
                  wrapperClassName="recharts-tooltip--dashboard"
                  formatter={(value: number) => [`${value.toFixed(0)}ms`, "Response Time"]}
                />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
