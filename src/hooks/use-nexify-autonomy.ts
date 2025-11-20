/* ==================================================================================
   NEXIFY AUTONOMY HOOK V18.6.0
   ==================================================================================
   Ermöglicht autonome Entscheidungsfindung basierend auf:
   - docs/NEXIFY_AUTONOMY_LEVELS_V18.6.0.md
   - docs/NEXIFY_DECISION_MATRIX_V18.6.0.md
   - docs/MASTER_PROMPT_NEXIFY_V18.5.7.md
   ================================================================================== */

import { logger } from "@/lib/logger";

/**
 * NeXify Entscheidungs-Kategorien
 */
type DecisionCategory =
  | "layout"
  | "types"
  | "performance"
  | "security"
  | "tests"
  | "docs"
  | "a11y"
  | "design-system"
  | "database"
  | "breaking"
  | "external-api"
  | "dependencies"
  | "architecture"
  | "ui-redesign";

/**
 * Risiko-Level für Entscheidungen
 */
type RiskLevel = "low" | "medium" | "high";

/**
 * Autonomie-Level
 */
type AutonomyLevel = 1 | 2 | 3;

/**
 * NeXify Entscheidung
 */
interface NeXifyDecision {
  category: DecisionCategory;
  action: string;
  autonomous: boolean; // Kann ohne Freigabe durchgeführt werden?
  reasoning: string;
  risk_level: RiskLevel;
  autonomy_level: AutonomyLevel; // Welches Level wird benötigt?
  estimated_time: string; // z.B. "2 Min"
  files_affected: string[]; // z.B. ["src/pages/Master.tsx"]
}

/**
 * NeXify Autonomy Hook
 *
 * Analysiert User-Anfragen und entscheidet, welche Aktionen
 * autonom durchgeführt werden können vs. Freigabe benötigen.
 *
 * @example
 * const { analyzeRequest, executeAutonomous, requestApproval } = useNeXifyAutonomy();
 *
 * const decisions = analyzeRequest("Optimiere das Master-Dashboard");
 * executeAutonomous(decisions); // Führt autonome Aktionen durch
 * const approvalMessage = requestApproval(decisions); // Fragt User nach Freigabe
 */
export function useNeXifyAutonomy() {
  /**
   * Analysiert eine User-Anfrage und extrahiert autonome Entscheidungen
   *
   * @param userMessage - User-Anfrage aus Chat
   * @param currentAutonomyLevel - Aktuell aktiviertes Autonomie-Level (default: 2)
   * @returns Array von Entscheidungen
   */
  const analyzeRequest = (
    userMessage: string,
    currentAutonomyLevel: AutonomyLevel = 2
  ): NeXifyDecision[] => {
    const decisions: NeXifyDecision[] = [];
    const lowerMessage = userMessage.toLowerCase();

    // ============================================================================
    // LAYOUT & UI ANALYSEN
    // ============================================================================

    if (
      (lowerMessage.includes("layout") || lowerMessage.includes("align")) &&
      (lowerMessage.includes("optimiere") ||
        lowerMessage.includes("fix") ||
        lowerMessage.includes("korrigiere"))
    ) {
      decisions.push({
        category: "layout",
        action: "Layout-Alignments korrigieren",
        autonomous: currentAutonomyLevel >= 2,
        reasoning: "Layout-Fix ohne Breaking Changes - Level 2 autonom",
        risk_level: "low",
        autonomy_level: 2,
        estimated_time: "3-5 Min",
        files_affected: ["src/pages/Master.tsx", "src/components/layout/MainLayout.tsx"],
      });

      decisions.push({
        category: "docs",
        action: "Dokumentation für Layout-Fix erstellen",
        autonomous: currentAutonomyLevel >= 2,
        reasoning: "Dokumentation nach Code-Änderung (Pflicht)",
        risk_level: "low",
        autonomy_level: 2,
        estimated_time: "2 Min",
        files_affected: ["docs/MASTER_LAYOUT_FIX_V*.md"],
      });
    }

    if (lowerMessage.includes("zu breit") || lowerMessage.includes("overlap")) {
      decisions.push({
        category: "layout",
        action: "marginRight/paddingRight korrigieren",
        autonomous: currentAutonomyLevel >= 2,
        reasoning: "Overlap-Problem - technischer Fix ohne Breaking Changes",
        risk_level: "low",
        autonomy_level: 2,
        estimated_time: "2 Min",
        files_affected: ["src/pages/Master.tsx"],
      });
    }

    // ============================================================================
    // TYPESCRIPT & TYPES ANALYSEN
    // ============================================================================

    if (
      lowerMessage.includes("types") ||
      lowerMessage.includes("typescript") ||
      (lowerMessage.includes("optimiere") && lowerMessage.includes("code"))
    ) {
      decisions.push({
        category: "types",
        action: "TypeScript any-Types eliminieren",
        autonomous: currentAutonomyLevel >= 2,
        reasoning: "Type-Safety ohne Breaking Changes - Level 2 autonom",
        risk_level: "low",
        autonomy_level: 2,
        estimated_time: "5-10 Min",
        files_affected: ["src/**/*.tsx", "src/**/*.ts"],
      });

      decisions.push({
        category: "types",
        action: "Fehlende Props-Interfaces ergänzen",
        autonomous: currentAutonomyLevel >= 2,
        reasoning: "Verbessert Type-Safety ohne Breaking Changes",
        risk_level: "low",
        autonomy_level: 2,
        estimated_time: "3-5 Min",
        files_affected: ["src/components/**/*.tsx"],
      });
    }

    // ============================================================================
    // PERFORMANCE ANALYSEN
    // ============================================================================

    if (lowerMessage.includes("performance") || lowerMessage.includes("optimiere")) {
      decisions.push({
        category: "performance",
        action: "Memoization für teure Re-Renders",
        autonomous: currentAutonomyLevel >= 2,
        reasoning: "Performance-Verbesserung ohne Breaking Changes",
        risk_level: "low",
        autonomy_level: 2,
        estimated_time: "5-8 Min",
        files_affected: ["src/pages/**/*.tsx", "src/components/**/*.tsx"],
      });

      decisions.push({
        category: "performance",
        action: "console.log → logger Migration",
        autonomous: currentAutonomyLevel >= 2,
        reasoning: "Production-Ready Logging ohne Breaking Changes",
        risk_level: "low",
        autonomy_level: 2,
        estimated_time: "3-5 Min",
        files_affected: ["src/**/*.tsx", "src/**/*.ts"],
      });
    }

    // ============================================================================
    // NEUE FEATURES (FREIGABE NÖTIG)
    // ============================================================================

    if (
      lowerMessage.includes("erstelle") ||
      lowerMessage.includes("neue") ||
      lowerMessage.includes("implementiere")
    ) {
      // Datenbank-Änderungen
      if (lowerMessage.includes("tabelle") || lowerMessage.includes("datenbank")) {
        decisions.push({
          category: "database",
          action: "Neue Datenbank-Tabelle erstellen",
          autonomous: false, // IMMER Freigabe nötig!
          reasoning: "Datenbank-Schema-Änderung - User-Freigabe erforderlich",
          risk_level: "high",
          autonomy_level: 3,
          estimated_time: "5-10 Min",
          files_affected: ["supabase/migrations/*.sql"],
        });
      }

      // Edge Functions
      if (lowerMessage.includes("edge function") || lowerMessage.includes("api")) {
        decisions.push({
          category: "external-api",
          action: "Neue Edge Function erstellen",
          autonomous: false, // Freigabe nötig wegen Secrets
          reasoning: "Neue Feature + mögliche Secrets - User-Freigabe erforderlich",
          risk_level: "medium",
          autonomy_level: 3,
          estimated_time: "10-15 Min",
          files_affected: ["supabase/functions/*/index.ts"],
        });
      }

      // Dashboard-Components
      if (lowerMessage.includes("dashboard") || lowerMessage.includes("component")) {
        decisions.push({
          category: "breaking",
          action: "Neue Dashboard-Komponente erstellen",
          autonomous: currentAutonomyLevel >= 3, // Nur Level 3 autonom
          reasoning: "Neue Feature - Level 3 benötigt für autonome Durchführung",
          risk_level: "medium",
          autonomy_level: 3,
          estimated_time: "15-20 Min",
          files_affected: ["src/pages/*.tsx", "src/components/**/*.tsx"],
        });
      }
    }

    // ============================================================================
    // TESTS
    // ============================================================================

    if (lowerMessage.includes("test") || lowerMessage.includes("testing")) {
      decisions.push({
        category: "tests",
        action: "Unit Tests für neue Components",
        autonomous: currentAutonomyLevel >= 2,
        reasoning: "Verbessert Test-Coverage ohne Breaking Changes",
        risk_level: "low",
        autonomy_level: 2,
        estimated_time: "8-10 Min",
        files_affected: ["src/**/*.test.tsx"],
      });
    }

    // ============================================================================
    // ACCESSIBILITY
    // ============================================================================

    if (lowerMessage.includes("accessibility") || lowerMessage.includes("a11y")) {
      decisions.push({
        category: "a11y",
        action: "ARIA-Labels und Keyboard-Navigation ergänzen",
        autonomous: currentAutonomyLevel >= 2,
        reasoning: "Verbessert Accessibility ohne Breaking Changes",
        risk_level: "low",
        autonomy_level: 2,
        estimated_time: "5-8 Min",
        files_affected: ["src/components/**/*.tsx"],
      });
    }

    logger.info(`[NeXify Autonomy] Analyzed ${decisions.length} decisions`, {
      component: "useNeXifyAutonomy",
      autonomousCount: decisions.filter((d) => d.autonomous).length,
      approvalCount: decisions.filter((d) => !d.autonomous).length,
    });

    return decisions;
  };

  /**
   * Führt autonome Entscheidungen durch (OHNE User-Freigabe)
   *
   * @param decisions - Array von Entscheidungen
   * @returns Anzahl durchgeführter Aktionen
   */
  const executeAutonomous = (decisions: NeXifyDecision[]): number => {
    const autonomousActions = decisions.filter((d) => d.autonomous);

    if (autonomousActions.length === 0) {
      logger.info("[NeXify Autonomy] Keine autonomen Aktionen gefunden", {
        component: "useNeXifyAutonomy",
      });
      return 0;
    }

    autonomousActions.forEach((action) => {
      logger.info(`[NeXify Autonomy] Executing: ${action.action}`, {
        component: "useNeXifyAutonomy",
        category: action.category,
        risk: action.risk_level,
        files: action.files_affected,
      });

      // HIER würde die tatsächliche Implementierung passieren
      // In Production: Würde Tools aufrufen (lov-line-replace, lov-write, etc.)
    });

    logger.group("[NeXify Autonomy] Execution Summary");
    logger.info(`✅ ${autonomousActions.length} autonome Aktionen durchgeführt`);
    logger.info(
      `Geschätzte Zeit: ${autonomousActions.reduce((acc, a) => acc + parseInt(a.estimated_time), 0)} Min`
    );
    logger.groupEnd();

    return autonomousActions.length;
  };

  /**
   * Fragt User nach Freigabe für kritische Änderungen
   *
   * @param decisions - Array von Entscheidungen
   * @returns User-Prompt-String (Markdown)
   */
  const requestApproval = (decisions: NeXifyDecision[]): string => {
    const approvalNeeded = decisions.filter((d) => !d.autonomous);

    if (approvalNeeded.length === 0) {
      return "✅ Alle Aktionen autonom durchführbar - keine Freigabe nötig!";
    }

    const approvalMessage = `
⏸️ **Folgende Aktionen benötigen deine Freigabe:**

${approvalNeeded
  .map(
    (a, i) => `
**${i + 1}. ${a.action}**
- **Kategorie:** ${a.category}
- **Risiko:** ${a.risk_level.toUpperCase()}
- **Begründung:** ${a.reasoning}
- **Geschätzte Zeit:** ${a.estimated_time}
- **Betroffene Dateien:** ${a.files_affected.join(", ")}
`
  )
  .join("\n")}

**Soll ich fortfahren?** (ja/nein)
    `.trim();

    logger.warn(`[NeXify Autonomy] ${approvalNeeded.length} Aktionen benötigen Freigabe`, {
      component: "useNeXifyAutonomy",
    });

    return approvalMessage;
  };

  /**
   * Generiert Statistiken über Entscheidungen
   *
   * @param decisions - Array von Entscheidungen
   * @returns Statistik-Objekt
   */
  const getStatistics = (decisions: NeXifyDecision[]) => {
    const autonomous = decisions.filter((d) => d.autonomous).length;
    const approval = decisions.filter((d) => !d.autonomous).length;
    const total = decisions.length;

    const byCategory = decisions.reduce(
      (acc, d) => {
        acc[d.category] = (acc[d.category] || 0) + 1;
        return acc;
      },
      {} as Record<DecisionCategory, number>
    );

    const byRisk = decisions.reduce(
      (acc, d) => {
        acc[d.risk_level] = (acc[d.risk_level] || 0) + 1;
        return acc;
      },
      {} as Record<RiskLevel, number>
    );

    return {
      total,
      autonomous,
      approval,
      autonomy_rate: total > 0 ? (autonomous / total) * 100 : 0,
      by_category: byCategory,
      by_risk: byRisk,
    };
  };

  return {
    analyzeRequest,
    executeAutonomous,
    requestApproval,
    getStatistics,
  };
}

/**
 * Utility: Entscheidungs-Matrix als Lookup-Tabelle
 *
 * Kann verwendet werden, um schnell zu prüfen,
 * ob eine Aktion autonom durchführbar ist.
 */
export const AUTONOMY_MATRIX: Record<DecisionCategory, { level: AutonomyLevel; risk: RiskLevel }> =
  {
    layout: { level: 2, risk: "low" },
    types: { level: 2, risk: "low" },
    performance: { level: 2, risk: "low" },
    security: { level: 2, risk: "low" },
    tests: { level: 2, risk: "low" },
    docs: { level: 2, risk: "low" },
    a11y: { level: 2, risk: "low" },
    "design-system": { level: 2, risk: "low" },
    database: { level: 3, risk: "high" },
    breaking: { level: 3, risk: "high" },
    "external-api": { level: 3, risk: "medium" },
    dependencies: { level: 3, risk: "medium" },
    architecture: { level: 3, risk: "high" },
    "ui-redesign": { level: 3, risk: "medium" },
  };
