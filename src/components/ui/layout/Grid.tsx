/* ==================================================================================
   GRID COMPONENT V28.1 - LAYOUT PATTERN SYSTEM
   ==================================================================================
   ✅ Responsive grid columns
   ✅ Consistent gaps
   ✅ Auto-flow options
   ✅ V28.1 Slate Design System
   ================================================================================== */

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Responsive columns */
  cols?: {
    default?: 1 | 2 | 3 | 4 | 5 | 6;
    sm?: 1 | 2 | 3 | 4 | 5 | 6;
    md?: 1 | 2 | 3 | 4 | 5 | 6;
    lg?: 1 | 2 | 3 | 4 | 5 | 6;
    xl?: 1 | 2 | 3 | 4 | 5 | 6;
  };
  /** Gap between items */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

/**
 * Grid Component
 * 
 * Responsive grid layout with consistent spacing.
 * 
 * @example
 * <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
 *   {children}
 * </Grid>
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ cols = { default: 1 }, gap = 'md', children, className, ...props }, ref) => {
    const gapClasses = {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    };
    
    const colsDefault = cols.default || 1;
    const colsSm = cols.sm;
    const colsMd = cols.md;
    const colsLg = cols.lg;
    const colsXl = cols.xl;
    
    const gridColsClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
    };
    
    const smColsClasses = {
      1: 'sm:grid-cols-1',
      2: 'sm:grid-cols-2',
      3: 'sm:grid-cols-3',
      4: 'sm:grid-cols-4',
      5: 'sm:grid-cols-5',
      6: 'sm:grid-cols-6',
    };
    
    const mdColsClasses = {
      1: 'md:grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
      4: 'md:grid-cols-4',
      5: 'md:grid-cols-5',
      6: 'md:grid-cols-6',
    };
    
    const lgColsClasses = {
      1: 'lg:grid-cols-1',
      2: 'lg:grid-cols-2',
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
      5: 'lg:grid-cols-5',
      6: 'lg:grid-cols-6',
    };
    
    const xlColsClasses = {
      1: 'xl:grid-cols-1',
      2: 'xl:grid-cols-2',
      3: 'xl:grid-cols-3',
      4: 'xl:grid-cols-4',
      5: 'xl:grid-cols-5',
      6: 'xl:grid-cols-6',
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          gridColsClasses[colsDefault],
          colsSm && smColsClasses[colsSm],
          colsMd && mdColsClasses[colsMd],
          colsLg && lgColsClasses[colsLg],
          colsXl && xlColsClasses[colsXl],
          gapClasses[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';
