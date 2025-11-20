/* ==================================================================================
   UNIVERSAL PAGINATION V33.0 - STANDARDISIERTE PAGINATION
   ==================================================================================
   ✅ Prev/Next Navigation
   ✅ Page Numbers mit Ellipsis
   ✅ Items-per-Page Select
   ✅ Status-Text (Zeige X-Y von Z)
   ✅ 100% V28.1 Design System konform
   ✅ Responsive
   ================================================================================== */

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/compat";
import { cn } from "@/lib/utils";

interface UniversalPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (count: number) => void;
  itemsPerPageOptions?: number[];
  className?: string;
}

export function UniversalPagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50, 100],
  className,
}: UniversalPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border-t border-slate-200",
        className
      )}
    >
      {/* Items-per-Page Select */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600">Zeige</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {itemsPerPageOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-slate-600">Einträge</span>
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={cn(
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:bg-slate-100"
              )}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;

            // Show first, last, current, and adjacent pages
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={page === currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            // Show ellipsis
            if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <PaginationItem key={page}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return null;
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              className={cn(
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:bg-slate-100"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Status Text */}
      <div className="text-sm text-slate-600">
        {totalItems > 0 ? (
          <>
            Zeige {startItem}-{endItem} von {totalItems}
          </>
        ) : (
          <>Keine Einträge</>
        )}
      </div>
    </div>
  );
}
