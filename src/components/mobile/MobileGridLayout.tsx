import { useState } from "react";
import { V28Button } from "@/components/design-system/V28Button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Search, Plus, LucideIcon } from "lucide-react";
import { MobileInput } from "./MobileInput";
import { MobileFilterBar } from "./MobileFilterBar";
import { EmptyState } from "@/components/shared/EmptyState";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface MobileGridLayoutProps<T> {
  // Search & Refresh
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  isLoading: boolean;

  // Filter Bar
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;

  // Data & Rendering
  data: T[];
  renderCard: (item: T) => React.ReactNode;
  onItemClick: (item: T) => void;
  entityLabel: { singular: string; plural: string };

  // FAB
  fabLabel: string;
  onFabClick: () => void;
  fabIcon?: LucideIcon;

  // Empty State
  emptyStateProps: {
    icon: React.ReactNode;
    noDataTitle: string;
    noDataDescription: string;
    noResultsTitle: string;
    noResultsDescription: string;
  };
}

export function MobileGridLayout<T extends { id: string }>({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onRefresh,
  isLoading,
  filters,
  activeFilter,
  onFilterChange,
  data,
  renderCard,
  onItemClick,
  entityLabel,
  fabLabel,
  onFabClick,
  fabIcon: FabIcon = Plus,
  emptyStateProps,
}: MobileGridLayoutProps<T>) {
  return (
    <div className="space-y-6">
      {/* 1. Search + Refresh - STANDARDISIERT */}
      <div className="flex items-center gap-3">
        <MobileInput
          type="search"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
          icon={Search}
          className="flex-1"
        />
        <V28Button
          variant="secondary"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-11 w-11 shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </V28Button>
      </div>

      {/* 2. Filter Bar - STANDARDISIERT */}
      <MobileFilterBar
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />

      {/* 3. Results Count - STANDARDISIERT */}
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-medium text-muted-foreground">
          {data.length} {data.length === 1 ? entityLabel.singular : entityLabel.plural}
        </span>
      </div>

      {/* 4. Content Area - CUSTOMIZABLE via renderCard */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-24 bg-muted rounded" />
            </Card>
          ))}
        </div>
      ) : data.length > 0 ? (
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.id} onClick={() => onItemClick(item)}>
              {renderCard(item)}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={emptyStateProps.icon}
          title={searchValue ? emptyStateProps.noResultsTitle : emptyStateProps.noDataTitle}
          description={
            searchValue ? emptyStateProps.noResultsDescription : emptyStateProps.noDataDescription
          }
          actionLabel={!searchValue ? fabLabel : undefined}
          onAction={!searchValue ? onFabClick : undefined}
          isSearchResult={!!searchValue}
        />
      )}

      {/* 5. FAB - STANDARDISIERT */}
      <V28Button
        size="lg"
        variant="primary"
        className="fixed bottom-24 right-4 rounded-full w-14 h-14 shadow-2xl z-40 hover:scale-110 transition-transform"
        onClick={onFabClick}
        aria-label={fabLabel}
      >
        <FabIcon className="h-6 w-6" />
      </V28Button>
    </div>
  );
}
