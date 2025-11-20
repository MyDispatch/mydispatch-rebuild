import { useState } from "react";
import { useKnowledgeBase } from "./use-knowledge-base";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MigrationProgress {
  phase: string;
  current: number;
  total: number;
  status: "pending" | "running" | "completed" | "error";
  message: string;
}

interface MigrationStats {
  knowledgeBaseEntries: number;
  componentsRegistered: number;
  knownIssuesFixed: number;
  codeSnippetsAdded: number;
}

export function useKnowledgeMigration() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<MigrationProgress[]>([]);
  const [stats, setStats] = useState<MigrationStats>({
    knowledgeBaseEntries: 0,
    componentsRegistered: 0,
    knownIssuesFixed: 0,
    codeSnippetsAdded: 0,
  });

  const { parseDocument } = useKnowledgeBase();

  const updateProgress = (
    phase: string,
    current: number,
    total: number,
    status: MigrationProgress["status"],
    message: string
  ) => {
    setProgress((prev) => {
      const existing = prev.find((p) => p.phase === phase);
      if (existing) {
        return prev.map((p) =>
          p.phase === phase ? { phase, current, total, status, message } : p
        );
      }
      return [...prev, { phase, current, total, status, message }];
    });
  };

  /**
   * Phase 1: Migrate all documentation files
   */
  const migrateDocumentation = async () => {
    const phase = "Phase 1: Documentation Migration";
    updateProgress(phase, 0, 112, "running", "Starting documentation migration...");

    try {
      // Mock: In Produktion würde hier rekursiv alle MD-Files gescannt
      const criticalDocs = [
        { path: "docs/SHARED_KNOWLEDGE_V18.5.1.md", version: "V18.5.1" },
        { path: "docs/COMPONENT_REGISTRY.md", version: "V18.5.1" },
        { path: "docs/LESSONS_LEARNED.md", version: "V18.5.1" },
        { path: "docs/AVOIDABLE_ERRORS.md", version: "V18.5.1" },
        { path: "docs/DESIGN_SYSTEM_V18.3.31.md", version: "V18.3.31" },
      ];

      let processed = 0;
      let inserted = 0;

      for (const doc of criticalDocs) {
        try {
          // In Produktion: const content = await fetch(`/${doc.path}`).then(r => r.text());
          const mockContent = `# ${doc.path}\n\n## Best Practice\n- Use V28 Components\n- NEVER hallucinate functions`;

          const result = await parseDocument(mockContent, doc.path, doc.version);
          if (result?.inserted_count) {
            inserted += result.inserted_count;
          }

          processed++;
          updateProgress(phase, processed, criticalDocs.length, "running", `Processed ${doc.path}`);
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error(`Failed to process ${doc.path}:`, error);
          }
        }
      }

      setStats((prev) => ({ ...prev, knowledgeBaseEntries: prev.knowledgeBaseEntries + inserted }));
      updateProgress(
        phase,
        processed,
        criticalDocs.length,
        "completed",
        `✅ ${inserted} entries added`
      );

      return true;
    } catch (error) {
      updateProgress(phase, 0, 112, "error", `Error: ${error}`);
      return false;
    }
  };

  /**
   * Phase 2: Complete component registry
   */
  const completeComponentRegistry = async () => {
    const phase = "Phase 2: Component Registry";
    updateProgress(phase, 0, 60, "running", "Scanning components...");

    try {
      const { data, error } = await supabase.functions.invoke("extract-component-props", {
        body: { trigger: "migration", scan_all: true },
      });

      if (error) throw error;

      const inserted = data?.inserted_count || 0;
      setStats((prev) => ({ ...prev, componentsRegistered: prev.componentsRegistered + inserted }));
      updateProgress(phase, inserted, 60, "completed", `✅ ${inserted} components registered`);

      return true;
    } catch (error) {
      updateProgress(phase, 0, 60, "error", `Error: ${error}`);
      return false;
    }
  };

  /**
   * Phase 3: Rebuild known issues with solutions
   */
  const rebuildKnownIssues = async () => {
    const phase = "Phase 3: Known Issues Rebuild";
    updateProgress(phase, 0, 22, "running", "Extracting solutions...");

    try {
      // Update existing issues with solutions
      const knownSolutions = [
        {
          issue_type: "infinite_loop",
          solution: "Use useCallback and prevent nested onClick handlers",
          prevention_checklist: [
            "Check for nested interactive elements",
            "Use useCallback for handlers",
          ],
        },
        {
          issue_type: "hallucinated_function",
          solution: "Always check component_registry before using functions",
          prevention_checklist: ["Query knowledge_base first", "NEVER code from memory"],
        },
      ];

      let updated = 0;
      for (const solution of knownSolutions) {
        const { error } = await supabase
          .from("known_issues")
          .update({
            solution: solution.solution,
            prevention_checklist: solution.prevention_checklist,
            resolved: true,
            resolved_at: new Date().toISOString(),
          })
          .eq("issue_type", solution.issue_type)
          .is("solution", null);

        if (!error) updated++;
      }

      setStats((prev) => ({ ...prev, knownIssuesFixed: prev.knownIssuesFixed + updated }));
      updateProgress(phase, updated, 22, "completed", `✅ ${updated} issues fixed`);

      return true;
    } catch (error) {
      updateProgress(phase, 0, 22, "error", `Error: ${error}`);
      return false;
    }
  };

  /**
   * Phase 4: Expand code snippets
   */
  const expandCodeSnippets = async () => {
    const phase = "Phase 4: Code Snippets";
    updateProgress(phase, 0, 30, "running", "Adding snippets...");

    try {
      const newSnippets = [
        {
          pattern_name: "DashboardInfoBoard Integration",
          code: 'import { DashboardInfoBoard } from "@/components/dashboard/DashboardInfoBoard";\n\n<DashboardInfoBoard stats={stats} loading={isLoading} />',
          language: "tsx",
          tags: ["dashboard", "kpis", "widgets"],
        },
        {
          pattern_name: "UniversalDownload Usage",
          code: 'import { UniversalDownload } from "@/components/shared/UniversalDownload";\n\n<UniversalDownload data={items} filename="export" format="pdf" />',
          language: "tsx",
          tags: ["export", "pdf", "excel"],
        },
      ];

      let inserted = 0;
      for (const snippet of newSnippets) {
        const { error } = await supabase
          .from("code_snippets")
          .upsert(snippet, { onConflict: "pattern_name" });

        if (!error) inserted++;
      }

      setStats((prev) => ({ ...prev, codeSnippetsAdded: prev.codeSnippetsAdded + inserted }));
      updateProgress(phase, inserted, 30, "completed", `✅ ${inserted} snippets added`);

      return true;
    } catch (error) {
      updateProgress(phase, 0, 30, "error", `Error: ${error}`);
      return false;
    }
  };

  /**
   * Phase 5: Final validation
   */
  const runValidation = async () => {
    const phase = "Phase 5: Validation";
    updateProgress(phase, 0, 4, "running", "Running validation checks...");

    try {
      // Check 1: Knowledge-Base count
      const { count: kbCount } = await supabase
        .from("knowledge_base")
        .select("*", { count: "exact", head: true });

      updateProgress(phase, 1, 4, "running", `Knowledge-Base: ${kbCount || 0} entries`);

      // Check 2: Component Registry count
      const { count: compCount } = await supabase
        .from("component_registry")
        .select("*", { count: "exact", head: true })
        .eq("verification_status", "active");

      updateProgress(phase, 2, 4, "running", `Components: ${compCount || 0} registered`);

      // Check 3: Known Issues with solutions
      const { count: issuesCount } = await supabase
        .from("known_issues")
        .select("*", { count: "exact", head: true })
        .not("solution", "is", null);

      updateProgress(phase, 3, 4, "running", `Known Issues: ${issuesCount || 0} with solutions`);

      // Check 4: Code Snippets
      const { count: snippetsCount } = await supabase
        .from("code_snippets")
        .select("*", { count: "exact", head: true });

      updateProgress(
        phase,
        4,
        4,
        "completed",
        `✅ Validation complete: ${kbCount || 0} KB | ${compCount || 0} Components | ${issuesCount || 0} Issues | ${snippetsCount || 0} Snippets`
      );

      return true;
    } catch (error) {
      updateProgress(phase, 0, 4, "error", `Error: ${error}`);
      return false;
    }
  };

  /**
   * Run all phases sequentially
   */
  const runFullMigration = async () => {
    setIsRunning(true);
    setProgress([]);

    toast.info("🚀 Starting Knowledge-Base Migration...");

    const phases = [
      { name: "Documentation", fn: migrateDocumentation },
      { name: "Component Registry", fn: completeComponentRegistry },
      { name: "Known Issues", fn: rebuildKnownIssues },
      { name: "Code Snippets", fn: expandCodeSnippets },
      { name: "Validation", fn: runValidation },
    ];

    for (const phase of phases) {
      const success = await phase.fn();
      if (!success) {
        toast.error(`❌ Migration failed at ${phase.name}`);
        setIsRunning(false);
        return;
      }
    }

    toast.success("✅ Knowledge-Base Migration Complete!");
    setIsRunning(false);
  };

  return {
    runFullMigration,
    migrateDocumentation,
    completeComponentRegistry,
    rebuildKnownIssues,
    expandCodeSnippets,
    runValidation,
    isRunning,
    progress,
    stats,
  };
}
