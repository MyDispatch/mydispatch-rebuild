/* ==================================================================================
   AUTO-OPTIMIZATION SYSTEM SCANNER V18.3.24
   ==================================================================================
   ✅ AI-gestützte automatische Fehler-Erkennung
   ✅ Systemweite Code-Quality-Analyse
   ✅ Performance-Bottleneck-Detection
   ✅ Security-Vulnerability-Scanning
   ✅ Accessibility-Checks
   ================================================================================== */

export interface OptimizationIssue {
  id: string;
  category: "error" | "performance" | "security" | "accessibility" | "code-quality" | "design";
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  affectedFiles: string[];
  autoFixable: boolean;
  estimatedEffort: "quick" | "medium" | "large";
  priority: number; // 1-10 (10 = höchste Priorität)
  detectedAt: string;
  fixedAt?: string;
  copyablePrompt: string; // Prompt zum Kopieren für AI-Fix
}

export interface SystemHealthReport {
  timestamp: string;
  overallScore: number; // 0-100
  issues: OptimizationIssue[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  trends: {
    fixedLast7Days: number;
    newLast7Days: number;
    averageFixTime: number; // in hours
  };
}

// ==================================================================================
// PATTERN-BASED ISSUE DETECTION
// ==================================================================================

/**
 * Definiert bekannte Anti-Patterns und Probleme
 */
export const KNOWN_ISSUES: Array<{
  id: string;
  pattern: RegExp;
  category: OptimizationIssue["category"];
  severity: OptimizationIssue["severity"];
  title: string;
  getDescription: (match: RegExpMatchArray) => string;
  getPrompt: (filePath: string, match: RegExpMatchArray) => string;
}> = [
  // Icon-Farben Violations
  {
    id: "icon-color-violation",
    pattern: /<[A-Z][a-zA-Z]*[^>]*className="[^"]*text-status-(success|warning|error)[^"]*"/g,
    category: "design",
    severity: "high",
    title: "Icon verwendet Ampelfarbe",
    getDescription: (match) => `Icon verwendet verbotene Ampelfarbe: ${match[0]}`,
    getPrompt: (filePath, match) =>
      `Fixe Icon-Farben-Violation in ${filePath}: Ersetze text-status-* mit text-foreground`,
  },

  // DELETE statt Archiving
  {
    id: "delete-instead-archive",
    pattern: /\.delete\(\)/g,
    category: "security",
    severity: "critical",
    title: "DELETE verwendet statt Archiving",
    getDescription: () => "Code verwendet .delete() statt .update({ archived: true })",
    getPrompt: (filePath) => `Kritisch: Ersetze .delete() mit Archiving-System in ${filePath}`,
  },

  // Fehlende company_id Filter
  {
    id: "missing-company-id",
    pattern: /supabase\.from\([^)]+\)\.select\([^)]+\)(?!.*\.eq\('company_id')/g,
    category: "security",
    severity: "critical",
    title: "Query ohne company_id Filter",
    getDescription: (match) => `Query fehlt company_id Filter: ${match[0]}`,
    getPrompt: (filePath, match) =>
      `KRITISCH: Füge company_id Filter hinzu in ${filePath}: ${match[0]}`,
  },

  // Hex-Farben statt Design-Tokens
  {
    id: "hex-colors",
    pattern: /#[0-9A-Fa-f]{3,6}(?![^<]*>)/g,
    category: "design",
    severity: "medium",
    title: "Hex-Farbe statt Design-Token",
    getDescription: (match) => `Hex-Farbe gefunden: ${match[0]}`,
    getPrompt: (filePath, match) => `Ersetze Hex-Farbe ${match[0]} mit Design-Token in ${filePath}`,
  },

  // Inline-Formatierung
  {
    id: "inline-formatting",
    pattern: /\.toFixed\(|\.toLocaleString\(|new Intl\./g,
    category: "code-quality",
    severity: "low",
    title: "Inline-Formatierung statt Utils",
    getDescription: () => "Inline-Formatierung gefunden, sollte format-utils verwenden",
    getPrompt: (filePath) => `Refactore Inline-Formatierung in ${filePath} zu format-utils`,
  },

  // Console.logs in Production
  {
    id: "console-logs",
    pattern: /console\.(log|warn|debug)\(/g,
    category: "code-quality",
    severity: "low",
    title: "Console.log in Production",
    getDescription: (match) => `${match[0]} gefunden`,
    getPrompt: (filePath) => `Entferne/ersetze console.logs in ${filePath} mit proper logging`,
  },

  // Unvalidated User Inputs
  {
    id: "unvalidated-input",
    pattern: /onChange.*=>.*setState\([^)]*e\.target\.value[^)]*\)(?!.*validate)/gi,
    category: "security",
    severity: "medium",
    title: "Unvalidierte User-Inputs",
    getDescription: () => "User-Input ohne Validierung",
    getPrompt: (filePath) => `Füge Input-Validierung hinzu in ${filePath}`,
  },

  // Missing Error Boundaries
  {
    id: "missing-error-boundary",
    pattern: /export default function [A-Z][a-zA-Z]*\(/g,
    category: "code-quality",
    severity: "medium",
    title: "Potentiell fehlende Error-Boundary",
    getDescription: () => "Page-Component ohne Error-Boundary",
    getPrompt: (filePath) => `Prüfe ob ${filePath} Error-Boundary benötigt`,
  },
];

// ==================================================================================
// FILE SCANNER
// ==================================================================================

/**
 * Scannt eine Datei auf bekannte Issues
 */
export function scanFile(filePath: string, content: string): OptimizationIssue[] {
  const issues: OptimizationIssue[] = [];

  for (const knownIssue of KNOWN_ISSUES) {
    const matches = content.matchAll(knownIssue.pattern);

    for (const match of matches) {
      issues.push({
        id: `${knownIssue.id}-${filePath}-${Date.now()}`,
        category: knownIssue.category,
        severity: knownIssue.severity,
        title: knownIssue.title,
        description: knownIssue.getDescription(match),
        affectedFiles: [filePath],
        autoFixable: ["icon-color-violation", "hex-colors", "console-logs"].includes(knownIssue.id),
        estimatedEffort: knownIssue.severity === "critical" ? "quick" : "medium",
        priority: calculatePriority(knownIssue.severity, knownIssue.category),
        detectedAt: new Date().toISOString(),
        copyablePrompt: knownIssue.getPrompt(filePath, match),
      });
    }
  }

  return issues;
}

/**
 * Berechnet Priorität basierend auf Severity und Category
 */
function calculatePriority(
  severity: OptimizationIssue["severity"],
  category: OptimizationIssue["category"]
): number {
  const severityWeight = {
    critical: 10,
    high: 7,
    medium: 4,
    low: 2,
  };

  const categoryWeight = {
    security: 10,
    error: 9,
    performance: 7,
    accessibility: 6,
    "code-quality": 4,
    design: 3,
  };

  return Math.min(10, Math.round((severityWeight[severity] + categoryWeight[category]) / 2));
}

// ==================================================================================
// PERFORMANCE ANALYSIS
// ==================================================================================

/**
 * Analysiert Performance-Bottlenecks
 */
export function analyzePerformance(filePath: string, content: string): OptimizationIssue[] {
  const issues: OptimizationIssue[] = [];

  // Large Bundle-Size Components
  if (content.length > 5000 && content.includes("export default")) {
    issues.push({
      id: `large-component-${filePath}`,
      category: "performance",
      severity: "medium",
      title: "Große Komponente (>5KB)",
      description: `${filePath} ist sehr groß und sollte aufgeteilt werden`,
      affectedFiles: [filePath],
      autoFixable: false,
      estimatedEffort: "medium",
      priority: 5,
      detectedAt: new Date().toISOString(),
      copyablePrompt: `Refactore ${filePath} in kleinere Komponenten`,
    });
  }

  // Missing Memoization
  if (content.includes("map(") && !content.includes("useMemo") && !content.includes("React.memo")) {
    issues.push({
      id: `missing-memo-${filePath}`,
      category: "performance",
      severity: "low",
      title: "Potentiell fehlende Memoization",
      description: "Component mit map() könnte von useMemo profitieren",
      affectedFiles: [filePath],
      autoFixable: false,
      estimatedEffort: "quick",
      priority: 3,
      detectedAt: new Date().toISOString(),
      copyablePrompt: `Prüfe ob ${filePath} Memoization benötigt`,
    });
  }

  return issues;
}

// ==================================================================================
// ACCESSIBILITY CHECKS
// ==================================================================================

/**
 * Prüft Accessibility-Issues
 */
export function checkAccessibility(filePath: string, content: string): OptimizationIssue[] {
  const issues: OptimizationIssue[] = [];

  // Missing alt attributes on images
  const imgWithoutAlt = /<img(?![^>]*alt=)[^>]*>/g;
  const matches = content.matchAll(imgWithoutAlt);

  for (const match of matches) {
    issues.push({
      id: `missing-alt-${filePath}-${Date.now()}`,
      category: "accessibility",
      severity: "high",
      title: "Bild ohne alt-Attribut",
      description: "Image-Tag fehlt alt-Attribut für Screen-Reader",
      affectedFiles: [filePath],
      autoFixable: false,
      estimatedEffort: "quick",
      priority: 7,
      detectedAt: new Date().toISOString(),
      copyablePrompt: `Füge alt-Attribute zu Images in ${filePath} hinzu`,
    });
  }

  return issues;
}

// ==================================================================================
// SYSTEM-WIDE SCAN
// ==================================================================================

/**
 * Führt vollständigen System-Scan durch
 * (In Production würde dies alle Files durchgehen)
 */
export function generateSystemHealthReport(
  files: Array<{ path: string; content: string }>
): SystemHealthReport {
  const allIssues: OptimizationIssue[] = [];

  for (const file of files) {
    const fileIssues = [
      ...scanFile(file.path, file.content),
      ...analyzePerformance(file.path, file.content),
      ...checkAccessibility(file.path, file.content),
    ];

    allIssues.push(...fileIssues);
  }

  // Sort by priority
  allIssues.sort((a, b) => b.priority - a.priority);

  const summary = {
    critical: allIssues.filter((i) => i.severity === "critical").length,
    high: allIssues.filter((i) => i.severity === "high").length,
    medium: allIssues.filter((i) => i.severity === "medium").length,
    low: allIssues.filter((i) => i.severity === "low").length,
  };

  const overallScore = calculateHealthScore(summary);

  return {
    timestamp: new Date().toISOString(),
    overallScore,
    issues: allIssues,
    summary,
    trends: {
      fixedLast7Days: 0, // Would be calculated from history
      newLast7Days: allIssues.length,
      averageFixTime: 0,
    },
  };
}

/**
 * Berechnet System-Health-Score
 */
function calculateHealthScore(summary: {
  critical: number;
  high: number;
  medium: number;
  low: number;
}): number {
  const weights = {
    critical: -20,
    high: -10,
    medium: -5,
    low: -2,
  };

  const deductions =
    summary.critical * weights.critical +
    summary.high * weights.high +
    summary.medium * weights.medium +
    summary.low * weights.low;

  return Math.max(0, Math.min(100, 100 + deductions));
}
