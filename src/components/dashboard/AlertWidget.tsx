/* ==================================================================================
   ALERT-WIDGET V18.5.1 - System-Alert-Übersicht für Master-Dashboard
   ==================================================================================
   - Kompaktes Widget für rechte Spalte (lg:col-span-4)
   - Zeigt Stats (Critical/Warning/Info) + Latest 5 Alerts
   - Auto-Refresh alle 30s via React Query
   - Integration-First: Nutzt bestehende Hooks (use-alert-system.ts)
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from "@/lib/compat";
import { Badge } from "@/lib/compat";
import { useLatestAlerts, useAlertStatistics } from "@/hooks/use-alert-system";
import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

export function AlertWidget() {
  const { data: stats, isLoading: statsLoading } = useAlertStatistics(7);
  const { data: alerts, isLoading: alertsLoading } = useLatestAlerts(5);

  const isLoading = statsLoading || alertsLoading;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          System-Alerts
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Stats-Übersicht */}
        {isLoading ? (
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <StatBadge
              label="Critical"
              value={stats?.critical || 0}
              icon={AlertCircle}
              variant="destructive"
            />
            <StatBadge
              label="Warning"
              value={stats?.warning || 0}
              icon={AlertTriangle}
              variant="warning"
            />
            <StatBadge label="Info" value={stats?.info || 0} icon={Info} variant="default" />
          </div>
        )}

        {/* Latest Alerts */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Letzte Alerts
          </h4>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded-md" />
              ))}
            </div>
          ) : alerts && alerts.length > 0 ? (
            <div className="space-y-2">
              {alerts.slice(0, 5).map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Keine aktiven Alerts</p>
              <p className="text-xs text-muted-foreground">System läuft stabil</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ==================================================================================
   STAT-BADGE - Statistik-Badge für Alert-Counts
   ================================================================================== */

interface StatBadgeProps {
  label: string;
  value: number;
  icon: React.ElementType;
  variant: "destructive" | "warning" | "default";
}

function StatBadge({ label, value, icon: Icon, variant }: StatBadgeProps) {
  const variantStyles = {
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
    warning: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border-yellow-500/20",
    default: "bg-primary/10 text-primary border-primary/20",
  };

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        p-2 sm:p-3 rounded-lg border
        ${variantStyles[variant]}
      `}
    >
      <Icon className="h-3 w-3 sm:h-4 sm:w-4 mb-1" />
      <p className="text-lg sm:text-xl font-bold">{value}</p>
      <p className="text-[10px] sm:text-xs font-medium">{label}</p>
    </div>
  );
}

/* ==================================================================================
   ALERT-ITEM - Einzelner Alert (kompakt)
   ================================================================================== */

interface AlertItemProps {
  alert: {
    id: string;
    severity: "critical" | "warning" | "info";
    message: string;
    source: string;
    created_at: string;
    resolved_at?: string | null;
  };
}

function AlertItem({ alert }: AlertItemProps) {
  const severityConfig = {
    critical: {
      icon: AlertCircle,
      variant: "destructive" as const,
      bgColor: "bg-destructive/10",
    },
    warning: {
      icon: AlertTriangle,
      variant: "secondary" as const,
      bgColor: "bg-yellow-500/10",
    },
    info: {
      icon: Info,
      variant: "outline" as const,
      bgColor: "bg-primary/10",
    },
  };

  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  // Nachricht auf 50 Zeichen kürzen
  const truncatedMessage =
    alert.message.length > 50 ? `${alert.message.substring(0, 50)}...` : alert.message;

  return (
    <div
      className={`
        flex items-start gap-2 p-2 rounded-md
        ${config.bgColor}
        ${alert.resolved_at ? "opacity-50" : ""}
      `}
    >
      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">{truncatedMessage}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant={config.variant} className="text-[10px] px-1.5 py-0">
            {alert.severity}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(new Date(alert.created_at), {
              addSuffix: true,
              locale: de,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
