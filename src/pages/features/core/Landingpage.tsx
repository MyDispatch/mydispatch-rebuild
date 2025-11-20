/* ==================================================================================
   FEATURE DETAIL PAGE: Landingpage (Info)
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
import { Globe, Smartphone, Zap, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingpagePage() {
  const navigate = useNavigate();

  const features = [
    { icon: Globe, title: 'Eigene Webseite', description: 'Professionelle Landingpage mit Ihrem Logo und Design' },
    { icon: Smartphone, title: 'Mobile-optimiert', description: 'Perfekte Darstellung auf allen Geräten' },
    { icon: Zap, title: 'Schnelle Einrichtung', description: 'In unter 10 Minuten online' },
    { icon: CheckCircle, title: 'SEO-optimiert', description: 'Besser gefunden werden in Google' },
  ];

  return (
    <MarketingLayout currentPage="features">
      <SEOHead
        title="Info-Landingpage | MyDispatch"
        description="Professionelle Webseite inklusive für Ihr Taxi- oder Mietwagenunternehmen. Mit Logo, Kontaktformular und Google Maps Integration."
        canonical="/features/core/landingpage"
      />

      {/* Hero Section - V32.0 PREMIUM DASHBOARD */}
      <V28HeroPremium
        variant="features"
        backgroundVariant="3d-premium"
        badge={{ text: 'Core Feature', icon: Globe }}
        title="Professionelle Landingpage für Ihr Taxi-Unternehmen"
        subtitle="Eigene Website mit Buchungswidget - in wenigen Minuten online"
        description="Präsentieren Sie Ihr Unternehmen modern und professionell. Ihre Kunden buchen direkt online - ohne Umwege."
        primaryCTA={{
          label: 'Jetzt starten',
          onClick: () => navigate('/auth?mode=signup')
        }}
        secondaryCTA={{
          label: 'Demo ansehen',
          onClick: () => navigate('/demo')
        }}
        visual={<PremiumDashboardContent pageType="features" />}
        businessMetrics={[
          { label: 'Setup-Zeit', value: '<5 Min', sublabel: 'sofort live' },
          { label: 'Design', value: 'Responsive', sublabel: 'alle Geräte' },
          { label: 'Buchungen', value: '24/7', sublabel: 'online möglich' }
        ]}
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
          <V28Button variant="primary" size="lg" onClick={() => navigate('/pricing')}>
            Tarife vergleichen
          </V28Button>
        </div>
      </V28MarketingSection>
    </MarketingLayout>
  );
}
