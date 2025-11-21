import type { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/lib/compat';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  status?: 'online' | 'offline' | 'warning' | 'error';
  pulse?: boolean;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function StatusCard({
  title,
  count,
  icon: Icon,
  status = 'offline',
  pulse = false,
  children,
  onClick,
  className
}: StatusCardProps) {
  const statusColors = {
    online: 'bg-status-success',
    offline: 'bg-muted',
    warning: 'bg-status-warning',
    error: 'bg-status-error'
  };

  const statusLabels = {
    online: 'Online',
    offline: 'Offline',
    warning: 'Warnung',
    error: 'Fehler'
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        'bg-card hover:shadow-lg transition-all duration-300 border-border/50',
        onClick && 'cursor-pointer hover:scale-[1.01]',
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              'bg-gradient-to-br from-primary to-primary-glow shadow-md'
            )}>
              <Icon className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">
                {title}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  statusColors[status],
                  pulse && 'animate-pulse'
                )} />
                <span className="text-xs text-muted-foreground">
                  {statusLabels[status]}
                </span>
              </div>
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className="text-lg font-bold px-3 py-1"
          >
            {count}
          </Badge>
        </div>
      </CardHeader>
      
      {children && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            {children}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
