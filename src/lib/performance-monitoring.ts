/* ==================================================================================
   PERFORMANCE MONITORING V18.5.1
   ==================================================================================
   Web Vitals Tracking für MyDispatch
   - Tracking von CLS, INP, LCP, FCP, TTFB (INP ersetzt FID ab web-vitals v4+)
   - Supabase-basierte Speicherung
   - Production-optimiert
   ================================================================================== */

import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from "web-vitals";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

interface PerformanceMetric {
  metric_name: "CLS" | "INP" | "LCP" | "FCP" | "TTFB";
  metric_value: number;
  rating: string;
  route: string;
  user_agent: string;
  created_at: string;
}

/**
 * Sendet Performance-Metrik an Supabase
 */
async function sendToAnalytics(metric: Metric) {
  try {
    // Nur in Production tracken
    if (import.meta.env.DEV) return;

    const performanceMetric: PerformanceMetric = {
      metric_name: metric.name as "CLS" | "INP" | "LCP" | "FCP" | "TTFB",
      metric_value: metric.value,
      rating: metric.rating,
      route: window.location.pathname,
      user_agent: navigator.userAgent,
      created_at: new Date().toISOString(),
    };

    await supabase.from("performance_metrics").insert(performanceMetric);
  } catch (error) {
    // Silent fail - Performance-Tracking darf App nicht beeinträchtigen
    if (import.meta.env.DEV) {
      logger.debug("Performance metric error", { error, component: "PerformanceMonitoring" });
    }
  }
}

/**
 * Initialisiert Performance-Monitoring
 * Sollte so früh wie möglich aufgerufen werden (main.tsx)
 */
export function initPerformanceMonitoring() {
  // Nur in Production
  if (import.meta.env.DEV) {
    logger.info("Performance monitoring disabled in development", {
      component: "PerformanceMonitoring",
    });
    return;
  }

  try {
    // Cumulative Layout Shift
    onCLS(sendToAnalytics);

    // Interaction to Next Paint (ersetzt FID)
    onINP(sendToAnalytics);

    // Largest Contentful Paint
    onLCP(sendToAnalytics);

    // First Contentful Paint
    onFCP(sendToAnalytics);

    // Time to First Byte
    onTTFB(sendToAnalytics);

    logger.info("Performance monitoring initialized", { component: "PerformanceMonitoring" });
  } catch (error) {
    logger.error("Failed to initialize performance monitoring", error as Error, {
      component: "PerformanceMonitoring",
    });
  }
}

/**
 * Manuelle Performance-Messung für Custom Events
 */
export function measurePerformance(name: string, startMark: string, endMark: string) {
  try {
    performance.mark(endMark);
    const measure = performance.measure(name, startMark, endMark);

    const metric: Metric = {
      name: "CLS", // Placeholder, wird nicht verwendet
      value: measure.duration,
      rating:
        measure.duration < 1000 ? "good" : measure.duration < 2500 ? "needs-improvement" : "poor",
      delta: 0,
      navigationType: "navigate",
      id: crypto.randomUUID(),
      entries: [],
    };

    sendToAnalytics(metric);
  } catch (error) {
    if (import.meta.env.DEV) {
      logger.debug("Performance measurement error", { error, component: "PerformanceMonitoring" });
    }
  }
}

/**
 * Hilfsfunktion zum Starten einer Performance-Messung
 */
export function startPerformanceMark(name: string) {
  try {
    performance.mark(name);
  } catch (error) {
    if (import.meta.env.DEV) {
      logger.debug("Performance mark error", { error, component: "PerformanceMonitoring" });
    }
  }
}
