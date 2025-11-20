/* ==================================================================================
   V28 TARIFF CARD - FLAT DESIGN 2.0
   ==================================================================================
   ✅ Selected State: ring-2 ring-slate-700 + shadow-xl
   ✅ Unselected State: border-slate-200 + shadow-lg
   ✅ Hover: shadow-xl + scale-[1.02]
   ✅ V28IconBox integriert
   ✅ Rounded-2xl Design
   ✅ V28.1 PROFESSIONAL MINIMALISM
   ================================================================================== */

import { ReactNode, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Check, LucideIcon } from "lucide-react";
import { V28Badge } from "@/components/design-system/V28Badge";
import { V28IconBox } from "@/components/design-system/V28IconBox";

interface V28TariffCardProps {
  name: string;
  price: number | string;
  icon: LucideIcon;
  features: string[];
  limitations?: string | string[];
  isSelected: boolean;
  onClick: () => void;
  badge?: string;
  className?: string;
}

export function V28TariffCard({
  name,
  price,
  icon,
  features,
  limitations = "",
  isSelected,
  onClick,
  badge,
  className,
}: V28TariffCardProps) {
  // Prevent nested element clicks from triggering card selection
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Ignore clicks on checkboxes or other interactive elements
      const target = e.target as HTMLElement;
      if (target.closest('[role="checkbox"]') || target.closest("button:not(.v28-tariff-card)")) {
        return;
      }
      onClick();
    },
    [onClick]
  );

  return (
    <div
      onClick={handleClick}
      className={cn(
        "v28-tariff-card relative flex flex-col rounded-2xl transition-all duration-300 cursor-pointer",
        "bg-white border",
        isSelected
          ? "border-slate-400 ring-2 ring-slate-400 shadow-2xl"
          : "border-slate-200 shadow-lg hover:shadow-2xl hover:scale-[1.01]",
        className
      )}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <V28Badge variant="primary" className="text-xs px-3 py-1">
            {badge}
          </V28Badge>
        </div>
      )}

      {/* Selected Indicator - Bottom Right */}
      {isSelected && (
        <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center shadow-md">
          <Check className="h-5 w-5 text-white" />
        </div>
      )}

      {/* Content */}
      <div className={cn("p-6", badge ? "pt-10" : "pt-6")}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-semibold text-slate-900">{name}</h3>
          <V28IconBox icon={icon} variant={isSelected ? "primary" : "secondary"} />
        </div>

        {/* Price */}
        <div className="mb-6">
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
            {typeof price === "number" ? `${price} €` : price}
          </span>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-6">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="h-3 w-3 text-slate-700" />
              </div>
              <span className="text-sm text-slate-700">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Limitations */}
        {limitations &&
          (typeof limitations === "string" ? limitations : limitations.length > 0) && (
            <div className="pt-4 border-t border-slate-200">
              {typeof limitations === "string" ? (
                <p className="text-sm font-medium text-slate-600">{limitations}</p>
              ) : (
                <ul className="space-y-2">
                  {limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start gap-2">
                      <span className="text-xs text-slate-500">• {limitation}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
