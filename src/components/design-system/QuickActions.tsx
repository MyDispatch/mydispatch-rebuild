/* ==================================================================================
   QUICK ACTIONS - MASTER COMPONENT V18.3.25
   ==================================================================================
   Professional Quick Actions component with:
   - Touch-targets ≥ 44px (WCAG compliance)
   - Responsive icon sizing
   - Badge support (notifications, counts)
   - Grid or List layout
   - Disabled states
   - Professional animations
   ================================================================================== */

import { V28Button } from '@/components/design-system/V28Button';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/lib/compat';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost';
  disabled?: boolean;
  badge?: string | number;
  description?: string;
}

export interface QuickActionsProps {
  actions: QuickAction[];
  layout?: 'grid' | 'list';
  columns?: 1 | 2 | 3 | 4;
  title?: string;
  variant?: 'card' | 'inline';
  className?: string;
}

export function QuickActions({
  actions,
  layout = 'list',
  columns = 2,
  title,
  variant = 'card',
  className
}: QuickActionsProps) {
  
  // Grid column classes
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  const content = (
    <div className={cn(
      layout === 'grid' 
        ? `grid ${gridCols[columns]} gap-3 sm:gap-4`
        : 'space-y-2 sm:space-y-3',
      className
    )}>
      {actions.map((action, index) => {
        const IconComponent = action.icon;
        
        return (
          <V28Button
            key={index}
            variant={action.variant === 'default' ? 'primary' : action.variant === 'outline' || action.variant === 'ghost' ? 'secondary' : 'primary'}
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              'relative w-full justify-start min-h-[44px] transition-all duration-300',
              'hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
              layout === 'grid' && 'flex-col items-center justify-center text-center h-auto py-4 sm:py-6',
              action.disabled && 'opacity-50 cursor-not-allowed hover:shadow-none hover:translate-y-0'
            )}
          >
            {/* Badge for notifications */}
            {action.badge && (
              <Badge 
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center p-0 text-[10px] sm:text-xs rounded-full"
              >
                {action.badge}
              </Badge>
            )}

            {/* Icon */}
            <IconComponent className={cn(
              'text-foreground',
              layout === 'list' ? 'mr-2 h-4 w-4 sm:h-5 sm:w-5' : 'mb-2 h-6 w-6 sm:h-8 sm:w-8'
            )} />
            
            {/* Content */}
            <div className={cn(
              layout === 'grid' && 'space-y-1'
            )}>
              <span className={cn(
                'font-medium',
                layout === 'grid' ? 'text-sm sm:text-base block' : 'text-sm sm:text-base'
              )}>
                {action.label}
              </span>
              
              {action.description && layout === 'grid' && (
                <span className="text-xs text-muted-foreground block">
                  {action.description}
                </span>
              )}
            </div>
          </V28Button>
        );
      })}
    </div>
  );

  if (variant === 'inline') {
    return content;
  }

  return (
    <Card className="shadow-sm border-border/50">
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg font-semibold">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(!title && 'pt-6')}>
        {content}
      </CardContent>
    </Card>
  );
}
