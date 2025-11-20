/* ==================================================================================
   FEATURE DETAIL PAGE: Custom Development (V32.0 - Hero-Lock Compliant)
   ================================================================================== */

import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { SEOHead } from '@/components/shared/SEOHead';
import { V28HeroPremium } from '@/components/hero/V28HeroPremium';
import { PremiumDashboardContent } from '@/components/dashboard/PremiumDashboardContent';
import { V28MarketingSection } from '@/components/design-system/V28MarketingSection';
import { V28MarketingCard } from '@/components/design-system/V28MarketingCard';
import { V28IconBox } from '@/components/design-system/V28IconBox';
import { V28TariffBadge } from '@/components/design-system/V28TariffBadge';
import { Code2, GitBranch, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomDevelopmentPage() {
  const navigate = useNavigate();

  const features = [
    { icon: Code2, title: 'Custom Features', description: 'Individuelle Funktionen nach Ihren Anforderungen' },
    { icon: GitBranch, title: 'System-Integrationen', description: 'Anbindung an Ihre bestehende IT-Infrastruktur' },
    { icon: Users, title: 'Dediziertes Team', description: 'Eigenes Entwickler-Team für Ihre Projekte' },
    { icon: Zap, title: 'Schnelle Umsetzung', description: 'Agile Entwicklung mit regelmäßigen Updates' },
  ];

  return (
    <MarketingLayout currentPage="features">
      <SEOHead
        title="Custom Development | MyDispatch"
        description="Individuelle Softwareentwicklung für Ihre spezifischen Anforderungen. Mit dediziertem Entwickler-Team."
        canonical="/features/enterprise/custom-development"
      />

      <V28HeroPremium
        variant="features"
        backgroundVariant="3d-premium"
        badge={{
          text: "Enterprise-Feature",
          icon: Code2
        }}
        title="Custom Development"
        subtitle="Individuelle Softwareentwicklung für Ihre Anforderungen"
        description="Wir entwickeln individuelle Features nach Ihren Spezifikationen. Mit dediziertem Entwickler-Team und agiler Arbeitsweise."
        primaryCTA={{
          label: "Sales kontaktieren",
          onClick: () => navigate('/contact')
        }}
        visual={<PremiumDashboardContent pageType="custom-development" />}
        businessMetrics={[
          { label: 'Projekte', value: '50+', sublabel: 'erfolgreich' },
          { label: 'Team', value: '8', sublabel: 'Entwickler' },
          { label: 'Sprint', value: '2 Wochen', sublabel: 'Cycles' }
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
