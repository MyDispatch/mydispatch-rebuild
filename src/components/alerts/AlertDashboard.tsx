// ==================================================================================
// ALERT-DASHBOARD V18.5.1
// ==================================================================================
// Purpose: Real-Time Alert Monitoring & Management
// ==================================================================================

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/lib/compat";
import { Badge } from "@/lib/compat";
import { V28Button } from "@/components/design-system/V28Button";
import { AlertCircle, CheckCircle, Clock, TrendingUp, Mail, AlertTriangle } from "lucide-react";
import { useLatestAlerts, useAlertHistory, useAlertStatistics, useResolveAlert } from "@/hooks/use-alert-system";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export function AlertDashboard() {
  const { data: latestAlerts, isLoading: loadingAlerts } = useLatestAlerts(10);
  const { data: alertHistory } = useAlertHistory(7);
  const { data: stats } = useAlertStatistics(7);
  const resolveAlert = useResolveAlert();

  const getSeverityColor = (severity: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "warning":
        return "outline"; // Warning uses outline variant
      default:
        return "secondary";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loadingAlerts) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-32 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Alert-System</h1>
        <p className="text-muted-foreground mt-2">
          Real-Time Überwachung aller System-Alerts
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gesamt (7 Tage)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-destructive">{stats?.critical || 0}</div>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-warning">{stats?.warning || 0}</div>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Info
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats?.info || 0}</div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Aktive Alerts</CardTitle>
          <CardDescription>
            Ungelöste Alerts (automatisch alle 30s aktualisiert)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {!latestAlerts || latestAlerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground">Alle Alerts gelöst!</p>
              <p className="text-muted-foreground mt-2">
                Es gibt aktuell keine aktiven Alerts im System.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {latestAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getSeverityIcon(alert.severity)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{alert.source}</Badge>
                        {alert.email_sent && (
                          <Badge variant="secondary" className="gap-1">
                            <Mail className="h-4 w-4" />
                            Gesendet
                          </Badge>
                        )}
                      </div>
                      <p className="font-semibold text-foreground">{alert.message}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(alert.created_at), "dd. MMM yyyy, HH:mm", { locale: de })} Uhr
                      </p>
                      {alert.details && Object.keys(alert.details).length > 0 && (
                        <details className="mt-2">
                          <summary className="text-sm text-primary cursor-pointer hover:underline">
                            Details anzeigen
                          </summary>
                          <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                            {JSON.stringify(alert.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                  <V28Button
                    size="sm"
                    variant="secondary"
                    onClick={() => resolveAlert.mutate(alert.id)}
                    disabled={resolveAlert.isPending}
                    className="ml-4 min-h-[44px]"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Resolved
                  </V28Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert History (Last 7 Days) */}
      <Card>
        <CardHeader>
          <CardTitle>Alert-Verlauf</CardTitle>
          <CardDescription>Alle Alerts der letzten 7 Tage</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {!alertHistory || alertHistory.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Keine Alerts in den letzten 7 Tagen</p>
          ) : (
            <div className="space-y-2">
              {alertHistory.slice(0, 20).map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between p-3 border border-border rounded-lg ${
                    alert.resolved ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={getSeverityColor(alert.severity)} className="min-w-[80px]">
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(alert.created_at), "dd. MMM yyyy, HH:mm", { locale: de })}
                      </p>
                    </div>
                  </div>
                  {alert.resolved && (
                    <Badge variant="secondary">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolved
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
