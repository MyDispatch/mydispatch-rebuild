/* ==================================================================================
   DATADOC MONITORING CLIENT V18.5.0
   ==================================================================================
   Production-Ready Monitoring & Analytics Client für MyDispatch
   
   Features:
   - Real-time Metrics Logging
   - Event Tracking
   - Error Reporting
   - Performance Monitoring
   - DSGVO-konform (keine PII)
   
   Integration mit Datadoc.com API
   ================================================================================== */

import { logger } from './logger';

interface DatadocConfig {
  baseUrl: string;
  keyId: string;
  apiKey: string;
  enabled: boolean;
}

interface Metric {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp?: string;
}

interface Event {
  type: string;
  data: Record<string, any>;
  timestamp?: string;
}

export class DatadocClient {
  private config: DatadocConfig;
  private queue: Array<Metric | Event> = [];
  private flushInterval: number = 10000; // 10 seconds
  private flushTimer: number | null = null;

  constructor() {
    // Initialize from environment variables
    this.config = {
      baseUrl: 'https://api.datadoc.com/v1',
      keyId: import.meta.env.VITE_DATADOC_KEY_ID || '',
      apiKey: import.meta.env.VITE_DATADOC_API_KEY || '',
      enabled: import.meta.env.PROD && !!import.meta.env.VITE_DATADOC_API_KEY,
    };

    // Start auto-flush if enabled
    if (this.config.enabled) {
      this.startAutoFlush();
    }
  }

  /**
   * Log a metric to Datadoc
   * 
   * @example
   * datadoc.logMetric({
   *   name: 'api.query.duration',
   *   value: 234,
   *   tags: { endpoint: 'bookings', status: 'success' }
   * });
   */
  async logMetric(metric: Metric): Promise<void> {
    if (!this.config.enabled) {
      if (import.meta.env.DEV) {
        logger.debug('[Datadoc] Metric (disabled)', { component: 'DatadocClient', metric });
      }
      return;
    }

    try {
      const payload = {
        ...metric,
        timestamp: metric.timestamp || new Date().toISOString(),
        source: 'mydispatch-frontend',
        environment: import.meta.env.MODE,
      };

      // Queue for batch sending
      this.queue.push(payload);

      // Flush immediately if critical metric
      if (metric.tags?.priority === 'critical') {
        await this.flush();
      }
    } catch (error) {
      logger.error('[Datadoc] Failed to log metric', error as Error, { metric });
    }
  }

  /**
   * Log an event to Datadoc
   * 
   * @example
   * datadoc.logEvent({
   *   type: 'user.login',
   *   data: { method: 'email', success: true }
   * });
   */
  async logEvent(event: Event): Promise<void> {
    if (!this.config.enabled) {
      if (import.meta.env.DEV) {
        logger.debug('[Datadoc] Event (disabled)', { component: 'DatadocClient', event });
      }
      return;
    }

    try {
      const payload = {
        ...event,
        timestamp: event.timestamp || new Date().toISOString(),
        source: 'mydispatch-frontend',
        environment: import.meta.env.MODE,
        // Remove PII for DSGVO compliance
        data: this.sanitizeData(event.data),
      };

      this.queue.push(payload);
    } catch (error) {
      logger.error('[Datadoc] Failed to log event', error as Error, { event });
    }
  }

  /**
   * Track API performance
   */
  async trackAPICall(
    endpoint: string,
    duration: number,
    status: 'success' | 'error',
    metadata?: Record<string, string>
  ): Promise<void> {
    await this.logMetric({
      name: 'api.query.duration',
      value: duration,
      tags: {
        endpoint,
        status,
        ...metadata,
      },
    });
  }

  /**
   * Track user interaction
   */
  async trackInteraction(
    action: string,
    component: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.logEvent({
      type: 'user.interaction',
      data: {
        action,
        component,
        ...metadata,
      },
    });
  }

  /**
   * Track error occurrence
   */
  async trackError(
    errorType: string,
    component: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.logEvent({
      type: 'error.occurred',
      data: {
        errorType,
        component,
        ...metadata,
      },
    });
  }

  /**
   * Flush queued metrics/events to Datadoc API
   */
  private async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const batch = [...this.queue];
    this.queue = [];

    try {
      const response = await fetch(`${this.config.baseUrl}/batch`, {
        method: 'POST',
        headers: {
          'X-API-Key-ID': this.config.keyId,
          'X-API-Key': this.config.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: batch }),
      });

      if (!response.ok) {
        throw new Error(`Datadoc API error: ${response.status}`);
      }

      if (import.meta.env.DEV) {
        logger.debug(`[Datadoc] Flushed ${batch.length} events`, { component: 'DatadocClient' });
      }
    } catch (error) {
      logger.error('[Datadoc] Failed to flush batch', error as Error);
      // Re-queue on error
      this.queue.unshift(...batch);
    }
  }

  /**
   * Start auto-flush timer
   */
  private startAutoFlush(): void {
    if (this.flushTimer) return;

    this.flushTimer = window.setInterval(() => {
      this.flush();
    }, this.flushInterval) as unknown as number;
  }

  /**
   * Stop auto-flush timer
   */
  public stopAutoFlush(): void {
    if (this.flushTimer) {
      window.clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Remove PII from data (DSGVO compliance)
   */
  private sanitizeData(data: Record<string, any>): Record<string, any> {
    const sanitized = { ...data };
    const piiFields = ['email', 'phone', 'name', 'firstName', 'lastName', 'address'];

    piiFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Manually flush all pending events (e.g., before page unload)
   */
  public async flushAll(): Promise<void> {
    await this.flush();
  }
}

// Singleton instance
export const datadoc = new DatadocClient();

// Auto-flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    datadoc.flushAll();
  });
}
