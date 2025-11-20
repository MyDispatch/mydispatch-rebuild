/* ==================================================================================
   FEATURE DETAIL PAGE: Rechnungsstellung
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
import { FileText, Zap, Mail, Bell, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RechnungsstellungPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Automatische Erstellung",
      description: "Rechnungen aus abgeschlossenen Aufträgen automatisch generieren",
    },
    {
      icon: Mail,
      title: "E-Mail-Versand",
      description: "Direkter Versand per E-Mail mit PDF-Anhang",
    },
    {
      icon: Bell,
      title: "Mahnwesen",
      description: "Automatische Zahlungserinnerungen bei überfälligen Rechnungen",
    },
    {
      icon: CheckCircle,
      title: "Zahlungsabgleich",
      description: "Zahlungseingänge automatisch mit Rechnungen abgleichen",
    },
  ];

  return (
    <MarketingLayout currentPage="features">
      <SEOHead
        title="Professionelle Rechnungsstellung | MyDispatch"
        description="Erstellen Sie Rechnungen in Sekunden mit automatischen Mahnungen und Zahlungsabgleich. GoBD-konform und DATEV-kompatibel."
        canonical="/features/core/rechnungsstellung"
      />

      {/* Hero - V32.0 PREMIUM DASHBOARD */}
      <V28HeroPremium
        variant="features"
        backgroundVariant="3d-premium"
        badge={{ text: "Core-Feature", icon: FileText }}
        title="Rechnungsstellung leicht gemacht"
        subtitle="GoBD-konforme Rechnungen in Sekunden"
        description="Mit automatischen Mahnungen und Zahlungsabgleich."
        primaryCTA={{
          label: "Jetzt starten",
          onClick: () => navigate("/auth?mode=signup"),
        }}
        showPWAButton={true}
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
            <V28TariffBadge label="Starter" />
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
