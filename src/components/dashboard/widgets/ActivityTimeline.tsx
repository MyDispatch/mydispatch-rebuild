/* ==================================================================================
   ACTIVITY TIMELINE V28.1 - PURE TAILWIND
   ==================================================================================
   Letzte Aktivitäten Timeline - Rechte Spalte Position 5
   ✅ Pure Tailwind Slate Design
   ✅ Aufträge, Kunden, Rechnungen, etc.
   ✅ Scrollable List mit Timeline-Dots
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from "@/lib/compat";
import { Activity, FileText, UserPlus, Car, MapPin } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "booking" | "customer" | "invoice" | "vehicle" | "driver" | "other";
  title: string;
  description: string;
  timestamp: Date;
  onClick?: () => void;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
  maxItems?: number;
}

const iconMap = {
  booking: FileText,
  customer: UserPlus,
  invoice: FileText,
  vehicle: Car,
  driver: MapPin,
  other: Activity,
};

const colorMap = {
  booking: "text-slate-700 bg-slate-50",
  customer: "text-slate-700 bg-slate-50",
  invoice: "text-slate-700 bg-slate-50",
  vehicle: "text-slate-700 bg-slate-50",
  driver: "text-slate-700 bg-slate-50",
  other: "text-slate-600 bg-slate-50",
};

export function ActivityTimeline({ activities, maxItems = 10 }: ActivityTimelineProps) {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-slate-100">
            <Activity className="h-4 w-4 text-slate-700" />
          </div>
          <CardTitle className="text-sm font-semibold text-slate-900">Letzte Aktivitäten</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        {displayActivities.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm font-medium text-slate-600">Keine Aktivitäten</p>
          </div>
        ) : (
          <div className="relative space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {/* Timeline Line */}
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200" />

            {displayActivities.map((activity, index) => {
              const Icon = iconMap[activity.type];
              const colors = colorMap[activity.type];

              return (
                <div
                  key={activity.id}
                  className={cn(
                    "relative pl-10 animate-fade-in",
                    activity.onClick &&
                      "cursor-pointer hover:bg-slate-50 -ml-2 p-2 rounded-lg transition-colors duration-200"
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                  onClick={activity.onClick}
                >
                  {/* Timeline Dot */}
                  <div
                    className={cn(
                      "absolute left-0 w-8 h-8 rounded-lg flex items-center justify-center",
                      colors
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900 leading-tight">
                        {activity.title}
                      </p>
                      <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap shrink-0">
                        {format(activity.timestamp, "HH:mm", { locale: de })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{activity.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
