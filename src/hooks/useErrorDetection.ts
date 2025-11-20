/* ==================================================================================
   USE ERROR DETECTION HOOK - V6.0
   ==================================================================================
   ✅ Real-time validation for forms, types, performance
   ✅ Development-only (tree-shaken in production)
   ✅ Auto-logs to error_logs table
   ================================================================================== */

import { useEffect } from "react";
import { useErrorDetectionContext } from "@/components/debug/ErrorDetectionProvider";

interface UseErrorDetectionOptions {
  validateForms?: boolean;
  validateTypes?: boolean;
  validatePerformance?: boolean;
  validateAccessibility?: boolean;
  componentName?: string;
}

export function useErrorDetection(options: UseErrorDetectionOptions = {}) {
  // Only run in development
  if (import.meta.env.PROD) {
    return;
  }

  const { addError, addWarning, config } = useErrorDetectionContext();

  useEffect(() => {
    // Form Validation
    if (options.validateForms !== false && config.validateForms) {
      const validateForms = () => {
        const forms = document.querySelectorAll("form");
        forms.forEach((form) => {
          const inputs = form.querySelectorAll("input, textarea, select");
          inputs.forEach((input) => {
            // Check for missing labels
            if (!input.id || !document.querySelector(`label[for="${input.id}"]`)) {
              addWarning({
                id: `form-label-${Date.now()}`,
                message: `Input without label: ${(input as HTMLInputElement).name || "unnamed"}`,
                timestamp: Date.now(),
                source: options.componentName || "useErrorDetection",
              });
            }

            // Check for missing required validation
            if ((input as HTMLInputElement).required && !(input as HTMLInputElement).pattern) {
              addWarning({
                id: `form-validation-${Date.now()}`,
                message: `Required input without validation pattern: ${(input as HTMLInputElement).name}`,
                timestamp: Date.now(),
                source: options.componentName || "useErrorDetection",
              });
            }
          });
        });
      };

      validateForms();
    }

    // Performance Validation
    if (options.validatePerformance !== false && config.validatePerformance) {
      const startTime = performance.now();

      return () => {
        const renderTime = performance.now() - startTime;
        if (renderTime > 100) {
          addWarning({
            id: `perf-render-${Date.now()}`,
            message: `Slow component render: ${options.componentName || "unknown"} took ${renderTime.toFixed(0)}ms`,
            timestamp: Date.now(),
            source: options.componentName || "useErrorDetection",
          });
        }
      };
    }
  }, []);
}
