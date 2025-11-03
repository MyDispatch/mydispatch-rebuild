import { Badge } from '@/lib/compat';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedBadgeProps {
  label: string;
  icon?: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  pulse?: boolean;
  glow?: boolean;
  className?: string;
}

export function AnimatedBadge({
  label,
  icon: Icon,
  variant = 'default',
  pulse = false,
  glow = false,
  className
}: AnimatedBadgeProps) {
  // ✅ CI-KONFORM: Semantic Tokens statt direkter Farben
  const variants = {
    default: 'bg-primary text-foreground',
    success: 'bg-status-success text-status-success-foreground',
    warning: 'bg-status-warning text-status-warning-foreground',
    error: 'bg-status-error text-status-error-foreground',
    info: 'bg-primary text-foreground'
  };

  const glowColors = {
    default: 'shadow-primary/50',
    success: 'shadow-status-success/50',
    warning: 'shadow-status-warning/50',
    error: 'shadow-status-error/50',
    info: 'shadow-primary/50'
  };

  return (
    <Badge
      className={cn(
        'inline-flex items-center space-x-1 px-3 py-1 rounded-full font-semibold',
        'transition-all duration-300',
        variants[variant],
        pulse && 'animate-pulse',
        glow && `shadow-lg ${glowColors[variant]}`,
        'hover:scale-105',
        className
      )}
    >
      {Icon && <Icon className="h-4 w-4 text-foreground" />}
      <span>{label}</span>
    </Badge>
  );
}
