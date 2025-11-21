/* ==================================================================================
   QUICK ACTIONS PANEL - Grid of Action Buttons
   ==================================================================================
   ✅ Grid of action buttons
   ✅ Each button: icon + text
   ✅ Consistent height: h-12
   ✅ Professional hover effects
   ✅ Responsive grid layout
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import type { LucideIcon} from 'lucide-react';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  color?: 'default' | 'success' | 'warning' | 'danger';
  disabled?: boolean;
  badge?: string | number;
}

interface QuickActionsPanelProps {
  title?: string;
  actions: QuickAction[];
  columns?: 1 | 2 | 3;
  showLabels?: boolean;
  className?: string;
}

export function QuickActionsPanel({ 
  title = 'Schnellzugriff', 
  actions,
  columns = 2,
  showLabels = true,
  className = '' 
}: QuickActionsPanelProps) {
  
  const getGridClass = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-3';
      default:
        return 'grid-cols-2';
    }
  };

  const getButtonColorClasses = (color?: string, variant?: string) => {
    if (variant === 'primary') return '';
    
    switch (color) {
      case 'success':
        return 'hover:bg-green-50 hover:text-green-700 hover:border-green-200';
      case 'warning':
        return 'hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200';
      case 'danger':
        return 'hover:bg-red-50 hover:text-red-700 hover:border-red-200';
      default:
        return '';
    }
  };

  return (
    <Card className={`bg-white ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className={cn('grid gap-2', getGridClass())}>
          {actions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <div key={index} className="relative">
                <V28Button
                  variant={action.variant || 'secondary'}
                  size="md"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={cn(
                    "w-full h-12 justify-start px-3 transition-all duration-200",
                    "hover:shadow-sm hover:scale-[1.02]",
                    getButtonColorClasses(action.color, action.variant)
                  )}
                  icon={Icon}
                  iconPosition="left"
                >
                  {showLabels && (
                    <span className="ml-2 truncate text-sm font-medium">
                      {action.label}
                    </span>
                  )}
                </V28Button>
                
                {/* Optional Badge */}
                {action.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {action.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Optional Footer */}
        {actions.length > 6 && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500 text-center">
              {actions.filter(a => !a.disabled).length} von {actions.length} Aktionen verfügbar
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Compact version for tight spaces
export function QuickActionsCompact({ 
  actions,
  className = '' 
}: { 
  actions: QuickAction[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        
        return (
          <V28Button
            key={index}
            variant={action.variant || 'ghost'}
            size="sm"
            onClick={action.onClick}
            disabled={action.disabled}
            className="h-9"
            icon={Icon}
            iconPosition="left"
          >
            <span className="ml-1.5 text-xs">{action.label}</span>
          </V28Button>
        );
      })}
    </div>
  );
}

export default QuickActionsPanel;