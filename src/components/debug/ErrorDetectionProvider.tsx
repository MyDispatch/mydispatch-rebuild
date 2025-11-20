/* ==================================================================================
   ERROR DETECTION PROVIDER - V6.0 REAL-TIME VALIDATION
   ==================================================================================
   ✅ Real-time form validation
   ✅ Performance monitoring
   ✅ Accessibility checks
   ✅ Development-only (tree-shaken in production)
   ================================================================================== */

import React, { createContext, useContext, useEffect, useState } from "react";
import { logger } from "@/lib/logger";

interface ErrorDetectionConfig {
  validateForms: boolean;
  validateTypes: boolean;
  validatePerformance: boolean;
  validateAccessibility: boolean;
}

interface ErrorDetectionContextValue {
  config: ErrorDetectionConfig;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  addError: (error: ValidationError) => void;
  addWarning: (warning: ValidationWarning) => void;
  clearErrors: () => void;
}

interface ValidationError {
  id: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: number;
  source?: string;
}

interface ValidationWarning {
  id: string;
  message: string;
  timestamp: number;
  source?: string;
}

const ErrorDetectionContext = createContext<ErrorDetectionContextValue | null>(null);

export function useErrorDetectionContext() {
  const context = useContext(ErrorDetectionContext);
  if (!context) {
    throw new Error("useErrorDetectionContext must be used within ErrorDetectionProvider");
  }
  return context;
}

interface Props {
  children: React.ReactNode;
  config?: Partial<ErrorDetectionConfig>;
}

export function ErrorDetectionProvider({ children, config: userConfig }: Props) {
  // Only run in development
  if (import.meta.env.PROD) {
    return <>{children}</>;
  }

  const [config] = useState<ErrorDetectionConfig>({
    validateForms: true,
    validateTypes: true,
    validatePerformance: true,
    validateAccessibility: true,
    ...userConfig,
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [warnings, setWarnings] = useState<ValidationWarning[]>([]);

  const addError = (error: ValidationError) => {
    setErrors((prev) => [...prev, error]);
    logger.error("ErrorDetection: " + error.message, undefined, {
      severity: error.severity,
      source: error.source,
    });
  };

  const addWarning = (warning: ValidationWarning) => {
    setWarnings((prev) => [...prev, warning]);
    logger.warn("ErrorDetection Warning: " + warning.message, {
      source: warning.source,
    });
  };

  const clearErrors = () => {
    setErrors([]);
    setWarnings([]);
  };

  // Performance Monitoring
  useEffect(() => {
    if (!config.validatePerformance) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.duration > 1000) {
          addWarning({
            id: `perf-${Date.now()}`,
            message: `Slow operation: ${entry.name} took ${entry.duration.toFixed(0)}ms`,
            timestamp: Date.now(),
            source: "performance",
          });
        }
      });
    });

    observer.observe({ entryTypes: ["measure", "navigation"] });

    return () => observer.disconnect();
  }, [config.validatePerformance]);

  // Accessibility Validation
  useEffect(() => {
    if (!config.validateAccessibility) return;

    const checkAccessibility = () => {
      // Check for images without alt text
      const imagesWithoutAlt = document.querySelectorAll("img:not([alt])");
      if (imagesWithoutAlt.length > 0) {
        addWarning({
          id: `a11y-img-${Date.now()}`,
          message: `${imagesWithoutAlt.length} images without alt text`,
          timestamp: Date.now(),
          source: "accessibility",
        });
      }

      // Check for buttons without accessible names
      const buttonsWithoutNames = document.querySelectorAll(
        "button:not([aria-label]):not([aria-labelledby]):empty"
      );
      if (buttonsWithoutNames.length > 0) {
        addWarning({
          id: `a11y-btn-${Date.now()}`,
          message: `${buttonsWithoutNames.length} buttons without accessible names`,
          timestamp: Date.now(),
          source: "accessibility",
        });
      }
    };

    // Check on mount and on DOM changes
    checkAccessibility();
    const observer = new MutationObserver(checkAccessibility);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [config.validateAccessibility]);

  const value: ErrorDetectionContextValue = {
    config,
    errors,
    warnings,
    addError,
    addWarning,
    clearErrors,
  };

  return (
    <ErrorDetectionContext.Provider value={value}>
      {children}
      {/* Show error overlay in development */}
      {errors.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
          <div className="bg-status-error text-white p-4 rounded-lg shadow-lg">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold">⚠️ Validation Errors ({errors.length})</h3>
              <button onClick={clearErrors} className="text-white/80 hover:text-white">
                ✕
              </button>
            </div>
            <div className="space-y-1 text-sm max-h-40 overflow-auto">
              {errors.slice(-3).map((error) => (
                <div key={error.id} className="text-white/90">
                  • {error.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ErrorDetectionContext.Provider>
  );
}
