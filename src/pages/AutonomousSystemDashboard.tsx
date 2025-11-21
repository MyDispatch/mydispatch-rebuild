// ==================================================================================
// AUTONOMOUS SYSTEM DASHBOARD V1.0
// ==================================================================================
// Purpose: Monitor and control autonomous development system
// Route: /master/autonomous (Master account only)
// ==================================================================================

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAutonomousSystem } from "@/hooks/use-autonomous-system";
import { Activity, AlertTriangle, CheckCircle2, Clock, Play, XCircle, Zap } from "lucide-react";
import { useState } from "react";

export default function AutonomousSystemDashboard() {
  const {
    config,
    tasks,
    executionLogs,
    stats,
    health,
    isLoading,
    error,
    triggerPoll,
    updateConfig,
    emergencyStop,
    isTriggering,
  } = useAutonomousSystem();

  const [showLogs, setShowLogs] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Lade Autonomous System Status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Fehler beim Laden
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const getHealthBadge = () => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      healthy: { variant: "default", icon: CheckCircle2, label: "Gesund" },
      active: { variant: "default", icon: Activity, label: "Aktiv" },
      idle: { variant: "secondary", icon: Clock, label: "Bereit" },
      warning: { variant: "warning", icon: AlertTriangle, label: "Warnung" },
      critical: { variant: "destructive", icon: XCircle, label: "Kritisch" },
      stopped: { variant: "destructive", icon: XCircle, label: "Gestoppt" },
      disabled: { variant: "secondary", icon: XCircle, label: "Deaktiviert" },
      unknown: { variant: "secondary", icon: AlertTriangle, label: "Unbekannt" },
    };

    const { variant, icon: Icon, label } = variants[health] || variants.unknown;

    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const getTaskStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: "secondary",
      in_progress: "default",
      completed: "default",
      failed: "destructive",
      awaiting_review: "warning",
      cancelled: "secondary",
    };

    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Autonomous System</h1>
          <p className="text-muted-foreground">
            Überwache und steuere das autonome Entwicklungssystem
          </p>
        </div>
        {getHealthBadge()}
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Gesamt Tasks</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stats?.total_tasks || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Ausstehend</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-warning">
              {stats?.pending_tasks || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Abgeschlossen</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-success">
              {stats?.completed_tasks || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Fehlgeschlagen</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-error">
              {stats?.failed_tasks || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            System-Konfiguration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Status</p>
              <Badge variant={config?.enabled ? "default" : "secondary"}>
                {config?.enabled ? "Aktiviert" : "Deaktiviert"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Modus</p>
              <Badge variant={config?.dry_run_mode ? "secondary" : "default"}>
                {config?.dry_run_mode ? "Dry-Run" : "Produktion"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Autonomie-Level</p>
              <Badge>{config?.autonomy_level || 0}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Max. Parallele Tasks</p>
              <Badge>{config?.max_parallel_tasks || 0}</Badge>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => triggerPoll()}
              disabled={!config?.enabled || isTriggering}
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              {isTriggering ? "Wird ausgeführt..." : "Manuell ausführen"}
            </Button>

            {config?.dry_run_mode && (
              <Button
                onClick={() => updateConfig({ dry_run_mode: false })}
                variant="outline"
                size="sm"
              >
                Produktions-Modus aktivieren
              </Button>
            )}

            {!config?.emergency_stop && (
              <Button
                onClick={() => emergencyStop({ reason: "Manueller Stop", hours: 1 })}
                variant="destructive"
                size="sm"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Emergency Stop
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Aktuelle Tasks</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Keine Tasks vorhanden
            </p>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 10).map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{task.task_type}</Badge>
                      {getTaskStatusBadge(task.status)}
                      <span className="text-xs text-muted-foreground">
                        Priorität: {task.priority}
                      </span>
                    </div>
                    <p className="text-sm">{task.description}</p>
                    {task.error_message && (
                      <p className="text-xs text-destructive mt-1">
                        Fehler: {task.error_message}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {new Date(task.created_at).toLocaleString("de-DE")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Execution Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ausführungs-Logs</CardTitle>
            <Button
              onClick={() => setShowLogs(!showLogs)}
              variant="ghost"
              size="sm"
            >
              {showLogs ? "Ausblenden" : "Anzeigen"}
            </Button>
          </div>
        </CardHeader>
        {showLogs && (
          <CardContent className="p-6">
            {executionLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Keine Logs vorhanden
              </p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {executionLogs.slice(0, 20).map((log) => (
                  <div
                    key={log.id}
                    className="text-xs p-2 bg-muted rounded font-mono"
                  >
                    <span className="text-muted-foreground">
                      {new Date(log.created_at).toLocaleTimeString("de-DE")}
                    </span>
                    {" | "}
                    <span className="font-semibold">{log.execution_step}</span>
                    {" | "}
                    <Badge variant="outline" className="text-xs">
                      {log.step_status}
                    </Badge>
                    {log.error_details && (
                      <div className="text-destructive mt-1">
                        {JSON.stringify(log.error_details)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
