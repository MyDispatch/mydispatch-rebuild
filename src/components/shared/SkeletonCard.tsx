/* ==================================================================================
   SKELETON CARD - Loading-State Component
   ==================================================================================
   Purpose: Einheitliche Skeleton-Screens für bessere UX bei Loading-States
   
   Features:
   - ✅ Verschiedene Varianten (card, table, list)
   - ✅ Pulse-Animation
   - ✅ Responsive
   - ✅ Accessibility
   
   Usage:
   {isLoading ? <SkeletonCard variant="card" /> : <DataCard data={data} />}
   ================================================================================== */

import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  variant?: 'card' | 'table' | 'list' | 'kpi';
  count?: number;
  className?: string;
}

export function SkeletonCard({ 
  variant = 'card', 
  count = 1,
  className 
}: SkeletonCardProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const variants = {
    card: (
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-3 bg-muted rounded animate-pulse w-full" />
        <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
        <div className="flex gap-2 mt-4">
          <div className="h-8 bg-muted rounded animate-pulse w-20" />
          <div className="h-8 bg-muted rounded animate-pulse w-20" />
        </div>
      </div>
    ),
    kpi: (
      <div className="rounded-lg border border-border bg-card p-4 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3 bg-muted rounded animate-pulse w-24" />
          <div className="h-4 w-4 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-8 bg-muted rounded animate-pulse w-16" />
        <div className="h-2 bg-muted rounded animate-pulse w-32" />
      </div>
    ),
    table: (
      <div className="rounded-md border border-border">
        <div className="bg-muted/50 p-4 border-b border-border">
          <div className="flex gap-4">
            <div className="h-4 bg-muted rounded animate-pulse w-32" />
            <div className="h-4 bg-muted rounded animate-pulse w-24" />
            <div className="h-4 bg-muted rounded animate-pulse w-20" />
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 border-b border-border last:border-b-0">
            <div className="flex gap-4">
              <div className="h-3 bg-muted rounded animate-pulse w-32" />
              <div className="h-3 bg-muted rounded animate-pulse w-24" />
              <div className="h-3 bg-muted rounded animate-pulse w-20" />
            </div>
          </div>
        ))}
      </div>
    ),
    list: (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-2 bg-muted rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <div className={cn('space-y-4', className)}>
      {skeletons.map((i) => (
        <div key={i}>{variants[variant]}</div>
      ))}
    </div>
  );
}

/**
 * Skeleton für KPI-Grid
 */
export function SkeletonKPIGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <SkeletonCard variant="kpi" count={count} />
    </div>
  );
}

/**
 * Skeleton für Table
 */
export function SkeletonTable() {
  return <SkeletonCard variant="table" />;
}

/**
 * Skeleton für List
 */
export function SkeletonList({ count = 5 }: { count?: number }) {
  return <SkeletonCard variant="list" count={count} />;
}
