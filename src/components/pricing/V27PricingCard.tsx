/* ==================================================================================
   V27 PRICING CARD - NORDIC SKY DESIGN
   ==================================================================================
   ✅ Indigo/Champagne/Sky-Blue Farbschema
   ✅ Runde V27IconBox Integration
   ✅ Modernere Shadows & Transitions
   ✅ V27.0 NORDIC SKY KONFORM
   ================================================================================== */

import { ReactNode, useState } from 'react';
import { LucideIcon, ChevronDown } from 'lucide-react';
import { V27IconBox } from '@/components/design-system/V27IconBox';
import { V27Button } from '@/components/design-system/V27Button';
// V26FeatureListItem removed - using inline implementation
import { PRIMARY_COLORS_V27 } from '@/lib/design-system/unified-design-tokens';
import { cn } from '@/lib/utils';

interface V27PricingCardProps {
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

export function V27PricingCard({
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
}: V27PricingCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const displayedFeatures = features.slice(0, displayLimit);
  const hasMoreFeatures = features.length > displayLimit;

  return (
    <div
      className={cn(
        'relative flex flex-col text-left rounded-2xl transition-all duration-200 animate-fade-in',
        className
      )}
      style={{
        backgroundColor: 'hsl(0, 0%, 100%)',
        border: highlighted 
          ? 'none' 
          : `1px solid rgba(229, 231, 235, 0.3)`,
        boxShadow: highlighted
          ? isHovered
            ? `inset 0 0 0 2px ${PRIMARY_COLORS_V27.indigo}, 0 0 50px ${PRIMARY_COLORS_V27.sky}60, 0 30px 60px -15px rgba(91, 113, 184, 0.4)`
            : `inset 0 0 0 2px ${PRIMARY_COLORS_V27.indigo}, 0 0 40px ${PRIMARY_COLORS_V27.sky}50, 0 25px 50px -15px rgba(91, 113, 184, 0.35)`
          : isHovered
          ? `0 0 25px rgba(91, 113, 184, 0.2), 0 15px 35px -10px rgba(91, 113, 184, 0.18)`
          : `0 8px 24px -5px rgba(91, 113, 184, 0.12)`,
        transform: isHovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Badge */}
      {badge && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
          <div
            className="px-5 py-2 rounded-full"
            style={{
              backgroundColor: PRIMARY_COLORS_V27.champagne,
              border: '3px solid',
              borderColor: PRIMARY_COLORS_V27.indigo,
              boxShadow: '0 4px 16px rgba(91, 113, 184, 0.3), 0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
            }}
          >
            <span
              className="font-sans text-sm font-semibold"
              style={{ color: PRIMARY_COLORS_V27.indigo }}
            >
              {badge}
            </span>
          </div>
        </div>
      )}

      {/* Card Header */}
      <div className={cn('relative pb-6 px-10', badge ? 'pt-14' : 'pt-10')}>
        {/* Icon - Fixed Position */}
        <div className="absolute top-10 right-10">
          <V27IconBox icon={icon} size="md" variant="primary" shape="soft" />
        </div>

        {/* Title */}
        <div className="pr-16 mb-6">
          <h3
            className="font-sans text-2xl font-semibold"
            style={{ color: PRIMARY_COLORS_V27.indigo }}
          >
            {name}
          </h3>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div
            className="font-sans text-5xl font-extrabold"
            style={{ color: PRIMARY_COLORS_V27.indigo }}
          >
            {price}
          </div>
          <p
            className="font-sans text-sm font-normal mt-1"
            style={{ color: 'hsl(220, 9%, 46%)' }}
          >
            {priceLabel}
          </p>
        </div>

        {/* Yearly Discount Badge */}
        {yearlyDiscountText && (
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md mb-4"
            style={{
              backgroundColor: 'hsl(142, 80%, 96%)',
              border: '2px solid',
              borderColor: 'hsl(142, 71%, 45%)',
            }}
          >
            <span
              className="font-sans text-sm font-semibold"
              style={{ color: 'hsl(142, 71%, 35%)' }}
            >
              {yearlyDiscountText}
            </span>
          </div>
        )}

        {/* Description */}
        <p
          className="font-sans text-base font-normal leading-relaxed"
          style={{ color: 'rgba(91, 113, 184, 0.8)' }}
        >
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
                className="h-5 w-5 mt-0.5 flex-shrink-0" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: PRIMARY_COLORS_V27.indigo }}
              >
                <path 
                  d="M20 6L9 17l-5-5" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span 
                className="text-base font-normal"
                style={{ color: 'rgba(91, 113, 184, 0.8)' }}
              >
                {feature.name}
              </span>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="space-y-3 mt-auto">
          {hasMoreFeatures && onShowAllFeatures && (
            <button
              onClick={onShowAllFeatures}
              className="w-full text-sm font-medium font-sans py-2 px-4 rounded-lg transition-all duration-200"
              style={{
                color: PRIMARY_COLORS_V27.indigo,
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${PRIMARY_COLORS_V27.champagne}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ChevronDown className="h-4 w-4 mr-1 inline" />
              +{features.length - displayLimit} weitere Features
            </button>
          )}

          <V27Button
            variant={highlighted ? 'primary' : 'secondary'}
            onClick={onCTAClick}
            className="w-full text-base"
          >
            {ctaText}
          </V27Button>
        </div>
      </div>
    </div>
  );
}
