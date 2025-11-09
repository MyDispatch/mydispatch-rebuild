/* ==================================================================================
   FEATURE DETAIL PAGE: White-Labeling (V32.0 - Hero-Lock Compliant)
   ================================================================================== */

import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { SEOHead } from '@/components/shared/SEOHead';
import { V28HeroPremium } from '@/components/hero/V28HeroPremium';
import { PremiumDashboardContent } from '@/components/dashboard/PremiumDashboardContent';
import { V28MarketingSection } from '@/components/design-system/V28MarketingSection';
import { V28MarketingCard } from '@/components/design-system/V28MarketingCard';
import { V28IconBox } from '@/components/design-system/V28IconBox';
import { V28TariffBadge } from '@/components/design-system/V28TariffBadge';
import { Palette, Globe, Smartphone, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WhiteLabelingPage() {
  const navigate = useNavigate();

  const features = [
    { icon: Palette, title: 'Custom Branding', description: 'Ihre Farben, Ihr Logo, Ihr Design' },
    { icon: Globe, title: 'Eigene Domain', description: 'app.ihr-unternehmen.de statt MyDispatch-Branding' },
    { icon: Smartphone, title: 'Branded Apps', description: 'iOS und Android Apps mit Ihrem Logo' },
    { icon: Image, title: 'Custom Assets', description: 'Eigene Icons, Bilder und Grafiken' },
  ];

  return (
    <MarketingLayout currentPage="features">
      <SEOHead
        title="White-Labeling | MyDispatch"
        description="MyDispatch vollständig in Ihrem Branding. Mit eigener Domain, Logo und Farbschema. Ihre Software, Ihre Marke."
        canonical="/features/enterprise/white-labeling"
      />

      <V28HeroPremium
        variant="features"
        backgroundVariant="3d-premium"
        badge={{
          text: "Enterprise-Feature",
          icon: Palette
        }}
        title="White-Labeling"
        subtitle="MyDispatch in Ihrem Branding"
        description="Ihre Software, Ihre Marke – ohne MyDispatch-Logo. Mit eigener Domain, individuellem Farbschema und Branded Apps."
        primaryCTA={{
          label: "Sales kontaktieren",
          onClick: () => navigate('/contact')
        }}
        visual={<PremiumDashboardContent pageType="white-labeling" />}
        businessMetrics={[
          { label: 'Branding', value: '100%', sublabel: 'Ihr Design' },
          { label: 'Domains', value: 'Custom', sublabel: 'Ihre URL' },
          { label: 'Apps', value: 'iOS+Android', sublabel: 'White Label' }
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
            <V28TariffBadge label="Starter" active={false} />
            <V28TariffBadge label="Business" active={false} />
            <V28TariffBadge label="Enterprise" />
          </div>
        </div>
      </V28MarketingSection>
    </MarketingLayout>
  );
}
