/* ==================================================================================
   FEATURE DETAIL PAGE: Live-Traffic & Wetter
   ================================================================================== */

import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { SEOHead } from "@/components/shared/SEOHead";
import { V28HeroPremium } from "@/components/hero";
import { PremiumDashboardContent } from "@/components/dashboard/PremiumDashboardContent";
import { V28MarketingSection } from "@/components/design-system/V28MarketingSection";
import { V28MarketingCard } from "@/components/design-system/V28MarketingCard";
import { V28IconBox } from "@/components/design-system/V28IconBox";
import { V28Button } from "@/components/design-system/V28Button";
import { V28TariffBadge } from "@/components/design-system/V28TariffBadge";
import { MapPin, Cloud, Navigation, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LiveTrafficPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: MapPin,
      title: "Echtzeit-Verkehr",
      description: "Live-Verkehrsinformationen für optimale Routenplanung",
    },
    { icon: Cloud, title: "Wettervorhersage", description: "Aktuelle Wetterdaten und Vorhersagen" },
    {
      icon: Navigation,
      title: "Intelligentes Routing",
      description: "Automatische Umleitung bei Staus",
    },
    {
      icon: Clock,
      title: "Ankunftszeit-Prognose",
      description: "Genaue ETA-Berechnung mit Live-Daten",
    },
  ];

  return (
    <MarketingLayout currentPage="features">
      <SEOHead
        title="Live-Traffic & Wetter | MyDispatch"
        description="Echtzeit-Verkehrsinformationen und Wettervorhersage für optimale Routenplanung. Vermeiden Sie Staus und planen Sie vorausschauend."
        canonical="/features/business/live-traffic"
      />

      {/* Hero - V32.0 PREMIUM DASHBOARD */}
      <V28HeroPremium
        variant="features"
        backgroundVariant="3d-premium"
        badge={{ text: "Business-Feature", icon: MapPin }}
        title="Live-Traffic & Wetter"
        subtitle="Echtzeit-Verkehrsinformationen und Wettervorhersage"
        description="Vermeiden Sie Staus und planen Sie vorausschauend."
        primaryCTA={{
          label: "Jetzt starten",
          onClick: () => navigate("/auth?mode=signup"),
        }}
        secondaryCTA={{
          label: "Mehr erfahren",
          onClick: () => navigate("/pricing"),
        }}
        visual={<PremiumDashboardContent pageType="features" />}
        trustElements={true}
      />

      <V28MarketingSection background="canvas" title="Funktionen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <V28MarketingCard key={idx}>
              <V28IconBox icon={feature.icon} variant="slate" />
              <h3 className="text-lg font-semibold text-slate-900 mt-4 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </V28MarketingCard>
          ))}
        </div>
      </V28MarketingSection>

      <V28MarketingSection background="white" title="In welchem Tarif enthalten?">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex gap-4 flex-wrap justify-center mb-8">
            <V28TariffBadge label="Starter" active={false} />
            <V28TariffBadge label="Business" />
            <V28TariffBadge label="Enterprise" />
          </div>
          <V28Button variant="primary" size="lg" onClick={() => navigate("/pricing")}>
            Tarife vergleichen
          </V28Button>
        </div>
      </V28MarketingSection>
    </MarketingLayout>
  );
}
