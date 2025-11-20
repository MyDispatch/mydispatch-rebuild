/* ==================================================================================
   Mobile Scroll Table - V18.3.18 Sprint 41
   ==================================================================================
   - Touch-optimierte horizontale Scroll-Tabelle
   - Sticky Header
   - Responsive Column-Widths
   - Type-safe mit Generics
   ================================================================================== */

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  width?: number;
  align?: "left" | "center" | "right";
  className?: string;
}

interface MobileScrollTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
  className?: string;
}

export function MobileScrollTable<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  emptyMessage = "Keine Daten verfügbar",
  className,
}: MobileScrollTableProps<T>) {
  const getCellValue = (row: T, column: Column<T>): ReactNode => {
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }
    return row[column.accessor] as ReactNode;
  };

  const getAlignClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  return (
    <div className={cn("overflow-x-auto scrollbar-hide -mx-4", className)}>
      <div className="inline-block min-w-full px-4">
        <table className="min-w-full divide-y divide-border">
          {/* Header - Sticky */}
          <thead className="sticky top-0 bg-card z-10 shadow-sm">
            <tr>
              {columns.map((column, i) => (
                <th
                  key={i}
                  className={cn(
                    "py-3 px-3 text-xs font-semibold text-muted-foreground",
                    getAlignClass(column.align),
                    column.className
                  )}
                  style={{ minWidth: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-border bg-card">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 px-3 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row, rowIndex)}
                  className={cn(
                    "transition-colors",
                    onRowClick && "active:bg-muted/50 cursor-pointer touch-manipulation"
                  )}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        "py-3 px-3 text-sm",
                        getAlignClass(column.align),
                        column.className
                      )}
                    >
                      {getCellValue(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Scroll-Hinweis (nur bei ersten 2 Zeilen sichtbar) */}
      {data.length > 0 && (
        <div className="text-xs text-muted-foreground text-center mt-2 px-4">
          👉 Horizontal scrollen für mehr Spalten
        </div>
      )}
    </div>
  );
}
