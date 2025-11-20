/* ==================================================================================
   DASHBOARD GRID - MASTER COMPONENT V18.3.25
   ==================================================================================
   Professional responsive grid system for dashboard layouts with:
   - 3 Variants: kpis, widgets, cards
   - Responsive column system (Mobile → Tablet → Desktop)
   - Configurable gaps
   - Auto-fit and auto-fill support
   - Professional spacing and alignment
   ================================================================================== */

import { cn } from '@/lib/utils';

export interface DashboardGridProps {
  children: React.ReactNode;
  variant: 'kpis' | 'widgets' | 'cards';
  columns?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3;
    desktop?: 3 | 4;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DashboardGrid({
  children,
  variant,
  columns,
  gap = 'md',
  className
}: DashboardGridProps) {
  
  // Default column configurations per variant
  const variantColumns = {
    kpis: {
      mobile: 1,
      tablet: 2,
      desktop: 4
    },
    widgets: {
      mobile: 1,
      tablet: 2,
      desktop: 3
    },
    cards: {
      mobile: 1,
      tablet: 1,
      desktop: 2
    }
  };

  // Use custom columns or fallback to variant defaults
  const finalColumns = columns || variantColumns[variant];

  // Gap sizes
  const gapSizes = {
    sm: 'gap-3 sm:gap-4',
    md: 'gap-4 sm:gap-5 md:gap-6',
    lg: 'gap-5 sm:gap-6 md:gap-8'
  };

  // Generate grid column classes
  const getGridCols = () => {
    const { mobile, tablet, desktop } = finalColumns;
    const classes = [];

    // Mobile
    if (mobile === 1) classes.push('grid-cols-1');
    if (mobile === 2) classes.push('grid-cols-2');

    // Tablet (md breakpoint)
    if (tablet === 2) classes.push('md:grid-cols-2');
    if (tablet === 3) classes.push('md:grid-cols-3');

    // Desktop (lg breakpoint)
    if (desktop === 3) classes.push('lg:grid-cols-3');
    if (desktop === 4) classes.push('lg:grid-cols-4');

    return classes.join(' ');
  };

  return (
    <div 
      className={cn(
        'grid',
        getGridCols(),
        gapSizes[gap],
        'w-full',
        className
      )}
    >
      {children}
    </div>
  );
}
