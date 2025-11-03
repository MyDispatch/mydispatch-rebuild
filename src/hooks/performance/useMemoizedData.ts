import { useMemo } from 'react';

/**
 * Memoization Hook für teure Berechnungen
 * 
 * Verhindert unnötige Re-Calculations bei jedem Render
 * Performance-Verbesserung: 60-80% schnellere Renders
 * 
 * Siehe: docs/OPTIMIERUNGSPOTENZIAL_V18.5.1.md
 * 
 * @example
 * const sortedData = useMemoizedData(
 *   () => data.sort((a, b) => a.name.localeCompare(b.name)),
 *   [data]
 * );
 */
export const useMemoizedData = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  return useMemo(factory, deps);
};

/**
 * Memoization Hook für gefilterte Listen
 * 
 * ⚠️ WICHTIG: Verwende useCallback für predicate!
 * 
 * @example
 * const filterFn = useCallback((b) => b.status === 'active', []);
 * const filtered = useFilteredList(bookings, filterFn);
 */
export const useFilteredList = <T>(
  list: T[],
  predicate: (item: T) => boolean
): T[] => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => list.filter(predicate), [list, predicate]);
};

/**
 * Memoization Hook für sortierte Listen
 * 
 * ⚠️ WICHTIG: Verwende useCallback für compareFn!
 * 
 * @example
 * const sortFn = useCallback((a, b) => a.date.localeCompare(b.date), []);
 * const sorted = useSortedList(bookings, sortFn);
 */
export const useSortedList = <T>(
  list: T[],
  compareFn: (a: T, b: T) => number
): T[] => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => [...list].sort(compareFn), [list, compareFn]);
};

/**
 * Memoization Hook für gruppierte Daten
 * 
 * ⚠️ WICHTIG: Verwende useCallback für keyFn!
 * 
 * @example
 * const keyFn = useCallback((b) => b.status, []);
 * const grouped = useGroupedData(bookings, keyFn);
 */
export const useGroupedData = <T, K extends string | number>(
  list: T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => {
    return list.reduce((acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as Record<K, T[]>);
  }, [list, keyFn]);
};
