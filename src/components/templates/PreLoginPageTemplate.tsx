/* ==================================================================================
   PRE-LOGIN PAGE TEMPLATE V28.1
   ==================================================================================
   ✅ Wiederverwendbares Template für alle Pre-Login Seiten
   ✅ Nutzt zentrale Configs aus src/config/pages/
   ✅ Konsistentes Layout basierend auf Home.tsx Master-Pattern
   ✅ V28 Design System Compliance
   ================================================================================== */

import { ReactNode } from "react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { SEOHead } from "@/components/shared/SEOHead";
import { V28HeroPremium } from "@/components/hero/V28HeroPremium";
import { V28MarketingSection } from "@/components/design-system/V28MarketingSection";
import { V28MarketingCard } from "@/components/design-system/V28MarketingCard";
import { V28IconBox } from "@/components/design-system/V28IconBox";
import { ScrollToTopButton } from "@/components/shared/ScrollToTopButton";
import { V28Button } from "@/components/design-system/V28Button";
import { PreLoginPageConfig } from "@/config/pages";
import { useNavigate } from "react-router-dom";

// ==================================================================================
// INTERFACES
// ==================================================================================

interface PreLoginPageTemplateProps {
  pageConfig: PreLoginPageConfig | Partial<PreLoginPageConfig>;
  customSections?: ReactNode;
  showFinalCTA?: boolean;
  showScrollToTop?: boolean;
}

// ==================================================================================
// COMPONENT
// ==================================================================================

export function PreLoginPageTemplate({
  pageConfig,
  customSections,
  showFinalCTA = true,
  showScrollToTop = true,
}: PreLoginPageTemplateProps) {
  const navigate = useNavigate();

  // SEO Meta Tags
  const seoConfig = pageConfig.seo
    ? {
        title: pageConfig.seo.title,
        description: pageConfig.seo.description,
        keywords: pageConfig.seo.keywords,
        canonical: pageConfig.seo.canonical,
        type: pageConfig.seo.type,
      }
    : undefined;

  return (
    <MarketingLayout>
      {/* SEO Head */}
      {seoConfig && <SEOHead {...seoConfig} />}

      {/* Hero Section */}
      {pageConfig.hero && (
        <V28HeroPremium
          variant={pageConfig.hero.variant}
          backgroundVariant={
            pageConfig.hero.backgroundVariant === "3d-premium" ||
            pageConfig.hero.backgroundVariant === "flat"
              ? pageConfig.hero.backgroundVariant
              : "3d-premium"
          }
          badge={pageConfig.hero.badge ? { text: pageConfig.hero.badge } : undefined}
          title={pageConfig.hero.title}
          subtitle={pageConfig.hero.subtitle}
          description={pageConfig.hero.description}
          businessMetrics={pageConfig.hero.businessMetrics}
          trustElements={pageConfig.hero.trustElements}
          primaryCTA={{
            label: "Jetzt starten",
            onClick: () => navigate("/auth"),
          }}
          secondaryCTA={{
            label: "Live-Demo",
            onClick: () => navigate("/demo"),
          }}
        />
      )}

      {/* Features Section */}
      {pageConfig.sections?.features && (
        <V28MarketingSection
          id="features"
          background={pageConfig.sections.features.background || "canvas"}
          title={pageConfig.sections.features.title}
          description={pageConfig.sections.features.description}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {pageConfig.sections.features.items.map((feature, index) => (
              <V28MarketingCard key={index}>
                <div className="space-y-4">
                  <V28IconBox icon={feature.icon} variant="primary" />
                  <h3 className="font-sans text-xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="font-sans text-slate-600 leading-relaxed">{feature.description}</p>
                  {feature.benefit && (
                    <p className="font-sans text-sm text-primary font-semibold">
                      ✓ {feature.benefit}
                    </p>
                  )}
                </div>
              </V28MarketingCard>
            ))}
          </div>
        </V28MarketingSection>
      )}

      {/* Testimonials Section */}
      {pageConfig.sections?.testimonials && (
        <V28MarketingSection
          id="testimonials"
          background={pageConfig.sections.testimonials.background || "white"}
          title={pageConfig.sections.testimonials.title}
          description={pageConfig.sections.testimonials.description}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {pageConfig.sections.testimonials.items.map((testimonial, index) => (
              <V28MarketingCard key={index}>
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-500 text-xl">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="font-sans text-slate-700 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="pt-4 border-t border-slate-200">
                    <p className="font-sans font-semibold text-slate-900">{testimonial.author}</p>
                    <p className="font-sans text-sm text-slate-600">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </V28MarketingCard>
            ))}
          </div>
        </V28MarketingSection>
      )}

      {/* Custom Sections (Page-Specific Content) */}
      {customSections}

      {/* Pricing Section */}
      {pageConfig.sections?.pricing && (
        <V28MarketingSection
          id="pricing"
          background={pageConfig.sections.pricing.background || "canvas"}
          title={pageConfig.sections.pricing.title}
          description={pageConfig.sections.pricing.description}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {pageConfig.sections.pricing.tiers.map((tier, index) => (
              <V28MarketingCard
                key={index}
                className={tier.highlighted ? "border-primary border-2" : ""}
              >
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="font-sans text-2xl font-bold text-slate-900">{tier.name}</h3>
                    <div className="font-sans text-4xl font-bold text-primary">
                      {tier.price}
                      {tier.price !== "Individuell" && (
                        <span className="text-lg text-slate-600 font-normal">/Monat</span>
                      )}
                    </div>
                    <p className="font-sans text-slate-600">{tier.description}</p>
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="font-sans flex items-start gap-2 text-slate-700">
                        <span className="text-primary font-bold">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <V28Button
                    className="w-full"
                    variant={tier.highlighted ? "primary" : "secondary"}
                    onClick={() => navigate("/auth")}
                  >
                    {tier.highlighted ? "Jetzt starten" : "Mehr erfahren"}
                  </V28Button>
                </div>
              </V28MarketingCard>
            ))}
          </div>
        </V28MarketingSection>
      )}

      {/* FAQ Section */}
      {pageConfig.sections?.faq && (
        <V28MarketingSection
          id="faq"
          background={pageConfig.sections.faq.background || "white"}
          title={pageConfig.sections.faq.title}
          description={pageConfig.sections.faq.description}
        >
          <div className="max-w-3xl mx-auto space-y-4">
            {pageConfig.sections.faq.items.map((item, index) => (
              <V28MarketingCard key={index}>
                <div className="space-y-3">
                  <h3 className="font-sans text-lg font-bold text-slate-900">{item.question}</h3>
                  <p className="font-sans text-slate-600 leading-relaxed">{item.answer}</p>
                </div>
              </V28MarketingCard>
            ))}
          </div>
        </V28MarketingSection>
      )}

      {/* Final CTA Section */}
      {showFinalCTA && pageConfig.trustLine && (
        <V28MarketingSection
          background="canvas"
          title="Starten Sie jetzt durch"
          description="Testen Sie MyDispatch und überzeugen Sie sich selbst."
        >
          <div className="max-w-2xl mx-auto text-center space-y-8">
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <V28Button
                size="lg"
                variant="primary"
                onClick={() => navigate("/auth")}
                className="text-base sm:text-lg px-8 py-6"
              >
                Jetzt starten
              </V28Button>
              <V28Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/demo")}
                className="text-base sm:text-lg px-8 py-6"
              >
                Live-Demo anfragen
              </V28Button>
            </div>

            {/* Trust-Line */}
            <div className="space-y-3 max-w-3xl mx-auto text-center">
              <p className="font-sans text-sm text-slate-600">
                {pageConfig.trustLine.security} ·{" "}
                <strong className="text-slate-900">{pageConfig.trustLine.location}</strong> ·{" "}
                {pageConfig.trustLine.flexibility}
              </p>
              <p className="font-sans text-xs text-slate-500 italic">
                {pageConfig.trustLine.slogan}
              </p>
            </div>
          </div>
        </V28MarketingSection>
      )}

      {/* Scroll to Top Button */}
      {showScrollToTop && <ScrollToTopButton />}
    </MarketingLayout>
  );
}
