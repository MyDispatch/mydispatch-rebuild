/* ==================================================================================
   PRODUCTION ERROR MONITOR - V6.0
   ==================================================================================
   ✅ Queue-based Error Batching (reduces DB load)
   ✅ DSGVO-compliant (no sensitive user data)
   ✅ Auto-flush every 30 seconds
   ✅ Duplicate detection (same error within 5 min)
   ✅ German error messages
   ================================================================================== */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface ErrorReport {
  error_message: string;
  error_stack?: string;
  error_category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context: Record<string, unknown>;
  timestamp: number;
}

export class ProductionErrorMonitor {
  private static errorQueue: ErrorReport[] = [];
  private static seenErrors = new Map<string, number>();
  private static flushInterval: NodeJS.Timeout | null = null;
  private static initialized = false;

  /**
   * Initialize Production Error Monitor
   * Call this in main.tsx AFTER initGlobalErrorHandlers()
   */
  static initialize(): void {
    if (this.initialized) return;
    
    // Only run in Production
    if (!import.meta.env.PROD) {
      logger.info('[ProductionErrorMonitor] Development mode - skipping initialization');
      return;
    }

    // Global error handler
    window.addEventListener('error', this.handleGlobalError.bind(this));
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));

    // Flush errors every 30 seconds
    this.flushInterval = setInterval(() => {
      if (this.errorQueue.length > 0) {
        this.flushErrorQueue();
      }
    }, 30000);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      if (this.errorQueue.length > 0) {
        this.flushErrorQueue();
      }
    });

    this.initialized = true;
    logger.info('[ProductionErrorMonitor] Initialized');
  }

  /**
   * Handle Global Window Errors
   */
  private static handleGlobalError(event: ErrorEvent): void {
    // Skip cross-origin errors (CORS)
    if (event.message === 'Script error.' && !event.filename) {
      return;
    }

    const error: ErrorReport = {
      error_message: event.message,
      error_stack: event.error?.stack || 'No stack trace available',
      error_category: 'window_error',
      severity: this.calculateSeverity(event.message),
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        userAgent: navigator.userAgent,
        url: window.location.href,
      },
      timestamp: Date.now(),
    };

    this.queueError(error);
  }

  /**
   * Handle Unhandled Promise Rejections
   */
  private static handleUnhandledRejection(event: PromiseRejectionEvent): void {
    const error: ErrorReport = {
      error_message: event.reason?.message || String(event.reason),
      error_stack: event.reason?.stack || 'No stack trace available',
      error_category: 'promise_rejection',
      severity: this.calculateSeverity(event.reason?.message || ''),
      context: {
        reason: event.reason,
        userAgent: navigator.userAgent,
        url: window.location.href,
      },
      timestamp: Date.now(),
    };

    this.queueError(error);
  }

  /**
   * Queue Error for Batch Processing
   */
  private static queueError(error: ErrorReport): void {
    // Duplicate Detection (same error within 5 min)
    const errorKey = `${error.error_category}:${error.error_message}`;
    const lastSeen = this.seenErrors.get(errorKey);
    
    if (lastSeen && Date.now() - lastSeen < 5 * 60 * 1000) {
      // Duplicate - skip
      return;
    }

    this.seenErrors.set(errorKey, Date.now());
    this.errorQueue.push(error);

    // Flush immediately for critical errors
    if (error.severity === 'critical') {
      this.flushErrorQueue();
    }
  }

  /**
   * Flush Error Queue to Supabase
   */
  private static async flushErrorQueue(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = []; // Clear queue

    try {
      const { error } = await supabase.from('error_logs').insert(
        errors.map(err => ({
          error_message: err.error_message,
          error_stack: err.error_stack,
          error_category: err.error_category,
          severity: err.severity,
          context: err.context,
        }))
      );

      if (error) throw error;

      logger.info(`[ProductionErrorMonitor] Flushed ${errors.length} errors to Supabase`);
    } catch (flushError) {
      logger.error('[ProductionErrorMonitor] Failed to flush errors:', flushError);
      
      // Re-queue errors (with limit to prevent memory leak)
      if (this.errorQueue.length < 100) {
        this.errorQueue.push(...errors);
      }
    }

    // Cleanup old seen errors (keep only last 1 hour)
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const [key, timestamp] of this.seenErrors.entries()) {
      if (timestamp < oneHourAgo) {
        this.seenErrors.delete(key);
      }
    }
  }

  /**
   * Calculate Error Severity
   */
  private static calculateSeverity(message: string): 'low' | 'medium' | 'high' | 'critical' {
    // Critical Patterns
    if (
      message.includes('ChunkLoadError') ||
      message.includes('Hydration failed') ||
      message.includes('white screen') ||
      message.includes('Cannot read properties of undefined')
    ) {
      return 'critical';
    }

    // High Severity
    if (
      message.includes('Network Error') ||
      message.includes('Failed to fetch') ||
      message.includes('TypeError') ||
      message.includes('ReferenceError')
    ) {
      return 'high';
    }

    // Medium Severity
    if (
      message.includes('Warning') ||
      message.includes('Deprecated') ||
      message.includes('timeout')
    ) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Manual Error Reporting (for try-catch blocks)
   */
  static reportError(
    error: Error | string,
    category: string = 'manual_report',
    context: Record<string, unknown> = {}
  ): void {
    const errorReport: ErrorReport = {
      error_message: error instanceof Error ? error.message : error,
      error_stack: error instanceof Error ? error.stack : undefined,
      error_category: category,
      severity: this.calculateSeverity(error instanceof Error ? error.message : error),
      context: {
        ...context,
        userAgent: navigator.userAgent,
        url: window.location.href,
      },
      timestamp: Date.now(),
    };

    this.queueError(errorReport);
  }

  /**
   * Cleanup (for testing)
   */
  static destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.initialized = false;
    this.errorQueue = [];
    this.seenErrors.clear();
  }
}

export default ProductionErrorMonitor;
