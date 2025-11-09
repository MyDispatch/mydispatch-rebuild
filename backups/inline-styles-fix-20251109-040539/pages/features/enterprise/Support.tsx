/* ==================================================================================
   FEATURE DETAIL PAGE: Premium-Support (V32.0 - Hero-Lock Compliant)
   ================================================================================== */

import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { SEOHead } from '@/components/shared/SEOHead';
import { V28HeroPremium } from '@/components/hero/V28HeroPremium';
import { PremiumDashboardContent } from '@/components/dashboard/PremiumDashboardContent';
import { V28MarketingSection } from '@/components/design-system/V28MarketingSection';
import { V28MarketingCard } from '@/components/design-system/V28MarketingCard';
import { V28IconBox } from '@/components/design-system/V28IconBox';
import { V28TariffBadge } from '@/components/design-system/V28TariffBadge';
import { Headphones, Clock, Phone, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SupportPage() {
  const navigate = useNavigate();

  const features = [
    { icon: Clock, title: '24/7 Support', description: 'Rund um die Uhr erreichbar – auch nachts und am Wochenende' },
    { icon: Phone, title: 'Hotline-Priorität', description: 'Keine Warteschlangen – direkte Durchstellung' },
    { icon: Users, title: 'Account Manager', description: 'Dedizierter Ansprechpartner für Ihr Unternehmen' },
    { icon: Headphones, title: 'Vor-Ort-Schulungen', description: 'Persönliche Schulungen in Ihrem Unternehmen' },
  ];

  return (
    <MarketingLayout currentPage="features">
      <SEOHead
        title="Premium-Support | MyDispatch"
        description="24/7 Premium-Support mit dedizierten Account Manager und Vor-Ort-Schulungen. Keine Warteschlangen."
        canonical="/features/enterprise/support"
      />

      <V28HeroPremium
        variant="features"
        backgroundVariant="3d-premium"
        badge={{
          text: "Enterprise-Feature",
          icon: Headphones
        }}
        title="Premium-Support 24/7"
        subtitle="Dedizierter Support für Ihr Unternehmen"
        description="Mit Enterprise erhalten Sie 24/7 Premium-Support, einen dedizierten Account Manager und persönliche Vor-Ort-Schulungen."
        primaryCTA={{
          label: "Sales kontaktieren",
          onClick: () => navigate('/contact')
        }}
        visual={<PremiumDashboardContent pageType="support" />}
        businessMetrics={[
          { label: 'Verfügbarkeit', value: '24/7', sublabel: 'Support' },
          { label: 'Reaktion', value: '<30min', sublabel: 'Antwortzeit' },
          { label: 'Zufriedenheit', value: '98%', sublabel: 'Kunden-Rating' }
        ]}
        trustElements={true}
      />

      <V28MarketingSection background="canvas" title="Leistungen">
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
            <V28TariffBadge label="Business" active={false} />
            <V28TariffBadge label="Enterprise" />
          </div>
        </div>
      </V28MarketingSection>
    </MarketingLayout>
  );
}
