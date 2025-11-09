/* ==================================================================================
   QUICK ACTION CARD COMPONENT V1.0
   ==================================================================================
   Wiederverwendbare Quick-Action-Card für Dashboards
   - V28Button-basiert
   - Icon-Support
   - Prominent-Variant
   - Konsistentes Styling
   ================================================================================== */

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  label: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  prominent?: boolean;
  className?: string;
}

export function QuickActionCard({
  label,
  description,
  icon: Icon,
  onClick,
  prominent = false,
  className
}: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start p-6 rounded-lg border transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2",
        prominent
          ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 focus:ring-primary"
          : "bg-card hover:bg-muted border-border focus:ring-primary",
        className
      )}
    >
      {/* Icon */}
      <Icon 
        className={cn(
          "h-6 w-6 mb-4",
          prominent ? "text-primary-foreground" : "text-primary"
        )} 
      />
      
      {/* Label */}
      <span className="font-semibold text-base mb-2">{label}</span>
      
      {/* Description */}
      <span 
        className={cn(
          "text-sm",
          prominent ? "text-primary-foreground/80" : "text-muted-foreground"
        )}
      >
        {description}
      </span>
    </button>
  );
}
