/* ==================================================================================
   HOME PRICING SECTION V28.1 - ALIGNED WITH PRICING PAGE
   ==================================================================================
   ✅ Direkte Section-Struktur (wie Pricing.tsx)
   ✅ Container mx-auto für korrekte Zentrierung
   ✅ Professional Gray-Blue Palette
   ✅ Responsive & Mobile-optimiert
   ================================================================================== */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, Building2, Crown } from "lucide-react";
import { V28BillingToggle } from "@/components/design-system/V28BillingToggle";
import { V28PricingCard } from "@/components/pricing";
import { ALL_TARIFFS } from "@/lib/tariff/tariff-definitions";
import { cn } from "@/lib/utils";

export const HomePricingSection = () => {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const getTariffIcon = (tariffId: string) => {
    switch (tariffId) {
      case "starter":
        return Rocket;
      case "business":
        return Building2;
      case "enterprise":
        return Crown;
      default:
        return Rocket;
    }
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Title & Description */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-2 sm:mb-3 md:mb-4">
            Transparente Preise, faire Konditionen
          </h2>
          <p className="font-sans text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-2">
            Wählen Sie den Tarif, der zu Ihrer Flottengröße passt. Monatlich kündbar, ohne versteckte Kosten.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-10 sm:mb-14 md:mb-20 lg:mb-28">
          <V28BillingToggle
            billingPeriod={billingPeriod}
            onToggle={setBillingPeriod}
            discountText="-20%"
          />
        </div>

        {/* Pricing Cards - Mobile: 1 col, Tablet: 1 col (scroll), Desktop: 3 cols */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10 md:items-start overflow-x-auto">
          {ALL_TARIFFS.map((tariff) => {
            const includedFeatures = tariff.features.filter((f) => f.included);
            const displayLimit = tariff.highlighted ? 8 : 5;
            const displayedFeatures = includedFeatures.slice(0, displayLimit);
            const hasMoreFeatures = includedFeatures.length > displayLimit;
            const TariffIcon = getTariffIcon(tariff.id);

            return (
              <div
                key={tariff.id}
                className={cn(
                  "transition-all duration-300 min-w-full md:min-w-0",
                  tariff.highlighted && "md:-translate-y-6 lg:-translate-y-10 xl:-translate-y-16"
                )}
              >
                <V28PricingCard
                  name={tariff.name}
                  description={tariff.description}
                  price={
                    billingPeriod === 'monthly'
                      ? tariff.priceMonthlyFormatted
                      : tariff.priceYearlyFormatted
                  }
                  priceDetail={billingPeriod === 'monthly' ? 'pro Monat' : 'pro Jahr'}
                  icon={TariffIcon}
                  badge={tariff.badge}
                  highlighted={tariff.highlighted}
                  ctaLabel={tariff.ctaText}
                  ctaVariant={tariff.highlighted ? 'primary' : 'secondary'}
                  features={displayedFeatures.map(f => ({ text: f.name, included: true }))}
                  hasMoreFeatures={hasMoreFeatures}
                  onCTAClick={() => navigate(tariff.id === 'enterprise' ? '/contact' : '/auth?mode=signup')}
                  onShowAllFeatures={hasMoreFeatures ? () => navigate('/pricing') : undefined}
                  className={cn(
                    "animate-fade-in h-full",
                    tariff.highlighted
                      ? "hover:shadow-[0_20px_60px_-12px_rgba(71,85,105,0.3)] transition-all duration-300"
                      : "hover:shadow-2xl transition-shadow duration-300"
                  )}
                />
              </div>
            );
          })}
        </div>

        {/* Footer Link */}
        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <a
            href="/pricing"
            className="font-sans text-sm sm:text-base font-medium no-underline transition-all duration-300 hover:opacity-80 text-slate-600 hover:text-slate-900"
          >
            Alle Features vergleichen
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomePricingSection;
