/* ==================================================================================
   Wiki Dashboard - NeXify Knowledge System Metrics & Health
   ==================================================================================
   Zeigt:
   - Total Docs, Critical Issues, Knowledge Graph Coverage
   - Recent Learnings Timeline
   - Component Registry Status
   - Best Practices Leaderboard
   - Wiki Load Performance
   - Auto-Sync Status
   ================================================================================== */

import { useEffect, useState } from "react";
import { useWiki } from "@/contexts/WikiContext";
import { SEOHead } from "@/components/shared/SEOHead";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { V28Button } from "@/components/design-system/V28Button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  AlertCircle,
  Link as LinkIcon,
  CheckCircle2,
  TrendingUp,
  Package,
  RefreshCw,
  Clock,
  Database,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { useToast } from "@/hooks/use-toast";

export default function WikiDashboard() {
  const { wikiData, isLoading, loadWiki } = useWiki();
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);
  const [graphBuilding, setGraphBuilding] = useState(false);

  const handleSyncWiki = async () => {
    setSyncing(true);
    try {
      await loadWiki();
      toast({
        title: "✅ Wiki aktualisiert",
        description: "Alle Dokumente wurden erfolgreich synchronisiert.",
      });
    } catch (error) {
      toast({
        title: "❌ Sync fehlgeschlagen",
        description: "Wiki konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleBuildGraph = async () => {
    setGraphBuilding(true);
    try {
      const { data, error } = await supabase.functions.invoke("wiki-knowledge-graph");

      if (error) throw error;

      toast({
        title: "✅ Knowledge Graph erstellt",
        description: `${data?.links_created || 0} Links zwischen ${data?.docs_processed || 0} Dokumenten erstellt.`,
      });

      // Reload wiki data
      await loadWiki();
    } catch (error) {
      logger.error("[Wiki Dashboard] Graph build failed", error as Error, {
        component: "WikiDashboard",
      });
      toast({
        title: "❌ Graph-Erstellung fehlgeschlagen",
        description: "Knowledge Graph konnte nicht erstellt werden.",
        variant: "destructive",
      });
    } finally {
      setGraphBuilding(false);
    }
  };

  if (isLoading && !wikiData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-400" />
          <p className="text-slate-600">NeXify Wiki wird geladen...</p>
        </div>
      </div>
    );
  }

  const criticalIssuesCount = wikiData?.criticalIssues?.length || 0;
  const graphCoverage = wikiData?.knowledgeGraphCoverage || 0;
  const totalDocs = wikiData?.totalDocs || 0;
  const loadTime = wikiData?.loadTime || 0;

  return (
    <>
      <SEOHead
        title="NeXify Wiki Dashboard"
        description="Knowledge System Metrics & Health Monitoring"
      />

      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🧠 NeXify Wiki Dashboard</h1>
            <p className="text-slate-600">Knowledge System Metrics & Performance Monitoring</p>
          </div>
          <div className="flex gap-3">
            <V28Button
              onClick={handleSyncWiki}
              disabled={syncing}
              variant="secondary"
              icon={RefreshCw}
              iconPosition="left"
              loading={syncing}
            >
              Sync Wiki
            </V28Button>
            <V28Button
              onClick={handleBuildGraph}
              disabled={graphBuilding}
              variant="primary"
              icon={LinkIcon}
              iconPosition="left"
              loading={graphBuilding}
            >
              Build Graph
            </V28Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Docs</CardTitle>
              <BookOpen className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{totalDocs}</div>
              <p className="text-xs text-slate-500 mt-1">In knowledge_base</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
              <AlertCircle
                className={`h-4 w-4 ${criticalIssuesCount > 0 ? "text-red-500" : "text-green-500"}`}
              />
            </CardHeader>
            <CardContent className="p-6">
              <div
                className={`text-2xl font-bold ${criticalIssuesCount > 0 ? "text-red-600" : "text-green-600"}`}
              >
                {criticalIssuesCount}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {criticalIssuesCount === 0 ? "✅ Zero-Hallucination" : "⚠️ Needs attention"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Graph Coverage</CardTitle>
              <LinkIcon className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{graphCoverage.toFixed(1)}%</div>
              <Progress value={graphCoverage} className="mt-2" />
              <p className="text-xs text-slate-500 mt-1">Target: 50%+</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Load Time</CardTitle>
              <Clock className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{loadTime}ms</div>
              <p className="text-xs text-slate-500 mt-1">
                {loadTime < 3000 ? "✅ Fast" : "⚠️ Slow"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="learnings" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="learnings">Recent Learnings</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="practices">Best Practices</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>

          <TabsContent value="learnings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Learnings</CardTitle>
                <CardDescription>Letzte 10 AI-Learnings aus Aktionen</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {wikiData?.recentLearnings && wikiData.recentLearnings.length > 0 ? (
                  <div className="space-y-4">
                    {wikiData.recentLearnings.map((learning: any, idx: number) => (
                      <div key={idx} className="border-l-4 border-slate-200 pl-4 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline">{learning.pattern_type}</Badge>
                          <span className="text-xs text-slate-500">
                            {new Date(learning.learned_at).toLocaleDateString("de-DE")}
                          </span>
                        </div>
                        <p className="text-sm">{learning.learnings}</p>
                        <div className="flex gap-2 mt-2">
                          {learning.patterns_used?.map((pattern: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {pattern}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">Keine Learnings vorhanden</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="components" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Component Registry</CardTitle>
                <CardDescription>
                  {wikiData?.knownComponents?.length || 0} verifizierte Components
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {wikiData?.knownComponents && wikiData.knownComponents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wikiData.knownComponents.map((comp: any, idx: number) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{comp.component_name}</h3>
                          <Badge variant="outline">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                        <code className="text-xs text-slate-600 block bg-slate-50 p-2 rounded">
                          {comp.file_path}
                        </code>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">Keine Components registriert</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Best Practices Leaderboard</CardTitle>
                <CardDescription>Top patterns nach Usage Count</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {wikiData?.bestPractices && wikiData.bestPractices.length > 0 ? (
                  <div className="space-y-3">
                    {wikiData.bestPractices.map((practice: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{practice.title}</h4>
                          <p className="text-xs text-slate-600 mt-1">{practice.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{practice.usage_count}</div>
                          <p className="text-xs text-slate-500">uses</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">Keine Best Practices vorhanden</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Critical Issues</CardTitle>
                <CardDescription>{criticalIssuesCount} ungelöste Critical Issues</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {wikiData?.criticalIssues && wikiData.criticalIssues.length > 0 ? (
                  <div className="space-y-4">
                    {wikiData.criticalIssues.map((issue: any, idx: number) => (
                      <div key={idx} className="border-l-4 border-red-500 pl-4 py-3 bg-red-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-red-900">{issue.issue_type}</h4>
                          <Badge variant="destructive">Critical</Badge>
                        </div>
                        <p className="text-sm text-red-800 mb-2">{issue.description}</p>
                        <div className="bg-white p-3 rounded mt-2">
                          <p className="text-xs font-medium mb-1">Solution:</p>
                          <p className="text-xs text-slate-600">{issue.solution}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-2" />
                    <p className="text-green-600 font-medium">✅ Zero Critical Issues!</p>
                    <p className="text-slate-500 text-sm mt-1">Zero-Hallucination Goal erreicht</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
