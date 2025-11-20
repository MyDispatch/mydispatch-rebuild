/* ==================================================================================
   PERFORMANCE GUARD - V6.0
   ==================================================================================
   ✅ Monitors slow operations (>1000ms)
   ✅ Logs performance issues
   ✅ Development-only warnings
   ================================================================================== */

import { useEffect, type ReactNode } from 'react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  threshold?: number; // milliseconds
}

export function PerformanceGuard({ children, threshold = 1000 }: Props) {
  useEffect(() => {
    // Only run in development
    if (import.meta.env.PROD) return;

    // Monitor performance
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach((entry) => {
        if (entry.entryType === 'measure' && entry.duration > threshold) {
          logger.warn(
            `🐌 Slow operation detected: ${entry.name} took ${entry.duration.toFixed(0)}ms`,
            {
              name: entry.name,
              duration: entry.duration,
              threshold,
            }
          );

          // Show toast in development
          if (import.meta.env.DEV) {
            showPerformanceWarning(entry.name, entry.duration);
          }
        }

        // Monitor navigation timing
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          const loadTime = navEntry.loadEventEnd - navEntry.fetchStart;

          if (loadTime > 2000) {
            logger.warn(`🐌 Slow page load: ${loadTime.toFixed(0)}ms`, {
              loadTime,
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
              domInteractive: navEntry.domInteractive - navEntry.fetchStart,
            });
          }
        }
      });
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return <>{children}</>;
}

// Helper: Show performance warning toast
function showPerformanceWarning(name: string, duration: number): void {
  // Create toast element
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #f59e0b;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 9998;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 20px;">🐌</span>
      <div>
        <strong>Slow Operation</strong>
        <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">
          ${name}: ${duration.toFixed(0)}ms
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(toast);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// Add CSS animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
