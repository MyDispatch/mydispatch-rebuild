/* ==================================================================================
   V28 TARIFF CARD - PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ V28.1 Professional Gray-Blue Design
   ✅ Pure Tailwind mit Slate-Palette
   ✅ Selectable State mit Ring
   ================================================================================== */

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Check, LucideIcon } from "lucide-react";
import { Badge } from "@/lib/compat";

interface V28TariffCardProps {
  name: string;
  price: number;
  icon: LucideIcon;
  features: string[];
  limitations?: string[];
  isSelected: boolean;
  onClick: () => void;
  badge?: string;
  className?: string;
}

export function V28TariffCard({
  name,
  price,
  icon: Icon,
  features,
  limitations = [],
  isSelected,
  onClick,
  badge,
  className,
}: V28TariffCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex flex-col rounded-lg transition-all duration-300 cursor-pointer shadow-lg",
        "border-2",
        isSelected
          ? "border-slate-700 ring-2 ring-slate-200 shadow-xl"
          : "border-slate-200 hover:border-slate-300 hover:-translate-y-1",
        className
      )}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-slate-700 text-white px-4 py-1.5">{badge}</Badge>
        </div>
      )}

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Content */}
      <div className={cn("p-6 bg-white", badge ? "pt-10" : "pt-6")}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-semibold text-slate-900">{name}</h3>
          <div className="p-2.5 rounded-lg bg-slate-100">
            <Icon className="h-6 w-6 text-slate-700" />
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-extrabold text-slate-900">{price}€</span>
            <span className="text-sm font-normal text-slate-600">/Monat</span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-6">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-4">
              <Check className="h-5 w-5 shrink-0 mt-0.5 text-green-600" />
              <span className="text-sm font-normal text-slate-700">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Limitations */}
        {limitations.length > 0 && (
          <ul className="space-y-2 pt-4 border-t border-slate-200">
            {limitations.map((limitation) => (
              <li key={limitation} className="flex items-start gap-2">
                <span className="text-xs font-normal text-slate-500">• {limitation}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Backward compatibility export
export const V26TariffCard = V28TariffCard;
