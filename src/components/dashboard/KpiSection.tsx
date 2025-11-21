/* ==================================================================================
   KPI SECTION - Modular KPI Grid Component
   ==================================================================================
   ✅ Consistent with rest of app
   ✅ Uses StatCard from smart-templates
   ✅ Proper spacing: p-4, gap-4
   ✅ Responsive grid layout
   ================================================================================== */

import type { LucideIcon } from 'lucide-react';
import { StatCard } from '@/components/smart-templates/StatCard';

export interface KpiItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  loading?: boolean;
}

interface KpiSectionProps {
  title?: string;
  kpis: KpiItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function KpiSection({ title, kpis, columns = 3, className = '' }: KpiSectionProps) {
  const getGridClass = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      )}
      <div className={`grid ${getGridClass()} gap-4`}>
        {kpis.map((kpi, index) => (
          <StatCard
            key={index}
            label={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            change={kpi.change}
            className="h-32"
          />
        ))}
      </div>
    </div>
  );
}

export default KpiSection;