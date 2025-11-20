/* ==================================================================================
   FEATURE DETAIL PAGE: Fahrer & Fahrzeuge
   ================================================================================== */

import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { SEOHead } from "@/components/shared/SEOHead";
import { V28HeroPremium } from "@/components/hero";
import { PremiumDashboardContent } from "@/components/dashboard/PremiumDashboardContent";
import { V28MarketingSection } from "@/components/design-system/V28MarketingSection";
import { V28MarketingCard } from "@/components/design-system/V28MarketingCard";
import { V28IconBox } from "@/components/design-system/V28IconBox";
import { V28Button } from "@/components/design-system/V28Button";
import { V28TariffBadge } from "@/components/design-system/V28TariffBadge";

import { Users, CheckCircle, Shield, Clock, FileText, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FahrerFahrzeugePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Fahrer-Profile",
      description: "Vollständige Verwaltung aller Fahrerinformationen mit Fotos und Dokumenten",
    },
    {
      icon: FileText,
      title: "Führerscheinverwaltung",
      description:
        "Automatische Ablauferinnerungen für Führerscheine und Personenbeförderungsschein",
    },
    {
      icon: Calendar,
      title: "Schichtplanung",
      description: "Digitale Schichtplanung mit Verfügbarkeitskalender",
    },
    {
      icon: Shield,
      title: "Fahrzeugdokumentation",
      description: "TÜV, Versicherung, Zulassung – alle Dokumente zentral verwaltet",
    },
    {
      icon: Clock,
      title: "Zeiterfassung",
      description: "Automatische Erfassung von Arbeitszeiten und Pausen",
    },
    {
      icon: CheckCircle,
      title: "Compliance",
      description: "Einhaltung aller gesetzlichen Vorgaben und Fristen",
    },
  ];

  const useCases = [
    {
      company: "Taxi Berlin GmbH",
      challenge: "Verlust von 20% der Umsätze durch abgelaufene Führerscheine",
      solution: "Automatische Erinnerungen 30 Tage vor Ablauf",
      result: "0 Ausfälle durch Dokumentenablauf im letzten Jahr",
    },
    {
      company: "Mietwagen Stuttgart",
      challenge: "Manuelle TÜV-Planung für 50 Fahrzeuge",
      solution: "Digitaler Wartungskalender mit Benachrichtigungen",
      result: "90% Zeitersparnis bei der Fuhrpartverwaltung",
    },
  ];

  return (
    <MarketingLayout currentPage="features">
      <SEOHead
        title="Fahrer & Fahrzeuge verwalten | MyDispatch"
        description="Professionelle Fahrer- und Fuhrpartverwaltung mit TÜV-Überwachung, Führerscheinverwaltung und automatischen Ablauf-Erinnerungen."
        canonical="/features/core/fahrer-fahrzeuge"
      />

      {/* Hero - V32.0 PREMIUM DASHBOARD */}
      <V28HeroPremium
        variant="features"
        backgroundVariant="3d-premium"
        badge={{ text: "Core-Feature", icon: Users }}
        title="Fahrer & Fahrzeuge zentral verwalten"
        subtitle="Behalten Sie den Überblick über Ihre gesamte Flotte und Ihr Team"
        description="Mit automatischen Ablauf-Erinnerungen und digitalen Schichtzetteln."
        primaryCTA={{
          label: "Jetzt starten",
          onClick: () => navigate("/auth?mode=signup"),
        }}
        secondaryCTA={{
          label: "Demo anfragen",
          onClick: () => navigate("/demo"),
        }}
        visual={<PremiumDashboardContent pageType="features" />}
        trustElements={true}
      />

      {/* Problem-Solution */}
      <V28MarketingSection background="canvas" title="Die Herausforderung">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <V28MarketingCard>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Problem</h3>
            <p className="text-slate-600 leading-relaxed">
              Abgelaufene Führerscheine, verpasste TÜV-Termine und manuelle Excel-Listen führen zu
              Compliance-Verstößen und Umsatzausfällen.
            </p>
          </V28MarketingCard>
          <V28MarketingCard>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Lösung</h3>
            <p className="text-slate-600 leading-relaxed">
              MyDispatch überwacht alle Fristen automatisch und sendet rechtzeitig Erinnerungen –
              per E-Mail und Push-Benachrichtigung.
            </p>
          </V28MarketingCard>
        </div>
      </V28MarketingSection>

      {/* Feature Details */}
      <V28MarketingSection background="white" title="Alle Funktionen im Detail">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <V28MarketingCard key={idx}>
              <V28IconBox icon={feature.icon} variant="slate" />
              <h3 className="text-lg font-semibold text-slate-900 mt-4 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </V28MarketingCard>
          ))}
        </div>
      </V28MarketingSection>

      {/* Use Cases */}
      <V28MarketingSection background="canvas" title="Praxisbeispiele">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {useCases.map((useCase, idx) => (
            <V28MarketingCard key={idx}>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{useCase.company}</h4>
              <p className="text-sm text-slate-600 mb-4">
                <strong>Herausforderung:</strong> {useCase.challenge}
              </p>
              <p className="text-sm text-slate-600 mb-4">
                <strong>Lösung:</strong> {useCase.solution}
              </p>
              <p className="text-sm text-slate-900 font-semibold">✅ {useCase.result}</p>
            </V28MarketingCard>
          ))}
        </div>
      </V28MarketingSection>

      {/* Tariff Availability */}
      <V28MarketingSection background="white" title="In welchem Tarif enthalten?">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex gap-4 flex-wrap justify-center mb-8">
            <V28TariffBadge label="Starter" />
            <V28TariffBadge label="Business" />
            <V28TariffBadge label="Enterprise" />
          </div>
          <p className="text-slate-600 mb-8">Dieses Feature ist in allen Tarifen enthalten.</p>
          <V28Button variant="primary" size="lg" onClick={() => navigate("/pricing")}>
            Tarife vergleichen
          </V28Button>
        </div>
      </V28MarketingSection>

      {/* FAQ */}
      <V28MarketingSection background="canvas" title="Häufig gestellte Fragen">
        <div className="max-w-3xl mx-auto space-y-4">
          <V28MarketingCard>
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              Wie viele Fahrer kann ich verwalten?
            </h4>
            <p className="text-slate-600">
              Im Starter-Tarif bis zu 3 Fahrer. Ab Business-Tarif unbegrenzt.
            </p>
          </V28MarketingCard>
          <V28MarketingCard>
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              Werden alle Dokumente automatisch überwacht?
            </h4>
            <p className="text-slate-600">
              Ja, MyDispatch überwacht Führerschein, Personenbeförderungsschein, TÜV, Versicherung
              und Zulassung automatisch.
            </p>
          </V28MarketingCard>
          <V28MarketingCard>
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              Kann ich eigene Dokumente hochladen?
            </h4>
            <p className="text-slate-600">
              Ja, Sie können beliebige Dokumente (z.B. Arbeitsverträge, Schulungsnachweise)
              hochladen und verwalten.
            </p>
          </V28MarketingCard>
        </div>
      </V28MarketingSection>

      {/* Final CTA */}
      <V28MarketingSection background="white" className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
          Bereit für digitale Fahrer- und Fuhrpartverwaltung?
        </h2>
        <div className="flex gap-4 justify-center">
          <V28Button variant="primary" size="lg" onClick={() => navigate("/auth?mode=signup")}>
            Jetzt starten
          </V28Button>
          <V28Button variant="secondary" size="lg" onClick={() => navigate("/demo")}>
            Demo anfragen
          </V28Button>
        </div>
      </V28MarketingSection>
    </MarketingLayout>
  );
}
