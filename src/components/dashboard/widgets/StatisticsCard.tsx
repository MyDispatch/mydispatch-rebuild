/* ==================================================================================
   STATISTICS CARD V28.1 - PURE TAILWIND
   ==================================================================================
   Vergleich & Trends - Rechte Spalte Position 4
   ✅ Pure Tailwind Slate Design
   ✅ Gestern/Woche/Monat Vergleiche
   ✅ Trend-Badges
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from '@/lib/compat';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/format-utils';
import { Badge } from '@/lib/compat';
import { cn } from '@/lib/utils';

interface ComparisonPeriod {
  label: string;
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

interface StatisticsCardProps {
  periods: ComparisonPeriod[];
  valueFormatter?: (value: number) => string;
}

export function StatisticsCard({ 
  periods, 
  valueFormatter = (value) => formatCurrency(value) 
}: StatisticsCardProps) {
  return (
    <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-slate-100">
            <BarChart3 className="h-4 w-4 text-slate-700" />
          </div>
          <CardTitle className="text-sm font-semibold text-slate-900">
            Vergleich & Trends
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-3">
        {periods.map((period, index) => {
          const TrendIcon = period.trend === 'up' ? TrendingUp : period.trend === 'down' ? TrendingDown : null;
          
          return (
            <div
              key={period.label}
              className={cn(
                'p-3 rounded-lg border border-slate-200 bg-slate-50 animate-fade-in',
                'hover:bg-white transition-colors duration-200'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600">
                  {period.label}
                </span>
                {TrendIcon && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'h-5 px-1.5',
                      period.trend === 'up' && 'border-green-200 bg-green-50 text-green-600',
                      period.trend === 'down' && 'border-red-200 bg-red-50 text-red-600'
                    )}
                  >
                    <TrendIcon className="h-3 w-3 mr-0.5" />
                    <span className="text-[10px] font-bold">
                      {Math.abs(period.change)}%
                    </span>
                  </Badge>
                )}
              </div>
              
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900">
                    {valueFormatter(period.current)}
                  </p>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    Aktuell
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-600">
                    {valueFormatter(period.previous)}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Vorher
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
