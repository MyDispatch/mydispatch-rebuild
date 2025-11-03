import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { V28Button } from '@/components/design-system/V28Button';
import { cn } from '@/lib/utils';

interface IllustratedEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function IllustratedEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}: IllustratedEmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6', className)}>
      {/* Illustrated Icon */}
      <div className="relative mb-6">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-xl">
            <Icon className="h-12 w-12 text-foreground" />
          </div>
        </div>
        {/* Decorative Dots */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full opacity-60 animate-bounce" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-foreground text-center mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {description}
      </p>

      {/* Action */}
      {action && (
        <V28Button
          onClick={action.onClick}
          variant="primary"
          className="h-12 px-8 rounded-full shadow-lg"
        >
          {action.label}
        </V28Button>
      )}
    </div>
  );
}
