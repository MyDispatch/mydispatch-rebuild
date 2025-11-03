/* ==================================================================================
   ACTIVITY TIMELINE - V18.3 Sprint 34
   ==================================================================================
   Erweiterte Aktivitäts-Timeline mit Actions und Status-Badges + Pagination
   ================================================================================== */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/compat';
import { V28Button } from '@/components/design-system/V28Button';
import { Badge } from '@/lib/compat';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Car,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TimelineAction {
  label: string;
  onClick: () => void;
}

interface TimelineItem {
  id: string;
  time: string;
  type: 'booking' | 'payment' | 'warning' | 'driver' | 'vehicle' | 'invoice';
  icon: any;
  title: string;
  description: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  meta?: { label: string; value: string }[];
  actions?: TimelineAction[];
}

interface ActivityTimelineProps {
  activities: TimelineItem[];
  maxItems?: number;
}

export function ActivityTimeline({ 
  activities,
  maxItems = 5 
}: ActivityTimelineProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(activities.length / maxItems);
  const startIndex = (currentPage - 1) * maxItems;
  const displayedActivities = activities.slice(startIndex, startIndex + maxItems);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'bg-status-success/10 border-status-success/20';
      case 'warning':
        return 'bg-status-warning/10 border-status-warning/20';
      case 'error':
        return 'bg-status-error/10 border-status-error/20';
      default:
        return 'bg-primary/10 border-primary/20';
    }
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">Letzte Aktivitäten</CardTitle>
            <CardDescription className="text-[10px]">Live-Timeline</CardDescription>
          </div>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 pb-3">
        {activities.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Clock className="h-10 w-10 mx-auto mb-2 opacity-50 text-muted-foreground" />
            <p className="text-xs">Keine Aktivitäten vorhanden</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {displayedActivities.map((activity, index) => {
                const Icon = activity.icon;
                const isLast = index === displayedActivities.length - 1;

                return (
                  <div key={activity.id} className="relative">
                    {/* Timeline Line */}
                    {!isLast && (
                      <div className="absolute left-4 top-10 bottom-0 w-px bg-border" />
                    )}

                    <div className="flex gap-2.5">
                      {/* Icon */}
                      <div className={`
                        relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                        border-2 ${getStatusColor(activity.status)}
                      `}>
                        <Icon className="h-4 w-4 text-foreground" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-semibold">{activity.title}</h4>
                            {activity.status && (
                              <Badge 
                                variant={getStatusBadgeVariant(activity.status)}
                                className="text-[8px] px-1 py-0"
                              >
                                {activity.status.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {activity.time}
                          </span>
                        </div>

                        <p className="text-[11px] text-muted-foreground mb-1.5">
                          {activity.description}
                        </p>

                        {/* Meta Info */}
                        {activity.meta && activity.meta.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-1.5">
                            {activity.meta.map((meta, idx) => (
                              <div key={idx} className="text-[10px]">
                                <span className="text-muted-foreground">{meta.label}: </span>
                                <span className="font-medium">{meta.value}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        {activity.actions && activity.actions.length > 0 && (
                          <div className="flex gap-1.5">
                            {activity.actions.map((action, idx) => (
                              <V28Button
                                key={idx}
                                size="sm"
                                variant="ghost"
                                className="h-6 text-[10px] px-2"
                                onClick={action.onClick}
                              >
                                {action.label}
                              </V28Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-3 border-t">
                <V28Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 text-foreground" />
                </V28Button>
                
                <span className="text-[10px] text-muted-foreground">
                  Seite {currentPage} von {totalPages}
                </span>

                <V28Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4 text-foreground" />
                </V28Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
