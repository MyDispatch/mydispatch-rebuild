/* ==================================================================================
   DASHBOARD GRID - Responsive Grid Layout Wrapper
   ==================================================================================
   ✅ Responsive grid wrapper
   ✅ Mobile: grid-cols-1
   ✅ Tablet: grid-cols-2
   ✅ Desktop: grid-cols-3 lg:grid-cols-4
   ✅ Consistent gap-4
   ================================================================================== */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardGridProps {
  children: ReactNode;
  columns?: 'auto' | 2 | 3 | 4 | 6;
  gap?: 2 | 3 | 4 | 6 | 8;
  className?: string;
  // Advanced layout options
  fullWidthOnMobile?: boolean;
  centerItems?: boolean;
}

export function DashboardGrid({ 
  children, 
  columns = 'auto',
  gap = 4,
  className = '',
  fullWidthOnMobile = true,
  centerItems = false
}: DashboardGridProps) {
  
  const getGridClass = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 6:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6';
      case 'auto':
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  const getGapClass = () => {
    return `gap-${gap}`;
  };

  return (
    <div 
      className={cn(
        'grid',
        getGridClass(),
        getGapClass(),
        fullWidthOnMobile && 'w-full',
        centerItems && 'place-items-center',
        className
      )}
    >
      {children}
    </div>
  );
}

// Specialized grid layouts for common dashboard patterns
export function DashboardMainGrid({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn(
      'grid grid-cols-1 xl:grid-cols-4 gap-4',
      className
    )}>
      {children}
    </div>
  );
}

export function DashboardContentGrid({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn(
      'xl:col-span-3 space-y-4',
      className
    )}>
      {children}
    </div>
  );
}

export function DashboardSidebarGrid({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn(
      'xl:col-span-1 space-y-4',
      className
    )}>
      {children}
    </div>
  );
}

export default DashboardGrid;