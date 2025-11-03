/* ==================================================================================
   URGENT ACTIONS CARD V28.1 - PURE TAILWIND
   ==================================================================================
   Dringende Aktionen Widget - Rechte Spalte Position 1 (IMMER ZUERST!)
   ✅ Pure Tailwind Slate Design
   ✅ 1px Borders, 200ms Transitions
   ✅ Warnungen, Überfällige Rechnungen, Fahrzeug-Wartung
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/lib/compat';
import { AlertTriangle, FileText, Wrench, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UrgentAction {
  id: string;
  type: 'warning' | 'overdue' | 'maintenance';
  title: string;
  description: string;
  count?: number;
  onClick?: () => void;
}

interface UrgentActionsCardProps {
  actions: UrgentAction[];
}

const iconMap = {
  warning: AlertTriangle,
  overdue: FileText,
  maintenance: Wrench,
};

const colorMap = {
  warning: 'text-amber-600 bg-amber-50 border-amber-200',
  overdue: 'text-red-600 bg-red-50 border-red-200',
  maintenance: 'text-blue-600 bg-blue-50 border-blue-200',
};

export function UrgentActionsCard({ actions }: UrgentActionsCardProps) {
  const urgentCount = actions.length;

  return (
    <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Dringende Aktionen
            </CardTitle>
          </div>
          {urgentCount > 0 && (
            <Badge variant="destructive" className="h-6 px-2 text-xs font-bold">
              {urgentCount}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        {actions.length === 0 ? (
          <div className="py-8 text-center">
            <div className="inline-block mb-3">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-600">
              Keine dringenden Aktionen
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Alles unter Kontrolle
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {actions.map((action, index) => {
              const Icon = iconMap[action.type];
              const colors = colorMap[action.type];
              
              return (
                <div
                  key={action.id}
                  className={cn(
                    'p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md',
                    colors,
                    'animate-fade-in'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={action.onClick}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold truncate">
                          {action.title}
                        </p>
                        {action.count && (
                          <Badge variant="outline" className="h-5 px-1.5 text-xs font-bold shrink-0">
                            {action.count}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs line-clamp-2">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 opacity-50" />
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
