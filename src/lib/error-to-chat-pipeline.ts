/* ==================================================================================
   ERROR-TO-CHAT-PIPELINE - KI-GESTEUERTE FEHLERBEHEBUNG
   ==================================================================================
   Automatische Fehlerberichterstattung mit Kontext für MyDispatch AI
   ================================================================================== */

import { errorTracker, type TrackedError } from "./error-tracker";
import { logger } from "@/lib/logger";

export interface UserAction {
  timestamp: string;
  action: string;
  target: string;
  value?: string;
}

export interface ErrorReport {
  error: TrackedError;
  userActions: UserAction[];
  deviceInfo: {
    userAgent: string;
    screenSize: string;
    viewport: string;
    deviceType: "desktop" | "tablet" | "mobile";
    browser: string;
    os: string;
  };
  systemState: {
    route: string;
    userId?: string;
    sessionDuration: number;
    performanceMetrics: {
      memoryUsage?: number;
      connectionSpeed?: string;
    };
  };
}

class ErrorToChatPipeline {
  private userActions: UserAction[] = [];
  private readonly MAX_ACTIONS = 10;

  constructor() {
    this.initializeActionTracking();
  }

  /**
   * Initialize user action tracking
   */
  private initializeActionTracking(): void {
    // Track clicks
    document.addEventListener("click", (e) => {
      this.trackAction({
        action: "click",
        target: this.getElementDescription(e.target as HTMLElement),
      });
    });

    // Track form submissions
    document.addEventListener("submit", (e) => {
      this.trackAction({
        action: "submit",
        target: this.getElementDescription(e.target as HTMLElement),
      });
    });

    // Track navigation
    window.addEventListener("popstate", () => {
      this.trackAction({
        action: "navigation",
        target: window.location.pathname,
      });
    });

    // Track input focus
    document.addEventListener("focusin", (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        this.trackAction({
          action: "focus",
          target: this.getElementDescription(e.target),
        });
      }
    });
  }

  /**
   * Track user action
   */
  private trackAction(action: Omit<UserAction, "timestamp">): void {
    this.userActions.push({
      ...action,
      timestamp: new Date().toISOString(),
    });

    // Keep only last N actions
    if (this.userActions.length > this.MAX_ACTIONS) {
      this.userActions.shift();
    }
  }

  /**
   * Get element description for tracking
   */
  private getElementDescription(element: HTMLElement): string {
    const tag = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : "";
    const classes = element.className ? `.${element.className.split(" ")[0]}` : "";
    const text = element.textContent?.trim().substring(0, 30) || "";

    return `${tag}${id}${classes} ${text ? `\"${text}\"` : ""}`.trim();
  }

  /**
   * Get device information
   */
  private getDeviceInfo(): ErrorReport["deviceInfo"] {
    const ua = navigator.userAgent;
    const screenWidth = window.screen.width;

    let deviceType: "desktop" | "tablet" | "mobile";
    if (screenWidth < 768) deviceType = "mobile";
    else if (screenWidth < 1024) deviceType = "tablet";
    else deviceType = "desktop";

    // Simple browser detection
    let browser = "Unknown";
    if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Safari")) browser = "Safari";
    else if (ua.includes("Edge")) browser = "Edge";

    // Simple OS detection
    let os = "Unknown";
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iOS")) os = "iOS";

    return {
      userAgent: ua,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      deviceType,
      browser,
      os,
    };
  }

  /**
   * Get system state
   */
  private getSystemState(): ErrorReport["systemState"] {
    const performanceMetrics: ErrorReport["systemState"]["performanceMetrics"] = {};

    // Memory usage (if available)
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      performanceMetrics.memoryUsage = memory.usedJSHeapSize / 1048576; // MB
    }

    // Connection speed (if available)
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      performanceMetrics.connectionSpeed = connection.effectiveType;
    }

    return {
      route: window.location.pathname,
      sessionDuration: Date.now() - (window.performance?.timing?.navigationStart || Date.now()),
      performanceMetrics,
    };
  }

  /**
   * Generate comprehensive error report
   */
  generateErrorReport(error: Error | unknown): ErrorReport | null {
    const stats = errorTracker.getErrorStats();
    const recentErrors = stats.recentErrors;

    if (recentErrors.length === 0) {
      if (import.meta.env.DEV) {
        logger.warn("[ErrorToChatPipeline] No tracked errors found", {
          component: "ErrorToChatPipeline",
        });
      }
      return null;
    }

    const latestError = recentErrors[0];

    return {
      error: latestError,
      userActions: [...this.userActions],
      deviceInfo: this.getDeviceInfo(),
      systemState: this.getSystemState(),
    };
  }

  /**
   * Format error report for MyDispatch AI Chat
   */
  formatForChat(report: ErrorReport): string {
    const lines = [
      "🔴 **FEHLER-BERICHT (Automatisch generiert)**",
      "",
      "**Fehler:**",
      `- Nachricht: ${report.error.message}`,
      `- Kategorie: ${report.error.category}`,
      `- Schweregrad: ${report.error.severity}`,
      "",
      "**Letzte Benutzer-Aktionen:**",
      ...report.userActions
        .slice(-5)
        .map((action, i) => `${i + 1}. ${action.action} → ${action.target}`),
      "",
      "**Geräte-Info:**",
      `- Typ: ${report.deviceInfo.deviceType}`,
      `- Browser: ${report.deviceInfo.browser} (${report.deviceInfo.os})`,
      `- Viewport: ${report.deviceInfo.viewport}`,
      "",
      "**System-Status:**",
      `- Route: ${report.systemState.route}`,
      `- Session-Dauer: ${Math.round(report.systemState.sessionDuration / 1000)}s`,
    ];

    if (report.systemState.performanceMetrics.memoryUsage) {
      lines.push(`- Speicher: ${Math.round(report.systemState.performanceMetrics.memoryUsage)}MB`);
    }

    if (report.error.stack) {
      lines.push(
        "",
        "**Stack-Trace:**",
        "```",
        report.error.stack.split("\n").slice(0, 5).join("\n"),
        "```"
      );
    }

    return lines.join("\n");
  }

  /**
   * Send error to chat (integration with MyDispatch AI Chat)
   */
  async sendErrorToChat(error: Error | unknown): Promise<boolean> {
    try {
      const report = this.generateErrorReport(error);
      if (!report) return false;

      const formattedReport = this.formatForChat(report);

      // In einem echten Setup würde dies den Report an den Chat senden
      if (import.meta.env.DEV) {
        logger.debug("[ErrorToChatPipeline] Report generiert", {
          component: "ErrorToChatPipeline",
          formattedReport,
        });
      }

      // Optional: Kopiere in Zwischenablage
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(formattedReport);
        if (import.meta.env.DEV) {
          logger.debug("[ErrorToChatPipeline] Report in Zwischenablage kopiert", {
            component: "ErrorToChatPipeline",
          });
        }
      }

      return true;
    } catch (err) {
      if (import.meta.env.DEV) {
        logger.error("[ErrorToChatPipeline] Fehler beim Senden", err as Error, {
          component: "ErrorToChatPipeline",
        });
      }
      return false;
    }
  }

  /**
   * Clear tracked actions
   */
  clearActions(): void {
    this.userActions = [];
  }
}

// Singleton instance
export const errorToChatPipeline = new ErrorToChatPipeline();

// Convenience function
export async function sendErrorToChat(error: Error | unknown): Promise<boolean> {
  return errorToChatPipeline.sendErrorToChat(error);
}
