/* ==================================================================================
   PageHeaderWithKPIs - Wiederverwendbares Template für alle Seiten
   ==================================================================================
   - 3 KPI-Cards (9 cols) + Schnellzugriff (3 cols)
   - Konsistent mit DashboardV18_3 Design
   - Hervorhebender Schnellzugriff
   - Design-System konform
   ================================================================================== */

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import type { LucideIcon } from 'lucide-react';
import { StatCard } from '@/components/smart-templates/StatCard';
import { cn } from '@/lib/utils';

interface KPICardData {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  subtitle?: string;
  miniChart?: number[];
}

interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
}

export type { KPICardData, QuickAction };

interface PageHeaderWithKPIsProps {
  kpis: [KPICardData, KPICardData, KPICardData]; // Genau 3 KPIs
  quickActions: [QuickAction, QuickAction]; // Genau 2 Quick Actions
  quickAccessTitle?: string;
}

export function PageHeaderWithKPIs({
  kpis,
  quickActions,
  quickAccessTitle = 'Schnellzugriff',
}: PageHeaderWithKPIsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
      {/* KPI Cards - 9 cols */}
      <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {kpis.map((kpi, index) => (
          <StatCard
            key={index}
            label={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            change={kpi.trend ? { value: kpi.trend.value, trend: kpi.trend.value >= 0 ? 'up' : 'down' } : undefined}
          />
        ))}
      </div>

      {/* Schnellzugriff - V28.1 Slate Design */}
      <div className="lg:col-span-3">
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col">
          <CardHeader className="pb-3 pt-4 border-b border-slate-200">
            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-slate-700">
              <span className="w-1 h-4 rounded-full bg-slate-700" />
              {quickAccessTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 flex-1 flex flex-col gap-2">
            {quickActions.map((action, index) => (
              <V28Button
                key={index}
                variant={index === 0 ? 'primary' : 'secondary'}
                size="md"
                onClick={action.onClick}
                icon={action.icon}
                iconPosition="left"
                fullWidth
                className="rounded-full font-semibold text-sm"
              >
                {action.label}
              </V28Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
