/* ==================================================================================
   OPTIMIZED HANDLERS - V18.1
   ==================================================================================
   useCallback für Event-Handler zur Performance-Optimierung
   ================================================================================== */

import { useCallback } from "react";

/**
 * Optimized CRUD Handlers Hook
 * Nutzt useCallback um Referenz-Stabilität zu garantieren
 */
export function useOptimizedHandlers<T extends { id: string }>(
  onRefresh: () => Promise<void>,
  onOpenDetail: (item: T) => void,
  onEdit: (item: T) => void
) {
  const handleRefresh = useCallback(async () => {
    await onRefresh();
  }, [onRefresh]);

  const handleViewDetail = useCallback(
    (item: T) => {
      onOpenDetail(item);
    },
    [onOpenDetail]
  );

  const handleEdit = useCallback(
    (item: T) => {
      onEdit(item);
    },
    [onEdit]
  );

  return {
    handleRefresh,
    handleViewDetail,
    handleEdit,
  };
}

/**
 * Optimized Search Handler
 * Debounced Search mit useCallback
 */
export function useOptimizedSearch(onSearch: (term: string) => void, debounceMs: number = 300) {
  const handleSearch = useCallback(
    (term: string) => {
      const timer = setTimeout(() => {
        onSearch(term);
      }, debounceMs);

      return () => clearTimeout(timer);
    },
    [onSearch, debounceMs]
  );

  return handleSearch;
}

/**
 * Optimized Filter Handler
 * Memoized Filter-Funktion
 */
export function useOptimizedFilter<T>(
  items: T[],
  filterFn: (item: T, term: string) => boolean,
  searchTerm: string
) {
  return useCallback(() => {
    if (!searchTerm || searchTerm.trim() === "") {
      return items;
    }

    return items.filter((item) => filterFn(item, searchTerm.toLowerCase()));
  }, [items, filterFn, searchTerm]);
}
