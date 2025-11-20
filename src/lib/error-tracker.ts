/* ==================================================================================
   ERROR TRACKER - ZENTRALE FEHLERSAMMLUNG
   ==================================================================================
   Automatische Kategorisierung, Deduplication und Severity-Scoring
   ================================================================================== */

import { supabase } from '@/integrations/supabase/client';

export type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ErrorCategory = 'runtime' | 'api' | 'network' | 'user' | 'system';

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  companyId?: string;
  url?: string;
  userAgent?: string;
  [key: string]: any;
}

export interface TrackedError {
  message: string;
  stack?: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  context: ErrorContext;
  timestamp: number;
  hash: string; // Für Deduplication
}

class ErrorTracker {
  private errors: Map<string, TrackedError> = new Map();
  private errorCounts: Map<string, number> = new Map();
  private readonly DEDUP_WINDOW = 60000; // 1 Minute

  /**
   * Track a generic error
   */
  async trackError(
    error: Error | unknown,
    context: ErrorContext = {},
    severity: ErrorSeverity = 'medium'
  ): Promise<void> {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    const trackedError: TrackedError = {
      message: errorMessage,
      stack: errorStack,
      category: this.categorizeError(errorMessage),
      severity,
      context: {
        ...context,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      },
      timestamp: Date.now(),
      hash: this.generateHash(errorMessage, context.component),
    };

    // Deduplication Check
    if (this.isDuplicate(trackedError)) {
      this.incrementErrorCount(trackedError.hash);
      return;
    }

    // Store in memory
    this.errors.set(trackedError.hash, trackedError);
    this.errorCounts.set(trackedError.hash, 1);

    // Log to Supabase
    await this.logToSupabase(trackedError);

    // Log in Dev
    if (import.meta.env.DEV) {
      const { logError } = await import('@/lib/logger');
      logError('[ErrorTracker] Error tracked', trackedError as any);
    }
  }

  /**
   * Track API errors specifically
   */
  async trackAPIError(
    endpoint: string,
    statusCode: number,
    response: any,
    context: ErrorContext = {}
  ): Promise<void> {
    const severity = this.getAPISeverity(statusCode);
    const errorMessage = `API Error: ${endpoint} returned ${statusCode}`;
    
    await this.trackError(
      new Error(errorMessage),
      {
        ...context,
        endpoint,
        statusCode,
        response: typeof response === 'string' ? response : JSON.stringify(response),
      },
      severity
    );
  }

  /**
   * Track UI/Component errors
   */
  async trackUIError(
    component: string,
    action: string,
    error: Error | unknown,
    context: ErrorContext = {}
  ): Promise<void> {
    await this.trackError(error, {
      ...context,
      component,
      action,
    }, 'medium');
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    totalErrors: number;
    bySeverity: Record<ErrorSeverity, number>;
    byCategory: Record<ErrorCategory, number>;
    recentErrors: TrackedError[];
  } {
    const errors = Array.from(this.errors.values());
    
    const bySeverity: Record<ErrorSeverity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    const byCategory: Record<ErrorCategory, number> = {
      runtime: 0,
      api: 0,
      network: 0,
      user: 0,
      system: 0,
    };

    errors.forEach(err => {
      bySeverity[err.severity]++;
      byCategory[err.category]++;
    });

    return {
      totalErrors: errors.length,
      bySeverity,
      byCategory,
      recentErrors: errors.slice(-50).reverse(), // Last 50, newest first
    };
  }

  /**
   * Clear old errors (cleanup)
   */
  clearOldErrors(olderThanMs: number = 3600000): void {
    const cutoff = Date.now() - olderThanMs;
    const toDelete: string[] = [];

    this.errors.forEach((error, hash) => {
      if (error.timestamp < cutoff) {
        toDelete.push(hash);
      }
    });

    toDelete.forEach(hash => {
      this.errors.delete(hash);
      this.errorCounts.delete(hash);
    });
  }

  // ============ PRIVATE HELPERS ============

  private categorizeError(message: string): ErrorCategory {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('api') || lowerMessage.includes('endpoint')) {
      return 'api';
    }
    if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('timeout')) {
      return 'network';
    }
    if (lowerMessage.includes('cannot read') || lowerMessage.includes('undefined') || lowerMessage.includes('null')) {
      return 'runtime';
    }
    if (lowerMessage.includes('user') || lowerMessage.includes('permission')) {
      return 'user';
    }
    
    return 'system';
  }

  private getAPISeverity(statusCode: number): ErrorSeverity {
    if (statusCode >= 500) return 'critical';
    if (statusCode === 429) return 'high';
    if (statusCode >= 400) return 'medium';
    return 'low';
  }

  private generateHash(message: string, component?: string): string {
    const str = `${message}-${component || 'unknown'}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  private isDuplicate(error: TrackedError): boolean {
    const existing = this.errors.get(error.hash);
    if (!existing) return false;
    
    // Consider duplicate if within dedup window
    return (error.timestamp - existing.timestamp) < this.DEDUP_WINDOW;
  }

  private incrementErrorCount(hash: string): void {
    const count = this.errorCounts.get(hash) || 0;
    this.errorCounts.set(hash, count + 1);
  }

  private async logToSupabase(error: TrackedError): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = user ? await supabase
        .from('profiles')
        .select('company_id')
        .eq('user_id', user.id)
        .single() : { data: null };

      await supabase.from('system_logs').insert({
        level: this.severityToLogLevel(error.severity),
        message: `[${error.category.toUpperCase()}] ${error.message}`,
        context: {
          ...error.context,
          stack: error.stack,
          severity: error.severity,
          category: error.category,
          errorCount: this.errorCounts.get(error.hash) || 1,
        },
        user_id: user?.id || null,
        company_id: profile?.company_id || null,
      });
    } catch (err) {
      // Silent fail - don't create error loop
      if (import.meta.env.DEV) {
        const { logError } = await import('@/lib/logger');
        logError('[ErrorTracker] Failed to log to Supabase', err as Error);
      }
    }
  }

  private severityToLogLevel(severity: ErrorSeverity): 'error' | 'warn' | 'info' {
    if (severity === 'critical' || severity === 'high') return 'error';
    if (severity === 'medium') return 'warn';
    return 'info';
  }
}

// Singleton instance
export const errorTracker = new ErrorTracker();

// Convenience exports
export const trackError = (error: Error | unknown, context?: ErrorContext, severity?: ErrorSeverity) =>
  errorTracker.trackError(error, context, severity);

export const trackAPIError = (endpoint: string, statusCode: number, response: any, context?: ErrorContext) =>
  errorTracker.trackAPIError(endpoint, statusCode, response, context);

export const trackUIError = (component: string, action: string, error: Error | unknown, context?: ErrorContext) =>
  errorTracker.trackUIError(component, action, error, context);

export const getErrorStats = () => errorTracker.getErrorStats();

// Auto-cleanup every hour
setInterval(() => {
  errorTracker.clearOldErrors();
}, 3600000);
