/* ==================================================================================
   SMART TEMPLATE: STAT CARD V28.1
   ==================================================================================
   ✅ Kompakte Karte für KPIs und Statistiken
   ✅ V28.1 Professional Minimalism
   ✅ Pure Tailwind mit Slate-Palette
   ================================================================================== */

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LucideIcon} from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { StatusConfig } from '@/lib/status-system';

interface StatCardProps {
  // Content
  label?: string;
  title?: string; // Alias für label (KPIGenerator Kompatibilität)
  value: string | number;
  subtitle?: string; // NEU: Subtitle-Support für KPIGenerator
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  trend?: { value: number; label: string }; // Alias für change (KPIGenerator Kompatibilität)

  // Visual
  icon?: LucideIcon;

  // Behavior
  onClick?: () => void;

  // Styling
  className?: string;

  // NEU: Status-Integration (Phase 2.5)
  statusInfo?: StatusConfig | null;
}

export function StatCard({
  label,
  title,
  value,
  subtitle,
  change,
  trend,
  icon: Icon,
  onClick,
  className,
  statusInfo,
}: StatCardProps) {
  // Aliases: title → label, trend → change (KPIGenerator Kompatibilität)
  const displayLabel = title || label;

  // Konvertiere KPIGenerator trend → change format (nur wenn numerischer Wert vorhanden)
  const displayChange = change || (trend && typeof trend.value === 'number' && trend.value !== undefined ? {
    value: Math.abs(trend.value),
    trend: trend.value > 0 ? 'up' as const : trend.value < 0 ? 'down' as const : 'neutral' as const
  } : undefined);

  // Trend label für KPIGenerator (zeige label wenn kein numerischer trend.value vorhanden)
  const displayTrendLabel = trend?.label && !displayChange ? trend.label : undefined;

  // Trend Icon: up/down/neutral
  const TrendIcon = displayChange?.trend === 'up' ? TrendingUp :
                     displayChange?.trend === 'down' ? TrendingDown :
                     displayChange?.trend === 'neutral' ? Minus : null;

  return (
    <Card
      className={cn(
        'bg-white border border-slate-200 rounded-lg transition-all duration-300',
        onClick && 'cursor-pointer hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Label */}
            <p className="text-sm font-medium mb-2 text-slate-600">
              {displayLabel}
            </p>

            {/* Value */}
            <p className="text-3xl font-bold mb-2 text-slate-900">
              {value}
            </p>

            {/* Subtitle (KPIGenerator) */}
            {subtitle && (
              <p className="text-xs text-slate-500 mb-1">
                {subtitle}
              </p>
            )}

            {/* Change Indicator (mit neutral-Support) */}
            {displayChange && (
              <div className="flex items-center gap-1">
                {TrendIcon && (
                  <TrendIcon
                    className={cn(
                      'h-4 w-4',
                      displayChange.trend === 'up' && 'text-success-text',
                      displayChange.trend === 'down' && 'text-error-text',
                      displayChange.trend === 'neutral' && 'text-slate-400'
                    )}
                  />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    displayChange.trend === 'up' && 'text-success-text',
                    displayChange.trend === 'down' && 'text-error-text',
                    displayChange.trend === 'neutral' && 'text-slate-400'
                  )}
                >
                  {displayChange.value > 0 ? '+' : ''}{displayChange.value}%
                </span>
              </div>
            )}

            {/* Trend Label (KPIGenerator) - nur wenn kein Change-Indicator */}
            {displayTrendLabel && (
              <p className="text-xs text-slate-500 mt-1">
                {displayTrendLabel}
              </p>
            )}

            {/* NEU: Status Badge (Phase 2.5) */}
            {statusInfo && (
              <Badge
                variant="outline"
                className={cn(
                  'mt-2',
                  statusInfo.bgColorClass,
                  statusInfo.borderColorClass
                )}
              >
                <span className={statusInfo.colorClass}>
                  {statusInfo.label}
                </span>
              </Badge>
            )}
          </div>

          {/* Icon */}
          {Icon && (
            <div className="p-2.5 rounded-lg bg-slate-100 shrink-0">
              <Icon className="h-5 w-5 text-slate-700" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
