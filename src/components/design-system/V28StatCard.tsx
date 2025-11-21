/* ==================================================================================
   V28 STAT CARD - PREMIUM KPI COMPONENT
   ==================================================================================
   ✅ Based on V28MarketingCard + Home.tsx KPI Patterns
   ✅ Hover-Glow + Scale Animation
   ✅ Premium Shadows
   ✅ V28IconBox Integration
   ✅ Tailwind-native Slate colors
   ================================================================================== */

import { ReactNode } from 'react';
import type { LucideIcon} from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { V28IconBox } from './V28IconBox';

interface V28StatCardProps {
  label: string;
  value: string | number;
  change?: { value: number; trend: 'up' | 'down' | 'neutral' };
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
}

export function V28StatCard({ 
  label, 
  value, 
  change, 
  icon, 
  onClick,
  className 
}: V28StatCardProps) {
  const TrendIcon = change?.trend === 'up' 
    ? TrendingUp 
    : change?.trend === 'down' 
    ? TrendingDown 
    : Minus;

  const trendColorClass = change?.trend === 'up'
    ? 'text-status-success'
    : change?.trend === 'down'
    ? 'text-status-error'
    : 'text-slate-600';

  return (
    <div
      className={cn(
        'group relative overflow-hidden',
        'rounded-2xl bg-white border border-slate-200 shadow-lg',
        'p-8',
        'transition-all duration-300',
        onClick && 'cursor-pointer hover:shadow-2xl hover:scale-[1.02]',
        className
      )}
      onClick={onClick}
    >
      {/* Hover-Glow-Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold mb-3 text-slate-600">
            {label}
          </p>
          <p className="text-4xl font-black tracking-tight text-slate-900">
            {value}
          </p>
          
          {change && (
            <div className="flex items-center gap-2 mt-3">
              <TrendIcon className={cn('h-5 w-5', trendColorClass)} />
              <span className={cn('text-base font-bold', trendColorClass)}>
                {change.value > 0 ? '+' : ''}{change.value}%
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <V28IconBox icon={icon} variant="slate" />
        )}
      </div>
    </div>
  );
}
