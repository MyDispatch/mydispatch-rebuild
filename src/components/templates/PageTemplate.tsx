/* ==================================================================================
   PAGE TEMPLATE V29.0 - WIEDERVERWENDBARES MARKETING-SEITEN-TEMPLATE
   ==================================================================================
   ✅ Data-Driven: Nur Content-Config übergeben
   ✅ V28.1 Design System compliant
   ✅ Hero + Sections + CTA automatisch
   ✅ SEO-optimiert
   ================================================================================== */

import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
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

interface CTAButton {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary';
}

interface SectionItem {
  id?: string;
  icon?: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  features?: string[];
}

interface Section {
  id?: string;
  title: string;
  description?: string;
  background?: 'white' | 'canvas';
  items: SectionItem[];
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

interface HeroConfig {
  variant: 'home' | 'features' | 'demo' | 'pricing';
  title: string;
  subtitle: string; // Required by V28HeroPremium
  description?: string;
  primaryCTA?: CTAButton;
  secondaryCTA?: CTAButton;
  visual?: ReactNode; // Use 'visual' instead of 'graphic'
  trustElements?: boolean;
}

export interface PageTemplateProps {
  // SEO
  title: string;
  description: string;
  
  // Hero
  hero: HeroConfig;
  
  // Sections
  sections: Section[];
  
  // Final CTA (optional)
  finalCTA?: {
    title: string;
    description: string;
    buttons: CTAButton[];
  };
  
  // Layout
  currentPage?: string;
}

/* ==================================================================================
   PAGE TEMPLATE COMPONENT
   ================================================================================== */

export function PageTemplate({
  title,
  description,
  hero,
  sections,
  finalCTA,
  currentPage,
}: PageTemplateProps) {
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
        className="h-12 px-8 font-semibold rounded-lg transition-all duration-300"
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
      <SEOHead 
        title={title} 
        description={description}
      />

      {/* Hero Section */}
      <V28HeroPremium
        variant={hero.variant}
        title={hero.title}
        subtitle={hero.subtitle}
        description={hero.description}
        primaryCTA={hero.primaryCTA ? {
          label: hero.primaryCTA.label,
          onClick: hero.primaryCTA.onClick || (() => navigate(hero.primaryCTA?.href || '/auth')),
        } : {
          label: 'Jetzt starten',
          onClick: () => navigate('/auth')
        }}
        secondaryCTA={hero.secondaryCTA ? {
          label: hero.secondaryCTA.label,
          onClick: hero.secondaryCTA.onClick || (() => navigate(hero.secondaryCTA?.href || '/demo')),
        } : undefined}
        visual={hero.visual}
        trustElements={hero.trustElements}
      />

      {/* Dynamic Sections */}
      {sections.map((section, sectionIdx) => (
        <V28MarketingSection
          key={section.id || `section-${sectionIdx}`}
          id={section.id}
          title={section.title}
          description={section.description}
          background={section.background || 'white'}
        >
          <DataGrid 
            columns={section.columns || { mobile: 1, tablet: 2, desktop: 3 }}
            gap="md"
          >
            {section.items.map((item, itemIdx) => (
              <V28MarketingCard key={item.id || `item-${itemIdx}`}>
                <div className="space-y-4">
                  {/* Icon */}
                  {item.icon && (
                    <V28IconBox 
                      icon={item.icon}
                      variant="primary"
                    />
                  )}

                  {/* Badge */}
                  {item.badge && (
                    <div className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
                      {item.badge}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base leading-relaxed text-slate-600">
                    {item.description}
                  </p>

                  {/* Features List */}
                  {item.features && item.features.length > 0 && (
                    <ul className="space-y-2 mt-4">
                      {item.features.map((feature, featureIdx) => (
                        <li 
                          key={featureIdx}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </V28MarketingCard>
            ))}
          </DataGrid>
        </V28MarketingSection>
      ))}

      {/* Final CTA Section */}
      {finalCTA && (
        <V28MarketingSection
          background="canvas"
          title={finalCTA.title}
          description={finalCTA.description}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            {finalCTA.buttons.map((button, idx) => (
              <div key={idx}>
                {renderCTAButton(button)}
              </div>
            ))}
          </div>
        </V28MarketingSection>
      )}

      {/* Scroll to Top */}
      <ScrollToTopButton />
    </MarketingLayout>
  );
}

/* ==================================================================================
   USAGE EXAMPLE
   ==================================================================================

import { PageTemplate } from '@/components/templates/PageTemplate';
import { pageData } from '@/data/my-page-data';

export default function MyPage() {
  return <PageTemplate {...pageData} />;
}

// In src/data/my-page-data.ts:
export const pageData = {
  title: 'Features | MyDispatch',
  description: 'Entdecken Sie alle Features',
  hero: {
    variant: 'features',
    title: 'Alle Features',
    description: 'Eine Übersicht aller Funktionen',
    primaryCTA: { label: 'Jetzt starten', href: '/auth' },
    secondaryCTA: { label: 'Demo ansehen', href: '/demo' },
  },
  sections: [
    {
      id: 'core-features',
      title: 'Kern-Features',
      description: 'Die wichtigsten Funktionen',
      items: [
        {
          icon: Truck,
          title: 'Auftragsverwaltung',
          description: 'Verwalten Sie alle Aufträge zentral',
          features: ['Feature 1', 'Feature 2']
        }
      ]
    }
  ],
  finalCTA: {
    title: 'Bereit loszulegen?',
    description: 'Starten Sie noch heute',
    buttons: [
      { label: 'Jetzt starten', href: '/auth', variant: 'primary' }
    ]
  }
};

   ================================================================================== */
