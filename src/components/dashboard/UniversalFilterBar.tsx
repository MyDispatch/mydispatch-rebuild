/* ==================================================================================
   UNIVERSAL FILTER BAR V33.0 - STANDARDISIERTE SUCHE & FILTER
   ==================================================================================
   ✅ Suche (immer vorhanden)
   ✅ Archiv-Toggle (immer vorhanden)
   ✅ Dynamische Filter (optional)
   ✅ 100% V28.1 Design System konform
   ✅ Responsive (Mobile Stack, Desktop Row)
   ================================================================================== */

import { Input } from '@/lib/compat';
import { Switch } from '@/lib/compat';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/compat';
import { cn } from '@/lib/utils';

export interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange';
  options?: { value: string; label: string }[];
  value?: any;
  placeholder?: string;
}

interface UniversalFilterBarProps {
  // Standard (immer vorhanden)
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  showArchived: boolean;
  onArchivedChange: (value: boolean) => void;
  
  // Optional (dashboard-spezifisch)
  filters?: FilterConfig[];
  onFilterChange?: (filterId: string, value: any) => void;
  
  // Layout
  className?: string;
}

export function UniversalFilterBar({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Suchen...",
  showArchived,
  onArchivedChange,
  filters,
  onFilterChange,
  className
}: UniversalFilterBarProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-4 p-4 bg-white border-b border-slate-200", className)}>
      {/* Suche (immer links) */}
      <div className="flex-1">
        <Input
          type="search"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      
      {/* Filter (optional, mitte) */}
      {filters && filters.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => (
            <Select
              key={filter.id}
              value={filter.value}
              onValueChange={(value) => onFilterChange?.(filter.id, value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={filter.placeholder || filter.label} />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      )}
      
      {/* Archiv-Toggle (immer rechts) */}
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Switch
          checked={showArchived}
          onCheckedChange={onArchivedChange}
          id="archive-toggle"
        />
        <label htmlFor="archive-toggle" className="text-sm text-slate-600 cursor-pointer">
          Archivierte anzeigen
        </label>
      </div>
    </div>
  );
}
