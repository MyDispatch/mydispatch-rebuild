/* ==================================================================================
   METRIC DISPLAY COMPONENT - ERSETZT BADGE-MISSBRAUCH
   ==================================================================================
   ✅ Zeigt Zahlen/Metriken korrekt an (nicht als Badge)
   ✅ Optional: Trend-Indicator, Label, Icon
   ✅ Konsistentes Design mit Design-Tokens
   ==================================================================================
   ERSETZT: <Badge>15</Badge> → <MetricDisplay value={15} label="Aufträge" />
   ================================================================================== */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TYPOGRAPHY, SPACING } from '@/lib/design-system';
import { cn } from '@/lib/utils';
import { SafeIcon } from './SafeIcon';

// ==================================================================================
// TYPES
// ==================================================================================

interface MetricDisplayProps {
  value: string | number;
  label?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// ==================================================================================
// COMPONENT
// ==================================================================================

export function MetricDisplay({
  value,
  label,
  icon,
  trend,
  size = 'medium',
  className,
}: MetricDisplayProps) {
  
  // Size Mapping
  const sizeMap = {
    small: {
      value: TYPOGRAPHY.metricSmall,
      label: TYPOGRAPHY.bodySmall,
      icon: 'md' as const,
    },
    medium: {
      value: TYPOGRAPHY.metricMedium,
      label: TYPOGRAPHY.body,
      icon: 'lg' as const,
    },
    large: {
      value: TYPOGRAPHY.metricLarge,
      label: TYPOGRAPHY.bodyLarge,
      icon: 'xl' as const,
    },
  };
  
  const styles = sizeMap[size];
  
  // Trend Icon & Color
  const getTrendIcon = () => {
    if (!trend) return null;
    
    const icons = {
      up: TrendingUp,
      down: TrendingDown,
      neutral: Minus,
    };
    
    return icons[trend.direction];
  };
  
  const getTrendColor = () => {
    if (!trend) return '';
    
    // NUR hier dürfen Ampelfarben verwendet werden (für Trend-Status)
    const colors = {
      up: 'text-status-success',
      down: 'text-status-error',
      neutral: 'text-muted-foreground',
    };
    
    return colors[trend.direction];
  };
  
  const TrendIcon = getTrendIcon();
  
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {/* Icon + Value */}
      <div className="flex items-center gap-2">
        {icon && <SafeIcon icon={icon} size={styles.icon} />}
        <span className={styles.value}>{value}</span>
      </div>
      
      {/* Label */}
      {label && (
        <span className={cn(styles.label, 'text-muted-foreground')}>
          {label}
        </span>
      )}
      
      {/* Trend */}
      {trend && TrendIcon && (
        <div className={cn('flex items-center gap-1', getTrendColor())}>
          <TrendIcon className="h-4 w-4" />
          <span className="text-xs font-medium">
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </span>
        </div>
      )}
    </div>
  );
}

// ==================================================================================
// METRIC GRID COMPONENT (für Dashboard)
// ==================================================================================

interface MetricGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function MetricGrid({ children, columns = 4, className }: MetricGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };
  
  return (
    <div className={cn(
      'grid gap-4',
      gridCols[columns],
      className
    )}>
      {children}
    </div>
  );
}
