/* ==================================================================================
   SMART TEMPLATE: DATA GRID V28.1
   ==================================================================================
   ✅ Responsive Grid-Layout für Daten-Karten
   ✅ V28.1 Professional Minimalism
   ✅ Pure Tailwind mit Slate-Palette
   ================================================================================== */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DataGridProps {
  // Content
  children: ReactNode;
  
  // Layout
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  
  // Styling
  className?: string;
}

export function DataGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className,
}: DataGridProps) {
  // ✅ EXPLIZITE Klassen-Map (Tailwind PurgeCSS-kompatibel!)
  const columnClasses: Record<string, string> = {
    '1-1-1': 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1',
    '1-1-2': 'grid-cols-1 md:grid-cols-1 lg:grid-cols-2',
    '1-1-3': 'grid-cols-1 md:grid-cols-1 lg:grid-cols-3',
    '1-1-4': 'grid-cols-1 md:grid-cols-1 lg:grid-cols-4',
    '1-2-2': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2',
    '1-2-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '1-2-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    '1-3-3': 'grid-cols-1 md:grid-cols-3 lg:grid-cols-3',
    '1-3-4': 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4',
    '2-2-3': 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3',
    '2-3-4': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const gridKey = `${columns.mobile || 1}-${columns.tablet || 2}-${columns.desktop || 3}`;
  const gridClass = columnClasses[gridKey] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div
      className={cn(
        'grid items-start',
        gridClass,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * USAGE EXAMPLES:
 * 
 * // Standard 3-Column Grid
 * <DataGrid>
 *   <DashboardCard title="Card 1">Content</DashboardCard>
 *   <DashboardCard title="Card 2">Content</DashboardCard>
 *   <DashboardCard title="Card 3">Content</DashboardCard>
 * </DataGrid>
 * 
 * // Custom Column Configuration
 * <DataGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap="lg">
 *   <StatCard label="Aufträge" value="142" />
 *   <StatCard label="Fahrer" value="28" />
 *   <StatCard label="Fahrzeuge" value="35" />
 *   <StatCard label="Kunden" value="89" />
 * </DataGrid>
 * 
 * // Compact Grid
 * <DataGrid gap="sm" columns={{ mobile: 2, tablet: 3, desktop: 6 }}>
 *   {stats.map(stat => (
 *     <StatCard key={stat.id} {...stat} />
 *   ))}
 * </DataGrid>
 */
