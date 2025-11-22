/* ==================================================================================
   ACTIVITY ITEM COMPONENT V1.0
   ==================================================================================
   Wiederverwendbare Activity-Item-Komponente für Dashboard-Feeds
   - Konsistentes Styling
   - Icon-Support
   - Status-Variants (success, info, warning, error)
   - Timestamp-Formatting
   - Performance: React.memo() für häufige Re-Renders
   ================================================================================== */

import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ActivityItemProps {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  time: Date;
  status: 'success' | 'info' | 'warning' | 'error';
  className?: string;
}

const statusStyles = {
  success: 'bg-status-success/10 text-status-success',
  info: 'bg-primary/10 text-primary',
  warning: 'bg-status-warning/10 text-status-warning',
  error: 'bg-status-error/10 text-status-error',
};

export function ActivityItem({
  id,
  icon: Icon,
  title,
  description,
  time,
  status,
  className
}: ActivityItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors",
        className
      )}
    >
      {/* Icon */}
      <div className={cn(
        "p-2 rounded-lg shrink-0",
        statusStyles[status]
      )}>
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Timestamp */}
      <time className="text-xs text-muted-foreground shrink-0">
        {format(time, 'HH:mm', { locale: de })}
      </time>
    </div>
  );
}

// Export memoized version for performance
export default memo(ActivityItem);
