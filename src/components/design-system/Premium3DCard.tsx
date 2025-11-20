/* ==================================================================================
   PREMIUM 3D CARD COMPONENT V32.1
   ==================================================================================
   Wiederverwendbare 3D Card mit Hover-Effekten für KPIs & Metrics
   - Glassmorphism Background
   - 3D Hover-Animation
   - Trend-Indicator
   - Icon-Integration
   ================================================================================== */

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Premium3DCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Premium3DCard({
  icon: Icon,
  label,
  value,
  trend,
  trendDirection = 'neutral',
  variant = 'default',
  className
}: Premium3DCardProps) {
  const variantClasses = {
    default: 'border-slate-200 bg-white',
    success: 'border-green-200 bg-green-50/50',
    warning: 'border-amber-200 bg-amber-50/50',
    error: 'border-red-200 bg-red-50/50',
  };

  const iconBgClasses = {
    default: 'bg-slate-100',
    success: 'bg-green-100',
    warning: 'bg-amber-100',
    error: 'bg-red-100',
  };

  const iconColorClasses = {
    default: 'text-slate-700',
    success: 'text-green-700',
    warning: 'text-amber-700',
    error: 'text-red-700',
  };

  const trendColorClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-slate-600',
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1',
        variantClasses[variant],
        className
      )}
    >
      {/* Glassmorphism Hover Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

      {/* Content */}
      <div className="relative z-10 p-5 space-y-3">
        {/* Icon */}
        <div 
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110',
            iconBgClasses[variant]
          )}
        >
          <Icon className={cn('w-5 h-5', iconColorClasses[variant])} />
        </div>

        {/* Label + Value */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
        </div>

        {/* Trend (Optional) */}
        {trend && (
          <p className={cn(
            'text-xs font-medium flex items-center gap-1.5',
            trendColorClasses[trendDirection]
          )}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
