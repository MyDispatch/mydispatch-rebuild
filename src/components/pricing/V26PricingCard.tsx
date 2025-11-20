/* ==================================================================================
   V26 PRICING CARD - HERO-QUALITÄT MIT GLOW-EFFEKTEN
   ==================================================================================
   ✅ Identische visuelle Qualität wie Home-Hero
   ✅ Glow-Effekte statt harter Borders
   ✅ Beige/Dunkelblau Premium-Design
   ✅ Smooth Transitions (300ms)
   
    BADGE-DESIGN-LOGIK (CI-konform):
   - Variante 1: Beige Background + Blaue Schrift (Premium/Empfohlen)
   - Border: BLAU 3px (Border = Schriftfarbe für 3D-Tiefeneffekt)
   - Shadow: Dunkelblau Highlight + schwarzer Drop-Shadow + Inset-Glow
   - KEIN animate-pulse (statisch, professionell)
   
   UNTERSCHIED zu Toggle-Badges:
   - Statisches Badge (kein Zustandswechsel) → Standard CI-Regel
   - Toggle-Badge (Zustandswechsel) → Dynamischer Rand für Balance
   ================================================================================== */

import { ReactNode, useState } from "react";
import { LucideIcon, ChevronDown } from "lucide-react";
import { V26IconBox } from "@/components/design-system/V26IconBox";
import { V28Button } from "@/components/design-system/V28Button";
// V26FeatureListItem removed - using inline implementation
import { cn } from "@/lib/utils";

interface V26PricingCardProps {
  name: string;
  description: string;
  price: string;
  priceLabel: string;
  icon: LucideIcon;
  badge?: string;
  highlighted?: boolean;
  ctaText: string;
  features: Array<{ id: string; name: string }>;
  displayLimit?: number;
  yearlyDiscountText?: string;
  onCTAClick: () => void;
  onShowAllFeatures?: () => void;
  className?: string;
}

export function V26PricingCard({
  name,
  description,
  price,
  priceLabel,
  icon,
  badge,
  highlighted = false,
  ctaText,
  features,
  displayLimit = 5,
  yearlyDiscountText,
  onCTAClick,
  onShowAllFeatures,
  className,
}: V26PricingCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const displayedFeatures = features.slice(0, displayLimit);
  const hasMoreFeatures = features.length > displayLimit;

  return (
    <div
      className={cn(
        "relative flex flex-col text-left rounded-2xl transition-all duration-200 animate-fade-in bg-white border",
        highlighted
          ? "border-slate-900 shadow-lg hover:shadow-xl"
          : "border-slate-200 shadow-md hover:shadow-lg",
        isHovered && "scale-[1.01] -translate-y-1",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Badge */}
      {badge && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
          <div className="px-5 py-2 rounded-full bg-slate-50 border-3 border-slate-900 shadow-lg">
            <span className="font-sans text-sm font-semibold text-slate-900">{badge}</span>
          </div>
        </div>
      )}

      {/* Card Header */}
      <div className={cn("relative pb-6 px-10", badge ? "pt-14" : "pt-10")}>
        {/* Icon - Fixed Position (immer gleicher Abstand zum Rand) */}
        <div className="absolute top-10 right-10">
          <V26IconBox icon={icon} size="md" variant="primary" />
        </div>

        {/* Title mit Padding rechts für Icon-Space */}
        <div className="pr-16 mb-6">
          <h3 className="font-sans text-2xl font-semibold text-foreground">{name}</h3>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="font-sans text-5xl font-extrabold text-foreground">{price}</div>
          <p className="font-sans text-sm font-normal mt-1 text-muted-foreground">{priceLabel}</p>
        </div>

        {/* Yearly Discount Badge */}
        {yearlyDiscountText && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md mb-4 bg-green-50 border-2 border-green-200">
            <span className="font-sans text-sm font-semibold text-green-700">
              {yearlyDiscountText}
            </span>
          </div>
        )}

        {/* Description */}
        <p className="font-sans text-base font-normal leading-relaxed text-slate-700">
          {description}
        </p>
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col pt-0 pb-10 px-10">
        {/* Features List */}
        <ul className="space-y-3.5 mb-8 flex-1">
          {displayedFeatures.map((feature) => (
            <li key={feature.id} className="flex items-start gap-3">
              <svg
                className="h-5 w-5 mt-0.5 flex-shrink-0 text-slate-900"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-base font-normal text-slate-700">{feature.name}</span>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="space-y-3 mt-auto">
          {hasMoreFeatures && onShowAllFeatures && (
            <button
              onClick={onShowAllFeatures}
              className="w-full text-sm font-medium font-sans py-2 px-4 rounded-lg transition-all duration-200 text-slate-900 bg-transparent hover:bg-slate-50"
            >
              <ChevronDown className="h-4 w-4 mr-1 inline" />+{features.length - displayLimit}{" "}
              weitere Features
            </button>
          )}

          <V28Button
            variant={highlighted ? "primary" : "secondary"}
            onClick={onCTAClick}
            className="w-full text-base"
          >
            {ctaText}
          </V28Button>
        </div>
      </div>
    </div>
  );
}
