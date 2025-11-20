/* ==================================================================================
   V28 PRICING CARD - CLEAN & SPACIOUS
   ==================================================================================
   ✅ Single shadow (shadow-xl)
   ✅ Consistent padding (p-8)
   ✅ 1px border (border-slate-200)
   ✅ Ring effect for highlighted cards
   ✅ Simple hover (scale + shadow)
   ✅ Tailwind-only (no inline styles)
   ================================================================================== */

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { V28IconBox } from "@/components/design-system/V28IconBox";
import { V28Button } from "@/components/design-system/V28Button";
import { V28Badge } from "@/components/design-system/V28Badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface V28PricingCardProps {
  name: string;
  description: string;
  price: string;
  priceDetail?: string;
  icon: LucideIcon;
  features: Array<{ text: string; included: boolean }>;
  ctaLabel: string;
  ctaVariant?: "primary" | "secondary";
  onCTAClick: () => void;
  highlighted?: boolean;
  badge?: string;
  hasMoreFeatures?: boolean;
  onShowAllFeatures?: () => void;
  className?: string;
}

export function V28PricingCard({
  name,
  description,
  price,
  priceDetail,
  icon,
  features,
  ctaLabel,
  ctaVariant = "primary",
  onCTAClick,
  highlighted = false,
  badge,
  hasMoreFeatures,
  onShowAllFeatures,
  className,
}: V28PricingCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl bg-white p-6 md:p-8",
        "border transition-all duration-300",
        "hover:shadow-2xl hover:scale-[1.01]",
        highlighted
          ? "border-slate-400 ring-2 ring-slate-400 shadow-2xl"
          : "border-slate-200 shadow-lg",
        className
      )}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <V28Badge variant="primary">{badge}</V28Badge>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 md:gap-4 mb-6">
        <V28IconBox
          icon={icon}
          variant={highlighted ? "primary" : "secondary"}
          className="shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mb-1 leading-tight">
            {name}
          </h3>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">{price}</div>
        {priceDetail && <div className="text-xs md:text-sm text-slate-600">{priceDetail}</div>}
      </div>

      {/* CTA Button */}
      <V28Button
        variant={highlighted ? "primary" : "secondary"}
        size="lg"
        onClick={onCTAClick}
        className="w-full mb-6"
      >
        {ctaLabel}
      </V28Button>

      {/* Features List */}
      <div className="space-y-3 flex-1">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                "transition-colors duration-200",
                feature.included ? "bg-slate-100 text-slate-700" : "bg-slate-100 text-slate-400"
              )}
            >
              <Check className="h-3 w-3" />
            </div>
            <span
              className={cn(
                "text-xs md:text-sm leading-relaxed",
                feature.included ? "text-slate-700" : "text-slate-400"
              )}
            >
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      {/* Show All Features */}
      {hasMoreFeatures && onShowAllFeatures && (
        <button
          onClick={onShowAllFeatures}
          className="mt-4 text-sm text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200 flex items-center gap-1 group"
        >
          <span>Alle Features anzeigen</span>
          <span className="transform group-hover:translate-x-1 transition-transform duration-200">
            →
          </span>
        </button>
      )}
    </div>
  );
}
