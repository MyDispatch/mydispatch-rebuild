/* ==================================================================================
   REACT QUERY CLIENT - V18.5.1 (Performance-Optimiert)
   ==================================================================================
   Zentrale Query-Client-Konfiguration mit Smart Caching
   
   MIGRATION NOTICE (V18.5.1):
   - queryKeys moved to '@/lib/react-query/query-keys' (Factory Pattern)
   - This file now only exports queryClient + legacy keys for compatibility
   - All new code should use: import { queryKeys } from '@/lib/react-query/query-keys'
   ================================================================================== */

import { QueryClient } from '@tanstack/react-query';
import { defaultQueryOptions } from '@/lib/react-query/query-options';

export const queryClient = new QueryClient({
  defaultOptions: {
    ...defaultQueryOptions,
    queries: {
      ...defaultQueryOptions.queries,
      // Override: Aggressive Refetch für Real-Time Dashboard
      refetchInterval: 60 * 1000, // 1 Minute Background-Refetch
    },
  },
});

// ==================================================================================
// LEGACY QUERY-KEYS (DEPRECATED - Use @/lib/react-query/query-keys instead)
// ==================================================================================
// These keys are kept for backward compatibility only
// NEW CODE SHOULD USE: import { queryKeys } from '@/lib/react-query/query-keys'
// ==================================================================================

/** @deprecated Use queryKeys from '@/lib/react-query/query-keys' */
export const legacyQueryKeys = {
  bookings: (companyId: string) => ['bookings', companyId] as const,
  booking: (id: string) => ['booking', id] as const,
  
  drivers: (companyId: string) => ['drivers', companyId] as const,
  driver: (id: string) => ['driver', id] as const,
  
  vehicles: (companyId: string) => ['vehicles', companyId] as const,
  vehicle: (id: string) => ['vehicle', id] as const,
  
  customers: (companyId: string) => ['customers', companyId] as const,
  customer: (id: string) => ['customer', id] as const,
  
  partners: (companyId: string) => ['partners', companyId] as const,
  partner: (id: string) => ['partner', id] as const,
  
  costCenters: (companyId: string) => ['cost_centers', companyId] as const,
  costCenter: (id: string) => ['cost_center', id] as const,
  
  invoices: (companyId: string) => ['invoices', companyId] as const,
  invoice: (id: string) => ['invoice', id] as const,
  
  shifts: (companyId: string) => ['shifts', companyId] as const,
  shift: (id: string) => ['shift', id] as const,
  
  documents: (companyId: string, entityType?: string) => 
    entityType 
      ? (['documents', companyId, entityType] as const)
      : (['documents', companyId] as const),
  
  stats: (companyId: string) => ['stats', companyId] as const,
  
  globalSearch: (companyId: string, query: string) => 
    ['global-search', companyId, query],
};

// Re-export as queryKeys for backward compatibility
/** @deprecated Use queryKeys from '@/lib/react-query/query-keys' */
export const queryKeys = legacyQueryKeys;

// ==================================================================================
// NEW QUERY-KEYS SYSTEM (RECOMMENDED)
// ==================================================================================
// Export the new factory-based queryKeys system
export { queryKeys as newQueryKeys } from '@/lib/react-query/query-keys';
