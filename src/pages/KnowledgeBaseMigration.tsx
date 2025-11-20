import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { V28Button } from "@/components/design-system/V28Button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useKnowledgeMigration } from "@/hooks/use-knowledge-migration";
import { useTavilySearch } from "@/hooks/use-tavily-search";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Database,
  FileCode,
  AlertCircle,
  Code2,
  CheckSquare,
  Activity,
} from "lucide-react";

export default function KnowledgeBaseMigration() {
  const {
    runFullMigration,
    migrateDocumentation,
    completeComponentRegistry,
    rebuildKnownIssues,
    expandCodeSnippets,
    runValidation,
    isRunning,
    progress,
    stats,
  } = useKnowledgeMigration();

  const { checkAPIHealth, isCheckingHealth, apiHealth } = useTavilySearch();

  useEffect(() => {
    // Initial API Health Check on mount
    checkAPIHealth();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-slate-600" />;
      case "running":
        return <Loader2 className="h-5 w-5 text-slate-600 animate-spin" />;
      case "error":
        return <XCircle className="h-5 w-5 text-slate-900" />;
      default:
        return <div className="h-5 w-5 bg-slate-200 rounded-full" />;
    }
  };

  const getPhaseIcon = (phase: string) => {
    if (phase.includes("Documentation")) return <Database className="h-5 w-5" />;
    if (phase.includes("Component")) return <FileCode className="h-5 w-5" />;
    if (phase.includes("Issues")) return <AlertCircle className="h-5 w-5" />;
    if (phase.includes("Snippets")) return <Code2 className="h-5 w-5" />;
    if (phase.includes("Validation")) return <CheckSquare className="h-5 w-5" />;
    return <Database className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">
            Knowledge-Base Migration V5.0 + Tavily
          </h1>
          <p className="text-slate-600 text-lg">
            Vollständige Migration mit Zero-Hallucination-Garantie durch Tavily-Integration
          </p>
        </div>

        {/* API Health Status Card */}
        <Card
          className={
            apiHealth?.overall_status === "healthy"
              ? "border-green-500"
              : apiHealth?.overall_status === "critical"
                ? "border-red-500"
                : "border-yellow-500"
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                API Health Status
              </div>
              <V28Button
                variant="secondary"
                size="sm"
                onClick={() => checkAPIHealth()}
                disabled={isCheckingHealth}
              >
                {isCheckingHealth ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
              </V28Button>
            </CardTitle>
            <CardDescription>Tavily Integration & Connection Manager</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {apiHealth ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Overall Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      apiHealth.overall_status === "healthy"
                        ? "bg-slate-100 text-slate-800"
                        : apiHealth.overall_status === "critical"
                          ? "bg-slate-200 text-slate-900"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {apiHealth.overall_status.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-2">
                  {apiHealth.apis.map((api: any) => (
                    <div
                      key={api.api_name}
                      className="flex items-center justify-between p-2 bg-slate-50 rounded"
                    >
                      <div>
                        <span className="font-medium text-sm">{api.api_name}</span>
                        {api.critical && (
                          <span className="ml-2 text-xs text-orange-600">(Critical)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-600">{api.response_time_ms}ms</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            api.status === "healthy"
                              ? "bg-slate-100 text-slate-800"
                              : api.status === "down"
                                ? "bg-slate-200 text-slate-900"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {api.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-600">
                {isCheckingHealth ? "Checking API health..." : "Click Refresh to check API health"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">Knowledge-Base</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-slate-900">{stats.knowledgeBaseEntries}</div>
              <p className="text-xs text-slate-500 mt-1">Entries added</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">Components</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-slate-900">{stats.componentsRegistered}</div>
              <p className="text-xs text-slate-500 mt-1">Registered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">Known Issues</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-slate-900">{stats.knownIssuesFixed}</div>
              <p className="text-xs text-slate-500 mt-1">Fixed with solutions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">Code Snippets</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-slate-900">{stats.codeSnippetsAdded}</div>
              <p className="text-xs text-slate-500 mt-1">Patterns added</p>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Migration Control</CardTitle>
            <CardDescription>
              Führe die vollständige Migration aus oder einzelne Phasen (mit Tavily-Integration)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <V28Button
                onClick={runFullMigration}
                disabled={isRunning}
                size="lg"
                variant="primary"
                className="bg-slate-900 hover:bg-slate-800"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Running Migration...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-5 w-5" />
                    Run Full Migration (Phase 0-5)
                  </>
                )}
              </V28Button>

              <V28Button onClick={migrateDocumentation} disabled={isRunning} variant="secondary">
                Phase 1: Docs
              </V28Button>

              <V28Button
                onClick={completeComponentRegistry}
                disabled={isRunning}
                variant="secondary"
              >
                Phase 2: Components
              </V28Button>

              <V28Button onClick={rebuildKnownIssues} disabled={isRunning} variant="secondary">
                Phase 3: Issues
              </V28Button>

              <V28Button onClick={expandCodeSnippets} disabled={isRunning} variant="secondary">
                Phase 4: Snippets
              </V28Button>

              <V28Button onClick={runValidation} disabled={isRunning} variant="secondary">
                Phase 5: Validation
              </V28Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Display */}
        {progress.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Migration Progress</CardTitle>
              <CardDescription>Live-Status aller Phasen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {progress.map((p, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getPhaseIcon(p.phase)}
                      <div>
                        <div className="font-medium text-slate-900">{p.phase}</div>
                        <div className="text-sm text-slate-600">{p.message}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          p.status === "completed"
                            ? "default"
                            : p.status === "error"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {p.status}
                      </Badge>
                      {getStatusIcon(p.status)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>
                        {p.current} / {p.total}
                      </span>
                      <span>{Math.round((p.current / p.total) * 100)}%</span>
                    </div>
                    <Progress value={(p.current / p.total) * 100} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="border-slate-200 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-slate-900">ℹ️ Migration Details (Tavily-Enhanced)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <p>
              <strong>Phase 0:</strong> Schema-Fix (✅ Completed - pattern_name + API tables added)
            </p>
            <p>
              <strong>Phase 1:</strong> 112 MD-Files → Knowledge-Base mit Tavily-Validation
              (Expected: +150-200 entries)
            </p>
            <p>
              <strong>Phase 2:</strong> Component-Scan → Component-Registry (Expected: 60+
              components)
            </p>
            <p>
              <strong>Phase 3:</strong> Known-Issues → Solutions via Tavily-Search (Expected: 22
              issues + best practices)
            </p>
            <p>
              <strong>Phase 4:</strong> Code-Snippets → Wiederverwendbare Patterns mit
              Tavily-Validator (Expected: +15-20 snippets)
            </p>
            <p>
              <strong>Phase 5:</strong> Final-Validation → Consistency-Check + API-Health (Expected:
              342+ total entries)
            </p>
            <div className="pt-4 mt-4 border-t border-slate-300">
              <p className="text-slate-600">
                <strong>Total Duration:</strong> ~90 Minuten (mit Tavily-Integration)
              </p>
              <p className="text-slate-600">
                <strong>Expected Result:</strong> Zero-Hallucination Knowledge-System mit
                Live-Best-Practices
              </p>
              <p className="text-slate-700 font-medium">
                <strong>NEW:</strong> Alle Einträge werden gegen Tavily Official Docs validiert! 🎯
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
