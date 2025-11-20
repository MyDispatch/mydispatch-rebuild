import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

interface OrchestrationProgress {
  completed: number;
  failed: number;
  remaining: number;
}

interface OrchestrationResult {
  plan: {
    totalFiles: number;
    totalViolations: number;
    estimatedDuration: string;
    steps: Array<{
      agent: string;
      task: string;
      status: "pending" | "in-progress" | "completed" | "failed" | "skipped";
    }>;
  } | null;
  progress: OrchestrationProgress;
  nextAction: "continue" | "completed" | "rollback";
  violations: number;
  migrated: number;
}

export function useOrchestrator() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<OrchestrationProgress>({
    completed: 0,
    failed: 0,
    remaining: 0,
  });
  const [result, setResult] = useState<OrchestrationResult | null>(null);
  const { toast } = useToast();

  const startMigration = async (options: {
    task: "migrate-inline-styles" | "validate-system" | "self-heal";
    scope?: "all" | "critical" | "specific";
    specificFiles?: string[];
    requireVisualValidation?: boolean;
  }) => {
    setIsRunning(true);
    setProgress({ completed: 0, failed: 0, remaining: 0 });

    try {
      toast({
        title: "🤖 AI Orchestrator gestartet",
        description: `Task: ${options.task}, Scope: ${options.scope || "all"}`,
      });

      const { data, error } = await supabase.functions.invoke("ai-orchestrator", {
        body: {
          task: options.task,
          scope: options.scope || "all",
          specificFiles: options.specificFiles,
          constraints: {
            maxParallel: 10,
            requireVisualValidation: options.requireVisualValidation || false,
          },
        },
      });

      if (error) throw error;

      const orchestrationResult = data as OrchestrationResult;
      setResult(orchestrationResult);
      setProgress(orchestrationResult.progress);

      if (orchestrationResult.nextAction === "completed") {
        toast({
          title: "✅ Migration abgeschlossen",
          description: `${orchestrationResult.migrated} Files erfolgreich migriert`,
        });
      } else if (orchestrationResult.nextAction === "rollback") {
        toast({
          title: "⚠️ Migration fehlgeschlagen",
          description: "Rollback wird durchgeführt...",
          variant: "destructive",
        });
      } else {
        toast({
          title: "🔄 Batch abgeschlossen",
          description: `${orchestrationResult.progress.completed}/${orchestrationResult.plan?.totalFiles} Files migriert`,
        });
      }

      return orchestrationResult;
    } catch (error) {
      logger.error("[useOrchestrator] Error", error, {
        component: "useOrchestrator",
        task: options.task,
      });
      toast({
        title: "❌ Orchestrator-Fehler",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsRunning(false);
    }
  };

  const validateSystem = async () => {
    return startMigration({
      task: "validate-system",
      scope: "all",
      requireVisualValidation: true,
    });
  };

  const selfHeal = async () => {
    return startMigration({
      task: "self-heal",
      scope: "critical",
    });
  };

  return {
    isRunning,
    progress,
    result,
    startMigration,
    validateSystem,
    selfHeal,
  };
}
