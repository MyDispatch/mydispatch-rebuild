/* ==================================================================================
   FEATURE DETAIL PAGE: Auftragsverwaltung
   ================================================================================== */

import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { SEOHead } from '@/components/shared/SEOHead';
import { V28HeroPremium } from '@/components/hero';
import { PremiumDashboardContent } from '@/components/dashboard/PremiumDashboardContent';
import { V28MarketingSection } from '@/components/design-system/V28MarketingSection';
import { V28MarketingCard } from '@/components/design-system/V28MarketingCard';
import { V28IconBox } from '@/components/design-system/V28IconBox';
import { V28Button } from '@/components/design-system/V28Button';
import { V28TariffBadge } from '@/components/design-system/V28TariffBadge';

import { ClipboardList, Zap, Users, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuftragsverwaltungPage() {
  const navigate = useNavigate();

  const features = [
    { icon: Zap, title: 'Automatische Fahrerzuweisung', description: 'Intelligente Zuweisung basierend auf GPS, Verfügbarkeit und Fahrzeugklasse' },
    { icon: MapPin, title: 'Intelligentes Routing', description: 'HERE Maps Integration mit Live-Traffic für optimale Routen' },
    { icon: ClipboardList, title: 'Multi-Channel-Eingang', description: 'Aufträge per App, Telefon, Widget oder API erfassen' },
    { icon: Clock, title: 'Echtzeit-Status', description: 'Auftrags-Tracking von Annahme bis Abschluss' },
    { icon: Users, title: 'Priorisierung', description: 'VIP-Kunden, Express-Aufträge und Langstrecken bevorzugen' },
    { icon: CheckCircle, title: 'Historien-Tracking', description: 'Alle Aufträge durchsuchbar und filterbar' },
  ];

  return (
    <MarketingLayout currentPage="features">
      <SEOHead
        title="Intelligente Auftragsverwaltung | MyDispatch"
        description="Erfassen, planen und verwalten Sie alle Fahrten zentral. Mit intelligentem Routing und automatischer Fahrerzuweisung."
        canonical="/features/core/auftragsverwaltung"
      />

      {/* Hero - V32.0 PREMIUM DASHBOARD */}
      <V28HeroPremium
        variant="features"
        backgroundVariant="3d-premium"
        badge={{ text: "Core-Feature", icon: ClipboardList }}
        title="Intelligente Auftragsverwaltung"
        subtitle="Erfassen, planen und verwalten Sie alle Fahrten zentral"
        description="Mit intelligentem Routing und automatischer Fahrerzuweisung."
        primaryCTA={{
          label: 'Jetzt starten',
          onClick: () => navigate('/auth?mode=signup')
        }}
        showPWAButton={true}
        visual={<PremiumDashboardContent pageType="features" />}
        trustElements={true}
      />

      <V28MarketingSection background="canvas" title="Alle Funktionen im Detail">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <V28Button variant="primary" size="lg" onClick={() => navigate('/pricing')}>
            Tarife vergleichen
          </V28Button>
        </div>
      </V28MarketingSection>
    </MarketingLayout>
  );
}
