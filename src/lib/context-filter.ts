/* ==================================================================================
   DYNAMIC CONTEXT FILTERING - V18.2.18
   ==================================================================================
   Optimiert die Fähigkeit des Agenten, den Umfang der zu verarbeitenden
   System-Vorgaben auf den aktuell notwendigen, logisch relevanten Kontext
   zu beschränken → Eliminiert Kontext-Fehler, erhöht Präzision
   ================================================================================== */

export interface ContextScope {
  intent: "debug" | "implement" | "refactor" | "document" | "analyze";
  targetEntities?: string[];
  requiredDocs?: string[];
  excludeDocs?: string[];
  priority: "critical" | "high" | "medium" | "low";
}

export interface FilteredContext {
  scope: ContextScope;
  relevantFiles: string[];
  relevantDocs: string[];
  irrelevantFiles: string[];
  contextSize: "minimal" | "focused" | "comprehensive" | "full";
  estimatedTokens: number;
}

/**
 * Dynamic Context Filter
 * Reduziert Kontext-Overhead basierend auf aktuellem Intent
 */
export class ContextFilter {
  private static instance: ContextFilter;

  // Datei-Kategorien für intelligentes Filtering
  private readonly FILE_CATEGORIES = {
    core: ["src/App.tsx", "src/main.tsx", "src/index.css", "tailwind.config.ts"],
    hooks: /src\/hooks\/use-.*\.tsx/,
    components: /src\/components\/.*/,
    pages: /src\/pages\/.*/,
    lib: /src\/lib\/.*/,
    supabase: /supabase\/.*/,
    docs: /.*\.md/,
  };

  // Intent-basierte Kontext-Regeln
  private readonly INTENT_RULES = {
    debug: {
      priority: ["core", "hooks", "lib"],
      excludeDocs: true,
      contextSize: "focused" as const,
    },
    implement: {
      priority: ["components", "hooks", "lib"],
      excludeDocs: false,
      contextSize: "focused" as const,
    },
    refactor: {
      priority: ["core", "components", "hooks"],
      excludeDocs: true,
      contextSize: "comprehensive" as const,
    },
    document: {
      priority: ["docs"],
      excludeDocs: false,
      contextSize: "minimal" as const,
    },
    analyze: {
      priority: ["core", "hooks", "components", "pages"],
      excludeDocs: false,
      contextSize: "full" as const,
    },
  };

  private constructor() {}

  static getInstance(): ContextFilter {
    if (!ContextFilter.instance) {
      ContextFilter.instance = new ContextFilter();
    }
    return ContextFilter.instance;
  }

  /**
   * Filtere Kontext basierend auf Intent & Target
   */
  filter(scope: ContextScope, availableFiles: string[]): FilteredContext {
    const rules = this.INTENT_RULES[scope.intent];
    const relevantFiles: string[] = [];
    const irrelevantFiles: string[] = [];

    // 1. Kategorisiere Files
    for (const file of availableFiles) {
      const category = this.categorizeFile(file);

      // Prüfe ob Kategorie in Priority-Liste
      if (category && rules.priority.includes(category)) {
        relevantFiles.push(file);
      } else if (scope.targetEntities && this.matchesTarget(file, scope.targetEntities)) {
        // Target-spezifische Files IMMER includen
        relevantFiles.push(file);
      } else {
        irrelevantFiles.push(file);
      }
    }

    // 2. Dokumenten-Filtering
    let relevantDocs: string[] = [];
    if (!rules.excludeDocs) {
      relevantDocs = scope.requiredDocs || [];

      // Auto-Include: MASTER_PROMPT bei implement/refactor
      if (["implement", "refactor"].includes(scope.intent)) {
        if (!relevantDocs.includes("MASTER_PROMPT_V18.2.md")) {
          relevantDocs.push("MASTER_PROMPT_V18.2.md");
        }
      }

      // Auto-Include: PROJECT_STATUS bei analyze
      if (scope.intent === "analyze") {
        if (!relevantDocs.includes("PROJECT_STATUS.md")) {
          relevantDocs.push("PROJECT_STATUS.md");
        }
      }
    }

    // 3. Context-Size-Bestimmung
    const contextSize = this.determineContextSize(
      relevantFiles.length,
      relevantDocs.length,
      rules.contextSize
    );

    // 4. Token-Estimation (grob)
    const estimatedTokens = this.estimateTokens(relevantFiles, relevantDocs);

    return {
      scope,
      relevantFiles,
      relevantDocs,
      irrelevantFiles,
      contextSize,
      estimatedTokens,
    };
  }

  /**
   * Kategorisiere File
   */
  private categorizeFile(file: string): string | null {
    for (const [category, pattern] of Object.entries(this.FILE_CATEGORIES)) {
      if (pattern instanceof RegExp) {
        if (pattern.test(file)) return category;
      } else if (Array.isArray(pattern)) {
        if (pattern.includes(file)) return category;
      }
    }
    return null;
  }

  /**
   * Prüfe ob File Target-Entity matcht
   */
  private matchesTarget(file: string, targets: string[]): boolean {
    const fileLower = file.toLowerCase();
    return targets.some((target) => fileLower.includes(target.toLowerCase()));
  }

  /**
   * Bestimme finale Context-Size
   */
  private determineContextSize(
    fileCount: number,
    docCount: number,
    suggestedSize: "minimal" | "focused" | "comprehensive" | "full"
  ): "minimal" | "focused" | "comprehensive" | "full" {
    // Override bei zu vielen Files
    if (fileCount > 50) return "focused";
    if (fileCount > 100) return "minimal";

    return suggestedSize;
  }

  /**
   * Token-Estimation (sehr grob)
   */
  private estimateTokens(files: string[], docs: string[]): number {
    const avgFileTokens = 500; // Durchschnitt pro File
    const avgDocTokens = 2000; // Durchschnitt pro Doc

    return files.length * avgFileTokens + docs.length * avgDocTokens;
  }

  /**
   * Generiere Kontext-Bericht für Logging
   */
  generateReport(filtered: FilteredContext): string {
    return `
=== DYNAMIC CONTEXT FILTER REPORT ===
Intent: ${filtered.scope.intent}
Priority: ${filtered.scope.priority}
Context Size: ${filtered.contextSize}
Estimated Tokens: ${filtered.estimatedTokens}

Relevant Files: ${filtered.relevantFiles.length}
${filtered.relevantFiles
  .slice(0, 10)
  .map((f) => `  - ${f}`)
  .join("\n")}
${filtered.relevantFiles.length > 10 ? `  ... and ${filtered.relevantFiles.length - 10} more` : ""}

Relevant Docs: ${filtered.relevantDocs.length}
${filtered.relevantDocs.map((d) => `  - ${d}`).join("\n")}

Excluded Files: ${filtered.irrelevantFiles.length}
======================================
    `.trim();
  }
}

// Singleton
export const contextFilter = ContextFilter.getInstance();

// ===== HELPER FUNCTIONS =====

/**
 * Quick-Filter für häufige Use-Cases
 */
export function filterForDebugging(targetFiles: string[] = []): FilteredContext {
  return contextFilter.filter(
    {
      intent: "debug",
      targetEntities: targetFiles,
      priority: "critical",
    },
    [] // Files werden durch targetFiles spezifiziert
  );
}

export function filterForImplementation(
  targetEntities: string[],
  requiredDocs: string[] = ["MASTER_PROMPT_V18.2.md"]
): FilteredContext {
  return contextFilter.filter(
    {
      intent: "implement",
      targetEntities,
      requiredDocs,
      priority: "high",
    },
    []
  );
}

export function filterForRefactoring(
  targetEntities: string[],
  excludeDocs: string[] = []
): FilteredContext {
  return contextFilter.filter(
    {
      intent: "refactor",
      targetEntities,
      excludeDocs,
      priority: "medium",
    },
    []
  );
}
