/* ==================================================================================
   API TYPES - SHARED TYPE DEFINITIONS
   ==================================================================================
   Centralized types for API layer
   ================================================================================== */

import type { Database } from '@/integrations/supabase/types';

/**
 * Database table types
 */
export type Tables = Database['public']['Tables'];

// Entity types (direct from Supabase)
export type Booking = Tables['bookings']['Row'];
export type Customer = Tables['customers']['Row'];
export type Driver = Tables['drivers']['Row'];
export type Vehicle = Tables['vehicles']['Row'];
export type Company = Tables['companies']['Row'];

// Insert types (for creation)
export type BookingInsert = Tables['bookings']['Insert'];
export type CustomerInsert = Tables['customers']['Insert'];
export type DriverInsert = Tables['drivers']['Insert'];
export type VehicleInsert = Tables['vehicles']['Insert'];

// Update types (for updates)
export type BookingUpdate = Tables['bookings']['Update'];
export type CustomerUpdate = Tables['customers']['Update'];
export type DriverUpdate = Tables['drivers']['Update'];
export type VehicleUpdate = Tables['vehicles']['Update'];

/**
 * Query pagination
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Filter and sort options
 */
export interface FilterOptions {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  archived?: boolean;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Common query options
 */
export interface QueryOptions extends PaginationParams {
  filters?: FilterOptions;
  sort?: SortOptions;
}
