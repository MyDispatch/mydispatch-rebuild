/* ==================================================================================
   ZENTRALES TABELLEN-TEMPLATE V18.3 - SYSTEMWEITE KONSISTENZ
   ==================================================================================
   ✅ Einheitlicher Aufbau für ALLE Listen im System
   ✅ Nur Detail-Button am Seitenende
   ✅ Alle anderen Aktionen im Detail-Dialog
   ✅ Rechtskonforme Zeitstempel (created_at) immer sichtbar
   ✅ Bulk-Selection Support
   ✅ Responsive Design
   ================================================================================== */

import { ReactNode, memo } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Eye } from 'lucide-react';
import { V28Button } from '@/components/design-system/V28Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/EmptyState';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  sticky?: boolean; // V18.3: Legal-Required Columns
  mandatory?: boolean; // V18.3: Legal Compliance
}

interface StandardTableTemplateProps<T extends { id: string; created_at: string }> {
  data: T[];
  columns: TableColumn<T>[];
  onViewDetails: (item: T) => void;
  // Bulk-Selection
  selectedIds?: string[];
  onToggleSelection?: (id: string) => void;
  onToggleSelectAll?: () => void;
  showBulkSelect?: boolean;
  // Empty State
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  // Legal Compliance
  showCreatedAt?: boolean; // V18.3: Rechtlich erforderlich für Aufträge/Rechnungen
}

/**
 * Zentrales Tabellen-Template für ALLE Listen
 * - Einheitliche Struktur
 * - Nur Detail-Button
 * - Rechtskonforme Zeitstempel
 */
function StandardTableTemplateComponent<T extends { id: string; created_at: string }>({
  data,
  columns,
  onViewDetails,
  selectedIds = [],
  onToggleSelection,
  onToggleSelectAll,
  showBulkSelect = false,
  emptyTitle = 'Keine Einträge gefunden',
  emptyDescription = 'Es sind noch keine Einträge vorhanden',
  emptyIcon,
  showCreatedAt = true, // V18.3: Default true für Rechtssicherheit
}: StandardTableTemplateProps<T>) {
  // Check if all items are selected
  const isAllSelected = data.length > 0 && data.every(item => selectedIds.includes(item.id));
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

  if (data.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Bulk-Selection Checkbox */}
            {showBulkSelect && onToggleSelectAll && (
              <TableHead className="w-[50px] pl-6">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={onToggleSelectAll}
                  className={isSomeSelected && !isAllSelected ? "data-[state=checked]:bg-primary" : ""}
                  aria-label="Alle auswählen"
                />
              </TableHead>
            )}

            {/* Spalten-Header */}
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className={column.className}
              >
                {column.header}
              </TableHead>
            ))}

            {/* V18.3: Rechtlich erforderlich - Eingangsdatum IMMER anzeigen */}
            {showCreatedAt && (
              <TableHead className="w-[140px] hidden xl:table-cell">
                Eingegangen
              </TableHead>
            )}

            {/* Detail-Button Spalte (IMMER am Ende) */}
            <TableHead className="w-[100px] text-center">
              Details
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const isSelected = selectedIds.includes(item.id);

            return (
              <TableRow
                key={item.id}
                className="hover:bg-muted/50 transition-colors"
                data-selected={isSelected}
              >
                {/* Bulk-Selection Checkbox */}
                {showBulkSelect && onToggleSelection && (
                  <TableCell className="pl-6">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelection(item.id)}
                      aria-label={`Eintrag auswählen`}
                    />
                  </TableCell>
                )}

                {/* Spalten-Content */}
                {columns.map((column) => (
                  <TableCell
                    key={String(column.key)}
                    className={column.className}
                  >
                    {column.render
                      ? column.render(item)
                      : String(item[column.key as keyof T] || '-')}
                  </TableCell>
                ))}

                {/* V18.3: Rechtlich erforderlich - Eingangszeitstempel */}
                {showCreatedAt && (
                  <TableCell className="text-xs text-muted-foreground hidden xl:table-cell">
                    {format(new Date(item.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                  </TableCell>
                )}

                {/* Detail-Button (EINZIGER Button in der Tabelle) */}
                <TableCell className="text-center">
                  <V28Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onViewDetails(item)}
                    className="h-9 w-9 p-0 hover:bg-primary/10 transition-colors"
                    aria-label="Details anzeigen"
                  >
                    <Eye className="h-4 w-4 text-foreground" />
                  </V28Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export const StandardTableTemplate = memo(StandardTableTemplateComponent) as typeof StandardTableTemplateComponent;
