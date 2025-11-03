/* ==================================================================================
   V26 PERFORMANCE BADGE → V28 BADGE (DEPRECATED)
   ==================================================================================
   @deprecated Use V28Badge or standard Badge component instead!
   
   This V26 component is deprecated and will be removed in v29.
   Use the V28Badge component for all new trend indicators.
   
   Migration:
   ```tsx
   // Old
   import { V26PerformanceBadge } from '@/components/design-system/V26PerformanceBadge';
   
   // New
   import { Badge } from '@/lib/compat';
   ```
   ================================================================================== */

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface V26PerformanceBadgeProps {
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: {
    container: 'px-2 py-0.5 text-[10px]',
    icon: 'h-3 w-3',
  },
  md: {
    container: 'px-2.5 py-1 text-xs',
    icon: 'h-3.5 w-3.5',
  },
  lg: {
    container: 'px-3 py-1.5 text-sm',
    icon: 'h-4 w-4',
  },
};

export function V26PerformanceBadge({
  value,
  trend = 'neutral',
  showIcon = true,
  size = 'md',
  className,
}: V26PerformanceBadgeProps) {
  const sizes = sizeMap[size];
  
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg font-sans font-semibold transition-all duration-200 text-slate-900 bg-slate-100 border-2 border-slate-200 shadow-sm',
        sizes.container,
        className
      )}
    >
      {showIcon && TrendIcon && (
        <TrendIcon 
          className={cn(sizes.icon, 'text-slate-700')}
        />
      )}
      <span>{value}</span>
    </div>
  );
}
