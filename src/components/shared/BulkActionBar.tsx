/**
 * ==================================================================================
 * BULK ACTION BAR V28.2 - Floating Compact Multi-Select
 * ==================================================================================
 * ✅ Kompakte schwebende Lösung (oben rechts)
 * ✅ Keine Footer-Kollision mehr
 * ✅ Weniger störend, platzsparend
 * ✅ Dropdown für Actions
 * ==================================================================================
 */

import { X, ChevronDown } from "lucide-react";
import { V28Button } from "@/components/design-system/V28Button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface BulkAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary";
  disabled?: boolean;
  showCount?: boolean; // Show selected count in button label
}

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  actions: BulkAction[];
  className?: string;
}

/**
 * BulkActionBar Component V28.2
 * Kompakte schwebende Badge oben rechts - KEINE Footer-Kollision!
 */
export function BulkActionBar({
  selectedCount,
  onClearSelection,
  actions,
  className,
}: BulkActionBarProps) {
  // Nur anzeigen wenn Items ausgewählt sind
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        // Floating Badge rechts oben über dem Content
        "fixed top-20 right-6 z-40",
        "animate-in slide-in-from-top-2 fade-in duration-300",
        className
      )}
    >
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg shadow-lg p-3">
        {/* Selection Counter Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-white rounded-md">
          <span className="text-sm font-semibold">{selectedCount}</span>
          <span className="text-xs hidden sm:inline">ausgewählt</span>
        </div>

        {/* Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <V28Button variant="secondary" size="sm" className="gap-1">
              Aktionen
              <ChevronDown className="h-3 w-3" />
            </V28Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white">
            {actions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <DropdownMenuItem
                  key={index}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className="cursor-pointer"
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  <span>{action.label}</span>
                  {action.showCount && (
                    <span className="ml-auto text-xs text-slate-500">({selectedCount})</span>
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Selection */}
        <V28Button variant="secondary" size="sm" onClick={onClearSelection} className="gap-1">
          <X className="h-4 w-4" />
          <span className="sr-only">Auswahl aufheben</span>
        </V28Button>
      </div>
    </div>
  );
}
