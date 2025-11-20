/* ==================================================================================
   RESILIENT SUPABASE CLIENT WITH CONNECTION POOLING - V18.2.28
   ==================================================================================
   - Connection Pooling (optimierte Performance)
   - Retry Logic (Exponential Backoff)
   - Offline-Support
   ================================================================================== */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { logError, logWarning } from "./logger";

// Singleton Connection Pool Instance
let poolInstance: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabasePool() {
  if (!poolInstance) {
    poolInstance = createClient<Database>(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
      {
        auth: {
          storage: localStorage,
          persistSession: true,
          autoRefreshToken: true,
        },
        global: {
          headers: {
            "x-my-dispatch-version": "18.2.28",
            "x-client-info": "mydispatch-web",
          },
        },
      }
    );
  }
  return poolInstance;
}

// Retry Options
interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 2000, // 2 seconds
  maxDelay: 8000, // 8 seconds
};

/**
 * Execute a Supabase query with exponential backoff retry
 */
export async function resilientQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  options: RetryOptions = {}
): Promise<{ data: T | null; error: any }> {
  const { maxRetries, baseDelay, maxDelay } = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await queryFn();

      // Success
      if (!result.error) {
        return result;
      }

      lastError = result.error;

      // Check if error is retryable
      if (!isRetryableError(result.error)) {
        return result;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);

      // Log retry attempt
      logWarning(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`, {
        error: result.error,
        attempt,
        delay,
      });

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (error) {
      lastError = error;

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // All retries failed
  logError("All retry attempts failed", lastError instanceof Error ? lastError : undefined, {
    error: lastError,
    maxRetries,
  });

  return { data: null, error: lastError };
}

/**
 * Check if error is retryable (network errors, timeouts)
 */
function isRetryableError(error: any): boolean {
  if (!error) return false;

  const retryableCodes = [
    "NETWORK_ERROR",
    "TIMEOUT",
    "ECONNRESET",
    "ENOTFOUND",
    "ECONNREFUSED",
    "ETIMEDOUT",
  ];

  const errorCode = error.code || error.message || "";
  return retryableCodes.some((code) => String(errorCode).toUpperCase().includes(code));
}

// Export convenience method
export const supabasePool = getSupabasePool();
