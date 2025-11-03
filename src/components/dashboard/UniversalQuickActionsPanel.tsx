/* ==================================================================================
   UNIVERSAL QUICK ACTIONS PANEL V2.0
   ==================================================================================
   ✅ 3 Cards: Quick Actions + Recent Activity + Context Widget
   ✅ Kompakte Spacing ohne Scrolling
   ✅ Responsive Height basierend auf Viewport
   ✅ Flexibler Context Widget Support
   ================================================================================== */

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/lib/compat';
import { V28Button } from '@/components/design-system/V28Button';
import { cn } from '@/lib/utils';

interface QuickActionsPanelProps {
  // Card 1: Quick Actions
  quickActions: Array<{
    icon: LucideIcon;
    label: string;
    action: () => void;
    tooltip?: string;
    variant?: 'quick-action-primary' | 'secondary';
  }>;
  
  // Card 2: Recent Activity (optional)
  recentActivities?: Array<{
    icon: LucideIcon;
    iconColor?: string;
    title: string;
    time: string;
  }>;
  
  // Card 3: Context Widget (flexibel)
  contextWidget: {
    title: string;
    icon: LucideIcon;
    content: ReactNode;
  };
  
  // Layout Control
  maxHeight?: string; // Default: "calc(100vh - 200px)"
  compact?: boolean; // Wenn true: noch kompaktere Spacing
}

export function UniversalQuickActionsPanel({
  quickActions,
  recentActivities,
  contextWidget,
  maxHeight = 'calc(100vh - 200px)',
  compact = false,
}: QuickActionsPanelProps) {
  const spacingClass = compact ? 'space-y-3' : 'space-y-4';
  const paddingClass = compact ? 'px-3 pt-3 pb-3' : 'px-4 pt-4 pb-4';
  const cardPaddingClass = compact ? 'pb-2 pt-2 px-2' : 'pb-3 pt-3 px-3';
  const cardContentPaddingClass = compact ? 'pt-2 pb-2 px-2' : 'pt-3 pb-3 px-3';

  return (
    <div
      className={cn(
        'flex-1 overflow-hidden rounded-xl',
        'bg-gradient-to-br from-slate-50 via-white to-slate-50',
        'border-2 border-slate-200/60',
        'shadow-xl shadow-slate-200/50',
        'backdrop-blur-sm',
        spacingClass,
        paddingClass
      )}
      style={{ maxHeight }}
    >
      {/* Card 1: Quick Actions */}
      <Card className="border-slate-300 bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
        <CardHeader className={cn(cardPaddingClass, 'border-b-2 border-slate-200 bg-gradient-to-r from-slate-100 to-slate-50')}>
          <h3 className="text-sm font-bold text-slate-900 tracking-wide uppercase">⚡ Schnellzugriff</h3>
        </CardHeader>
        <CardContent className={cn(cardContentPaddingClass, compact ? 'space-y-1' : 'space-y-1.5')}>
          {quickActions.map((action, index) => (
            <V28Button
              key={index}
              variant={(action.variant === 'quick-action-primary' || action.variant === 'secondary') ? 'primary' : 'secondary'}
              size="sm"
              className="w-full justify-start gap-2 h-9 text-xs"
              onClick={action.action}
              type="button"
            >
              <action.icon className="w-3.5 h-3.5" />
              <span>{action.label}</span>
            </V28Button>
          ))}
        </CardContent>
      </Card>

      {/* Card 2: Recent Activity (Optional) */}
      {recentActivities && recentActivities.length > 0 && (
        <Card className="border-slate-300 bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
          <CardHeader className={cn(cardPaddingClass, 'border-b-2 border-slate-200 bg-gradient-to-r from-slate-100 to-slate-50')}>
            <h3 className="text-sm font-bold text-slate-900 tracking-wide uppercase">📋 Letzte Aktivitäten</h3>
          </CardHeader>
          <CardContent className={cn(cardContentPaddingClass, 'space-y-2')}>
            {recentActivities.slice(0, 3).map((activity, index) => (
              <div key={index} className="flex items-start gap-2 text-xs">
                <activity.icon className={cn(
                  'w-3.5 h-3.5 mt-0.5 flex-shrink-0',
                  activity.iconColor || 'text-green-600'
                )} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{activity.title}</p>
                  <p className="text-[10px] text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Card 3: Context Widget */}
      <Card className="border-slate-300 bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
        <CardHeader className={cn(cardPaddingClass, 'border-b-2 border-slate-200 bg-gradient-to-r from-slate-100 to-slate-50')}>
          <div className="flex items-center gap-2">
            <contextWidget.icon className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900 tracking-wide uppercase">{contextWidget.title}</h3>
          </div>
        </CardHeader>
        <CardContent className={cardContentPaddingClass}>
          {contextWidget.content}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * USAGE EXAMPLE:
 * 
 * <UniversalQuickActionsPanel
 *   quickActions={[
 *     { icon: Plus, label: 'Neuer Auftrag', action: () => {} },
 *     { icon: FileDown, label: 'Export', action: () => {} }
 *   ]}
 *   recentActivities={[
 *     { icon: CheckCircle2, title: 'Auftrag #1234 erstellt', time: 'Vor 5 Min.' }
 *   ]}
 *   contextWidget={{
 *     title: 'Systemstatus',
 *     icon: Activity,
 *     content: <SystemStatusWidget />
 *   }}
 * />
 */
