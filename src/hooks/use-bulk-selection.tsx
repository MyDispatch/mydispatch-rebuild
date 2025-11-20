/**
 * ==================================================================================
 * USE-BULK-SELECTION HOOK V18.3 - Multi-Select State Management
 * ==================================================================================
 * Generic Hook für Bulk-Selection in Tabellen
 * - Multi-Select mit Checkbox
 * - "Alle auswählen" Funktion
 * - Clear Selection
 * - Typed Return für maximale Type-Safety
 * ==================================================================================
 */

import { useState, useCallback, useMemo } from "react";

export interface UseBulkSelectionReturn<T> {
  selectedIds: string[];
  isSelected: (id: string) => boolean;
  isAllSelected: boolean;
  isSomeSelected: boolean;
  toggleSelection: (id: string) => void;
  toggleSelectAll: (items: T[]) => void;
  clearSelection: () => void;
  selectedCount: number;
}

/**
 * Generic Bulk-Selection Hook
 * @param extractId - Function to extract ID from item (default: item.id)
 */
export function useBulkSelection<T extends { id: string }>(
  extractId: (item: T) => string = (item) => item.id
): UseBulkSelectionReturn<T> {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Check if ID is selected
  const isSelected = useCallback((id: string): boolean => selectedIds.includes(id), [selectedIds]);

  // Toggle single selection
  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  }, []);

  // Toggle "Select All"
  const toggleSelectAll = useCallback(
    (items: T[]) => {
      const allIds = items.map(extractId);
      const isCurrentlyAllSelected = allIds.every((id) => selectedIds.includes(id));

      if (isCurrentlyAllSelected) {
        // Deselect all
        setSelectedIds([]);
      } else {
        // Select all
        setSelectedIds(allIds);
      }
    },
    [selectedIds, extractId]
  );

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  // Computed states
  const selectedCount = selectedIds.length;
  const isAllSelected = useMemo(
    () => (items: T[]) =>
      items.length > 0 && items.every((item) => selectedIds.includes(extractId(item))),
    [selectedIds, extractId]
  );
  const isSomeSelected = selectedIds.length > 0;

  return {
    selectedIds,
    isSelected,
    isAllSelected: false, // Wird dynamisch in Component berechnet
    isSomeSelected,
    toggleSelection,
    toggleSelectAll,
    clearSelection,
    selectedCount,
  };
}
