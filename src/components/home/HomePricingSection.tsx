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
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title & Description */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Transparente Preise, faire Konditionen
          </h2>
          <p className="font-sans text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Wählen Sie den Tarif, der zu Ihrer Flottengröße passt. Monatlich kündbar, ohne
            versteckte Kosten.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-28 md:mb-36">
          <V28BillingToggle
            billingPeriod={billingPeriod}
            onToggle={setBillingPeriod}
            discountText="-20%"
          />
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 md:items-start">
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
                  "transition-all duration-300",
                  tariff.highlighted && "md:-translate-y-12 lg:-translate-y-16"
                )}
              >
                <V28PricingCard
                  name={tariff.name}
                  description={tariff.description}
                  price={
                    billingPeriod === "monthly"
                      ? tariff.priceMonthlyFormatted
                      : tariff.priceYearlyFormatted
                  }
                  priceDetail={billingPeriod === "monthly" ? "pro Monat" : "pro Jahr"}
                  icon={TariffIcon}
                  badge={tariff.badge}
                  highlighted={tariff.highlighted}
                  ctaLabel={tariff.ctaText}
                  ctaVariant={tariff.highlighted ? "primary" : "secondary"}
                  features={displayedFeatures.map((f) => ({ text: f.name, included: true }))}
                  hasMoreFeatures={hasMoreFeatures}
                  onCTAClick={() =>
                    navigate(tariff.id === "enterprise" ? "/contact" : "/auth?mode=signup")
                  }
                  onShowAllFeatures={hasMoreFeatures ? () => navigate("/pricing") : undefined}
                  className={cn(
                    "animate-fade-in",
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
        <div className="text-center mt-12">
          <a
            href="/pricing"
            className="font-sans text-base font-medium no-underline transition-all duration-300 hover:opacity-80 text-slate-600 hover:text-slate-900"
          >
            Alle Features vergleichen
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomePricingSection;
