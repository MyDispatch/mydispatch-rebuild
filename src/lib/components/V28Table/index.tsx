/**
 * V28Table - Atomic Design System Table Component
 * Part of MISSION I (ATLAS) - UI Atoms
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface V28TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

export interface V28TableProps<T> {
  columns: V28TableColumn<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  className?: string;
  emptyMessage?: string;
}

export function V28Table<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  className,
  emptyMessage = 'No data available',
}: V28TableProps<T>) {
  return (
    <div className={cn('w-full overflow-auto border border-slate-200 dark:border-slate-700', className)}>
      <table className="w-full text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300',
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-slate-500 dark:text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'bg-white dark:bg-slate-900',
                  onRowClick && 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-4 py-3 text-slate-900 dark:text-slate-100',
                      column.className
                    )}
                  >
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
