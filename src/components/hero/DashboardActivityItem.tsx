/* ==================================================================================
   DASHBOARD ACTIVITY ITEM - WIEDERVERWENDBAR
   ==================================================================================
   ✅ Activity List Item für Dashboard Preview
   ✅ 100% V26.0 Design System konform
   ✅ Icon Box (Dunkelblau + Beige)
   ✅ Status Badge System
   ================================================================================== */

import type { LucideIcon } from 'lucide-react';

interface DashboardActivityItemProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  time: string;
  statusText?: string;
  statusType?: 'success' | 'info' | 'warning';
}

export function DashboardActivityItem({ 
  icon: Icon, 
  title, 
  subtitle, 
  time,
  statusText,
  statusType = 'info',
}: DashboardActivityItemProps) {
  return (
    <div
      className="hero-activity-item flex items-center gap-3 px-4 py-3 rounded-xl"
    >
      <div className="hero-activity-item__icon-box p-2 rounded-lg flex-shrink-0">
        <Icon className="hero-activity-item__icon h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="hero-activity-item__title font-sans text-sm font-semibold truncate">
            {title}
          </span>
          <span className="hero-activity-item__time font-sans text-xs flex-shrink-0">
            {time}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hero-activity-item__subtitle font-sans text-xs truncate">
            {subtitle}
          </span>
          {statusText && (
            <span
              className={`hero-activity-item__status-badge ${
                statusType === 'success' ? 'hero-activity-item__status-badge--success' : 
                statusType === 'warning' ? 'hero-activity-item__status-badge--warning' : 
                ''
              } inline-flex items-center px-2 py-0.5 rounded text-xs font-medium flex-shrink-0`}
            >
              {statusText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
