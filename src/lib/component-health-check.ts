/* ==================================================================================
   AUTOMATED COMPONENT HEALTH CHECKS
   ==================================================================================
   Laufzeit-Validierung von UI/UX-Standards für Desktop und Mobile
   ================================================================================== */

import { logWarning, logDebug } from "./logger";

interface ComponentHealthIssue {
  component: string;
  issue: string;
  severity: "critical" | "warning" | "info";
  recommendation: string;
}

class ComponentHealthChecker {
  private issues: ComponentHealthIssue[] = [];
  private readonly MOBILE_BREAKPOINT = 768;
  private readonly MIN_TOUCH_TARGET = 44; // iOS Human Interface Guidelines

  /**
   * Run all component health checks
   */
  runAllChecks(): ComponentHealthIssue[] {
    this.issues = [];

    logDebug("[Component Health] Starting checks...");

    this.checkMobileButtonSize();
    this.checkFormValidation();
    this.checkTablePagination();
    this.checkModalEscapeHandlers();
    this.checkImageAltText();
    this.checkAccessibility();
    this.checkResponsiveDesign();

    if (this.issues.length > 0) {
      logWarning("[Component Health] Found issues", { count: this.issues.length });
    } else {
      logDebug("[Component Health] All checks passed");
    }

    return this.issues;
  }

  /**
   * Check mobile button sizes
   */
  private checkMobileButtonSize(): void {
    if (window.innerWidth >= this.MOBILE_BREAKPOINT) return;

    const buttons = document.querySelectorAll('button, a[role="button"]');

    buttons.forEach((button, index) => {
      const rect = button.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);

      if (size < this.MIN_TOUCH_TARGET && rect.width > 0 && rect.height > 0) {
        const buttonText = button.textContent?.trim().substring(0, 30) || `Button ${index}`;
        this.addIssue({
          component: `Button: "${buttonText}"`,
          issue: `Touch target too small: ${Math.round(size)}px (minimum ${this.MIN_TOUCH_TARGET}px)`,
          severity: "warning",
          recommendation: "Increase button size or padding for mobile",
        });
      }
    });
  }

  /**
   * Check form validation
   */
  private checkFormValidation(): void {
    const forms = document.querySelectorAll("form");

    forms.forEach((form, index) => {
      const formId = form.id || `Form ${index + 1}`;

      // Check for required fields without validation
      const requiredFields = form.querySelectorAll("[required]");
      if (requiredFields.length > 0) {
        const hasValidation =
          form.hasAttribute("novalidate") || form.querySelector("[aria-invalid]") !== null;

        if (!hasValidation) {
          this.addIssue({
            component: formId,
            issue: "Form has required fields but no visible validation",
            severity: "warning",
            recommendation: "Add client-side validation with error messages",
          });
        }
      }

      // Check for submit buttons
      const submitButton = form.querySelector('button[type="submit"]');
      if (!submitButton && requiredFields.length > 0) {
        this.addIssue({
          component: formId,
          issue: "Form with required fields has no submit button",
          severity: "critical",
          recommendation: "Add a submit button to the form",
        });
      }
    });
  }

  /**
   * Check table pagination
   */
  private checkTablePagination(): void {
    const tables = document.querySelectorAll("table");

    tables.forEach((table, index) => {
      const rows = table.querySelectorAll("tbody tr");
      const tableId = table.id || `Table ${index + 1}`;

      // Check if large tables have pagination
      if (rows.length > 50) {
        const hasPagination =
          table.closest("div")?.querySelector('[role="navigation"]') !== null ||
          table.closest("div")?.querySelector(".pagination") !== null;

        if (!hasPagination) {
          this.addIssue({
            component: tableId,
            issue: `Table has ${rows.length} rows without pagination`,
            severity: "warning",
            recommendation: "Add pagination for tables with more than 50 rows",
          });
        }
      }

      // Check mobile responsiveness
      if (window.innerWidth < this.MOBILE_BREAKPOINT) {
        const tableWidth = table.getBoundingClientRect().width;
        const viewportWidth = window.innerWidth;

        if (tableWidth > viewportWidth) {
          const hasScroll = table.closest("div")?.style.overflowX === "auto";

          if (!hasScroll) {
            this.addIssue({
              component: tableId,
              issue: "Table overflows viewport on mobile without scroll",
              severity: "warning",
              recommendation: "Wrap table in div with overflow-x: auto",
            });
          }
        }
      }
    });
  }

  /**
   * Check modal escape handlers
   */
  private checkModalEscapeHandlers(): void {
    const modals = document.querySelectorAll('[role="dialog"], [role="alertdialog"]');

    modals.forEach((modal, index) => {
      const modalId = modal.id || `Modal ${index + 1}`;

      // Check for close button
      const hasCloseButton =
        modal.querySelector('[aria-label*="close" i], [aria-label*="schließen" i]') !== null;

      if (!hasCloseButton) {
        this.addIssue({
          component: modalId,
          issue: "Modal has no visible close button",
          severity: "warning",
          recommendation: "Add a close button with proper aria-label",
        });
      }

      // Check for backdrop
      const hasBackdrop =
        modal.previousElementSibling?.classList.contains("backdrop") ||
        modal.parentElement?.classList.contains("overlay");

      if (!hasBackdrop) {
        this.addIssue({
          component: modalId,
          issue: "Modal has no backdrop/overlay",
          severity: "info",
          recommendation: "Add a backdrop for better UX",
        });
      }
    });
  }

  /**
   * Check image alt text
   */
  private checkImageAltText(): void {
    const images = document.querySelectorAll("img");

    images.forEach((img, index) => {
      const src = img.src.substring(img.src.lastIndexOf("/") + 1, img.src.length);
      const imgId = img.id || img.alt || src || `Image ${index + 1}`;

      // Check for missing alt text
      if (!img.hasAttribute("alt")) {
        this.addIssue({
          component: `Image: ${imgId}`,
          issue: "Image missing alt attribute",
          severity: "warning",
          recommendation: "Add descriptive alt text for accessibility",
        });
      }

      // Check for empty alt on decorative images
      if (img.alt === "" && !img.hasAttribute("role")) {
        this.addIssue({
          component: `Image: ${imgId}`,
          issue: 'Decorative image should have role="presentation"',
          severity: "info",
          recommendation: 'Add role="presentation" for decorative images',
        });
      }
    });
  }

  /**
   * Check accessibility
   */
  private checkAccessibility(): void {
    // Check for missing labels on inputs
    const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');

    inputs.forEach((input, index) => {
      const inputId =
        (input as HTMLInputElement).id || (input as HTMLInputElement).name || `Input ${index + 1}`;

      const hasLabel =
        input.hasAttribute("aria-label") ||
        input.hasAttribute("aria-labelledby") ||
        document.querySelector(`label[for="${(input as HTMLInputElement).id}"]`) !== null;

      if (!hasLabel) {
        this.addIssue({
          component: `Input: ${inputId}`,
          issue: "Input field has no associated label",
          severity: "warning",
          recommendation: "Add aria-label or associated label element",
        });
      }
    });

    // Check for keyboard navigation
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    let hasTabIndexIssues = false;
    focusableElements.forEach((element) => {
      const tabIndex = parseInt((element as HTMLElement).getAttribute("tabindex") || "0");
      if (tabIndex > 0) {
        hasTabIndexIssues = true;
      }
    });

    if (hasTabIndexIssues) {
      this.addIssue({
        component: "Application",
        issue: "Positive tabindex values detected",
        severity: "warning",
        recommendation: "Avoid positive tabindex, use natural DOM order instead",
      });
    }
  }

  /**
   * Check responsive design
   */
  private checkResponsiveDesign(): void {
    // Check for viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      this.addIssue({
        component: "Application",
        issue: "Missing viewport meta tag",
        severity: "critical",
        recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
      });
    }

    // Check for horizontal scroll on mobile
    if (window.innerWidth < this.MOBILE_BREAKPOINT) {
      const bodyWidth = document.body.scrollWidth;
      const viewportWidth = window.innerWidth;

      if (bodyWidth > viewportWidth + 10) {
        // 10px tolerance
        this.addIssue({
          component: "Layout",
          issue: `Horizontal scroll detected on mobile (${bodyWidth}px > ${viewportWidth}px)`,
          severity: "warning",
          recommendation: "Check for fixed-width elements or overflow issues",
        });
      }
    }
  }

  /**
   * Add an issue
   */
  private addIssue(issue: ComponentHealthIssue): void {
    this.issues.push(issue);
  }

  /**
   * Get issues by severity
   */
  getIssuesBySeverity(severity: "critical" | "warning" | "info"): ComponentHealthIssue[] {
    return this.issues.filter((issue) => issue.severity === severity);
  }

  /**
   * Get total issue count
   */
  getTotalIssueCount(): number {
    return this.issues.length;
  }

  /**
   * Has critical issues
   */
  hasCriticalIssues(): boolean {
    return this.issues.some((issue) => issue.severity === "critical");
  }
}

// Singleton instance
export const componentHealthChecker = new ComponentHealthChecker();

// Convenience exports
export const runComponentHealthChecks = () => componentHealthChecker.runAllChecks();

// Auto-run in development mode
if (import.meta.env.DEV) {
  // Run checks after initial render
  setTimeout(() => {
    const issues = componentHealthChecker.runAllChecks();
    // Issues are already logged via logWarning/logDebug in runAllChecks
    // No additional console logging needed
  }, 2000);
}
