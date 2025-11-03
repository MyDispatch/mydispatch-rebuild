/* ==================================================================================
   SYSTEM STATUS WIDGET - Context Widget für Admin/System Dashboards
   ==================================================================================
   ✅ 2-Spalten Grid Layout
   ✅ Kompakte Status-Badges
   ✅ System Health Übersicht
   ================================================================================== */

import { Badge } from '@/lib/compat';

interface SystemStatusItem {
  label: string;
  status: 'online' | 'offline' | 'maintenance' | 'warning';
}

interface SystemStatusWidgetProps {
  items?: SystemStatusItem[];
}

const defaultItems: SystemStatusItem[] = [
  { label: 'API', status: 'online' },
  { label: 'Datenbank', status: 'online' },
  { label: 'Cloud', status: 'online' },
  { label: 'Backup', status: 'online' },
];

const statusConfig = {
  online: { variant: 'default' as const, className: 'bg-green-600 hover:bg-green-700' },
  offline: { variant: 'destructive' as const, className: 'bg-red-600 hover:bg-red-700' },
  maintenance: { variant: 'secondary' as const, className: 'bg-amber-500 hover:bg-amber-600' },
  warning: { variant: 'outline' as const, className: 'border-amber-500 text-amber-700' },
};

const statusLabels = {
  online: 'Online',
  offline: 'Offline',
  maintenance: 'Wartung',
  warning: 'Warnung',
};

export function SystemStatusWidget({ items = defaultItems }: SystemStatusWidgetProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item, index) => {
        const config = statusConfig[item.status];
        const label = statusLabels[item.status];
        
        return (
          <div key={index} className="flex flex-col gap-1 text-xs">
            <span className="text-slate-600 font-medium truncate">{item.label}</span>
            <Badge 
              variant={config.variant}
              className={`text-[10px] py-0 h-5 w-fit ${config.className}`}
            >
              {label}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}
