/* ==================================================================================
   HOME FEATURES SECTION V28.1
   ================================================================================== */

import { Link } from "react-router-dom";
import { V28MarketingSection } from "@/components/design-system/V28MarketingSection";
import { V28MarketingCard } from "@/components/design-system/V28MarketingCard";
import { V28IconBox } from "@/components/design-system/V28IconBox";
import { ClipboardList, Car, Users, FileText, Handshake, TrendingUp, Shield, Smartphone, Globe, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

const features = [
  {
    icon: ClipboardList,
    title: "Intelligente Auftragsverwaltung",
    description: "Erfassen, planen und verwalten Sie alle Fahrten zentral. Mit intelligentem Routing und automatischer Fahrerzuweisung.",
    link: "/features/core/auftragsverwaltung",
  },
  {
    icon: Car,
    title: "Digitale Fuhrpartverwaltung",
    description: "Komplette Fahrzeugverwaltung mit TÜV-Überwachung, Wartungsplaner und automatischen Ablauf-Erinnerungen.",
    link: "/features/core/fahrer-fahrzeuge",
  },
  {
    icon: Users,
    title: "Fahrermanagement Pro",
    description: "Schichtplanung, digitale Schichtzettel, Führerscheinverwaltung und automatische Abrechnung.",
    link: "/features/core/fahrer-fahrzeuge",
  },
  {
    icon: FileText,
    title: "Professionelles Rechnungswesen",
    description: "Erstellen Sie Angebote und Rechnungen in Sekunden mit automatischen Mahnungen und Zahlungsabgleich.",
    link: "/features/core/rechnungsstellung",
  },
  {
    icon: Handshake,
    title: "Partner-Netzwerk",
    description: "Vergeben Sie Aufträge an Partner-Unternehmen und verwalten Sie Provisionen transparent.",
    link: "/features/business/partner-management",
  },
  {
    icon: TrendingUp,
    title: "Live-Statistiken & KPIs",
    description: "Echtzeit-Dashboards mit Umsätzen, Auslastung und Fahrerperformance.",
    link: "/features/business/statistiken",
  },
  {
    icon: Shield,
    title: "DSGVO-konform & Sicher",
    description: "Made in Germany mit höchsten Datenschutzstandards auf deutschen Servern.",
    link: "/datenschutz",
  },
  {
    icon: Smartphone,
    title: "Kunden-Portal & Buchungswidget",
    description: "Ihre Kunden buchen online und verwalten Fahrten selbst.",
    link: "/features/business/buchungswidget",
  },
  {
    icon: Globe,
    title: "Live-Traffic & Wetter",
    description: "Echtzeit-Verkehrsinformationen und Wettervorhersage für optimale Routenplanung.",
    link: "/features/business/live-traffic",
  },
];

export const HomeFeaturesSection = () => {
  const { ref: featuresRef, isVisible: featuresVisible } = useIntersectionObserver();
  
  return (
    <V28MarketingSection
      background="canvas"
      title="Professionelle Disposition – einfach, sicher, transparent"
      description="Alles, was Sie für die moderne Flottenverwaltung benötigen – in einer Plattform."
    >
      <div className="max-w-7xl mx-auto relative">
        {/* Decorative Orbs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute bottom-[30%] -left-10 w-40 h-40 bg-slate-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
        
        <div 
          ref={featuresRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
        {features.map((feature, idx) => {
          const FeatureIcon = feature.icon;
          return (
            <Link
              key={idx}
              to={feature.link}
              className={cn(
                "group",
                featuresVisible && "animate-fade-in"
              )}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <V28MarketingCard className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer">
                {/* Hover-Glow-Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                
                {/* Content */}
                <div className="relative z-10">
                  <V28IconBox icon={FeatureIcon} variant="slate" className="group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-sans text-lg font-semibold mb-2 mt-4 text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-slate-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                    <span>Mehr erfahren</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </V28MarketingCard>
            </Link>
          );
        })}
        </div>
      </div>
    </V28MarketingSection>
  );
};

export default HomeFeaturesSection;
