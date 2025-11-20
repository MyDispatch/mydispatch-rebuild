/* ==================================================================================
   SYSTEM-AUDIT WIDGET V18.5.13
   ================================================================================== 
   PHASE 0: Proaktiver System-Status
   - Code-Drift Score
   - ARCA-Fehler
   - Dependency Health
   - CI-Compliance
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { V28Button } from "@/components/design-system/V28Button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useSystemAudit } from "@/hooks/use-system-audit";
import { Activity, AlertTriangle, CheckCircle, RefreshCw, TrendingDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

export function SystemAuditWidget() {
  const { runAudit, loading, lastAudit } = useSystemAudit();

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-status-success";
    if (score >= 70) return "text-status-warning";
    return "text-status-error";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return CheckCircle;
    if (score >= 70) return AlertTriangle;
    return TrendingDown;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-foreground" />
            <span className="text-foreground">System-Audit (PHASE 0)</span>
          </CardTitle>
          <V28Button size="sm" variant="secondary" onClick={() => runAudit()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Audit starten
          </V28Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!lastAudit ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Noch kein Audit durchgeführt</p>
            <p className="text-xs mt-1">Starte das erste System-Audit</p>
          </div>
        ) : (
          <>
            {/* Letzte Prüfung */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Letzte Prüfung:</span>
              <span className="text-foreground font-medium">
                {formatDistanceToNow(new Date(lastAudit.timestamp), {
                  addSuffix: true,
                  locale: de,
                })}
              </span>
            </div>

            {/* Metriken */}
            <div className="space-y-3">
              {/* Code-Drift Score */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">Code-Drift Score</span>
                  <span
                    className={`text-sm font-bold ${getScoreColor(lastAudit.metrics.codeDriftScore)}`}
                  >
                    {lastAudit.metrics.codeDriftScore}%
                  </span>
                </div>
                <Progress value={lastAudit.metrics.codeDriftScore} className="h-2" />
              </div>

              {/* ARCA-Fehler */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-status-warning" />
                  <span className="text-sm font-medium text-foreground">ARCA-Pattern</span>
                </div>
                <Badge variant={lastAudit.metrics.arcaErrorCount > 0 ? "destructive" : "outline"}>
                  {lastAudit.metrics.arcaErrorCount} Fehler
                </Badge>
              </div>

              {/* Dependency Health */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">Dependency Health</span>
                  <span
                    className={`text-sm font-bold ${getScoreColor(lastAudit.metrics.dependencyHealth)}`}
                  >
                    {lastAudit.metrics.dependencyHealth}%
                  </span>
                </div>
                <Progress value={lastAudit.metrics.dependencyHealth} className="h-2" />
              </div>

              {/* CI-Compliance */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">CI-Compliance</span>
                  <span
                    className={`text-sm font-bold ${getScoreColor(lastAudit.metrics.ciCompliance)}`}
                  >
                    {lastAudit.metrics.ciCompliance}%
                  </span>
                </div>
                <Progress value={lastAudit.metrics.ciCompliance} className="h-2" />
              </div>
            </div>

            {/* Issues */}
            {lastAudit.issues.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">Erkannte Issues:</p>
                {lastAudit.issues.slice(0, 3).map((issue, index) => {
                  const Icon = getScoreIcon(
                    issue.severity === "critical" ? 0 : issue.severity === "warning" ? 75 : 95
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 bg-muted/20 rounded text-xs"
                    >
                      <Icon
                        className={`h-3 w-3 mt-0.5 ${
                          issue.severity === "critical"
                            ? "text-status-error"
                            : issue.severity === "warning"
                              ? "text-status-warning"
                              : "text-status-info"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-foreground">{issue.message}</p>
                        {issue.autoFixable && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Auto-Fix verfügbar
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empfehlungen */}
            {lastAudit.recommendations.length > 0 && (
              <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs font-medium text-primary mb-2">Empfehlungen:</p>
                <ul className="space-y-1">
                  {lastAudit.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="text-xs text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary mt-0.5">→</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
