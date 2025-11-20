/**
 * CODE-CHECKER TRIGGER COMPONENT V1.0
 *
 * Simpler Trigger für Claude 4.5 Code-Reviews.
 * Kann in Dashboard oder andere Pages integriert werden.
 */

import { useState } from "react";
import { V28Button } from "@/components/design-system/V28Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/compat";
import { Badge } from "@/lib/compat";
import { Textarea } from "@/lib/compat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCode,
  Database,
  GitBranch,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";

type ReportType = "code" | "database" | "git" | "full";

interface CheckerResult {
  success: boolean;
  reportId?: string;
  issuesFound?: number;
  summary?: string;
  data?: {
    issues: Array<{
      type: string;
      severity: string;
      file: string;
      line: number;
      description: string;
      fix: string;
    }>;
    fixes: Array<{
      issue_id: number;
      suggested_code: string;
      confidence: number;
    }>;
  };
}

export function CodeCheckerTrigger({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckerResult | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [selectedType, setSelectedType] = useState<ReportType>("code");

  const runCheck = async () => {
    if (!codeInput.trim() && selectedType === "code") {
      toast.error("Bitte Code eingeben");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("code-checker", {
        body: {
          reportType: selectedType,
          code: selectedType === "code" ? codeInput : undefined,
          context: selectedType !== "code" ? codeInput : undefined,
        },
      });

      if (error) throw error;

      setResult(data);

      if (data.success) {
        toast.success(
          data.issuesFound > 0
            ? `✅ Check abgeschlossen: ${data.issuesFound} Issues gefunden`
            : "✅ Keine Probleme gefunden!"
        );
      } else {
        toast.error("Check fehlgeschlagen");
      }
    } catch (err: any) {
      logger.error("Check error", err, { component: "CodeCheckerTrigger", action: "runCheck" });
      toast.error(`Fehler: ${err.message}`);
      setResult({ success: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Claude 4.5 Code Checker</CardTitle>
        </div>
        <CardDescription>Automatische Code/DB-Reviews mit Claude Sonnet 4.5</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Type Selection */}
        <div className="flex flex-wrap gap-2">
          <V28Button
            size="sm"
            variant={selectedType === "code" ? "primary" : "secondary"}
            onClick={() => setSelectedType("code")}
            className="h-8"
          >
            <FileCode className="h-3 w-3 mr-1.5" />
            Code Review
          </V28Button>
          <V28Button
            size="sm"
            variant={selectedType === "database" ? "primary" : "secondary"}
            onClick={() => setSelectedType("database")}
            className="h-8"
          >
            <Database className="h-3 w-3 mr-1.5" />
            DB Analyse
          </V28Button>
          <V28Button
            size="sm"
            variant={selectedType === "git" ? "primary" : "secondary"}
            onClick={() => setSelectedType("git")}
            className="h-8"
          >
            <GitBranch className="h-3 w-3 mr-1.5" />
            Git Check
          </V28Button>
          <V28Button
            size="sm"
            variant={selectedType === "full" ? "primary" : "secondary"}
            onClick={() => setSelectedType("full")}
            className="h-8"
          >
            <Sparkles className="h-3 w-3 mr-1.5" />
            Full Check
          </V28Button>
        </div>

        {/* Input */}
        <Textarea
          placeholder={
            selectedType === "code"
              ? "Code-Snippet hier einfügen..."
              : selectedType === "database"
                ? "DB-Query oder Schema hier einfügen..."
                : "Kontext/Beschreibung hier eingeben..."
          }
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          rows={8}
          className="font-mono text-xs"
        />

        {/* Trigger Button */}
        <V28Button onClick={runCheck} disabled={loading} className="w-full h-10">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Prüfung läuft...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Mit Claude 4.5 prüfen
            </>
          )}
        </V28Button>

        {/* Results */}
        {result && (
          <div className="space-y-3 pt-2 border-t">
            {result.success ? (
              <>
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  {result.issuesFound === 0 ? (
                    <Badge variant="default" className="gap-1.5">
                      <CheckCircle2 className="h-3 w-3" />
                      Keine Probleme
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1.5">
                      <AlertTriangle className="h-3 w-3" />
                      {result.issuesFound} Issues
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Report ID: {result.reportId?.slice(0, 8)}...
                  </span>
                </div>

                {/* Summary */}
                {result.summary && (
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-sm leading-relaxed">{result.summary}</p>
                  </div>
                )}

                {/* Issues (Top 3) */}
                {result.data?.issues && result.data.issues.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Top Issues:</p>
                    {result.data.issues.slice(0, 3).map((issue, idx) => (
                      <div
                        key={idx}
                        className="rounded-md border border-beige-20 bg-weiss p-2.5 space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              issue.severity === "critical" || issue.severity === "high"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-[10px] h-4"
                          >
                            {issue.severity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{issue.type}</span>
                        </div>
                        <p className="text-xs font-medium">{issue.description}</p>
                        {issue.fix && (
                          <p className="text-xs text-muted-foreground">💡 {issue.fix}</p>
                        )}
                      </div>
                    ))}
                    {result.data.issues.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center pt-1">
                        +{result.data.issues.length - 3} weitere Issues
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">Check fehlgeschlagen</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
