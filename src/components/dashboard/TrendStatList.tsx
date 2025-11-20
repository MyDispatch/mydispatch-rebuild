/* ==================================================================================
   TREND STAT LIST - List of Statistics with Trend Indicators
   ==================================================================================
   ✅ List of stats with trend indicators
   ✅ Each item: title, value, trend (+/- %), icon
   ✅ Consistent spacing: gap-2 between items
   ✅ Professional design system colors
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TrendStatItem {
  label: string;
  value: string | number;
  trend: number;
  trendType: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  format?: 'currency' | 'percent' | 'number';
}

interface TrendStatListProps {
  title?: string;
  items: TrendStatItem[];
  className?: string;
}

export function TrendStatList({ 
  title = 'Live-Statistiken', 
  items,
  className = '' 
}: TrendStatListProps) {
  const getTrendIcon = (trendType: string) => {
    switch(trendType) {
      case 'positive':
        return TrendingUp;
      case 'negative':
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getTrendColor = (trendType: string) => {
    switch(trendType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-slate-400';
    }
  };

  const formatValue = (value: string | number, format?: string) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('de-DE', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(value));
    }
    if (format === 'percent') {
      return `${value}%`;
    }
    return value.toString();
  };

  return (
    <Card className={`bg-white ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          {items.map((item, index) => {
            const TrendIcon = getTrendIcon(item.trendType);
            const Icon = item.icon;
            
            return (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {Icon && (
                    <div className="p-2 rounded-lg bg-white">
                      <Icon className="h-4 w-4 text-slate-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    <p className="text-lg font-bold text-slate-900">
                      {formatValue(item.value, item.format)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg",
                    item.trendType === 'positive' && "bg-green-50",
                    item.trendType === 'negative' && "bg-red-50",
                    item.trendType === 'neutral' && "bg-slate-100"
                  )}>
                    <TrendIcon className={cn("h-3 w-3", getTrendColor(item.trendType))} />
                    <span className={cn("text-xs font-semibold", getTrendColor(item.trendType))}>
                      {item.trend > 0 ? '+' : ''}{item.trend}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Summary Section */}
        {items.length > 3 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-500 font-medium">Gesamtperformance</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs font-semibold text-green-600">
                  +{Math.round(items.reduce((sum, item) => sum + item.trend, 0) / items.length)}% Ø
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TrendStatList;