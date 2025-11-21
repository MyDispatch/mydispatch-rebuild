/* ==================================================================================
   V28 HERO PREMIUM - TAXI-BRANCHEN-AUTHENTIZITÄT
   ==================================================================================
   ✅ 4 Varianten: home, features, demo, pricing
   ✅ Split-Layout: Text links, Visual rechts
   ✅ Business-Metrics-Row (optional)
   ✅ Trust-Indicators-Integration (optional)
   ✅ PWA-Button-Support
   ✅ 100% V28.1 Slate-Farben (KEINE Beige/Dunkelblau!)
   ✅ Taxi-Branchen-spezifische Badges
   ================================================================================== */

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { V28Button } from '@/components/design-system/V28Button';
import { V28Hero3DBackgroundPremium } from '@/components/hero/V28Hero3DBackgroundPremium';
import { TrustIndicators } from '@/components/business/TrustIndicators';

interface V28HeroPremiumProps {
  variant: 'home' | 'features' | 'demo' | 'pricing';
  backgroundVariant?: '3d-premium' | 'flat'; // ✅ V32.0: Bevorzugt 3d-premium
  badge?: { text: string; icon?: LucideIcon };
  title: string;
  subtitle: string;
  description?: string | ReactNode;
  primaryCTA: { label: string; onClick: () => void; icon?: LucideIcon };
  secondaryCTA?: { label: string; onClick: () => void }; // ⚠️ MAX 2 BUTTONS! Nutze ENTWEDER secondaryCTA ODER showPWAButton
  showPWAButton?: boolean; // ⚠️ Ersetzt secondaryCTA (MAX 2 BUTTONS TOTAL!)
  visual?: ReactNode;
  businessMetrics?: {
    label: string;
    value: string;
    sublabel: string;
  }[];
  trustElements?: boolean;
}

export function V28HeroPremium({
  variant,
  backgroundVariant = '3d-premium', // ✅ V32.0: Default ist 3d-premium
  badge,
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  showPWAButton = false,
  visual,
  businessMetrics,
  trustElements = false,
}: V28HeroPremiumProps) {
  const getMinHeight = () => {
    // V32.1: EINHEITLICHE Hero-Höhe für alle Variants (Design-Harmonisierung)
    return 'min-h-[650px] md:min-h-[750px]';
  };

  return (
    <section className={`relative ${getMinHeight()} flex items-center justify-center overflow-hidden`}>
      {/* V32.0: NUR V28Hero3DBackgroundPremium erlaubt (bevorzugt) */}
      {backgroundVariant === '3d-premium' ? (
        <V28Hero3DBackgroundPremium />
      ) : (
        // Flat Background - keine zusätzliche Komponente nötig
        <div className="absolute inset-0 bg-slate-50" />
      )}

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Column - Text Content */}
          <div className="space-y-6 animate-fade-in">

            {/* Badge */}
            {badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200">
                {badge.icon && <badge.icon className="w-4 h-4 text-slate-700" />}
                <span className="font-sans text-sm font-semibold text-slate-700">
                  {badge.text}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-xl sm:text-2xl md:text-3xl font-medium text-slate-600 leading-relaxed">
              {subtitle}
            </p>

            {/* Description */}
            {description && (
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed max-w-xl">
                {description}
              </p>
            )}

            {/* Business Metrics - with staggered animation */}
            {businessMetrics && businessMetrics.length > 0 && (
              <div className="flex flex-wrap justify-start gap-12 py-4">
                {businessMetrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="text-left animate-fade-in"
                    style={{ animationDelay: `${0.6 + (idx * 0.1)}s` }}
                  >
                    <div className="text-3xl font-bold text-slate-900 mb-1 leading-none">
                      {metric.value}
                    </div>
                    <div className="text-sm text-slate-600 font-medium leading-tight">
                      {metric.label}
                    </div>
                    <div className="text-xs text-slate-500 leading-tight">
                      {metric.sublabel}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <V28Button
          variant="primary"
          size="lg"
          onClick={primaryCTA.onClick}
          className="shadow-lg hover:shadow-xl"
        >
          {primaryCTA.icon && <primaryCTA.icon className="w-5 h-5 mr-2" />}
          {primaryCTA.label}
        </V28Button>

              {/* PWA Install Button - MAX 2 BUTTONS! */}
            </div>

            {/* Trust Indicators */}
            {trustElements && (
              <div className="pt-8">
                <TrustIndicators />
              </div>
            )}
          </div>

          {/* Right Column - Visual */}
          {visual && (
            <div className="hidden lg:block animate-fade-in pixel-perfect" style={{ animationDelay: '0.2s' }}>
              {visual}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
