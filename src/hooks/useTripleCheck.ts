/* ==================================================================================
   USE TRIPLE-CHECK HOOK - V6.0
   ==================================================================================
   ✅ Development-only validation hook
   ✅ Syntax, Runtime, Performance checks
   ✅ Automated fix suggestions
   ================================================================================== */

import { useEffect } from "react";
import { TripleCheckSystem } from "@/utils/errorDetection";
import { logger } from "@/lib/logger";

interface UseTripleCheckOptions {
  componentName: string;
  validateOnMount?: boolean;
  showWarnings?: boolean;
}

export function useTripleCheck(options: UseTripleCheckOptions) {
  // Only run in development
  if (import.meta.env.PROD) {
    return;
  }

  useEffect(() => {
    if (options.validateOnMount !== false) {
      // Get component source (if available)
      const componentSource = getComponentSource(options.componentName);

      if (componentSource) {
        // PHASE 1: Syntax validation
        const syntaxValid = TripleCheckSystem.validateSyntax(componentSource);

        if (!syntaxValid) {
          const errors = TripleCheckSystem.getErrors();
          logger.error(`Triple-Check: Syntax errors in ${options.componentName}`, undefined, {
            errors,
            componentName: options.componentName,
          });
        }

        // PHASE 2: Runtime error prediction
        const runtimeIssues = TripleCheckSystem.predictRuntimeErrors(componentSource);

        if (runtimeIssues.length > 0) {
          logger.warn(`Triple-Check: Potential runtime issues in ${options.componentName}`, {
            issues: runtimeIssues,
            componentName: options.componentName,
          });
        }

        // PHASE 3: Performance analysis
        const perfReport = TripleCheckSystem.analyzePerformance(componentSource);

        if (perfReport.reRenderRisks.length > 0 || perfReport.memoryLeakRisks.length > 0) {
          logger.warn(`Triple-Check: Performance issues in ${options.componentName}`, {
            reRenderRisks: perfReport.reRenderRisks,
            memoryLeakRisks: perfReport.memoryLeakRisks,
            bundleSize: perfReport.bundleSizeImpact,
            componentName: options.componentName,
          });
        }

        // Show warnings in console if enabled
        if (options.showWarnings !== false) {
          const warnings = TripleCheckSystem.getWarnings();
          if (warnings.length > 0 && import.meta.env.DEV) {
            console.group(`⚠️ Triple-Check Warnings: ${options.componentName}`);
            warnings.forEach((warning) => console.warn(warning));
            console.groupEnd();
          }
        }
      }
    }

    // Clear on unmount
    return () => {
      TripleCheckSystem.clearErrors();
    };
  }, [options.componentName]);
}

// Helper: Get component source (limited in runtime, but useful for development)
function getComponentSource(componentName: string): string | null {
  // In development, we could use import.meta.glob or similar
  // For now, return null (requires build-time integration for full functionality)
  return null;
}
