/* ==================================================================================
   API HEALTH MONITOR - PROAKTIVE EDGE FUNCTION ÜBERWACHUNG
   ==================================================================================
   Automatisches Pingen, Response-Time-Tracking, Retry mit Exponential Backoff
   ================================================================================== */

import { supabase } from '@/integrations/supabase/client';
import { trackAPIError } from './error-tracker';

export interface APIEndpoint {
  name: string;
  url: string;
  method: 'GET' | 'POST';
  timeout?: number;
  criticalityLevel: 'critical' | 'high' | 'medium' | 'low';
}

export interface HealthStatus {
  endpoint: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  lastChecked: string;
  errorCount: number;
  successRate: number;
}

class APIHealthMonitor {
  private healthStatuses: Map<string, HealthStatus> = new Map();
  private rateLimits: Map<string, { until: number; retryAfter: number }> = new Map();
  private readonly CHECK_INTERVAL = 60000;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAYS = [1000, 2000, 4000];
  private intervalId?: number;

  startMonitoring(endpoints: APIEndpoint[]): void {
    this.checkAllEndpoints(endpoints);
    this.intervalId = window.setInterval(() => {
      this.checkAllEndpoints(endpoints);
    }, this.CHECK_INTERVAL);
  }

  stopMonitoring(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private async checkAllEndpoints(endpoints: APIEndpoint[]): Promise<void> {
    await Promise.allSettled(endpoints.map(e => this.checkEndpoint(e)));
  }

  private async checkEndpoint(endpoint: APIEndpoint): Promise<void> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const startTime = Date.now();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), endpoint.timeout || 10000);

        const response = await fetch(endpoint.url, {
          method: endpoint.method,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;

        if (response.ok) {
          this.updateHealthStatus(endpoint.name, { status: 'healthy', responseTime, errorCount: 0 });
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      } catch (error) {
        lastError = error as Error;
        if (attempt < this.MAX_RETRIES) await this.delay(this.RETRY_DELAYS[attempt]);
      }
    }

    if (lastError) {
      this.updateHealthStatus(endpoint.name, { status: 'down', responseTime: -1, errorCount: 1 });
      await trackAPIError(endpoint.url, 0, lastError.message);
    }
  }

  private updateHealthStatus(endpoint: string, updates: Partial<Omit<HealthStatus, 'endpoint' | 'lastChecked'>>): void {
    const existing = this.healthStatuses.get(endpoint);
    this.healthStatuses.set(endpoint, {
      endpoint,
      status: updates.status || 'healthy',
      responseTime: updates.responseTime ?? existing?.responseTime ?? 0,
      lastChecked: new Date().toISOString(),
      errorCount: (existing?.errorCount || 0) + (updates.errorCount || 0),
      successRate: 1.0,
    });
  }

  getHealthStatuses(): HealthStatus[] {
    return Array.from(this.healthStatuses.values());
  }

  /**
   * Rate-Limit Management
   */
  isRateLimited(endpoint: string): boolean {
    const limit = this.rateLimits.get(endpoint);
    if (!limit) return false;
    
    const now = Date.now();
    if (now >= limit.until) {
      this.rateLimits.delete(endpoint);
      return false;
    }
    
    return true;
  }

  setRateLimit(endpoint: string, retryAfterSeconds: number): void {
    this.rateLimits.set(endpoint, {
      until: Date.now() + (retryAfterSeconds * 1000),
      retryAfter: retryAfterSeconds,
    });
  }

  getRetryAfter(endpoint: string): number {
    const limit = this.rateLimits.get(endpoint);
    return limit ? Math.ceil((limit.until - Date.now()) / 1000) : 0;
  }

  clearRateLimit(endpoint: string): void {
    this.rateLimits.delete(endpoint);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const apiHealthMonitor = new APIHealthMonitor();
