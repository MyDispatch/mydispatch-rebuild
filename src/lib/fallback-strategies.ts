// ==================================================================================
// FALLBACK STRATEGIES - NEVER-FAIL SYSTEM
// ==================================================================================
// Purpose: Provide fallback data and graceful degradation for all operations
// Ensures: System NEVER shows empty screens or crashes
// ==================================================================================

import type { AutonomousTask, AutonomousSystemConfig } from "@/types/autonomous";

// ==================================================================================
// DEFAULT CONFIGURATIONS
// ==================================================================================
export const DEFAULT_SYSTEM_CONFIG: AutonomousSystemConfig = {
  id: 1,
  enabled: true,
  dry_run_mode: true,
  autonomy_level: 2,
  max_parallel_tasks: 5,
  notification_email: "courbois1981@gmail.com",
  emergency_stop: false,
  emergency_stop_reason: null,
  last_health_check: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const FALLBACK_TASK: AutonomousTask = {
  id: "fallback-task",
  task_type: "system_check",
  description: "Fallback task - system operating in degraded mode",
  priority: 0,
  status: "pending",
  autonomy_level: 2,
  require_approval: false,
  created_at: new Date().toISOString(),
  started_at: null,
  completed_at: null,
  assigned_to: "system",
  error_message: null,
  retry_count: 0,
  max_retries: 3,
  input_data: {},
  output_data: null,
};

// ==================================================================================
// FALLBACK DATA PROVIDERS
// ==================================================================================
export function getFallbackTasks(): AutonomousTask[] {
  return [
    {
      ...FALLBACK_TASK,
      id: "fallback-1",
      description: "System operating in offline mode - data will sync when connection restored",
    },
  ];
}

export function getFallbackExecutionLogs() {
  return [
    {
      id: "fallback-log-1",
      task_id: "fallback-task",
      execution_step: "system_status",
      step_status: "completed" as const,
      input_data: null,
      output_data: {
        message: "System operating in degraded mode",
        timestamp: new Date().toISOString(),
      },
      error_data: null,
      timestamp: new Date().toISOString(),
      duration_ms: 0,
      agent_version: "1.0",
      git_commit_sha: null,
      environment: "production",
    },
  ];
}

export function getFallbackStats() {
  return {
    total_tasks: 0,
    pending_tasks: 0,
    in_progress_tasks: 0,
    completed_tasks: 0,
    failed_tasks: 0,
    success_rate: 100,
    avg_execution_time: 0,
    last_execution: null,
  };
}

// ==================================================================================
// CACHE MANAGEMENT
// ==================================================================================
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class FallbackCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private readonly DEFAULT_TTL = 300000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

export const fallbackCache = new FallbackCache();

// Cleanup expired cache entries every 5 minutes
setInterval(() => {
  fallbackCache.cleanup();
}, 300000);

// ==================================================================================
// SMART FALLBACK STRATEGY
// ==================================================================================
export function smartFallback<T>(
  cacheKey: string,
  fallbackGenerator: () => T,
  options: {
    useCache?: boolean;
    cacheTTL?: number;
  } = {}
): T {
  const { useCache = true, cacheTTL = 300000 } = options;

  // Try cache first
  if (useCache && fallbackCache.has(cacheKey)) {
    const cached = fallbackCache.get<T>(cacheKey);
    if (cached) {
      console.log(`📦 Using cached fallback for ${cacheKey}`);
      return cached;
    }
  }

  // Generate fresh fallback
  const fallback = fallbackGenerator();

  // Cache for next time
  if (useCache) {
    fallbackCache.set(cacheKey, fallback, cacheTTL);
  }

  return fallback;
}

// ==================================================================================
// DEGRADED MODE INDICATORS
// ==================================================================================
export function isDegradedMode(): boolean {
  // Check if we're using any fallback data
  return fallbackCache.has("system_config") || fallbackCache.has("tasks");
}

export function getDegradationLevel(): "normal" | "partial" | "severe" {
  const cachedKeys = [
    "system_config",
    "tasks",
    "execution_logs",
    "stats",
  ];

  const degradedCount = cachedKeys.filter((key) => fallbackCache.has(key)).length;

  if (degradedCount === 0) return "normal";
  if (degradedCount <= 2) return "partial";
  return "severe";
}

// ==================================================================================
// LOCAL STORAGE PERSISTENCE (Ultimate Fallback)
// ==================================================================================
export function persistToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`autonomous_fallback_${key}`, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to persist to localStorage", error);
  }
}

export function loadFromLocalStorage<T>(key: string): T | null {
  try {
    const stored = localStorage.getItem(`autonomous_fallback_${key}`);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (error) {
    console.warn("Failed to load from localStorage", error);
  }
  return null;
}

export function ultimateFallback<T>(
  key: string,
  defaultValue: T
): T {
  // Try localStorage first
  const stored = loadFromLocalStorage<T>(key);
  if (stored) {
    console.log(`💾 Using localStorage fallback for ${key}`);
    return stored;
  }

  // Return default
  console.log(`🔰 Using default fallback for ${key}`);
  return defaultValue;
}
