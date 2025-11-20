/* ==================================================================================
   API-UTILS - Zentrale API-Helper-Funktionen
   ==================================================================================
   - Error Handling (handleError, handleSuccess)
   - Query-Filtering (company_id, archived)
   - Response-Formatierung
   ================================================================================== */

import { toast } from 'sonner';
import type { PostgrestError } from '@supabase/supabase-js';
import { logError, logDebug } from '@/lib/logger';

// ============================================================================
// ERROR HANDLING
// ============================================================================

export interface ErrorOptions {
  showToast?: boolean;
  fallbackMessage?: string;
  logToConsole?: boolean;
}

export function handleError(
  error: unknown,
  message?: string,
  options: ErrorOptions = {}
): void {
  const {
    showToast = true,
    fallbackMessage = 'Ein Fehler ist aufgetreten',
    logToConsole = true,
  } = options;

  // Log error
  if (logToConsole) {
    logError(message || fallbackMessage, error instanceof Error ? error : undefined, { 
      component: 'api-utils',
      error: typeof error === 'object' ? JSON.stringify(error) : String(error)
    });
  }

  // Extract error message
  let errorMessage = fallbackMessage;
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (isPostgrestError(error)) {
    errorMessage = error.message || error.details || fallbackMessage;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  // Show toast
  if (showToast) {
    toast.error(message || 'Fehler', {
      description: errorMessage,
      duration: 5000,
    });
  }
}

export function handleSuccess(message: string, description?: string): void {
  toast.success(message, {
    description,
    duration: 3000,
  });
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

// ============================================================================
// QUERY HELPERS
// ============================================================================

export interface QueryFilters {
  company_id?: string;
  archived?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Erstellt Standard-Filter für Multi-Tenant-Queries
 * 
 * @example
 * const filters = getStandardFilters(profile.company_id);
 * let query = supabase.from('bookings').select('*');
 * query = applyFilters(query, filters);
 */
export function getStandardFilters(
  companyId: string,
  archived: boolean = false
): QueryFilters {
  return {
    company_id: companyId,
    archived,
  };
}

/**
 * Wendet Filter auf Supabase-Query an (Type-Safe)
 * 
 * @example
 * let query = supabase.from('bookings').select('*');
 * query = applyQueryFilters(query, { company_id: '123', archived: false });
 */
export function applyQueryFilters<T>(
  query: any, // PostgrestQueryBuilder ist zu komplex zum Typisieren
  filters: QueryFilters
): any {
  if (filters.company_id) {
    query = query.eq('company_id', filters.company_id);
  }

  if (filters.archived !== undefined) {
    query = query.eq('archived', filters.archived);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  return query;
}

/**
 * Helper für company_id + archived Filter (häufigster Use-Case)
 * 
 * @example
 * const { data } = await queryWithCompanyFilter(
 *   supabase.from('bookings').select('*'),
 *   profile.company_id
 * );
 */
export async function queryWithCompanyFilter<T>(
  query: any,
  companyId: string,
  includeArchived: boolean = false
): Promise<{ data: T[] | null; error: PostgrestError | null }> {
  let filteredQuery = query.eq('company_id', companyId);
  
  if (!includeArchived) {
    filteredQuery = filteredQuery.eq('archived', false);
  }

  return filteredQuery;
}

// ============================================================================
// RESPONSE HELPERS
// ============================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    error: null,
    success: true,
  };
}

export function createErrorResponse<T>(error: string): ApiResponse<T> {
  return {
    data: null,
    error,
    success: false,
  };
}

// ============================================================================
// RETRY LOGIC
// ============================================================================

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  shouldRetry?: (error: unknown) => boolean;
}

/**
 * Führt eine Funktion mit Retry-Logic aus
 * 
 * @example
 * const data = await withRetry(
 *   () => supabase.from('bookings').select('*'),
 *   { maxRetries: 3 }
 * );
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    shouldRetry = () => true,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries - 1 && shouldRetry(error)) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}
