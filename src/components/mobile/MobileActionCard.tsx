import { LucideIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileActionCardProps {
  action: {
    id: string;
    type: "error" | "warning" | "info";
    title: string;
    description: string;
    icon: LucideIcon;
    onClick: () => void;
  };
}

export function MobileActionCard({ action }: MobileActionCardProps) {
  const Icon = action.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
        "cursor-pointer hover:bg-primary/10 active:scale-[0.98] touch-manipulation",
        action.type === "error" && "border-status-error bg-status-error/5",
        action.type === "warning" && "border-status-warning bg-status-warning/5",
        action.type === "info" && "border-primary bg-primary/10"
      )}
      onClick={action.onClick}
    >
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
          action.type === "error" && "bg-status-error text-primary-foreground",
          action.type === "warning" && "bg-status-warning text-primary-foreground",
          action.type === "info" && "bg-primary text-primary-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{action.title}</div>
        <div className="text-xs text-muted-foreground truncate">{action.description}</div>
      </div>

      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </div>
  );
}
