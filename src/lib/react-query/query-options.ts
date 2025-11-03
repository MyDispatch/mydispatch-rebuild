/**
 * React Query Default Options
 * 
 * Zentrale Konfiguration für konsistentes Caching-Verhalten
 * 
 * Siehe: docs/OPTIMIERUNGSPOTENZIAL_V18.5.1.md
 */

export const defaultQueryOptions = {
  queries: {
    // Standard: 5 Minuten Cache
    staleTime: 5 * 60 * 1000,
    
    // Garbage Collection nach 10 Minuten
    gcTime: 10 * 60 * 1000,
    
    // Retry-Strategie
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Refetch-Strategie
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },
  mutations: {
    // Retry nur bei Network-Errors
    retry: 1,
    retryDelay: 1000,
  },
} as const;

/**
 * Query-Optionen für Real-Time Daten
 * Kürzerer Cache, häufigeres Refetch
 */
export const realtimeQueryOptions = {
  staleTime: 30 * 1000, // 30 Sekunden
  gcTime: 5 * 60 * 1000, // 5 Minuten
  refetchInterval: 60 * 1000, // Jede Minute
  refetchOnWindowFocus: true,
} as const;

/**
 * Query-Optionen für statische Daten
 * Langer Cache, kein Refetch
 */
export const staticQueryOptions = {
  staleTime: 60 * 60 * 1000, // 1 Stunde
  gcTime: 24 * 60 * 60 * 1000, // 24 Stunden
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
} as const;

/**
 * Query-Optionen für User-Daten
 * Mittlerer Cache, Refetch on Focus
 */
export const userQueryOptions = {
  staleTime: 10 * 60 * 1000, // 10 Minuten
  gcTime: 30 * 60 * 1000, // 30 Minuten
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
} as const;
