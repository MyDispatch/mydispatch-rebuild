import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: ReactNode;
  actions?: ReactNode;
  gradient?: "primary" | "success";
  className?: string;
}

export function GradientHeader({
  title,
  subtitle,
  icon: Icon,
  badge,
  actions,
  gradient = "primary",
  className,
}: GradientHeaderProps) {
  const gradients = {
    primary: "from-primary via-primary-glow to-primary",
    success: "from-status-success/20 via-status-success/10 to-status-success/20",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-t-2xl",
        "bg-gradient-to-r",
        gradients[gradient],
        className
      )}
    >
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-foreground rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-foreground rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {Icon && (
              <div className="w-14 h-14 rounded-2xl bg-foreground/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Icon className="h-7 w-7 text-foreground" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                {badge}
              </div>
              {subtitle && <p className="text-foreground/80 text-sm mt-1">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="ml-4">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
