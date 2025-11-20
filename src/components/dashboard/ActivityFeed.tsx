/* ==================================================================================
   ACTIVITY FEED - Recent Activity Component
   ==================================================================================
   ✅ Consistent Card styling
   ✅ Proper spacing: p-4, gap-4
   ✅ Time-based activity items
   ✅ Status indicators with colors
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, LucideIcon } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  time: Date | string;
  icon?: LucideIcon;
  status?: 'success' | 'info' | 'warning' | 'error';
  link?: string;
}

interface ActivityFeedProps {
  title?: string;
  activities: ActivityItem[];
  maxItems?: number;
  showTime?: boolean;
  className?: string;
}

export function ActivityFeed({ 
  title = 'Letzte Aktivitäten',
  activities, 
  maxItems = 10, 
  showTime = true,
  className = ''
}: ActivityFeedProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'info':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const displayActivities = activities.slice(0, maxItems);

  return (
    <Card className={`shadow-sm ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <Activity className="h-5 w-5 text-slate-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {displayActivities.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">
            Keine Aktivitäten vorhanden
          </p>
        ) : (
          <div className="space-y-3">
            {displayActivities.map((activity) => {
              const ActivityIcon = activity.icon || Activity;
              const activityTime = typeof activity.time === 'string' 
                ? new Date(activity.time) 
                : activity.time;

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                    <ActivityIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-800">
                      {activity.title}
                    </p>
                    {activity.description && (
                      <p className="text-sm text-slate-600 mt-0.5">
                        {activity.description}
                      </p>
                    )}
                    {showTime && (
                      <p className="text-xs text-slate-500 mt-1">
                        {formatDistanceToNow(activityTime, { 
                          addSuffix: true, 
                          locale: de 
                        })}
                      </p>
                    )}
                  </div>
                  {activity.status && (
                    <Badge 
                      variant="outline"
                      className={`text-xs ${getStatusColor(activity.status)}`}
                    >
                      {activity.status === 'success' && 'Erfolgreich'}
                      {activity.status === 'info' && 'Info'}
                      {activity.status === 'warning' && 'Warnung'}
                      {activity.status === 'error' && 'Fehler'}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ActivityFeed;