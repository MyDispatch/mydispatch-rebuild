/* ==================================================================================
   OPTIMIZATION TRACKER V18.3.24 - MASTER DASHBOARD COMPONENT
   ==================================================================================
   ✅ Zwei-Spalten-Layout: Offene / Abgeschlossene Optimierungen
   ✅ Kopierfunktion für Prompts
   ✅ Automatische Verschiebung bei Erledigung
   ✅ Prioritäts-Sortierung
   ✅ Filter nach Kategorie/Severity
   ================================================================================== */

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { V28Button } from "@/components/design-system/V28Button";
import { Copy, CheckCircle2, AlertCircle, Clock, TrendingUp, Filter, Search } from "lucide-react";
import { Input } from "@/lib/compat";
import { toast } from "sonner";
import type { OptimizationIssue } from "@/lib/auto-optimization/system-scanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/compat";

interface OptimizationTrackerProps {
  issues: OptimizationIssue[];
  onMarkAsFixed: (issueId: string) => void;
}

export function OptimizationTracker({ issues, onMarkAsFixed }: OptimizationTrackerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Split issues into open and completed
  const openIssues = useMemo(
    () => issues.filter((i) => !i.fixedAt).sort((a, b) => b.priority - a.priority),
    [issues]
  );

  const completedIssues = useMemo(
    () =>
      issues
        .filter((i) => i.fixedAt)
        .sort((a, b) => new Date(b.fixedAt!).getTime() - new Date(a.fixedAt!).getTime()),
    [issues]
  );

  // Filter issues
  const filterIssues = (issueList: OptimizationIssue[]) => {
    return issueList.filter((issue) => {
      const matchesSearch =
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeverity = filterSeverity === "all" || issue.severity === filterSeverity;
      const matchesCategory = filterCategory === "all" || issue.category === filterCategory;

      return matchesSearch && matchesSeverity && matchesCategory;
    });
  };

  const filteredOpenIssues = filterIssues(openIssues);
  const filteredCompletedIssues = filterIssues(completedIssues);

  const copyPrompt = (prompt: string, title: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt kopiert!", {
      description: `"${title}" in Zwischenablage kopiert`,
    });
  };

  const getSeverityColor = (severity: OptimizationIssue["severity"]) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
    }
  };

  const getCategoryIcon = (category: OptimizationIssue["category"]) => {
    switch (category) {
      case "error":
        return "🔴";
      case "security":
        return "🔒";
      case "performance":
        return "⚡";
      case "accessibility":
        return "♿";
      case "code-quality":
        return "📝";
      case "design":
        return "🎨";
    }
  };

  const renderIssueCard = (issue: OptimizationIssue, isCompleted: boolean) => (
    <Card key={issue.id} className={isCompleted ? "opacity-60" : ""}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg">{getCategoryIcon(issue.category)}</span>
              <Badge variant={getSeverityColor(issue.severity)} className="text-xs">
                {issue.severity}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Priorität: {issue.priority}/10
              </Badge>
              {issue.autoFixable && (
                <Badge variant="outline" className="text-xs bg-green-50">
                  Auto-Fixable
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {issue.estimatedEffort === "quick"
                  ? "⚡ Quick"
                  : issue.estimatedEffort === "medium"
                    ? "⏱️ Medium"
                    : "🕐 Large"}
              </Badge>
            </div>

            {/* Title & Description */}
            <div>
              <h4 className="font-semibold text-foreground">{issue.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
            </div>

            {/* Affected Files */}
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Betroffene Dateien:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {issue.affectedFiles.map((file, i) => (
                  <code key={i} className="px-2 py-1 bg-muted rounded text-xs">
                    {file}
                  </code>
                ))}
              </div>
            </div>

            {/* Timestamps */}
            <div className="text-xs text-muted-foreground flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Erkannt: {new Date(issue.detectedAt).toLocaleDateString("de-DE")}
              </span>
              {issue.fixedAt && (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Behoben: {new Date(issue.fixedAt).toLocaleDateString("de-DE")}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 shrink-0">
            <V28Button
              size="sm"
              variant="secondary"
              onClick={() => copyPrompt(issue.copyablePrompt, issue.title)}
            >
              <Copy className="h-4 w-4 mr-2 text-foreground" />
              Kopieren
            </V28Button>

            {!isCompleted && (
              <V28Button size="sm" variant="primary" onClick={() => onMarkAsFixed(issue.id)}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Erledigt
              </V28Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offen</p>
                <p className="text-2xl font-bold text-foreground">{openIssues.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kritisch</p>
                <p className="text-2xl font-bold text-status-error">
                  {openIssues.filter((i) => i.severity === "critical").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-status-error" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Abgeschlossen</p>
                <p className="text-2xl font-bold text-green-600">{completedIssues.length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Erfolgsquote</p>
                <p className="text-2xl font-bold text-foreground">
                  {issues.length > 0
                    ? Math.round((completedIssues.length / issues.length) * 100)
                    : 0}
                  %
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach Titel oder Beschreibung..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Severity filtern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Severities</SelectItem>
                <SelectItem value="critical">Kritisch</SelectItem>
                <SelectItem value="high">Hoch</SelectItem>
                <SelectItem value="medium">Mittel</SelectItem>
                <SelectItem value="low">Niedrig</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Kategorie filtern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                <SelectItem value="error">Fehler</SelectItem>
                <SelectItem value="security">Sicherheit</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="accessibility">Accessibility</SelectItem>
                <SelectItem value="code-quality">Code-Qualität</SelectItem>
                <SelectItem value="design">Design</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Issues Tabs */}
      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="open" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-foreground" />
            Offene Optimierungen ({filteredOpenIssues.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-foreground" />
            Abgeschlossene ({filteredCompletedIssues.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4 mt-6">
          {filteredOpenIssues.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-3" />
                <p className="text-muted-foreground">Keine offenen Optimierungen gefunden! 🎉</p>
              </CardContent>
            </Card>
          ) : (
            filteredOpenIssues.map((issue) => renderIssueCard(issue, false))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {filteredCompletedIssues.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Noch keine abgeschlossenen Optimierungen</p>
              </CardContent>
            </Card>
          ) : (
            filteredCompletedIssues.map((issue) => renderIssueCard(issue, true))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
