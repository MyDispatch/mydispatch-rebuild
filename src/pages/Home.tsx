/* ==================================================================================
   HOME LANDING PAGE V28.2 - CODE-SPLIT VERSION
   ==================================================================================
   ✅ Aggressive Code-Splitting: 6 lazy-loadbare Sections
   ✅ Unter 100 Zeilen (ohne Imports)
   ✅ Progressive Loading mit Suspense
   ✅ White-Screen Fix: Kleine Chunks statt Monolith
   ================================================================================== */

import { lazy, Suspense } from "react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { SEOHead } from "@/components/shared/SEOHead";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { SectionErrorFallback } from "@/components/shared/SectionErrorFallback";
import { softwareApplicationSchema } from "@/lib/schema-org";
import { cityKeywords, longTailKeywords } from "@/lib/seo-data";
import { SEO_DEFAULTS } from "@/config/content";
import { LoadingFallback } from "@/components/shared/LoadingFallback";
import { ScrollToTopButton } from "@/components/shared/ScrollToTopButton";
import { CitiesPremiumSection } from "@/components/sections/CitiesPremiumSection";

// Lazy-Load ALL Sections (now using default exports)
const HomeHeroSection = lazy(() => import("@/components/home/HomeHeroSection"));
const HomeFeaturesSection = lazy(() => import("@/components/home/HomeFeaturesSection"));
const HomeTestimonialsSection = lazy(() => import("@/components/home/HomeTestimonialsSection"));
const HomePricingSection = lazy(() => import("@/components/home/HomePricingSection"));
const HomeFAQSection = lazy(() => import("@/components/home/HomeFAQSection"));
const HomeFinalCTASection = lazy(() => import("@/components/home/HomeFinalCTASection"));

const HomePage = () => {
  return (
    <MarketingLayout currentPage="home">
      <SEOHead
        title="MyDispatch - Führende Software für Taxi- & Mietwagenunternehmen"
        description={`Moderne Cloud-Lösung für professionelle Disposition. Jetzt in ${cityKeywords.slice(0, 10).join(", ")} und 40 weiteren Städten. GPS-Tracking, Auftragsverwaltung, automatische Rechnungsstellung. DSGVO-konform, Made in Germany.`}
        canonical="/"
        schema={softwareApplicationSchema}
        keywords={[
          ...SEO_DEFAULTS.keywords,
          ...cityKeywords.slice(0, 20),
          ...longTailKeywords.slice(0, 10),
        ]}
      />

      {/* Hero Section - Critical, load immediately */}
      <ErrorBoundary fallback={<SectionErrorFallback sectionName="Hero" />}>
        <Suspense fallback={<LoadingFallback />}>
          <HomeHeroSection />
        </Suspense>
      </ErrorBoundary>

      {/* Features Section - Below-the-fold */}
      <ErrorBoundary fallback={<SectionErrorFallback sectionName="Features" />}>
        <Suspense fallback={<div className="h-20" />}>
          <HomeFeaturesSection />
        </Suspense>
      </ErrorBoundary>

      {/* Testimonials Section */}
      <ErrorBoundary fallback={<SectionErrorFallback sectionName="Testimonials" />}>
        <Suspense fallback={<div className="h-20" />}>
          <HomeTestimonialsSection />
        </Suspense>
      </ErrorBoundary>

      {/* Pricing Section */}
      <ErrorBoundary fallback={<SectionErrorFallback sectionName="Pricing" />}>
        <Suspense fallback={<div className="h-20" />}>
          <HomePricingSection />
        </Suspense>
      </ErrorBoundary>

      {/* FAQ Section */}
      <ErrorBoundary fallback={<SectionErrorFallback sectionName="FAQ" />}>
        <Suspense fallback={<div className="h-20" />}>
          <HomeFAQSection />
        </Suspense>
      </ErrorBoundary>

      {/* Final CTA Section */}
      <ErrorBoundary fallback={<SectionErrorFallback sectionName="Final CTA" />}>
        <Suspense fallback={<div className="h-20" />}>
          <HomeFinalCTASection />
        </Suspense>
      </ErrorBoundary>

      {/* Cities Section - No lazy-load needed (already optimized) */}
      <CitiesPremiumSection cities={cityKeywords} maxVisible={30} />

      {/* Scroll-to-Top Button */}
      <ScrollToTopButton />
    </MarketingLayout>
  );
};

export default HomePage;
