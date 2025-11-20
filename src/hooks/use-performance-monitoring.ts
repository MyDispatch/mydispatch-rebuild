/* ==================================================================================
   PERFORMANCE MONITORING HOOK - GRAFANA/DATADOG-INSPIRED
   ==================================================================================
   ⚡ PHASE 3.3: Stability & Monitoring
   
   Core Web Vitals Tracking:
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)
   - TTFB (Time to First Byte)
   
   Usage:
   usePerformanceMonitoring(); // In App.tsx oder Layout
   ================================================================================== */

import { useEffect } from "react";
import { logger } from "@/lib/logger";

interface PerformanceMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
}

/**
 * Performance Monitoring Hook
 *
 * Tracks Core Web Vitals and reports to logging system
 *
 * Thresholds (Google Web Vitals):
 * - LCP: <2.5s (good), <4s (needs-improvement), >=4s (poor)
 * - FID: <100ms (good), <300ms (needs-improvement), >=300ms (poor)
 * - CLS: <0.1 (good), <0.25 (needs-improvement), >=0.25 (poor)
 * - TTFB: <800ms (good), <1800ms (needs-improvement), >=1800ms (poor)
 */
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Check if Web Vitals API is available
    if (typeof window === "undefined" || !window.performance) {
      return;
    }

    // LCP (Largest Contentful Paint)
    const observeLCP = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;

          if (lastEntry?.renderTime || lastEntry?.loadTime) {
            const value = lastEntry.renderTime || lastEntry.loadTime;
            const rating = value < 2500 ? "good" : value < 4000 ? "needs-improvement" : "poor";

            reportMetric({ name: "LCP", value, rating });
            observer.disconnect();
          }
        });

        observer.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch (error) {
        // LCP not supported
      }
    };

    // FID (First Input Delay)
    const observeFID = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            const value = entry.processingStart - entry.startTime;
            const rating = value < 100 ? "good" : value < 300 ? "needs-improvement" : "poor";

            reportMetric({ name: "FID", value, rating });
          });
          observer.disconnect();
        });

        observer.observe({ entryTypes: ["first-input"] });
      } catch (error) {
        // FID not supported
      }
    };

    // CLS (Cumulative Layout Shift)
    const observeCLS = () => {
      try {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
        });

        observer.observe({ entryTypes: ["layout-shift"] });

        // Report CLS after page is visible for 5 seconds
        setTimeout(() => {
          const rating = clsValue < 0.1 ? "good" : clsValue < 0.25 ? "needs-improvement" : "poor";
          reportMetric({ name: "CLS", value: clsValue, rating });
          observer.disconnect();
        }, 5000);
      } catch (error) {
        // CLS not supported
      }
    };

    // TTFB (Time to First Byte)
    const observeTTFB = () => {
      try {
        const navigationEntries = performance.getEntriesByType("navigation") as any[];
        if (navigationEntries.length > 0) {
          const navEntry = navigationEntries[0];
          const value = navEntry.responseStart - navEntry.requestStart;
          const rating = value < 800 ? "good" : value < 1800 ? "needs-improvement" : "poor";

          reportMetric({ name: "TTFB", value, rating });
        }
      } catch (error) {
        // TTFB not supported
      }
    };

    // Report metric to logging system
    const reportMetric = (metric: PerformanceMetric) => {
      // Log to console in development
      if (import.meta.env.DEV) {
        const emoji =
          metric.rating === "good" ? "✅" : metric.rating === "needs-improvement" ? "⚠️" : "❌";
        console.log(
          `${emoji} ${metric.name}: ${Math.round(metric.value)}${metric.name === "CLS" ? "" : "ms"} (${metric.rating})`
        );
      }

      // Log to Supabase in production
      if (import.meta.env.PROD) {
        logger.info(`Performance Metric: ${metric.name}`, {
          metric: metric.name,
          value: metric.value,
          rating: metric.rating,
          timestamp: Date.now(),
        });
      }
    };

    // Start observations
    observeLCP();
    observeFID();
    observeCLS();
    observeTTFB();

    // Cleanup
    return () => {
      // Observers are disconnected after reporting
    };
  }, []);
};
