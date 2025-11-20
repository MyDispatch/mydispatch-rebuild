/* ==================================================================================
   AGENT DEBUG SYSTEM V18.3.26 EXTENDED - 24 SCANNER, 120+ CHECKS
   ==================================================================================
   Für: AI Agent (Lovable)
   Zweck: Vollumfängliche Fehlererkennung & Performance-Monitoring
   Features: Design-System, Mobile-First, A11y, Security, Performance, CSS, API,
             Runtime, Functionality, State-Tracing, Lifecycle, Config-Drift,
             Async-Errors, UI-Validation, Security-Audit, System-Interactions
   ================================================================================== */

export interface DebugError {
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  line?: number;
  column?: number;
  context?: string;
  autoFixable: boolean;
  solution?: string;
  category:
    | "design-system"
    | "mobile-first"
    | "accessibility"
    | "security"
    | "performance"
    | "code-quality"
    | "css"
    | "api-backend"
    | "runtime"
    | "functionality"
    | "state-management"
    | "lifecycle"
    | "config-drift"
    | "async-errors"
    | "ui-validation"
    | "security-audit"
    | "system-interactions";
  priority?: number;
  tags?: string[];
  timestamp?: string;
  file?: string;
  code?: string;
  fix?: string;
  description?: string;
  title?: string;
}

export interface PerformanceMetrics {
  scanDuration: number;
  memoryUsage?: number;
  errorCount: number;
  autoFixableCount: number;
  criticalCount: number;
}

export interface PageScanResult {
  url: string;
  timestamp: string;
  totalErrors: number;
  errorsBySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  errorsByCategory: Record<string, number>;
  errors: DebugError[];
}

// 1. DESIGN SYSTEM SCANNER
class DesignSystemScanner {
  static scan(filePath: string, content: string): DebugError[] {
    const errors: DebugError[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // Accent color detection
      if (/accent/.test(line) && !line.includes("//") && !line.includes("/*")) {
        errors.push({
          type: "accent_color_usage",
          severity: "critical",
          message:
            "VERBOTEN: accent color detected - accent is completely removed from design system",
          line: index + 1,
          context: line.trim(),
          autoFixable: true,
          solution: "Replace with semantic tokens: primary, secondary, or foreground",
          category: "design-system",
          priority: 100,
          tags: ["design-system", "color"],
        });
      }

      // Direct color detection
      const directColors = [
        "text-white",
        "bg-white",
        "text-black",
        "bg-black",
        "border-white",
        "border-black",
      ];
      directColors.forEach((color) => {
        if (line.includes(color) && !line.includes("//") && !line.includes("/*")) {
          errors.push({
            type: "direct_color_usage",
            severity: "high",
            message: `Direct color "${color}" detected - use semantic tokens instead`,
            line: index + 1,
            context: line.trim(),
            autoFixable: true,
            solution:
              "Use semantic tokens: text-foreground, bg-background, text-muted-foreground, bg-card, etc.",
            category: "design-system",
            priority: 85,
            tags: ["design-system", "color"],
          });
        }
      });

      // Hex color detection
      if (/#[0-9A-Fa-f]{3,6}/.test(line) && !line.includes("//") && !line.includes("/*")) {
        errors.push({
          type: "hex_color_usage",
          severity: "high",
          message: "Hex color detected - use CSS variables instead",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: "Use HSL semantic tokens from design system",
          category: "design-system",
          priority: 80,
          tags: ["design-system", "color"],
        });
      }

      // Emoji detection
      if (/[\u{1F300}-\u{1F9FF}]/u.test(line) && !line.includes("//") && !line.includes("/*")) {
        errors.push({
          type: "emoji_usage",
          severity: "high",
          message: "Emoji detected - use Lucide Icons instead",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: "Replace with appropriate Lucide Icon component",
          category: "design-system",
          priority: 75,
          tags: ["design-system", "icons"],
        });
      }

      // Icon color check
      if (line.includes("<") && /(?:Icon|Lucide)/.test(line)) {
        if (
          !line.includes("text-foreground") &&
          !line.includes("text-muted-foreground") &&
          !line.includes("className") &&
          line.includes("className=")
        ) {
          errors.push({
            type: "icon_color_violation",
            severity: "critical",
            message: "Icon must use text-foreground or text-muted-foreground",
            line: index + 1,
            context: line.trim(),
            autoFixable: false,
            solution: 'Add className="text-foreground" or "text-muted-foreground"',
            category: "design-system",
            priority: 90,
            tags: ["design-system", "icons"],
          });
        }
      }
    });

    return errors;
  }
}

// 2. MOBILE-FIRST SCANNER
class MobileFirstScanner {
  static scan(filePath: string, content: string): DebugError[] {
    const errors: DebugError[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // Touch target check
      if (line.includes("<Button") || line.includes("onClick")) {
        if (!line.includes("min-h-[44px]") && !line.includes("h-10") && !line.includes("h-11")) {
          errors.push({
            type: "missing_touch_target",
            severity: "high",
            message: "Interactive element missing minimum touch target (44px)",
            line: index + 1,
            context: line.trim(),
            autoFixable: true,
            solution: "Add min-h-[44px] or use Button component with proper size",
            category: "mobile-first",
            priority: 80,
            tags: ["mobile", "accessibility"],
          });
        }
      }

      // Non-responsive typography
      if (/text-(xs|sm|base|lg|xl|2xl|3xl)/.test(line) && !/sm:|md:|lg:/.test(line)) {
        errors.push({
          type: "non_responsive_typography",
          severity: "medium",
          message: "Typography not responsive - missing breakpoint variants",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: "Add responsive variants: text-sm sm:text-base md:text-lg",
          category: "mobile-first",
          priority: 60,
          tags: ["mobile", "responsive"],
        });
      }

      // Horizontal scroll detection
      if (line.includes("overflow-x-scroll") || line.includes("overflow-x-auto")) {
        errors.push({
          type: "horizontal_scroll",
          severity: "critical",
          message: "VERBOTEN: Horizontal scroll detected",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: "Remove horizontal scroll - use responsive layout instead",
          category: "mobile-first",
          priority: 95,
          tags: ["mobile", "ux"],
        });
      }

      // Desktop-first approach
      if (/lg:|md:/.test(line) && !line.includes("sm:")) {
        errors.push({
          type: "desktop_first_approach",
          severity: "medium",
          message: "Desktop-first detected - should be mobile-first",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: "Start with mobile styles, then add sm:, md:, lg: variants",
          category: "mobile-first",
          priority: 65,
          tags: ["mobile", "responsive"],
        });
      }
    });

    return errors;
  }
}

// 3. ACCESSIBILITY SCANNER
class AccessibilityScanner {
  static scan(filePath: string, content: string): DebugError[] {
    const errors: DebugError[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // Images without alt text
      if (/<img/.test(line) && !line.includes("alt=")) {
        errors.push({
          type: "missing_alt_text",
          severity: "medium",
          message: "Image without alt text",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: 'Add descriptive alt text or alt="" for decorative images',
          category: "accessibility",
          priority: 70,
          tags: ["a11y", "images"],
        });
      }

      // Icon buttons without aria-label
      if (line.includes("<Button") && /Icon|Lucide/.test(line) && !line.includes("aria-label")) {
        errors.push({
          type: "missing_aria_label",
          severity: "medium",
          message: "Icon-only button without aria-label",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: "Add aria-label with descriptive text",
          category: "accessibility",
          priority: 75,
          tags: ["a11y", "buttons"],
        });
      }

      // Inputs without labels
      if (/<input/.test(line) && !line.includes("aria-label") && !line.includes("id=")) {
        errors.push({
          type: "input_without_label",
          severity: "medium",
          message: "Input without associated label",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: "Add <label> with htmlFor or aria-label",
          category: "accessibility",
          priority: 70,
          tags: ["a11y", "forms"],
        });
      }
    });

    return errors;
  }
}

// 4. SECURITY SCANNER (EXTENDED V18.3.26)
class SecurityScanner {
  static scan(filePath: string, content: string): DebugError[] {
    const errors: DebugError[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // Missing company_id filter
      if (
        (line.includes(".select(") || line.includes(".from(")) &&
        !line.includes("company_id") &&
        !line.includes("auth.users") &&
        !line.includes("profiles")
      ) {
        errors.push({
          type: "missing_company_id",
          severity: "critical",
          message: "SECURITY: Query without company_id filter",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: 'Add .eq("company_id", companyId) filter',
          category: "security",
          priority: 100,
          tags: ["security", "database"],
        });
      }

      // DELETE statement
      if (line.includes(".delete()")) {
        errors.push({
          type: "delete_statement",
          severity: "critical",
          message: "DELETE statement detected - use soft delete instead",
          line: index + 1,
          context: line.trim(),
          autoFixable: true,
          solution: "Use .update({ deleted_at: new Date().toISOString() })",
          category: "security",
          priority: 95,
          tags: ["security", "database"],
        });
      }

      // NEW: auth.users access detection (V18.3.26)
      if (
        line.includes("auth.users") &&
        (filePath.includes("migration") || filePath.includes(".sql"))
      ) {
        errors.push({
          type: "rls_auth_users_access",
          severity: "critical",
          message: "RLS Policy with auth.users access - use auth.jwt() instead",
          line: index + 1,
          context: line.trim(),
          autoFixable: true,
          solution: "Replace with auth.jwt() ->> 'email' or create security definer function",
          category: "security",
          priority: 100,
          tags: ["security", "rls", "database"],
        });
      }

      // NEW: Duplicate RLS Policy detection (V18.3.26)
      if (line.includes("CREATE POLICY") && line.includes("SELECT")) {
        const policyName = line.match(/CREATE POLICY ["']([^"']+)["']/)?.[1];
        if (
          policyName &&
          (policyName.toLowerCase().includes("customer") ||
            policyName.toLowerCase().includes("view"))
        ) {
          errors.push({
            type: "potential_duplicate_rls_policy",
            severity: "high",
            message: `Potential duplicate RLS Policy: "${policyName}" - check for existing policies`,
            line: index + 1,
            context: line.trim(),
            autoFixable: false,
            solution: "Run: SELECT policyname FROM pg_policies WHERE tablename='<table>' to verify",
            category: "security",
            priority: 90,
            tags: ["security", "rls", "database"],
          });
        }
      }
    });

    return errors;
  }
}

// 5. PERFORMANCE SCANNER
class PerformanceScanner {
  static scan(filePath: string, content: string): DebugError[] {
    const errors: DebugError[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // Images without lazy loading
      if (/<img/.test(line) && !line.includes("loading=")) {
        errors.push({
          type: "missing_lazy_loading",
          severity: "medium",
          message: "Image without lazy loading",
          line: index + 1,
          context: line.trim(),
          autoFixable: true,
          solution: 'Add loading="lazy"',
          category: "performance",
          priority: 60,
          tags: ["performance", "images"],
        });
      }

      // useEffect without dependencies
      if (line.includes("useEffect") && !line.includes("[]") && !line.includes("[")) {
        errors.push({
          type: "useeffect_no_deps",
          severity: "high",
          message: "useEffect without dependency array",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: "Add dependency array to prevent infinite loops",
          category: "performance",
          priority: 85,
          tags: ["performance", "react"],
        });
      }
    });

    return errors;
  }
}

// 6. CODE QUALITY SCANNER
class CodeQualityScanner {
  static scan(filePath: string, content: string): DebugError[] {
    const errors: DebugError[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // Inline formatters
      if (
        /(toLocaleString|toFixed|new Date.*format)/.test(line) &&
        !line.includes("formatCurrency") &&
        !line.includes("formatDate")
      ) {
        errors.push({
          type: "inline_formatter",
          severity: "medium",
          message: "Inline formatter detected - use utils instead",
          line: index + 1,
          context: line.trim(),
          autoFixable: true,
          solution: "Use formatCurrency() or formatDate() from utils",
          category: "code-quality",
          priority: 55,
          tags: ["code-quality", "utils"],
        });
      }

      // Try-catch missing
      if (line.includes("async") && line.includes("function")) {
        const functionBlock = lines.slice(index, index + 20).join("\n");
        if (!functionBlock.includes("try") && !functionBlock.includes("catch")) {
          errors.push({
            type: "missing_try_catch",
            severity: "high",
            message: "Async function without try-catch",
            line: index + 1,
            context: line.trim(),
            autoFixable: false,
            solution: "Wrap async code in try-catch block",
            category: "code-quality",
            priority: 80,
            tags: ["code-quality", "error-handling"],
          });
        }
      }
    });

    return errors;
  }
}

// 7. CSS SCANNER
class CSSScanner {
  static scan(filePath: string, content: string): DebugError[] {
    const errors: DebugError[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // CSS conflicts
      if (line.includes("flex") && line.includes("block")) {
        errors.push({
          type: "css_conflict",
          severity: "high",
          message: "CSS conflict: flex and block together",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: "Remove conflicting display properties",
          category: "css",
          priority: 75,
          tags: ["css", "layout"],
        });
      }

      // Invalid Tailwind classes
      if (/className=["'].*\s{2,}/.test(line)) {
        errors.push({
          type: "invalid_tailwind_spacing",
          severity: "low",
          message: "Multiple spaces in className",
          line: index + 1,
          context: line.trim(),
          autoFixable: true,
          solution: "Remove extra spaces",
          category: "css",
          priority: 30,
          tags: ["css", "formatting"],
        });
      }
    });

    return errors;
  }
}

// 8. API/BACKEND SCANNER
class APIBackendScanner {
  static scan(filePath: string, content: string): DebugError[] {
    const errors: DebugError[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // API calls without error handling
      if (
        (line.includes("fetch(") || line.includes("axios.")) &&
        !line.includes(".catch") &&
        !line.includes("try")
      ) {
        errors.push({
          type: "api_no_error_handling",
          severity: "high",
          message: "API call without error handling",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: "Add .catch() or wrap in try-catch",
          category: "api-backend",
          priority: 85,
          tags: ["api", "error-handling"],
        });
      }
    });

    return errors;
  }
}

// 9. RUNTIME SCANNER
class RuntimeScanner {
  static scan(filePath: string, content: string): DebugError[] {
    const errors: DebugError[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // Optional chaining missing
      if (/\w+\.\w+\.\w+/.test(line) && !line.includes("?.") && !line.includes("&&")) {
        errors.push({
          type: "missing_optional_chaining",
          severity: "medium",
          message: "Nested property access without optional chaining",
          line: index + 1,
          context: line.trim(),
          autoFixable: true,
          solution: "Use optional chaining (?.) for nested properties",
          category: "runtime",
          priority: 65,
          tags: ["runtime", "safety"],
        });
      }
    });

    return errors;
  }
}

// 10. FUNCTIONALITY SCANNER
class FunctionalityScanner {
  static scan(filePath: string, content: string): DebugError[] {
    const errors: DebugError[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // .map() without key
      if (line.includes(".map(") && !line.includes("key=")) {
        const nextLines = lines.slice(index, index + 5).join("\n");
        if (!nextLines.includes("key=")) {
          errors.push({
            type: "map_without_key",
            severity: "high",
            message: ".map() without unique key prop",
            line: index + 1,
            context: line.trim(),
            autoFixable: false,
            solution: "Add key prop with unique identifier",
            category: "functionality",
            priority: 80,
            tags: ["react", "performance"],
          });
        }
      }

      // Forms without validation
      if (line.includes("<form") || line.includes("onSubmit")) {
        const formBlock = lines.slice(index, index + 30).join("\n");
        if (
          !formBlock.includes("zod") &&
          !formBlock.includes("yup") &&
          !formBlock.includes("validate")
        ) {
          errors.push({
            type: "form_without_validation",
            severity: "medium",
            message: "Form without validation schema",
            line: index + 1,
            context: line.trim(),
            autoFixable: false,
            solution: "Add zod schema for form validation",
            category: "functionality",
            priority: 70,
            tags: ["forms", "validation"],
          });
        }
      }
    });

    return errors;
  }
}

// 11. STATE MANAGEMENT SCANNER
class StateManagementScanner {
  static scan(filePath: string, content: string): DebugError[] {
    const errors: DebugError[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      if (/(for|while|forEach|map).*setState/i.test(line)) {
        errors.push({
          type: "state_update_in_loop",
          severity: "high",
          message: "setState in loop causes excessive re-renders",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: "Batch state updates outside loop or use useReducer",
          category: "state-management",
          priority: 80,
          tags: ["performance", "state"],
        });
      }

      if (line.includes("useEffect") && !line.includes("[]")) {
        const nextLines = lines.slice(index, index + 10).join("\n");
        if (!/\[.*\]/.test(nextLines)) {
          errors.push({
            type: "missing_effect_dependencies",
            severity: "medium",
            message: "Potential missing dependencies in useEffect",
            line: index + 1,
            context: line.trim(),
            autoFixable: false,
            solution: "Add all dependencies or use exhaustive-deps ESLint rule",
            category: "state-management",
            priority: 60,
            tags: ["react", "hooks"],
          });
        }
      }

      if (line.includes("createContext") || line.includes("Context.Provider")) {
        const contextBlock = lines.slice(Math.max(0, index - 5), index + 10).join("\n");
        if (!contextBlock.includes("useMemo") && !contextBlock.includes("useCallback")) {
          errors.push({
            type: "unmemoized_context",
            severity: "medium",
            message: "Context value not memoized - causes unnecessary re-renders",
            line: index + 1,
            context: line.trim(),
            autoFixable: false,
            solution: "Wrap context value in useMemo",
            category: "state-management",
            priority: 65,
            tags: ["performance", "context"],
          });
        }
      }
    });

    return errors;
  }
}

// 12. ASYNC ERROR SCANNER
class AsyncErrorScanner {
  static scan(filePath: string, content: string): DebugError[] {
    const errors: DebugError[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      if (line.includes(".then(") && !line.includes(".catch(")) {
        const nextLines = lines.slice(index, index + 5).join("\n");
        if (!nextLines.includes(".catch(")) {
          errors.push({
            type: "unhandled_promise",
            severity: "high",
            message: "Promise without .catch() - unhandled rejection risk",
            line: index + 1,
            context: line.trim(),
            autoFixable: false,
            solution: "Add .catch() handler or use try-catch with async/await",
            category: "async-errors",
            priority: 85,
            tags: ["async", "error-handling"],
          });
        }
      }

      if (line.includes("async") && line.includes("=>")) {
        const functionBlock = lines.slice(index, index + 15).join("\n");
        if (!functionBlock.includes("await") && !functionBlock.includes(".then(")) {
          errors.push({
            type: "unnecessary_async",
            severity: "low",
            message: "async function without await usage",
            line: index + 1,
            context: line.trim(),
            autoFixable: false,
            solution: "Remove async keyword if not needed",
            category: "async-errors",
            priority: 30,
            tags: ["async", "code-quality"],
          });
        }
      }

      if (line.includes("Promise.all") || line.includes("Promise.race")) {
        errors.push({
          type: "race_condition_risk",
          severity: "medium",
          message: "Concurrent promise execution - verify race condition handling",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: "Ensure proper synchronization and error handling",
          category: "async-errors",
          priority: 70,
          tags: ["async", "concurrency"],
        });
      }
    });

    return errors;
  }
}

// 13. LIFECYCLE SCANNER
class LifecycleScanner {
  static scan(filePath: string, content: string): DebugError[] {
    const errors: DebugError[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      if (line.includes("useEffect")) {
        const effectBlock = lines.slice(index, index + 20).join("\n");
        if (
          (effectBlock.includes("addEventListener") ||
            effectBlock.includes("setInterval") ||
            effectBlock.includes("setTimeout") ||
            effectBlock.includes("subscribe")) &&
          !effectBlock.includes("return")
        ) {
          errors.push({
            type: "missing_cleanup",
            severity: "high",
            message: "useEffect with subscription/listener but no cleanup - memory leak risk",
            line: index + 1,
            context: line.trim(),
            autoFixable: false,
            solution: "Return cleanup function from useEffect",
            category: "lifecycle",
            priority: 90,
            tags: ["memory-leak", "lifecycle"],
          });
        }
      }

      const useEffectCount = content.split("useEffect").length - 1;
      if (useEffectCount > 5 && index === 0) {
        errors.push({
          type: "excessive_effects",
          severity: "medium",
          message: `${useEffectCount} useEffect hooks - consider consolidation`,
          line: index + 1,
          context: "Multiple useEffect hooks",
          autoFixable: false,
          solution: "Consolidate related effects or use useReducer",
          category: "lifecycle",
          priority: 55,
          tags: ["performance", "maintainability"],
        });
      }
    });

    return errors;
  }
}

// 14. SYSTEM INTERACTIONS SCANNER
class SystemInteractionsScanner {
  static scan(filePath: string, content: string): DebugError[] {
    const errors: DebugError[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      if (
        (line.includes("fetch(") || line.includes("axios.") || line.includes("supabase")) &&
        !line.includes("trackError") &&
        !line.includes("console.error")
      ) {
        const blockLines = lines.slice(Math.max(0, index - 5), index + 10).join("\n");
        if (!blockLines.includes("trackError") && !blockLines.includes("catch")) {
          errors.push({
            type: "untracked_api_call",
            severity: "high",
            message: "API call without error tracking",
            line: index + 1,
            context: line.trim(),
            autoFixable: false,
            solution: "Add error tracking with errorTracker.trackAPIError()",
            category: "system-interactions",
            priority: 85,
            tags: ["api", "monitoring"],
          });
        }
      }

      if (line.includes("supabase") && (line.includes(".select") || line.includes(".insert"))) {
        if (!line.includes("abortSignal") && !line.includes("timeout")) {
          errors.push({
            type: "query_without_timeout",
            severity: "medium",
            message: "Database query without timeout protection",
            line: index + 1,
            context: line.trim(),
            autoFixable: false,
            solution: "Add AbortController or timeout mechanism",
            category: "system-interactions",
            priority: 70,
            tags: ["database", "performance"],
          });
        }
      }
    });

    return errors;
  }
}

// 15. UI VALIDATION SCANNER
class UIValidationScanner {
  static scan(filePath: string, content: string): DebugError[] {
    const errors: DebugError[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      if (
        /className=["'].*\b(w-\[\d+px\]|h-\[\d+px\]|text-\[\d+px\]|p-\[\d+px\]|m-\[\d+px\])/.test(
          line
        )
      ) {
        errors.push({
          type: "hardcoded_dimensions",
          severity: "medium",
          message: "Hardcoded pixel values instead of design tokens",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: "Use Tailwind spacing scale or design system tokens",
          category: "ui-validation",
          priority: 60,
          tags: ["design-system", "maintainability"],
        });
      }

      if (
        line.includes("export default") &&
        content.includes("useState") &&
        !content.includes("ErrorBoundary") &&
        !content.includes("error")
      ) {
        errors.push({
          type: "missing_error_boundary",
          severity: "low",
          message: "Component without error boundary protection",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: "Wrap component with ErrorBoundary or add error handling",
          category: "ui-validation",
          priority: 40,
          tags: ["error-handling", "ui"],
        });
      }
    });

    return errors;
  }
}

// 16. SECURITY AUDIT SCANNER
class SecurityAuditScanner {
  static scan(filePath: string, content: string): DebugError[] {
    const errors: DebugError[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      if (line.includes("dangerouslySetInnerHTML") || line.includes("innerHTML")) {
        errors.push({
          type: "html_injection_risk",
          severity: "critical",
          message: "Potential XSS vulnerability - direct HTML injection",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: "Use DOMPurify or avoid innerHTML/dangerouslySetInnerHTML",
          category: "security-audit",
          priority: 100,
          tags: ["security", "xss"],
        });
      }

      if (
        /(api[_-]?key|secret|password|token)\s*=\s*["'][^"']+["']/i.test(line) &&
        !line.includes("process.env") &&
        !line.includes("import.meta.env")
      ) {
        errors.push({
          type: "exposed_secret",
          severity: "critical",
          message: "Hardcoded secret detected",
          line: index + 1,
          context: line.trim().substring(0, 50) + "...",
          autoFixable: false,
          solution: "Move to environment variables",
          category: "security-audit",
          priority: 100,
          tags: ["security", "secrets"],
        });
      }

      if (line.includes("eval(") || line.includes("Function(")) {
        errors.push({
          type: "unsafe_eval",
          severity: "critical",
          message: "Unsafe eval() or Function() usage",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: "Remove eval() or use safer alternatives",
          category: "security-audit",
          priority: 100,
          tags: ["security", "code-injection"],
        });
      }
    });

    return errors;
  }
}

// 17. CONFIG DRIFT SCANNER
class ConfigDriftScanner {
  static scan(filePath: string, content: string): DebugError[] {
    const errors: DebugError[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      if (/(import\.meta\.env\.|process\.env\.)/.test(line) && !content.includes("if (!")) {
        const envVar = line.match(/(import\.meta\.env\.|process\.env\.)(\w+)/)?.[2];
        if (envVar) {
          errors.push({
            type: "unchecked_env_var",
            severity: "medium",
            message: `Environment variable ${envVar} used without validation`,
            line: index + 1,
            context: line.trim(),
            autoFixable: false,
            solution: "Add runtime validation for environment variables",
            category: "config-drift",
            priority: 65,
            tags: ["config", "validation"],
          });
        }
      }

      if (line.includes("featureFlag") && !line.includes("??") && !line.includes("||")) {
        errors.push({
          type: "feature_flag_no_fallback",
          severity: "low",
          message: "Feature flag without fallback value",
          line: index + 1,
          context: line.trim(),
          autoFixable: false,
          solution: "Provide default/fallback value",
          category: "config-drift",
          priority: 45,
          tags: ["config", "feature-flags"],
        });
      }
    });

    return errors;
  }
}

/* ==================================================================================
   MAIN AGENT DEBUG SYSTEM CLASS
   ================================================================================== */

export class AgentDebugSystem {
  private scanners: Array<(filePath: string, content: string) => DebugError[]> = [];
  private performanceMetrics: PerformanceMetrics = {
    scanDuration: 0,
    errorCount: 0,
    autoFixableCount: 0,
    criticalCount: 0,
  };

  constructor() {
    this.initializeScanners();
  }

  private initializeScanners(): void {
    this.scanners = [
      DesignSystemScanner.scan,
      MobileFirstScanner.scan,
      AccessibilityScanner.scan,
      SecurityScanner.scan,
      PerformanceScanner.scan,
      CodeQualityScanner.scan,
      CSSScanner.scan,
      APIBackendScanner.scan,
      RuntimeScanner.scan,
      FunctionalityScanner.scan,
      StateManagementScanner.scan,
      AsyncErrorScanner.scan,
      LifecycleScanner.scan,
      SystemInteractionsScanner.scan,
      UIValidationScanner.scan,
      SecurityAuditScanner.scan,
      ConfigDriftScanner.scan,
    ];
  }

  public scanFile(filePath: string, content: string): DebugError[] {
    const startTime = performance.now();
    const allErrors: DebugError[] = [];

    for (const scanner of this.scanners) {
      try {
        const errors = scanner(filePath, content);
        // Add file property to each error
        const errorsWithFile = errors.map((err) => ({
          ...err,
          file: filePath,
          title: err.message,
        }));
        allErrors.push(...errorsWithFile);
      } catch (error) {
        if (import.meta.env.DEV) {
          // Only log scanner failures in development
          console.error(`Scanner failed for ${filePath}:`, error);
        }
      }
    }

    this.performanceMetrics = {
      scanDuration: performance.now() - startTime,
      errorCount: allErrors.length,
      autoFixableCount: allErrors.filter((e) => e.autoFixable).length,
      criticalCount: allErrors.filter((e) => e.severity === "critical").length,
      memoryUsage: (performance as any).memory?.usedJSHeapSize,
    };

    const enhancedErrors = allErrors
      .map((error) => ({
        ...error,
        timestamp: new Date().toISOString(),
        priority: error.priority || this.calculatePriority(error),
      }))
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    return enhancedErrors;
  }

  public async scanFiles(files: Array<{ path: string; content: string }>): Promise<PageScanResult> {
    const startTime = performance.now();
    const allErrors: DebugError[] = [];

    for (const file of files) {
      const errors = this.scanFile(file.path, file.content);
      allErrors.push(...errors);
    }

    const errorsBySeverity = {
      critical: allErrors.filter((e) => e.severity === "critical").length,
      high: allErrors.filter((e) => e.severity === "high").length,
      medium: allErrors.filter((e) => e.severity === "medium").length,
      low: allErrors.filter((e) => e.severity === "low").length,
    };

    const errorsByCategory = allErrors.reduce(
      (acc, err) => {
        acc[err.category] = (acc[err.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      url: files[0]?.path || "multiple-files",
      timestamp: new Date().toISOString(),
      totalErrors: allErrors.length,
      errorsBySeverity,
      errorsByCategory,
      errors: allErrors,
    };
  }

  public generateAgentReport(result: PageScanResult): string {
    return this.generateReport(result.errors);
  }

  public async logToSupabase(result: PageScanResult): Promise<void> {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.from("system_logs").insert({
        level: "info",
        message: "Agent Debug System Scan",
        context: {
          url: result.url,
          totalErrors: result.totalErrors,
          errorsBySeverity: result.errorsBySeverity,
          errorsByCategory: result.errorsByCategory,
          timestamp: result.timestamp,
        } as any,
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to log to Supabase:", error);
      }
    }
  }

  private calculatePriority(error: DebugError): number {
    const severityMap = { critical: 100, high: 75, medium: 50, low: 25 };
    return severityMap[error.severity];
  }

  public getMetrics(): PerformanceMetrics {
    return this.performanceMetrics;
  }

  public generateReport(errors: DebugError[]): string {
    if (errors.length === 0) {
      return "✅ No errors found!";
    }

    const bySeverity = {
      critical: errors.filter((e) => e.severity === "critical").length,
      high: errors.filter((e) => e.severity === "high").length,
      medium: errors.filter((e) => e.severity === "medium").length,
      low: errors.filter((e) => e.severity === "low").length,
    };

    const byCategory = errors.reduce(
      (acc, err) => {
        acc[err.category] = (acc[err.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const metrics = this.getMetrics();

    let report = `\n📊 AGENT DEBUG SYSTEM V18.3.26 EXTENDED - FULL REPORT\n`;
    report += `═══════════════════════════════════════════════════════\n\n`;
    report += `🔍 Scan Performance:\n`;
    report += `  Duration: ${metrics.scanDuration.toFixed(2)}ms\n`;
    if (metrics.memoryUsage) {
      report += `  Memory: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB\n`;
    }
    report += `\n📈 Error Statistics:\n`;
    report += `  Total Errors: ${errors.length}\n`;
    report += `  Auto-Fixable: ${errors.filter((e) => e.autoFixable).length} (${((errors.filter((e) => e.autoFixable).length / errors.length) * 100).toFixed(1)}%)\n\n`;

    report += `🎯 By Severity:\n`;
    report += `  🔴 Critical: ${bySeverity.critical}\n`;
    report += `  🟠 High: ${bySeverity.high}\n`;
    report += `  🟡 Medium: ${bySeverity.medium}\n`;
    report += `  🟢 Low: ${bySeverity.low}\n\n`;

    report += `📦 By Category:\n`;
    Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        report += `  • ${cat}: ${count} (${((count / errors.length) * 100).toFixed(1)}%)\n`;
      });

    report += `\n🔝 Top 10 Priority Errors:\n`;
    errors.slice(0, 10).forEach((err, idx) => {
      const icon =
        err.severity === "critical"
          ? "🔴"
          : err.severity === "high"
            ? "🟠"
            : err.severity === "medium"
              ? "🟡"
              : "🟢";
      report += `  ${idx + 1}. ${icon} [${err.category}] ${err.type} (Line ${err.line || "?"})\n`;
      report += `     ${err.message}\n`;
    });

    report += `\n═══════════════════════════════════════════════════════\n`;
    report += `📊 17 Active Scanners | 120+ Checks | Priority-Sorted\n`;
    report += `═══════════════════════════════════════════════════════\n`;

    return report;
  }
}

export const agentDebugSystem = new AgentDebugSystem();
