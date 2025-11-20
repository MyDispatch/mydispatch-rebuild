/* ==================================================================================
   REAL USER MONITORING (RUM) - Performance Tracking
   ==================================================================================
   Trackt echte User-Performance Metriken (ohne DB vorerst - Local Storage)
   ================================================================================== */

import { logger } from '@/lib/logger';

export interface PerformanceMetrics {
  url: string;
  ttfb: number; // Time to First Byte
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  user_agent: string;
  viewport_width: number;
  viewport_height: number;
  connection_type: string;
  timestamp: string;
}

/**
 * Track page performance metrics using Navigation Timing API
 */
export async function trackPagePerformance(url: string) {
  // Only track in production
  if (import.meta.env.DEV) return;

  try {
    // Wait for page to fully load
    await new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve(null);
      } else {
        window.addEventListener('load', resolve, { once: true });
      }
    });

    // Get performance data
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!perfData) return;

    // Calculate metrics
    const ttfb = perfData.responseStart - perfData.requestStart;
    const fcp = perfData.domContentLoadedEventEnd - perfData.fetchStart;
    const lcp = perfData.loadEventEnd - perfData.fetchStart;

    // Get connection info
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    const metrics: PerformanceMetrics = {
      url,
      ttfb: Math.round(ttfb),
      fcp: Math.round(fcp),
      lcp: Math.round(lcp),
      fid: 0, // Will be updated by FID observer
      cls: 0, // Will be updated by CLS observer
      user_agent: navigator.userAgent,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      connection_type: connection?.effectiveType || 'unknown',
      timestamp: new Date().toISOString(),
    };

    // Store locally for now
    const stored = localStorage.getItem('performance_metrics') || '[]';
    const allMetrics = JSON.parse(stored);
    allMetrics.push(metrics);
    
    // Keep only last 100 entries
    if (allMetrics.length > 100) {
      allMetrics.shift();
    }
    
    localStorage.setItem('performance_metrics', JSON.stringify(allMetrics));
    
    if (import.meta.env.DEV) {
      logger.debug('[RUM] Performance tracked', { component: 'PerformanceMonitor', metrics });
    }
  } catch (error) {
    logger.error('[RUM] Failed to track performance', error as Error, { component: 'PerformanceMonitor' });
  }
}

/**
 * Track Web Vitals (FID, CLS)
 */
export function observeWebVitals() {
  if (import.meta.env.DEV) return;

  try {
    // Track First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as any;
          const fid = fidEntry.processingStart - fidEntry.startTime;
          if (import.meta.env.DEV) {
            logger.debug('[RUM] FID', { component: 'PerformanceMonitor', fid: Math.round(fid) });
          }
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // Track Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            if (import.meta.env.DEV) {
              logger.debug('[RUM] CLS', { component: 'PerformanceMonitor', cls: Math.round(clsValue * 1000) / 1000 });
            }
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    }
    } catch (error) {
      logger.error('[RUM] Failed to observe web vitals', error as Error, { component: 'PerformanceMonitor' });
    }
}

/**
 * Track route changes for SPA
 */
export function trackRouteChange(newPath: string) {
  if (import.meta.env.DEV) return;
  
  // Track new page load
  trackPagePerformance(newPath);
}

/**
 * Get stored performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics[] {
  try {
    const stored = localStorage.getItem('performance_metrics') || '[]';
    return JSON.parse(stored);
  } catch {
    return [];
  }
}
