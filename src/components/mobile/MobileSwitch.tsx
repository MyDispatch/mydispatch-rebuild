/* ==================================================================================
   MOBILE-OPTIMIERTER SWITCH V18.3
   ==================================================================================
   - Touch-optimiert (min-h-[44px])
   - Großflächiges Touch-Target
   - Label + Description Support
   ================================================================================== */

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface MobileSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function MobileSwitch({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  className,
}: MobileSwitchProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between min-h-[44px] py-2 touch-manipulation",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={() => !disabled && onCheckedChange(!checked)}
    >
      <div className="flex-1 pr-3">
        <Label className="text-sm font-medium cursor-pointer" onClick={(e) => e.stopPropagation()}>
          {label}
        </Label>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0"
      />
    </div>
  );
}
