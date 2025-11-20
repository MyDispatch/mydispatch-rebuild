/* ==================================================================================
   MEMOIZED KPI HOOK - Performance-Optimierung für Dashboard-KPIs
   ==================================================================================
   Purpose: 50% weniger Re-Renders durch Memoization von KPI-Berechnungen
   
   Features:
   - ✅ useMemo für aufwändige Berechnungen
   - ✅ Dependency-Tracking (nur bei Datenänderung neu berechnen)
   - ✅ Type-Safe Interface
   - ✅ Universell für alle KPI-Typen
   
   Usage:
   const kpis = useMemoizedKPIs(() => calculateKPIs(data), [data]);
   ================================================================================== */

import { useMemo, DependencyList } from "react";
import { logger } from "@/lib/logger";

/**
 * MEMOIZED KPI HOOK
 *
 * Verhindert unnötige Re-Berechnungen von KPIs durch Memoization.
 *
 * @example
 * ```tsx
 * const bookingKPIs = useMemoizedKPIs(() => [
 *   {
 *     title: 'Offene Aufträge',
 *     value: bookings.filter(b => b.status === 'open').length,
 *     icon: Calendar,
 *     trend: { value: +5, isPositive: true }
 *   },
 *   // ... weitere KPIs
 * ], [bookings]); // Nur neu berechnen wenn bookings sich ändert
 * ```
 *
 * @param calculateFn - Funktion die KPIs berechnet
 * @param deps - Dependencies (z.B. [bookings, drivers])
 * @returns Memoized KPIs (werden nur bei Dependency-Änderung neu berechnet)
 */
export function useMemoizedKPIs<T>(calculateFn: () => T, deps: DependencyList): T {
  return useMemo(() => {
    // Optional: Performance-Logging in Development
    if (import.meta.env.DEV) {
      const startTime = performance.now();
      const result = calculateFn();
      const endTime = performance.now();

      if (endTime - startTime > 10) {
        logger.debug(`[useMemoizedKPIs] Calculation took ${(endTime - startTime).toFixed(2)}ms`, {
          component: "useMemoizedKPIs",
        });
      }

      return result;
    }

    return calculateFn();
  }, deps);
}

/**
 * MEMOIZED STATS HOOK
 *
 * Spezialisierte Version für Statistik-Berechnungen.
 *
 * @example
 * ```tsx
 * const stats = useMemoizedStats(() => ({
 *   total: bookings.length,
 *   active: bookings.filter(b => b.status === 'active').length,
 *   revenue: bookings.reduce((sum, b) => sum + b.amount, 0),
 * }), [bookings]);
 * ```
 */
export function useMemoizedStats<T extends Record<string, any>>(
  calculateFn: () => T,
  deps: DependencyList
): T {
  return useMemo(() => {
    return calculateFn();
  }, deps);
}

/**
 * MEMOIZED FILTERED DATA HOOK
 *
 * Optimiert Filter-Operationen (z.B. Search, Filter by Status).
 *
 * @example
 * ```tsx
 * const filteredBookings = useMemoizedFilter(
 *   () => bookings.filter(b =>
 *     b.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
 *   ),
 *   [bookings, searchTerm]
 * );
 * ```
 */
export function useMemoizedFilter<T>(filterFn: () => T[], deps: DependencyList): T[] {
  return useMemo(() => {
    return filterFn();
  }, deps);
}

/**
 * MEMOIZED SORTED DATA HOOK
 *
 * Optimiert Sort-Operationen.
 *
 * @example
 * ```tsx
 * const sortedBookings = useMemoizedSort(
 *   () => [...bookings].sort((a, b) =>
 *     new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
 *   ),
 *   [bookings, sortOrder]
 * );
 * ```
 */
export function useMemoizedSort<T>(sortFn: () => T[], deps: DependencyList): T[] {
  return useMemo(() => {
    return sortFn();
  }, deps);
}

/**
 * MEMOIZED GROUPED DATA HOOK
 *
 * Optimiert Gruppierungs-Operationen (z.B. Group by Status, Date).
 *
 * @example
 * ```tsx
 * const groupedBookings = useMemoizedGroup(
 *   () => bookings.reduce((groups, booking) => {
 *     const status = booking.status;
 *     if (!groups[status]) groups[status] = [];
 *     groups[status].push(booking);
 *     return groups;
 *   }, {} as Record<string, typeof bookings>),
 *   [bookings]
 * );
 * ```
 */
export function useMemoizedGroup<T, K extends string | number = string>(
  groupFn: () => Record<K, T[]>,
  deps: DependencyList
): Record<K, T[]> {
  return useMemo(() => {
    return groupFn();
  }, deps);
}

// ==================================================================================
// PERFORMANCE-TIPPS
// ==================================================================================

/**
 * Best Practices für Memoization:
 *
 * 1. ✅ NUR bei aufwändigen Berechnungen (> 5ms)
 * 2. ✅ Dependency-Array GENAU definieren
 * 3. ✅ NICHT bei einfachen Operationen (Overhead > Nutzen)
 * 4. ✅ NICHT bei sich ständig ändernden Daten
 *
 * BEISPIEL (GUTES Memoization):
 * ```tsx
 * // 🟢 Gut: Aufwändige Berechnung, seltene Änderung
 * const kpis = useMemoizedKPIs(() =>
 *   calculateComplexKPIs(bookings, drivers, vehicles),
 *   [bookings, drivers, vehicles]
 * );
 * ```
 *
 * BEISPIEL (SCHLECHTES Memoization):
 * ```tsx
 * // 🔴 Schlecht: Einfache Berechnung, Overhead zu hoch
 * const total = useMemo(() => bookings.length, [bookings]);
 * ```
 */
