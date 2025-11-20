/* ==================================================================================
   ERROR MONITOR - REAL-TIME ERROR DASHBOARD
   ==================================================================================
   Zentrale Kontrollstelle für Admins zur Überwachung aller System-Fehler
   ================================================================================== */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { V28Button } from "@/components/design-system/V28Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  MessageSquare,
  CheckCircle2,
  TrendingUp,
  Clock,
} from "lucide-react";
import { getErrorStats, type TrackedError } from "@/lib/error-tracker";
import { sendErrorToChat } from "@/lib/error-to-chat-pipeline";
import { logDebug } from "@/lib/logger";
import { handleSuccess, handleError } from "@/lib/error-handler";

const ErrorMonitor = () => {
  const [stats, setStats] = useState(getErrorStats());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setStats(getErrorStats());
      logDebug("[ErrorMonitor] Stats refreshed", { totalErrors: stats.totalErrors });
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, stats.totalErrors]);

  const handleRefresh = () => {
    setStats(getErrorStats());
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, "destructive" | "secondary" | "outline" | "default"> = {
      critical: "destructive",
      high: "destructive",
      medium: "secondary",
      low: "outline",
    };
    return variants[severity] || "default";
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      runtime: AlertCircle,
      api: TrendingUp,
      network: RefreshCw,
      user: Info,
      system: Clock,
    };
    return icons[category] || AlertCircle;
  };

  const handleSendToChat = async (error: TrackedError) => {
    try {
      const success = await sendErrorToChat(error);
      if (success) {
        handleSuccess("Fehler-Bericht in Zwischenablage kopiert. Fügen Sie ihn im Chat ein.");
      } else {
        handleError(new Error("Failed"), "Fehler-Bericht konnte nicht erstellt werden");
      }
    } catch (err) {
      handleError(err, "Fehler beim Senden an Chat");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Error Monitor</h1>
        <p className="text-muted-foreground">Echtzeit-Überwachung aller System-Fehler</p>
      </div>
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant={stats.totalErrors === 0 ? "outline" : "destructive"}>
              {stats.totalErrors} Fehler
            </Badge>
            {stats.totalErrors > 0 && (
              <V28Button variant="secondary" size="sm" onClick={handleRefresh} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Aktualisieren
              </V28Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <V28Button
              variant={autoRefresh ? "primary" : "secondary"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              ) : (
                <Clock className="h-4 w-4 mr-2" />
              )}
              Auto-Refresh {autoRefresh ? "An" : "Aus"}
            </V28Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                Kritisch
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-2xl font-bold">{stats.bySeverity.critical}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Hoch
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-2xl font-bold">{stats.bySeverity.high}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                Mittel
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-2xl font-bold">{stats.bySeverity.medium}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                Niedrig
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-2xl font-bold">{stats.bySeverity.low}</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Fehler nach Kategorie</CardTitle>
            <CardDescription>Verteilung der Fehler nach Typ</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(stats.byCategory).map(([category, count]) => {
                const IconComponent = getCategoryIcon(category);
                return (
                  <div key={category} className="flex flex-col items-center p-4 border rounded-lg">
                    <IconComponent className="h-5 w-5 mb-2 text-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">
                      {category.toUpperCase()}
                    </p>
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Error List */}
        <Card>
          <CardHeader>
            <CardTitle>Aktuelle Fehler</CardTitle>
            <CardDescription>Letzte 50 Fehler, neueste zuerst</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Alle ({stats.totalErrors})</TabsTrigger>
                <TabsTrigger value="critical">Kritisch ({stats.bySeverity.critical})</TabsTrigger>
                <TabsTrigger value="high">Hoch ({stats.bySeverity.high})</TabsTrigger>
                <TabsTrigger value="medium">Mittel ({stats.bySeverity.medium})</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <ErrorList errors={stats.recentErrors} onSendToChat={handleSendToChat} />
              </TabsContent>

              <TabsContent value="critical">
                <ErrorList
                  errors={stats.recentErrors.filter((e) => e.severity === "critical")}
                  onSendToChat={handleSendToChat}
                />
              </TabsContent>

              <TabsContent value="high">
                <ErrorList
                  errors={stats.recentErrors.filter((e) => e.severity === "high")}
                  onSendToChat={handleSendToChat}
                />
              </TabsContent>

              <TabsContent value="medium">
                <ErrorList
                  errors={stats.recentErrors.filter((e) => e.severity === "medium")}
                  onSendToChat={handleSendToChat}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface ErrorListProps {
  errors: TrackedError[];
  onSendToChat?: (error: TrackedError) => void;
}

const ErrorList = ({ errors, onSendToChat }: ErrorListProps) => {
  if (errors.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-success" />
        <p>Keine Fehler gefunden</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-3">
        {errors.map((error, index) => (
          <Card
            key={index}
            className="border-l-4"
            style={{
              borderLeftColor:
                error.severity === "critical"
                  ? "hsl(var(--destructive))"
                  : error.severity === "high"
                    ? "hsl(var(--warning))"
                    : "hsl(var(--muted-foreground))",
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        error.severity === "critical" || error.severity === "high"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {error.category}
                    </Badge>
                    <Badge variant="outline">{error.severity}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(error.timestamp).toLocaleString("de-DE")}
                    </span>
                  </div>

                  <p className="font-semibold text-sm">{error.message}</p>

                  {error.context?.component && (
                    <p className="text-xs text-muted-foreground">
                      Component: {error.context.component}
                    </p>
                  )}

                  {error.stack && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        Stack Trace
                      </summary>
                      <pre className="mt-2 p-2 bg-muted rounded overflow-x-auto">
                        {error.stack.substring(0, 500)}...
                      </pre>
                    </details>
                  )}
                </div>

                {onSendToChat && (
                  <V28Button
                    size="sm"
                    variant="secondary"
                    className="gap-2 shrink-0"
                    onClick={() => onSendToChat(error)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    An Chat senden
                  </V28Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ErrorMonitor;
