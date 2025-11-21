/**
 * ==================================================================================
 * SELECTABLE-TABLE V18.3 - Wiederverwendbare Tabelle mit Bulk-Selection
 * ==================================================================================
 * ZWECK: Eliminiert Duplikation von Checkbox + BulkActionBar über alle Pages
 * - Integriert use-bulk-selection Hook
 * - Automatische Checkbox-Spalte
 * - Automatische BulkActionBar (sticky bottom)
 * - Typ-sicher mit Generics
 * ==================================================================================
 * VERWENDUNG:
 * 
 * <SelectableTable
 *   items={bookings}
 *   getItemId={(item) => item.id}
 *   bulkActions={[
 *     { label: 'Status ändern', icon: RefreshCw, onClick: handleBulkStatus },
 *     { label: 'Archivieren', icon: Archive, onClick: handleBulkArchive }
 *   ]}
 *   renderHeader={() => (
 *     <>
 *       <TableHead>Status</TableHead>
 *       <TableHead>Kunde</TableHead>
 *     </>
 *   )}
 *   renderRow={(item, isSelected, toggleSelection) => (
 *     <>
 *       <TableCell>{item.status}</TableCell>
 *       <TableCell>{item.customer_name}</TableCell>
 *     </>
 *   )}
 * />
 * ==================================================================================
 */

import type { ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useBulkSelection } from '@/hooks/use-bulk-selection';
import type { BulkAction } from '@/components/shared/BulkActionBar';
import { BulkActionBar } from '@/components/shared/BulkActionBar';
import { cn } from '@/lib/utils';

interface SelectableTableProps<T extends { id: string }> {
  /**
   * Array of items to display
   */
  items: T[];
  
  /**
   * Function to extract ID from item (default: item.id)
   */
  getItemId?: (item: T) => string;
  
  /**
   * Bulk actions to show in BulkActionBar
   */
  bulkActions: BulkAction[];
  
  /**
   * Render function for table header (without checkbox column)
   */
  renderHeader: () => ReactNode;
  
  /**
   * Render function for table row (without checkbox cell)
   * @param item - Current item
   * @param isSelected - Whether item is selected
   * @param toggleSelection - Function to toggle selection
   */
  renderRow: (item: T, isSelected: boolean, toggleSelection: () => void) => ReactNode;
  
  /**
   * Optional className for table
   */
  className?: string;
  
  /**
   * Optional: Show row hover effect
   */
  hoverable?: boolean;
  
  /**
   * Optional: Callback when item is clicked (entire row)
   */
  onRowClick?: (item: T) => void;
}

/**
 * SelectableTable - Generic table component with integrated bulk selection
 */
export function SelectableTable<T extends { id: string }>({
  items,
  getItemId = (item) => item.id,
  bulkActions,
  renderHeader,
  renderRow,
  className,
  hoverable = true,
  onRowClick,
}: SelectableTableProps<T>) {
  const {
    selectedIds,
    isSelected,
    toggleSelection,
    toggleSelectAll,
    clearSelection,
    selectedCount,
  } = useBulkSelection<T>(getItemId);

  // Check if all visible items are selected
  const allSelected = items.length > 0 && items.every((item) => isSelected(getItemId(item)));
  const someSelected = selectedCount > 0 && !allSelected;

  return (
    <>
      <Table className={className}>
        <TableHeader>
          <TableRow>
            {/* Checkbox Column */}
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={() => toggleSelectAll(items)}
                aria-label="Alle auswählen"
                className={cn(
                  someSelected && "data-[state=checked]:bg-muted-foreground"
                )}
              />
            </TableHead>
            
            {/* User-defined Headers */}
            {renderHeader()}
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {items.map((item) => {
            const itemId = getItemId(item);
            const itemSelected = isSelected(itemId);
            
            return (
              <TableRow
                key={itemId}
                data-state={itemSelected ? 'selected' : undefined}
                className={cn(
                  hoverable && "cursor-pointer",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(item)}
              >
                {/* Checkbox Cell */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={itemSelected}
                    onCheckedChange={() => toggleSelection(itemId)}
                    aria-label={`Auswählen ${itemId}`}
                  />
                </TableCell>
                
                {/* User-defined Row */}
                {renderRow(item, itemSelected, () => toggleSelection(itemId))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Bulk Action Bar (sticky bottom) */}
      <BulkActionBar
        selectedCount={selectedCount}
        onClearSelection={clearSelection}
        actions={bulkActions}
      />
    </>
  );
}
