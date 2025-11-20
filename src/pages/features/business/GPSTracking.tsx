/* ==================================================================================
   FEATURE DETAIL PAGE: GPS-Tracking
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
import { Navigation, MapPin, Clock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GPSTrackingPage() {
  const navigate = useNavigate();

  const features = [
    { icon: MapPin, title: 'Live-Tracking', description: 'Sehen Sie alle Fahrzeuge in Echtzeit auf der Karte' },
    { icon: Navigation, title: 'Routen-Historie', description: 'Gefahrene Routen nachvollziehbar speichern' },
    { icon: Clock, title: 'Ankunftszeit', description: 'Genaue ETA-Berechnung für Kunden' },
    { icon: Shield, title: 'Sicherheit', description: 'Fahrer-Sicherheit durch Standort-Überwachung' },
  ];

  return (
    <MarketingLayout currentPage="features">
      <SEOHead
        title="GPS-Echtzeit-Tracking | MyDispatch"
        description="Verfolgen Sie alle Fahrzeuge in Echtzeit auf der Karte. Mit Routen-Historie und genauer ETA-Berechnung."
        canonical="/features/business/gps-tracking"
      />

      {/* Hero - V32.0 PREMIUM DASHBOARD */}
      <V28HeroPremium
        variant="features"
        backgroundVariant="3d-premium"
        badge={{ text: "Business-Feature", icon: MapPin }}
        title="GPS-Echtzeit-Tracking"
        subtitle="Immer wissen, wo Ihre Fahrzeuge sind"
        description="Live-Standortverfolgung, Routenoptimierung und automatische ETA-Berechnung."
        primaryCTA={{
          label: 'Jetzt starten',
          onClick: () => navigate('/auth?mode=signup')
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
            <V28TariffBadge label="Starter" active={false} />
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
