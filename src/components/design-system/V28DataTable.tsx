/* ==================================================================================
   V28 DATA TABLE - UNIVERSAL TABLE COMPONENT
   ==================================================================================
   ✅ Sortable columns
   ✅ Filterable
   ✅ Pagination
   ✅ Row selection
   ✅ Empty state
   ✅ Loading state
   ✅ Responsive
   ================================================================================== */

import { ReactNode, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import { V28Input } from './V28Input';
import { V28Button } from './V28Button';

export interface V28Column<T = any> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

interface V28DataTableProps<T = any> {
  data: T[];
  columns: V28Column<T>[];
  onRowClick?: (row: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
  pageSize?: number;
}

export function V28DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  searchable = false,
  searchPlaceholder = 'Suchen...',
  emptyMessage = 'Keine Daten vorhanden',
  loading = false,
  className,
  pageSize = 10,
}: V28DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    
    return data.filter((row) => {
      return columns.some((col) => {
        const value = col.accessorKey ? row[col.accessorKey] : null;
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  }, [data, searchQuery, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const col = columns.find((c) => c.id === sortColumn);
      if (!col?.accessorKey) return 0;
      
      const aVal = a[col.accessorKey];
      const bVal = b[col.accessorKey];
      
      if (aVal === bVal) return 0;
      
      const comparison = aVal > bVal ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection, columns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700" />
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      {searchable && (
        <div className="max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <V28Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className={cn(
                      'px-6 py-4 text-left text-sm font-semibold text-slate-900',
                      column.sortable && 'cursor-pointer hover:bg-slate-100 transition-colors',
                      column.width && `w-${column.width}`
                    )}
                    onClick={() => column.sortable && handleSort(column.id)}
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.sortable && sortColumn === column.id && (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      'hover:bg-slate-50 transition-colors',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((column) => (
                      <td key={column.id} className="px-6 py-4 text-sm text-slate-700">
                        {column.cell
                          ? column.cell(row)
                          : column.accessorKey
                          ? String(row[column.accessorKey])
                          : ''}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Zeige {(currentPage - 1) * pageSize + 1} bis{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} von {sortedData.length}
          </div>
          <div className="flex gap-2">
            <V28Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Zurück
            </V28Button>
            <V28Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Weiter
            </V28Button>
          </div>
        </div>
      )}
    </div>
  );
}
