/* ==================================================================================
   PERFORMANCE AUDIT & OPTIMIZATION - PHASE 2.6
   ==================================================================================
   Code-Splitting, Asset-Optimierung, Performance-Budget-Tracking
   ================================================================================== */

import { logger } from "@/lib/logger";

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint (ms)
  lcp: number; // Largest Contentful Paint (ms)
  fid: number; // First Input Delay (ms)
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte (ms)
  tbt: number; // Total Blocking Time (ms)
}

export interface PerformanceBudget {
  fcp: number; // Target: ≤ 1000ms
  lcp: number; // Target: ≤ 2500ms
  fid: number; // Target: ≤ 100ms
  cls: number; // Target: ≤ 0.1
  ttfb: number; // Target: ≤ 600ms
  tbt: number; // Target: ≤ 300ms
  bundleSize: number; // Target: ≤ 500KB
  initialLoadTime: number; // Target: ≤ 2000ms
}

export const DEFAULT_PERFORMANCE_BUDGET: PerformanceBudget = {
  fcp: 1000,
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  ttfb: 600,
  tbt: 300,
  bundleSize: 500 * 1024, // 500KB
  initialLoadTime: 2000,
};

class PerformanceAuditor {
  private metrics: PerformanceMetrics | null = null;
  private budget: PerformanceBudget = DEFAULT_PERFORMANCE_BUDGET;

  /**
   * Collect Web Vitals using PerformanceObserver API
   */
  collectMetrics(): void {
    if (!("PerformanceObserver" in window)) {
      logger.warn("[PerformanceAuditor] PerformanceObserver not supported", {
        component: "PerformanceAuditor",
      });
      return;
    }

    // FCP - First Contentful Paint
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find((entry) => entry.name === "first-contentful-paint");
        if (fcpEntry && this.metrics) {
          this.metrics.fcp = fcpEntry.startTime;
        }
      });
      observer.observe({ entryTypes: ["paint"] });
    } catch (e) {
      logger.warn("[PerformanceAuditor] FCP monitoring failed", {
        component: "PerformanceAuditor",
        error: e,
      });
    }

    // LCP - Largest Contentful Paint
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        if (lastEntry && this.metrics) {
          this.metrics.lcp = lastEntry.startTime;
        }
      });
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      logger.warn("[PerformanceAuditor] LCP monitoring failed", {
        component: "PerformanceAuditor",
        error: e,
      });
    }

    // FID - First Input Delay
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (this.metrics) {
            this.metrics.fid = entry.processingStart - entry.startTime;
          }
        });
      });
      observer.observe({ entryTypes: ["first-input"] });
    } catch (e) {
      logger.warn("[PerformanceAuditor] FID monitoring failed", {
        component: "PerformanceAuditor",
        error: e,
      });
    }

    // CLS - Cumulative Layout Shift
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            if (this.metrics) {
              this.metrics.cls = clsValue;
            }
          }
        });
      });
      observer.observe({ entryTypes: ["layout-shift"] });
    } catch (e) {
      logger.warn("[PerformanceAuditor] CLS monitoring failed", {
        component: "PerformanceAuditor",
        error: e,
      });
    }

    // TTFB - Time to First Byte
    try {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigation && this.metrics) {
        this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
      }
    } catch (e) {
      logger.warn("[PerformanceAuditor] TTFB monitoring failed", {
        component: "PerformanceAuditor",
        error: e,
      });
    }

    // Initialize metrics object
    this.metrics = {
      fcp: 0,
      lcp: 0,
      fid: 0,
      cls: 0,
      ttfb: 0,
      tbt: 0,
    };
  }

  /**
   * Check if performance meets budget
   */
  checkBudget(): {
    passed: boolean;
    violations: Array<{
      metric: string;
      actual: number;
      budget: number;
      severity: "critical" | "warning";
    }>;
  } {
    if (!this.metrics) {
      return { passed: false, violations: [] };
    }

    const violations: Array<{
      metric: string;
      actual: number;
      budget: number;
      severity: "critical" | "warning";
    }> = [];

    // Check each metric
    const checks: Array<{ key: keyof PerformanceMetrics; label: string }> = [
      { key: "fcp", label: "First Contentful Paint" },
      { key: "lcp", label: "Largest Contentful Paint" },
      { key: "fid", label: "First Input Delay" },
      { key: "cls", label: "Cumulative Layout Shift" },
      { key: "ttfb", label: "Time to First Byte" },
      { key: "tbt", label: "Total Blocking Time" },
    ];

    checks.forEach(({ key, label }) => {
      const actual = this.metrics![key];
      const budgetValue = this.budget[key];

      if (actual > budgetValue) {
        const percentOver = ((actual - budgetValue) / budgetValue) * 100;
        violations.push({
          metric: label,
          actual,
          budget: budgetValue,
          severity: percentOver > 50 ? "critical" : "warning",
        });
      }
    });

    return {
      passed: violations.length === 0,
      violations,
    };
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics | null {
    return this.metrics;
  }

  /**
   * Get performance score (0-100)
   */
  getPerformanceScore(): number {
    if (!this.metrics) return 0;

    const scores = {
      fcp: this.calculateScore(this.metrics.fcp, this.budget.fcp),
      lcp: this.calculateScore(this.metrics.lcp, this.budget.lcp),
      fid: this.calculateScore(this.metrics.fid, this.budget.fid),
      cls: this.calculateScore(this.metrics.cls, this.budget.cls),
      ttfb: this.calculateScore(this.metrics.ttfb, this.budget.ttfb),
    };

    // Weighted average (LCP has highest weight)
    const totalScore =
      scores.fcp * 0.15 +
      scores.lcp * 0.3 +
      scores.fid * 0.15 +
      scores.cls * 0.25 +
      scores.ttfb * 0.15;

    return Math.round(totalScore);
  }

  private calculateScore(actual: number, budget: number): number {
    if (actual <= budget) return 100;
    const percentOver = ((actual - budget) / budget) * 100;
    return Math.max(0, 100 - percentOver);
  }

  /**
   * Get optimization recommendations
   */
  getRecommendations(): Array<{
    priority: "high" | "medium" | "low";
    category: string;
    recommendation: string;
    impact: string;
  }> {
    const recommendations: Array<{
      priority: "high" | "medium" | "low";
      category: string;
      recommendation: string;
      impact: string;
    }> = [];

    if (!this.metrics) return recommendations;

    // LCP optimization
    if (this.metrics.lcp > this.budget.lcp) {
      recommendations.push({
        priority: "high",
        category: "LCP",
        recommendation: "Implement lazy loading for images and defer non-critical resources",
        impact: "Reduce LCP by 20-40%",
      });
    }

    // FCP optimization
    if (this.metrics.fcp > this.budget.fcp) {
      recommendations.push({
        priority: "high",
        category: "FCP",
        recommendation: "Inline critical CSS and defer non-critical CSS",
        impact: "Reduce FCP by 15-30%",
      });
    }

    // CLS optimization
    if (this.metrics.cls > this.budget.cls) {
      recommendations.push({
        priority: "high",
        category: "CLS",
        recommendation: "Add explicit width/height to images and reserve space for dynamic content",
        impact: "Reduce CLS to < 0.1",
      });
    }

    // TTFB optimization
    if (this.metrics.ttfb > this.budget.ttfb) {
      recommendations.push({
        priority: "medium",
        category: "TTFB",
        recommendation: "Enable CDN caching and optimize server response time",
        impact: "Reduce TTFB by 30-50%",
      });
    }

    return recommendations;
  }
}

// Singleton instance
export const performanceAuditor = new PerformanceAuditor();

// Auto-start monitoring in production
if (!import.meta.env.DEV) {
  performanceAuditor.collectMetrics();
}

/**
 * Performance Optimization Checklist
 */
export const PERFORMANCE_OPTIMIZATION_CHECKLIST = {
  codeSplitting: [
    "✅ Lazy load routes with React.lazy()",
    "✅ Split large components into separate chunks",
    "✅ Use dynamic imports for heavy libraries",
    "✅ Implement route-based code splitting",
  ],
  assetOptimization: [
    "✅ Convert images to WebP/AVIF format",
    "✅ Implement responsive images (srcset)",
    "✅ Enable lazy loading for images",
    "✅ Compress all assets (gzip/brotli)",
    "✅ Use CDN for static assets",
  ],
  criticalRenderingPath: [
    "✅ Inline critical CSS",
    "✅ Defer non-critical CSS",
    "✅ Minify CSS/JS",
    "✅ Remove render-blocking resources",
    "✅ Preload critical resources",
  ],
  caching: [
    "✅ Implement service worker caching",
    "✅ Use Cache-Control headers",
    "✅ Enable browser caching",
    "✅ Implement stale-while-revalidate",
  ],
};
