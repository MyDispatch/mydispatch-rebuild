/* ==================================================================================
   FEATURE DETAIL PAGE: API-Zugang (V32.0 - Hero-Lock Compliant)
   ================================================================================== */

import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { SEOHead } from '@/components/shared/SEOHead';
import { V28HeroPremium } from '@/components/hero/V28HeroPremium';
import { PremiumDashboardContent } from '@/components/dashboard/PremiumDashboardContent';
import { V28MarketingSection } from '@/components/design-system/V28MarketingSection';
import { V28MarketingCard } from '@/components/design-system/V28MarketingCard';
import { V28IconBox } from '@/components/design-system/V28IconBox';
import { V28Button } from '@/components/design-system/V28Button';
import { V28TariffBadge } from '@/components/design-system/V28TariffBadge';
import { Terminal, Code, GitBranch, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function APIZugangPage() {
  const navigate = useNavigate();

  const features = [
    { icon: Terminal, title: 'REST API', description: 'Vollständige REST API mit allen Funktionen' },
    { icon: Code, title: 'Webhooks', description: 'Echtzeit-Benachrichtigungen bei Events' },
    { icon: GitBranch, title: 'Custom Integrationen', description: 'Anbindung an Ihre bestehenden Systeme' },
    { icon: Shield, title: 'OAuth 2.0', description: 'Sichere Authentifizierung mit OAuth 2.0' },
  ];

  return (
    <MarketingLayout currentPage="features">
      <SEOHead
        title="API-Zugang | MyDispatch"
        description="Vollständige REST API für Custom Integrationen. Mit Webhooks, OAuth 2.0 und umfangreicher Dokumentation."
        canonical="/features/enterprise/api-zugang"
      />

      <V28HeroPremium
        variant="features"
        backgroundVariant="3d-premium"
        badge={{
          text: "Enterprise-Feature",
          icon: Terminal
        }}
        title="API-Zugang"
        subtitle="Vollständige REST API für Custom Integrationen"
        description="Binden Sie MyDispatch an Ihre bestehenden Systeme an. Mit Webhooks, OAuth 2.0 und umfangreicher Dokumentation."
        primaryCTA={{
          label: "Sales kontaktieren",
          onClick: () => navigate('/contact')
        }}
        visual={<PremiumDashboardContent pageType="api-zugang" />}
        businessMetrics={[
          { label: 'Endpoints', value: '150+', sublabel: 'REST API' },
          { label: 'Requests', value: '99.9%', sublabel: 'Uptime' },
          { label: 'Response', value: '<50ms', sublabel: 'durchschnittlich' }
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
          <p className="text-slate-600 mb-8">Nur im Enterprise-Tarif verfügbar.</p>
        </div>
      </V28MarketingSection>
    </MarketingLayout>
  );
}
