/* ==================================================================================
   API BASE - CENTRAL API CONFIGURATION
   ==================================================================================
   Single source of truth for all API calls
   ================================================================================== */

import { supabase } from '@/integrations/supabase/client';

/**
 * Base API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

/**
 * Query options for list endpoints
 */
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
}

/**
 * Handle Supabase errors consistently
 */
export function handleSupabaseError<T = any>(error: any): ApiResponse<T> {
  const apiError = new ApiError(
    error.message || 'An unknown error occurred',
    error.code,
    error.status
  );
  return { data: null, error: apiError };
}

/**
 * Base API configuration
 * All API modules should import from here
 */
export const api = {
  supabase, // Direct access when needed (migrations)
  
  // Placeholder for future API modules
  // bookings: bookingsApi,
  // customers: customersApi,
  // drivers: driversApi,
  // vehicles: vehiclesApi,
};

export default api;
