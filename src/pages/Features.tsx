/* ==================================================================================
   FEATURES PAGE - V28.1 PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ V28.1 Design System konform
   ✅ Hero Split Layout (Text links, Dashboard-Preview rechts)
   ✅ Feature-Grid mit V28IconBox
   ✅ FAQ-Sektion mit V28AccordionItem
   ✅ SEO-optimiert mit Schema.org
   ================================================================================== */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { SEOHead } from "@/components/shared/SEOHead";
import { V28HeroPremium } from "@/components/hero";
import { PremiumDashboardContent } from "@/components/dashboard/PremiumDashboardContent";
import { V28MarketingSection } from "@/components/design-system/V28MarketingSection";
import { V28MarketingCard } from "@/components/design-system/V28MarketingCard";
import { V28IconBox } from "@/components/design-system/V28IconBox";
import { V28Button } from "@/components/design-system/V28Button";
import { V28AccordionItem } from "@/components/pricing";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Users,
  Car,
  FileText,
  BarChart3,
  Calendar,
  MessageSquare,
  Smartphone,
  Shield,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "GPS-Echtzeit-Tracking",
    description:
      "Live-Standortverfolgung aller Fahrzeuge mit automatischer Routenoptimierung und Traffic-Daten.",
    tariff: "Alle Tarife",
    link: "/features/business/gps-tracking",
  },
  {
    icon: FileText,
    title: "Intelligente Disposition",
    description:
      "Automatische Auftragszuweisung basierend auf Verfügbarkeit, Standort und Fahrzeugtyp.",
    tariff: "Alle Tarife",
    link: "/features/core/auftragsverwaltung",
  },
  {
    icon: Users,
    title: "Kundenverwaltung",
    description:
      "Zentrale Datenbank mit Buchungshistorie, Präferenzen und automatischer Rechnungserstellung.",
    tariff: "Alle Tarife",
    link: "/features/core/kundenverwaltung",
  },
  {
    icon: Car,
    title: "Fahrzeugmanagement",
    description: "Fuhrparkverwaltung mit TÜV-Tracking, Wartungsplanung und Kostenkontrolle.",
    tariff: "Alle Tarife",
    link: "/features/core/fahrer-fahrzeuge",
  },
  {
    icon: BarChart3,
    title: "Erweiterte Statistiken",
    description: "Detaillierte Auswertungen zu Umsatz, Auslastung und Fahrerperformance.",
    tariff: "Business+",
    link: "/features/business/statistiken",
  },
  {
    icon: MessageSquare,
    title: "Kunden-Portal",
    description: "Eigenes Login-Portal für Kunden mit Buchungsübersicht und Self-Service.",
    tariff: "Business+",
    link: "/features/business/kunden-portal",
  },
  {
    icon: Calendar,
    title: "Schichtplanung",
    description: "Digitale Schichtzettel mit Zeiterfassung und automatischer Abrechnung.",
    tariff: "Alle Tarife",
    link: "/features/core/fahrer-fahrzeuge",
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description:
      "Native iOS/Android Apps für Fahrer mit Offline-Modus und Push-Benachrichtigungen.",
    tariff: "Alle Tarife",
    link: "/features/business/buchungswidget",
  },
  {
    icon: Shield,
    title: "DSGVO-konform",
    description: "Hosting in Deutschland, verschlüsselte Datenübertragung und AVV inklusive.",
    tariff: "Alle Tarife",
    link: "/datenschutz",
  },
  {
    icon: Zap,
    title: "API-Integration",
    description:
      "RESTful API für Anbindung externer Systeme (Buchhaltung, Zahlungsanbieter, etc.).",
    tariff: "Business+",
    link: "/features/enterprise/api-zugang",
  },
  {
    icon: Clock,
    title: "24/7 Verfügbarkeit",
    description: "99,9% Uptime-Garantie mit automatischen Backups und Notfall-Support.",
    tariff: "Alle Tarife",
    link: "/features/enterprise/support",
  },
  {
    icon: CheckCircle2,
    title: "White-Labeling",
    description: "Individuelles Branding der Landingpage und Kunden-Apps mit Ihrem Logo.",
    tariff: "Enterprise",
    link: "/features/enterprise/white-labeling",
  },
];

const faqItems = [
  {
    question: "Welche Features sind im Starter-Tarif enthalten?",
    answer:
      "Der Starter-Tarif umfasst alle Basis-Features: Disposition, Kunden-/Fahrerverwaltung, Auftragsverwaltung, Rechnungserstellung und Landingpage für bis zu 3 Fahrer/Fahrzeuge.",
  },
  {
    question: "Was bietet der Business-Tarif zusätzlich?",
    answer:
      "Business erweitert Starter um: Beliebig viele Fahrer/Fahrzeuge, Partner-Management, Live-Traffic, Statistiken, Kunden-Portal, Buchungswidget und API-Zugang.",
  },
  {
    question: "Kann ich Features einzeln dazubuchen?",
    answer:
      "Nein, Features sind in Tarifpaketen gebündelt. Sie können jedoch jederzeit zwischen den Tarifen wechseln (Upgrade/Downgrade).",
  },
  {
    question: "Gibt es eine mobile App?",
    answer:
      "Ja! MyDispatch ist als responsive Web-App konzipiert und funktioniert auf allen Geräten. Native mobile Apps sind für 2025 geplant.",
  },
  {
    question: "Werden regelmäßig neue Features veröffentlicht?",
    answer:
      "Ja, wir veröffentlichen alle 4-6 Wochen Updates mit neuen Features und Verbesserungen. Updates sind für alle Tarife inklusive.",
  },
];

export default function Features() {
  const navigate = useNavigate();

  return (
    <MarketingLayout currentPage="features">
      <SEOHead
        title="Features & Funktionen"
        description="Alle MyDispatch Features im Überblick: GPS-Tracking, Disposition, Kundenverwaltung, Statistiken, API-Integration und mehr. Jetzt entdecken!"
        canonical="/features"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "MyDispatch",
          applicationCategory: "BusinessApplication",
          offers: {
            "@type": "Offer",
            price: "39",
            priceCurrency: "EUR",
          },
          featureList: features.map((f) => f.title).join(", "),
        }}
        keywords={[
          "MyDispatch Features",
          "Taxi Software Funktionen",
          "Dispositionssoftware Features",
          "GPS Tracking",
          "Fuhrparkverwaltung",
        ]}
      />

      {/* Hero Section - V32.0 PREMIUM DASHBOARD */}
      <V28HeroPremium
        variant="features"
        backgroundVariant="3d-premium"
        badge={{ text: "GPS-Echtzeit-Tracking", icon: MapPin }}
        title="Vollständige Kontrolle über Ihre Fahrzeugflotte"
        subtitle="Echtzeit-GPS, Routenoptimierung & Automatische Disposition"
        description="Verfolgen Sie alle Fahrzeuge live, optimieren Sie Routen automatisch und steigern Sie die Kundenzufriedenheit durch präzise Ankunftszeiten."
        primaryCTA={{
          label: "Features entdecken",
          onClick: () => navigate("/features/business/gps-tracking"),
          icon: ArrowRight,
        }}
        showPWAButton={true}
        visual={<PremiumDashboardContent pageType="features" />}
        businessMetrics={[
          { label: "Features", value: "12+", sublabel: "im Überblick" },
          { label: "Verfügbarkeit", value: "24/7", sublabel: "Support" },
          { label: "Updates", value: "Gratis", sublabel: "für alle" },
        ]}
        trustElements={true}
      />

      {/* Feature Grid */}
      <V28MarketingSection
        background="canvas"
        title="Leistungsstarke Funktionen"
        description="Alle Features für modernes Flottenmanagement - skalierbar, DSGVO-konform und Made in Germany"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Link key={idx} to={feature.link} className="group">
              <V28MarketingCard className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer">
                {/* Hover-Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <V28IconBox
                      icon={feature.icon}
                      variant="slate"
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-sans text-lg font-semibold text-slate-900">
                          {feature.title}
                        </h3>
                        <Badge className="text-xs bg-slate-100 text-slate-700 border border-slate-300 shrink-0">
                          {feature.tariff}
                        </Badge>
                      </div>
                      <p className="font-sans text-sm text-slate-600 leading-relaxed mb-4">
                        {feature.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        <span>Details anzeigen</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </V28MarketingCard>
            </Link>
          ))}
        </div>
      </V28MarketingSection>

      {/* Feature Comparison by Tariff */}
      <V28MarketingSection
        background="white"
        title="Feature-Vergleich nach Tarif"
        description="Transparenter Überblick: Welche Features in welchem Tarif enthalten sind"
      >
        <div className="max-w-5xl mx-auto overflow-x-auto scrollbar-hide">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-4 px-4 font-sans text-sm font-semibold text-slate-900">
                  Feature
                </th>
                <th className="text-center py-4 px-4 font-sans text-sm font-semibold text-slate-900">
                  Starter
                </th>
                <th className="text-center py-4 px-4 font-sans text-sm font-semibold text-slate-900">
                  Business
                </th>
                <th className="text-center py-4 px-4 font-sans text-sm font-semibold text-slate-900">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => {
                const inStarter = feature.tariff === "Alle Tarife";
                const inBusiness =
                  feature.tariff === "Alle Tarife" || feature.tariff === "Business+";
                const inEnterprise = true;

                return (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="py-3 px-4 font-sans text-sm text-slate-700">{feature.title}</td>
                    <td className="text-center py-3 px-4">
                      {inStarter ? (
                        <CheckCircle2 className="h-5 w-5 text-slate-700 mx-auto" />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {inBusiness ? (
                        <CheckCircle2 className="h-5 w-5 text-slate-700 mx-auto" />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {inEnterprise ? (
                        <CheckCircle2 className="h-5 w-5 text-slate-700 mx-auto" />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-12">
          <V28Button variant="primary" size="lg" onClick={() => navigate("/pricing")}>
            Alle Tarife vergleichen
          </V28Button>
        </div>
      </V28MarketingSection>

      {/* FAQ Section */}
      <V28MarketingSection
        background="canvas"
        title="Häufige Fragen zu Features"
        description="Alles, was Sie über MyDispatch-Funktionen wissen müssen"
      >
        <V28MarketingCard className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-0">
            {faqItems.map((item, idx) => (
              <V28AccordionItem
                key={idx}
                value={`faq-${idx}`}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </Accordion>
        </V28MarketingCard>
      </V28MarketingSection>

      {/* Final CTA */}
      <V28MarketingSection background="white">
        <V28MarketingCard className="bg-primary text-primary-foreground text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Bereit für MyDispatch?
          </h2>
          <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 max-w-2xl mx-auto">
            Starten Sie jetzt mit allen Features. Keine Kreditkarte erforderlich.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <V28Button variant="secondary" size="lg" onClick={() => navigate("/auth?mode=signup")}>
              Jetzt starten
            </V28Button>
            <V28Button variant="secondary" size="lg" onClick={() => navigate("/contact")}>
              Beratung anfragen
            </V28Button>
          </div>
        </V28MarketingCard>
      </V28MarketingSection>
    </MarketingLayout>
  );
}
