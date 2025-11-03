/* ==================================================================================
   FEATURE DETAIL TEMPLATE V29.0 - TEMPLATE FÜR FEATURE-DETAIL-SEITEN
   ==================================================================================
   ✅ Spezialisiert für Feature-Seiten (z.B. /features/fahrer-app)
   ✅ Benefits + Use Cases + Technical Specs
   ✅ V28.1 Design System compliant
   ✅ Data-Driven Approach
   ================================================================================== */

import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideIcon, Check } from 'lucide-react';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { SEOHead } from '@/components/shared/SEOHead';
import { V28HeroPremium } from '@/components/hero/V28HeroPremium';
import { V28MarketingSection } from '@/components/design-system/V28MarketingSection';
import { V28MarketingCard } from '@/components/design-system/V28MarketingCard';
import { V28IconBox } from '@/components/design-system/V28IconBox';
import { DataGrid } from '@/components/smart-templates/DataGrid';
import { ScrollToTopButton } from '@/components/shared/ScrollToTopButton';
import { V28Button } from '@/components/design-system/V28Button';

/* ==================================================================================
   TYPE DEFINITIONS
   ================================================================================== */

interface Benefit {
  id?: string;
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
}

interface UseCase {
  id?: string;
  title: string;
  description: string;
  scenario: string;
  solution: string;
  results?: string[];
}

interface TechnicalSpec {
  id?: string;
  title: string;
  items: string[];
}

interface CTAButton {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary';
}

export interface FeatureDetailTemplateProps {
  // SEO
  title: string;
  description: string;
  
  // Hero
  featureName: string;
  featureTagline: string;
  featureDescription: string;
  heroGraphic?: ReactNode;
  
  // Content Sections
  benefits: Benefit[];
  useCases: UseCase[];
  technicalSpecs?: TechnicalSpec[];
  
  // CTAs
  primaryCTA?: CTAButton;
  secondaryCTA?: CTAButton;
  
  // Layout
  currentPage?: string;
}

/* ==================================================================================
   FEATURE DETAIL TEMPLATE COMPONENT
   ================================================================================== */

export function FeatureDetailTemplate({
  title,
  description,
  featureName,
  featureTagline,
  featureDescription,
  heroGraphic,
  benefits,
  useCases,
  technicalSpecs,
  primaryCTA,
  secondaryCTA,
  currentPage,
}: FeatureDetailTemplateProps) {
  const navigate = useNavigate();

  /* ==================================================================================
     RENDER HELPERS
     ================================================================================== */

  const renderCTAButton = (cta: CTAButton) => {
    const handleClick = () => {
      if (cta.onClick) {
        cta.onClick();
      } else if (cta.href) {
        navigate(cta.href);
      }
    };

    const isPrimary = cta.variant !== 'secondary';

    return (
      <V28Button
        onClick={handleClick}
        size="lg"
        variant={isPrimary ? 'primary' : 'secondary'}
        className={
          isPrimary
            ? 'h-12 px-8 font-semibold rounded-lg transition-all duration-300'
            : 'h-12 px-8 font-semibold rounded-lg transition-all duration-300'
        }
      >
        {cta.label}
      </V28Button>
    );
  };

  /* ==================================================================================
     RENDER
     ================================================================================== */

  return (
    <MarketingLayout currentPage={currentPage}>
      <SEOHead title={title} description={description} />

      {/* Hero Section */}
      <V28HeroPremium
        variant="features"
        title={featureName}
        subtitle={featureTagline}
        description={featureDescription}
        primaryCTA={primaryCTA ? {
          label: primaryCTA.label,
          onClick: primaryCTA.onClick || (() => navigate(primaryCTA?.href || '/auth')),
        } : {
          label: 'Jetzt starten',
          onClick: () => navigate('/auth')
        }}
        secondaryCTA={secondaryCTA ? {
          label: secondaryCTA.label,
          onClick: secondaryCTA.onClick || (() => navigate(secondaryCTA?.href || '/demo')),
        } : undefined}
        visual={heroGraphic}
      />

      {/* Benefits Section */}
      {benefits && benefits.length > 0 && (
        <V28MarketingSection
          id="benefits"
          title="Ihre Vorteile"
          description="Entdecken Sie, wie dieses Feature Ihre Arbeit erleichtert"
          background="white"
        >
          <DataGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
            {benefits.map((benefit, idx) => (
              <V28MarketingCard key={benefit.id || `benefit-${idx}`}>
                <div className="space-y-4">
                  {/* Icon */}
                  <V28IconBox 
                    icon={benefit.icon}
                    variant="primary"
                  />

                  {/* Badge */}
                  {benefit.badge && (
                    <div className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
                      {benefit.badge}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-slate-900">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base leading-relaxed text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              </V28MarketingCard>
            ))}
          </DataGrid>
        </V28MarketingSection>
      )}

      {/* Use Cases Section */}
      {useCases && useCases.length > 0 && (
        <V28MarketingSection
          id="use-cases"
          title="Use Cases"
          description="Praxisbeispiele aus dem Alltag"
          background="canvas"
        >
          <DataGrid columns={{ mobile: 1, tablet: 1, desktop: 2 }} gap="lg">
            {useCases.map((useCase, idx) => (
              <V28MarketingCard key={useCase.id || `usecase-${idx}`}>
                <div className="space-y-6">
                  {/* Title */}
                  <h3 className="text-2xl font-semibold text-slate-900">
                    {useCase.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base leading-relaxed text-slate-600">
                    {useCase.description}
                  </p>

                  {/* Scenario */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Szenario
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {useCase.scenario}
                    </p>
                  </div>

                  {/* Solution */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Lösung
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {useCase.solution}
                    </p>
                  </div>

                  {/* Results */}
                  {useCase.results && useCase.results.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                        Ergebnisse
                      </h4>
                      <ul className="space-y-2">
                        {useCase.results.map((result, resultIdx) => (
                          <li 
                            key={resultIdx}
                            className="flex items-start gap-2 text-sm text-slate-600"
                          >
                            <Check className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                            <span>{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </V28MarketingCard>
            ))}
          </DataGrid>
        </V28MarketingSection>
      )}

      {/* Technical Specifications */}
      {technicalSpecs && technicalSpecs.length > 0 && (
        <V28MarketingSection
          id="technical-specs"
          title="Technische Spezifikationen"
          description="Alle Details auf einen Blick"
          background="white"
        >
          <DataGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
            {technicalSpecs.map((spec, idx) => (
              <V28MarketingCard key={spec.id || `spec-${idx}`}>
                <div className="space-y-4">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-slate-900">
                    {spec.title}
                  </h3>

                  {/* Items List */}
                  <ul className="space-y-2">
                    {spec.items.map((item, itemIdx) => (
                      <li 
                        key={itemIdx}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <Check className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </V28MarketingCard>
            ))}
          </DataGrid>
        </V28MarketingSection>
      )}

      {/* Final CTA */}
      <V28MarketingSection
        background="canvas"
        title="Bereit, dieses Feature zu nutzen?"
        description="Starten Sie noch heute mit MyDispatch"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          {primaryCTA && renderCTAButton(primaryCTA)}
          {secondaryCTA && renderCTAButton(secondaryCTA)}
        </div>
      </V28MarketingSection>

      {/* Scroll to Top */}
      <ScrollToTopButton />
    </MarketingLayout>
  );
}

/* ==================================================================================
   USAGE EXAMPLE
   ==================================================================================

import { FeatureDetailTemplate } from '@/components/templates/FeatureDetailTemplate';
import { fahrerAppData } from '@/data/features/fahrer-app';

export default function FahrerAppFeature() {
  return <FeatureDetailTemplate {...fahrerAppData} />;
}

// In src/data/features/fahrer-app.ts:
export const fahrerAppData = {
  title: 'Fahrer-App | MyDispatch',
  description: 'Mobile App für Fahrer',
  featureName: 'Fahrer-App',
  featureTagline: 'Ihre Fahrer immer verbunden',
  featureDescription: 'Mobile App für iOS und Android',
  benefits: [
    {
      icon: Smartphone,
      title: 'GPS-Tracking',
      description: 'Echtzeitposition aller Fahrer',
      badge: 'LIVE'
    }
  ],
  useCases: [
    {
      title: 'Schnelle Auftragsannahme',
      description: 'Fahrer erhalten neue Aufträge in Echtzeit',
      scenario: 'Neuer Auftrag kommt rein um 14:30',
      solution: 'Push-Notification an nächsten freien Fahrer',
      results: [
        '70% schnellere Reaktionszeit',
        '95% Acceptance-Rate'
      ]
    }
  ],
  technicalSpecs: [
    {
      title: 'Plattformen',
      items: ['iOS 14+', 'Android 9+', 'Web-App']
    }
  ],
  primaryCTA: { label: 'Jetzt starten', href: '/auth' },
  secondaryCTA: { label: 'Demo ansehen', href: '/demo' }
};

   ================================================================================== */
