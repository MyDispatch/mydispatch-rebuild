/* ==================================================================================
   ERROR DETECTION UTILITIES - V6.0 TRIPLE-CHECK SYSTEM
   ==================================================================================
   ✅ Syntax & Type Validation
   ✅ Runtime Error Prediction
   ✅ Performance Impact Analysis
   ✅ Automated Fix Suggestions
   ================================================================================== */

export interface ErrorAnalysis {
  file: string;
  line: number;
  error: string;
  severity: "info" | "warning" | "error" | "critical";
  autoFixable: boolean;
  suggestion: string;
  preventionTip: string;
}

export interface PerformanceReport {
  reRenderRisks: string[];
  memoryLeakRisks: string[];
  bundleSizeImpact: number;
}

export interface FixSuggestion {
  error: string;
  severity: "low" | "medium" | "high" | "critical";
  autoFix?: string;
  manualSteps: string[];
}

export class TripleCheckSystem {
  private static errors: string[] = [];
  private static warnings: string[] = [];

  // PHASE 1: SYNTAX & TYPE VALIDATION
  static validateSyntax(code: string): boolean {
    this.errors = [];

    try {
      // Basic syntax checks
      if (code.includes("useState()") && !code.includes("useState<")) {
        this.errors.push("Missing TypeScript type for useState");
      }

      if (code.includes(".map(") && !code.includes("key=")) {
        this.errors.push("Missing key prop in map function");
      }

      if (code.includes("useEffect(") && !code.match(/useEffect\([^,]+,\s*\[/)) {
        this.errors.push("useEffect missing dependency array");
      }

      // Check for unsafe property access
      const unsafeAccessRegex = /(\w+)\.(\w+)(?!\?)/g;
      const matches = code.match(unsafeAccessRegex);
      if (matches && !code.includes("?.")) {
        this.errors.push("Potential null/undefined property access - use optional chaining");
      }

      // Check for console statements
      if (code.includes("console.log") || code.includes("console.error")) {
        this.warnings.push("Console statements found in code");
      }

      return this.errors.length === 0;
    } catch (error) {
      this.errors.push(`Syntax error: ${error instanceof Error ? error.message : "Unknown error"}`);
      return false;
    }
  }

  // PHASE 2: RUNTIME ERROR PREDICTION
  static predictRuntimeErrors(componentCode: string): string[] {
    const potentialIssues: string[] = [];

    // Check for common React antipatterns
    if (componentCode.includes("useState()") && !componentCode.includes("useState<")) {
      potentialIssues.push("Missing TypeScript type for useState");
    }

    if (componentCode.includes(".map(") && !componentCode.includes("key=")) {
      potentialIssues.push("Missing key prop in map function");
    }

    if (componentCode.includes("useEffect(") && !componentCode.includes("deps")) {
      potentialIssues.push("useEffect missing dependency array");
    }

    // Check for unsafe property access
    const unsafeAccessRegex = /\w+\.\w+(?!\?)/g;
    if (unsafeAccessRegex.test(componentCode)) {
      potentialIssues.push("Potential null/undefined property access");
    }

    // Check for missing error handling
    if (componentCode.includes("await ") && !componentCode.includes("try")) {
      potentialIssues.push("Missing error handling for async operation");
    }

    // Check for potential infinite loops
    if (componentCode.includes("setState") && componentCode.includes("useEffect")) {
      potentialIssues.push("Potential infinite re-render (setState in useEffect)");
    }

    return potentialIssues;
  }

  // PHASE 3: PERFORMANCE IMPACT ANALYSIS
  static analyzePerformance(code: string): PerformanceReport {
    return {
      reRenderRisks: this.checkReRenderRisks(code),
      memoryLeakRisks: this.checkMemoryLeaks(code),
      bundleSizeImpact: this.estimateBundleSize(code),
    };
  }

  private static checkReRenderRisks(code: string): string[] {
    const risks: string[] = [];

    // Check for inline object/array creation in JSX
    if (code.match(/\w+\s*=\s*{[^}]+}/g)) {
      risks.push("Inline object creation may cause unnecessary re-renders");
    }

    // Check for missing useMemo/useCallback
    if (code.includes("map(") && !code.includes("useMemo")) {
      risks.push("Array transformation without useMemo may cause performance issues");
    }

    return risks;
  }

  private static checkMemoryLeaks(code: string): string[] {
    const risks: string[] = [];

    // Check for event listeners without cleanup
    if (code.includes("addEventListener") && !code.includes("removeEventListener")) {
      risks.push("Event listener without cleanup may cause memory leak");
    }

    // Check for intervals without cleanup
    if (code.includes("setInterval") && !code.includes("clearInterval")) {
      risks.push("Interval without cleanup may cause memory leak");
    }

    // Check for subscriptions without cleanup
    if ((code.includes("subscribe") || code.includes(".on(")) && !code.includes("unsubscribe")) {
      risks.push("Subscription without cleanup may cause memory leak");
    }

    return risks;
  }

  private static estimateBundleSize(code: string): number {
    // Rough estimation based on code length and imports
    const baseSize = code.length;
    const importCount = (code.match(/import/g) || []).length;
    return baseSize + importCount * 100; // Estimated bytes
  }

  // AUTOMATED FIX SUGGESTIONS
  static generateFixSuggestions(errors: string[]): FixSuggestion[] {
    return errors.map((error) => ({
      error,
      severity: this.calculateSeverity(error),
      autoFix: this.generateAutoFix(error),
      manualSteps: this.getManualFixSteps(error),
    }));
  }

  private static calculateSeverity(error: string): "low" | "medium" | "high" | "critical" {
    if (error.includes("null") || error.includes("undefined")) return "high";
    if (error.includes("infinite") || error.includes("memory leak")) return "critical";
    if (error.includes("performance") || error.includes("re-render")) return "medium";
    return "low";
  }

  private static generateAutoFix(error: string): string | undefined {
    if (error.includes("null/undefined property access")) {
      return "Replace with optional chaining (?. operator)";
    }
    if (error.includes("Missing key prop")) {
      return "Add key={item.id} or key={index} prop";
    }
    if (error.includes("Console statements")) {
      return "Remove console statement or replace with logger";
    }
    if (error.includes("useState type")) {
      return "Add type parameter: useState<YourType>(initialValue)";
    }
    return undefined;
  }

  private static getManualFixSteps(error: string): string[] {
    if (error.includes("null/undefined property access")) {
      return [
        "Identify the property access that may be null/undefined",
        "Add optional chaining: obj?.property",
        "Or add null check: obj && obj.property",
      ];
    }
    if (error.includes("Missing key prop")) {
      return [
        "Find the .map() call",
        "Add unique key prop to each element",
        "Use item.id if available, or index as last resort",
      ];
    }
    if (error.includes("useEffect missing dependency")) {
      return [
        "Review all variables used in useEffect",
        "Add them to the dependency array",
        "Or use ESLint rule to auto-fix",
      ];
    }
    return ["Review the error and fix manually"];
  }

  static getErrors(): string[] {
    return [...this.errors];
  }

  static getWarnings(): string[] {
    return [...this.warnings];
  }

  static clearErrors(): void {
    this.errors = [];
    this.warnings = [];
  }
}
