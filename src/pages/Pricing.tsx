/* ==================================================================================
   V28 PRICING PAGE - PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ V28.1 Design System durchgängig
   ✅ Professional Gray-Blue Palette
   ✅ Responsive & Mobile-optimiert
   ✅ Konsistente Spacing & Typography
   ✅ Premium-Feeling durchgängig
   ================================================================================== */

import { useState } from "react";
import { Sparkles, Rocket, Building2, Crown, Truck, ChevronDown, Euro } from "lucide-react";
import { SEOHead } from "@/components/shared/SEOHead";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { useNavigate, Link } from "react-router-dom";
import { pricingSchema } from "@/lib/schema-org";
import { cn } from "@/lib/utils";

import { V28HeroPremium } from "@/components/hero";
import { PremiumDashboardContent } from "@/components/dashboard/PremiumDashboardContent";
import { V28MarketingSection } from "@/components/design-system/V28MarketingSection";
import { V28BillingToggle } from "@/components/design-system/V28BillingToggle";
import { V28InfoBox } from "@/components/design-system/V28InfoBox";
import { V28FeatureListItem } from "@/components/design-system/V28FeatureListItem";
import { V28Button } from "@/components/design-system/V28Button";
import { V28MarketingCard } from "@/components/design-system/V28MarketingCard";

// V28.1 Professional Gray-Blue Design
import {
  V28PricingCard,
  V28AddonCard,
  V28ComparisonTable,
  V28AccordionItem,
  TariffFeatureDialog,
} from "@/components/pricing";

// Accordion für FAQ
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Zentrale Tarif-Definitionen
import {
  ALL_TARIFFS,
  COMPARISON_FEATURES,
  getTariffById,
  ADDON_FLEET_EXTENSION,
} from "@/lib/tariff/tariff-definitions";
import { FAQ_DATA } from "@/data/faq-data";

// Icon-Mapping für Tarife
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

// Dynamische Vergleichs-Daten
const getComparisonData = () => {
  const starter = getTariffById("starter");
  const business = getTariffById("business");
  const enterprise = getTariffById("enterprise");

  return COMPARISON_FEATURES.map((cf) => {
    const starterFeature = starter?.features.find((f) => f.id === cf.key);
    const businessFeature = business?.features.find((f) => f.id === cf.key);
    const enterpriseFeature = enterprise?.features.find((f) => f.id === cf.key);

    return {
      name: cf.name,
      starter: starterFeature?.included ?? false,
      business: businessFeature?.included ?? false,
      enterprise: enterpriseFeature?.included ?? true,
    };
  });
};

export default function Pricing() {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [selectedTariff, setSelectedTariff] = useState<(typeof ALL_TARIFFS)[0] | null>(null);

  const comparisonData = getComparisonData();

  const handleSubscribe = (tariffId: string) => {
    if (tariffId === "enterprise") {
      navigate("/contact");
      return;
    }
    const billingParam = billingPeriod;
    navigate(`/auth?tariff=${tariffId}&billing=${billingParam}`);
  };

  return (
    <MarketingLayout currentPage="pricing">
      <SEOHead
        title="Preise & Tarife – MyDispatch | Transparente, faire Preisgestaltung"
        description="Klar strukturierte, faire Tarife für Taxi- und Mietwagenunternehmen. DSGVO-konform, Made in Germany. Jederzeit kündbar. MyDispatch – Ihre moderne Dispositionsplattform."
        canonical="/pricing"
        schema={pricingSchema}
        keywords={[
          "Taxi Software Preise",
          "Mietwagen Software Kosten",
          "Dispositionssoftware Tarife",
          "MyDispatch Preise",
          "Flottenmanagement Abo",
          "DSGVO-konforme Taxi-Software",
          "Made in Germany Dispositionssoftware",
        ]}
      />

      {/* Hero Section - V32.0 PREMIUM DASHBOARD */}
      <V28HeroPremium
        variant="pricing"
        backgroundVariant="3d-premium"
        badge={{ text: "Flexibles Preismodell", icon: Euro }}
        title="Transparente Preise für jede Flottengröße"
        subtitle="Flexibles Preismodell, das mit Ihrem Unternehmen wächst"
        description="Keine versteckten Kosten, monatlich kündbar, 20% Rabatt bei jährlicher Zahlung"
        primaryCTA={{
          label: "Jetzt starten",
          onClick: () => navigate("/auth?mode=signup"),
        }}
        secondaryCTA={{
          label: "Demo ansehen",
          onClick: () => navigate("/demo"),
        }}
        visual={<PremiumDashboardContent pageType="pricing" />}
        businessMetrics={[
          { label: "Tarife", value: "3", sublabel: "zur Auswahl" },
          { label: "Rabatt", value: "-20%", sublabel: "bei Jahresabo" },
          { label: "Kündbar", value: "Monatlich", sublabel: "flexibel" },
        ]}
        trustElements={true}
      />

      {/* ==================================================================================
          PRICING CARDS SECTION - V28.1 FLAT DESIGN
          ================================================================================== */}
      <section className="py-12 md:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Billing Toggle direkt bei Tarifen */}
          <div className="flex justify-center mb-12 md:mb-16">
            <V28BillingToggle
              billingPeriod={billingPeriod}
              onToggle={setBillingPeriod}
              discountText="-20%"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 md:items-start">
            {ALL_TARIFFS.map((tariff, index) => {
              const includedFeatures = tariff.features.filter((f) => f.included);
              const displayLimit = tariff.highlighted ? 8 : 5;
              const displayedFeatures = includedFeatures.slice(0, displayLimit);
              const hasMoreFeatures = includedFeatures.length > displayLimit;
              const TariffIcon = getTariffIcon(tariff.id);

              return (
                <div key={tariff.id} className="transition-all duration-300">
                  <div className="flex flex-col h-full">
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
                      onCTAClick={() => handleSubscribe(tariff.id)}
                      onShowAllFeatures={
                        hasMoreFeatures ? () => setSelectedTariff(tariff) : undefined
                      }
                      className="animate-fade-in flex-1"
                    />
                    <div className="mt-4">
                      <Link
                        to={`/pricing/${tariff.id}`}
                        className="block text-center text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors py-2"
                      >
                        Mehr über {tariff.name} erfahren →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DSGVO-konforme Hinweise */}
          <div className="mt-12 md:mt-16 max-w-4xl mx-auto">
            <V28InfoBox type="legal" title="Rechtliche Hinweise">
              <div className="space-y-3">
                <p>
                  <strong className="text-slate-900">Datenschutz:</strong> Alle Tarife sind
                  DSGVO-konform. Ihre Daten werden ausschließlich in Deutschland gespeichert und
                  verarbeitet.
                </p>
                <p>
                  <strong className="text-slate-900">Vertragslaufzeit:</strong> Alle Tarife sind
                  monatlich kündbar. Bei jährlicher Zahlung erhalten Sie einen Rabatt von 20% und
                  können zum Ende der Jahresperiode kündigen.
                </p>
                <p>
                  <strong className="text-slate-900">Zahlungsmodalitäten:</strong> Wir akzeptieren
                  alle gängigen Kreditkarten und SEPA-Lastschrift über unseren Zahlungspartner
                  Stripe.
                </p>
                <p>
                  <strong className="text-slate-900">Datenaufbewahrung:</strong> Gemäß § 51 PBefG
                  werden Auftragsdaten für 10 Jahre aufbewahrt. Personenbezogene Daten werden nach
                  Vertragsende gemäß DSGVO gelöscht.
                </p>
              </div>
            </V28InfoBox>
          </div>
        </div>
      </section>

      {/* ==================================================================================
          ADD-ONS SECTION - V28.1 FLAT DESIGN
          ================================================================================== */}
      <V28MarketingSection
        background="canvas"
        title="Erweiterungen"
        description="Passen Sie MyDispatch an Ihre Bedürfnisse an – mit zusätzlichen Modulen für mehr Flexibilität."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          <V28AddonCard
            icon={Truck}
            title="Fleet & Driver Add-On"
            price={
              billingPeriod === "monthly"
                ? ADDON_FLEET_EXTENSION.priceMonthlyFormatted
                : ADDON_FLEET_EXTENSION.priceYearlyFormatted
            }
            priceLabel={billingPeriod === "monthly" ? "pro Monat" : "pro Jahr"}
            description="Nur für Starter-Tarif. Pro zusätzlichem Fahrzeug oder Fahrer über die ersten 3 hinaus. Beliebig erweiterbar. Sofort aktiv. Monatlich kündbar."
            highlighted={true}
          />

          <V28AddonCard
            icon={Sparkles}
            title="Individuelle Module"
            description="Kontaktieren Sie uns für maßgeschneiderte Erweiterungen, Integrationen oder individuelle Anforderungen."
          >
            <div className="space-y-3">
              <V28FeatureListItem text="DATEV-Anbindung & Buchhaltung" />
              <V28FeatureListItem text="Spezielle API-Schnittstellen" />
              <V28FeatureListItem text="Individuelle Reportings" />
            </div>
          </V28AddonCard>
        </div>
      </V28MarketingSection>

      {/* ==================================================================================
          COMPARISON TABLE - V28.1 FLAT DESIGN
          ================================================================================== */}
      <V28MarketingSection
        background="white"
        title="Detaillierter Vergleich"
        description="Alle Features und Leistungsmerkmale der Tarife im direkten Vergleich – transparent und übersichtlich."
      >
        <V28ComparisonTable features={comparisonData} />
      </V28MarketingSection>

      {/* ==================================================================================
          FAQ SECTION - V28.1 STYLING
          ================================================================================== */}
      <V28MarketingSection
        background="canvas"
        title="Häufig gestellte Fragen"
        description="Antworten auf die wichtigsten Fragen zu Tarifen, Verträgen und Zahlungsmodalitäten."
      >
        <div className="max-w-4xl mx-auto">
          <V28MarketingCard contentClassName="p-0">
            <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
              {FAQ_DATA.map((faq, index, arr) => (
                <V28AccordionItem
                  key={`faq-${index}`}
                  value={`item-${index}`}
                  question={faq.question}
                  answer={faq.answer}
                  isLast={index === arr.length - 1}
                />
              ))}
            </Accordion>
          </V28MarketingCard>
        </div>
      </V28MarketingSection>

      {/* ==================================================================================
          FINAL CTA SECTION - V28.1 CLEAN BACKGROUND
          ================================================================================== */}
      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Bereit für professionelle Disposition?
            </h2>

            <p className="font-sans text-base md:text-lg lg:text-xl text-center leading-relaxed max-w-3xl mx-auto text-slate-600">
              Starten Sie noch heute mit MyDispatch und optimieren Sie Ihre Disposition.
              DSGVO-konform, Made in Germany, monatlich kündbar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch pt-4">
              <V28Button variant="primary" size="lg" onClick={() => navigate("/auth?mode=signup")}>
                Jetzt starten
              </V28Button>

              <V28Button variant="secondary" size="lg" onClick={() => navigate("/contact")}>
                Demo vereinbaren
              </V28Button>
            </div>

            {/* Trust-Badge */}
            <div className="pt-6 md:pt-8 flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs md:text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <span className="text-slate-700">✓</span>
                <span>DSGVO-konform</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <span className="text-slate-700">✓</span>
                <span>Made in Germany</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <span className="text-slate-700">✓</span>
                <span>Jederzeit kündbar</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature-Dialog für "Mehr anzeigen" */}
      {selectedTariff && (
        <TariffFeatureDialog
          tariff={selectedTariff}
          billingPeriod={billingPeriod}
          open={!!selectedTariff}
          onOpenChange={(open) => !open && setSelectedTariff(null)}
        />
      )}
    </MarketingLayout>
  );
}
