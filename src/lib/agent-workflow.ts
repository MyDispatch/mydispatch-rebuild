/* ==================================================================================
   AGENT WORKFLOW - Integration des Debug Systems in meinen Workflow
   ==================================================================================
   Dieses System integriert das Agent Debug System in meinen Standard-Workflow
   ================================================================================== */

import type { PageScanResult } from './agent-debug-system';
import { agentDebugSystem } from './agent-debug-system';

// ==================================================================================
// FILE SCANNER HELPER
// ==================================================================================

/**
 * Diese Funktion würde ich in meinem Workflow verwenden, um Dateien zu scannen
 * bevor ich sie bearbeite.
 * 
 * USAGE in meinem Workflow:
 * 1. User sagt: "Optimiere die Auth-Seite"
 * 2. Ich lese alle relevanten Dateien
 * 3. Ich scanne sie mit diesem System
 * 4. Ich sehe ALLE Fehler sofort
 * 5. Ich fixe alles in einem Durchgang
 */
export async function scanFilesBeforeEditing(
  files: Array<{ path: string; content: string }>
): Promise<PageScanResult> {
  const result = await agentDebugSystem.scanFiles(files);
  
  // Generate readable report for me
  const report = agentDebugSystem.generateAgentReport(result);
  
  // In development, log debug output
  // Intentionally removed: Report is logged via Supabase
  
  // Log to Supabase for tracking
  await agentDebugSystem.logToSupabase(result);
  
  return result;
}

// ==================================================================================
// BATCH FIX HELPER
// ==================================================================================

/**
 * Generiert automatische Fixes für alle auto-fixable Errors
 */
export function generateBatchFixes(result: PageScanResult): Record<string, string[]> {
  const fixes: Record<string, string[]> = {};
  
  result.errors
    .filter(error => error.autoFixable)
    .forEach(error => {
      if (!fixes[error.file]) {
        fixes[error.file] = [];
      }
      
      if (error.code && error.fix) {
        fixes[error.file].push(
          `// Replace: ${error.code}\n// With: ${error.fix}\n// Reason: ${error.description}`
        );
      }
    });
  
  return fixes;
}

// ==================================================================================
// WORKFLOW INTEGRATION GUIDE
// ==================================================================================

/**
 * AGENT WORKFLOW GUIDE - Wie ich das System nutze
 * 
 * PHASE -2: AUTONOME RECHERCHE (JETZT MIT DEBUG SYSTEM!)
 * -------------------------------------------------------
 * 
 * 1. User fragt: "Optimiere die Auth-Seite"
 * 
 * 2. Ich lese ALLE betroffenen Dateien:
 *    await viewFile('src/pages/Auth.tsx');
 *    await viewFile('src/components/auth/LoginForm.tsx');
 *    // etc.
 * 
 * 3. Ich scanne ALLE Dateien mit Debug System:
 *    const result = await scanFilesBeforeEditing([
 *      { path: 'src/pages/Auth.tsx', content: authContent },
 *      { path: 'src/components/auth/LoginForm.tsx', content: loginContent },
 *    ]);
 * 
 * 4. Ich sehe SOFORT:
 *    - 15 accent color violations
 *    - 8 missing touch targets
 *    - 3 accessibility issues
 *    - 2 security issues (missing company_id)
 * 
 * 5. Ich erstelle DETAILLIERTES Konzept:
 *    - Liste ALLE Fehler auf
 *    - Gruppiere nach Severity
 *    - Erstelle Fix-Plan
 * 
 * 6. Ich präsentiere dem User:
 *    "Ich habe 28 Fehler gefunden:
 *     - 2 CRITICAL (Security)
 *     - 15 HIGH (Design System)
 *     - 8 MEDIUM (Mobile-First)
 *     - 3 MEDIUM (Accessibility)
 *     
 *     Soll ich alle auf einmal fixen?"
 * 
 * 7. User: "OK" → Ich fixe ALLES in einem Durchgang
 * 
 * VORTEILE:
 * ✅ Ich sehe ALLE Fehler VOR der Bearbeitung
 * ✅ Ich vergesse nichts
 * ✅ Ich arbeite effizienter
 * ✅ Ich liefere perfekte Qualität
 * ✅ User muss nicht mehrfach "Try to Fix" klicken
 */

// ==================================================================================
// PRIORITY SORTER
// ==================================================================================

/**
 * Sortiert Errors nach Priorität für optimalen Fix-Workflow
 */
export function prioritizeErrors(result: PageScanResult) {
  const prioritized = {
    critical: result.errors.filter(e => e.severity === 'critical'),
    high: result.errors.filter(e => e.severity === 'high'),
    medium: result.errors.filter(e => e.severity === 'medium'),
    low: result.errors.filter(e => e.severity === 'low'),
    autoFixable: result.errors.filter(e => e.autoFixable),
  };

  return prioritized;
}

// ==================================================================================
// REPORTING HELPERS
// ==================================================================================

/**
 * Generiert User-freundlichen Summary
 */
export function generateUserSummary(result: PageScanResult): string {
  const { errorsBySeverity, totalErrors } = result;
  
  let summary = `Ich habe ${totalErrors} Optimierungsmöglichkeiten gefunden:\n\n`;
  
  if (errorsBySeverity.critical > 0) {
    summary += `🔴 ${errorsBySeverity.critical} KRITISCHE Fehler (Security, Breaking Issues)\n`;
  }
  if (errorsBySeverity.high > 0) {
    summary += `🟠 ${errorsBySeverity.high} WICHTIGE Fehler (Design System, Mobile-First)\n`;
  }
  if (errorsBySeverity.medium > 0) {
    summary += `🟡 ${errorsBySeverity.medium} MITTLERE Fehler (Accessibility, Code Quality)\n`;
  }
  if (errorsBySeverity.low > 0) {
    summary += `🔵 ${errorsBySeverity.low} KLEINERE Verbesserungen\n`;
  }
  
  const autoFixable = result.errors.filter(e => e.autoFixable).length;
  if (autoFixable > 0) {
    summary += `\n✨ ${autoFixable} davon können automatisch gefixt werden!\n`;
  }
  
  summary += `\nSoll ich alle Fehler auf einmal beheben?`;
  
  return summary;
}

/**
 * Generiert detaillierten Fix-Plan für mich (Agent)
 */
export function generateFixPlan(result: PageScanResult): string {
  const prioritized = prioritizeErrors(result);
  
  const plan = `
🎯 FIX-PLAN (SCHRITT-FÜR-SCHRITT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BATCH 1: CRITICAL FIXES (${prioritized.critical.length})
${prioritized.critical.map((e, i) => `  ${i + 1}. ${e.file}: ${e.title}`).join('\n')}

BATCH 2: AUTO-FIXABLE (${prioritized.autoFixable.length})
${prioritized.autoFixable.slice(0, 10).map((e, i) => `  ${i + 1}. ${e.file}: ${e.title}`).join('\n')}
${prioritized.autoFixable.length > 10 ? `  ... und ${prioritized.autoFixable.length - 10} weitere` : ''}

BATCH 3: HIGH PRIORITY (${prioritized.high.length})
${prioritized.high.slice(0, 10).map((e, i) => `  ${i + 1}. ${e.file}: ${e.title}`).join('\n')}
${prioritized.high.length > 10 ? `  ... und ${prioritized.high.length - 10} weitere` : ''}

BATCH 4: MEDIUM PRIORITY (${prioritized.medium.length})
${prioritized.medium.slice(0, 5).map((e, i) => `  ${i + 1}. ${e.file}: ${e.title}`).join('\n')}
${prioritized.medium.length > 5 ? `  ... und ${prioritized.medium.length - 5} weitere` : ''}
`;

  return plan;
}

// ==================================================================================
// EXPORT ALL HELPERS
// ==================================================================================

export const AgentWorkflow = {
  scanFilesBeforeEditing,
  generateBatchFixes,
  prioritizeErrors,
  generateUserSummary,
  generateFixPlan,
};
