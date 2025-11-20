/* ==================================================================================
   BUSINESS TARIF DETAIL PAGE - V28.1 COMPLIANT
   ==================================================================================
   ✅ V28.1 Design System (Slate-Palette)
   ✅ SEO-optimiert (Schema.org, Meta-Tags)
   ✅ Responsive & Mobile-first
   ✅ Alle Daten aus tariff-definitions.ts
   ================================================================================== */

import { SEOHead } from "@/components/shared/SEOHead";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { V28MarketingSection } from "@/components/design-system/V28MarketingSection";
import { V28MarketingCard } from "@/components/design-system/V28MarketingCard";
import { V28IconBox } from "@/components/design-system/V28IconBox";
import { V28Button } from "@/components/design-system/V28Button";
import { V28Badge } from "@/components/design-system/V28Badge";
import { Check, Building2, Users, Truck, BarChart3, Globe, Zap } from "lucide-react";
import { BUSINESS_TARIFF } from "@/lib/tariff/tariff-definitions";
import { Accordion } from "@/components/ui/accordion";
import { V28AccordionItem } from "@/components/pricing/V28AccordionItem";
import { Link } from "react-router-dom";

export default function BusinessDetail() {
  const includedFeatures = BUSINESS_TARIFF.features.filter((f) => f.included);

  return (
    <MarketingLayout currentPage="pricing">
      <SEOHead
        title="Business-Tarif im Detail | MyDispatch"
        description="MyDispatch Business: 99€/Monat für wachsende Betriebe. Alle Starter-Features plus Partner-Netzwerk, Kunden-Portal, Statistiken, API-Zugang. Unbegrenzte Fahrzeuge."
        canonical="/pricing/business"
        keywords={[
          "Taxi Software Business",
          "Mietwagen Software Profi",
          "Dispositionssoftware Partner",
          "Taxi Software unbegrenzt",
          "GPS Tracking Premium",
        ]}
      />

      {/* Hero Section - Split Layout */}
      <V28MarketingSection background="white" className="pt-20 lg:pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Links: Text */}
          <div>
            <V28Badge variant="primary" className="mb-6">
              {BUSINESS_TARIFF.badge || "Business-Tarif"}
            </V28Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Für wachsende Unternehmen mit Profi-Features
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Alle Starter-Features plus Partner-Netzwerk, Kunden-Portal, Statistiken, API-Zugang
              und vieles mehr. Unbegrenzte Fahrzeuge und Fahrer – perfekt für mittelgroße Betriebe.
            </p>
            <Link to="/auth?tariff=business">
              <V28Button variant="primary" size="lg" className="w-full">
                Jetzt Business wählen
              </V28Button>
            </Link>
          </div>

          {/* Rechts: Tarif-Card Preview */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border-2 border-slate-300 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="h-8 w-8 text-slate-700" />
              <h3 className="text-2xl font-bold text-slate-900">{BUSINESS_TARIFF.name}</h3>
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-slate-900">
                {BUSINESS_TARIFF.priceMonthlyFormatted}
              </span>
              <span className="text-slate-600">/Monat</span>
            </div>
            <ul className="space-y-3 mb-8">
              {includedFeatures.slice(0, 6).map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700">
                  <Check className="h-5 w-5 text-slate-700 shrink-0 mt-0.5" />
                  <span className="font-medium">{feature.name}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-500">
              Jahresabo: {BUSINESS_TARIFF.priceYearlyFormatted}/Jahr (20% gespart)
            </p>
          </div>
        </div>
      </V28MarketingSection>

      {/* Feature-Grid: Alle Business-Features detailliert */}
      <V28MarketingSection
        background="canvas"
        title="Alle Business-Features im Detail"
        description="Professionelle Lösung für wachsende Taxi- und Mietwagenunternehmen"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <V28MarketingCard>
            <V28IconBox icon={Truck} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Partner-Management</h3>
            <p className="text-slate-600">
              Verwalten Sie Partner-Unternehmen und vergeben Sie Aufträge im Netzwerk.
            </p>
          </V28MarketingCard>

          <V28MarketingCard>
            <V28IconBox icon={Globe} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Kunden-Portal</h3>
            <p className="text-slate-600">
              Ihre Kunden können online Aufträge einsehen, buchen und verwalten.
            </p>
          </V28MarketingCard>

          <V28MarketingCard>
            <V28IconBox icon={BarChart3} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Statistiken & Reports</h3>
            <p className="text-slate-600">
              Detaillierte Auswertungen zu Umsätzen, Auslastung und Performance.
            </p>
          </V28MarketingCard>

          <V28MarketingCard>
            <V28IconBox icon={Zap} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">API-Zugang</h3>
            <p className="text-slate-600">
              Integrieren Sie MyDispatch in Ihre bestehenden Systeme.
            </p>
          </V28MarketingCard>

          <V28MarketingCard>
            <V28IconBox icon={Users} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Team-Chat</h3>
            <p className="text-slate-600">
              Kommunizieren Sie in Echtzeit mit Ihrem Team direkt in der Plattform.
            </p>
          </V28MarketingCard>

          <V28MarketingCard>
            <V28IconBox icon={Building2} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Workflow-Automatisierung</h3>
            <p className="text-slate-600">
              Automatisieren Sie wiederkehrende Aufgaben mit n8n-Integration.
            </p>
          </V28MarketingCard>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-6">
            ... und alle Starter-Features: GPS-Tracking, Auftragsverwaltung, Angebote & Rechnungen,
            Kunden-/Fahrerverwaltung, Info-Landingpage
          </p>
        </div>
      </V28MarketingSection>

      {/* Use-Cases: Für wen ist Business ideal? */}
      <V28MarketingSection
        background="white"
        title="Für wen ist der Business-Tarif ideal?"
        description="Diese Unternehmen profitieren besonders vom Business-Tarif"
      >
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-4xl mb-4">🚕</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Mittelgroße Betriebe (4-15 Fahrzeuge)
            </h3>
            <p className="text-slate-600">
              Sie haben mehr als 3 Fahrzeuge und benötigen erweiterte Features wie Partner-Netzwerk,
              Statistiken und unbegrenzte Fahrzeug-/Fahrerverwaltung.
            </p>
          </div>
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Unternehmen mit Partnern</h3>
            <p className="text-slate-600">
              Sie arbeiten mit Partner-Unternehmen zusammen und möchten Aufträge im Netzwerk
              vergeben und verwalten.
            </p>
          </div>
        </div>
      </V28MarketingSection>

      {/* Vergleich: Business vs. Enterprise */}
      <V28MarketingSection
        background="canvas"
        title="Upgrade auf Enterprise?"
        description="Großflotte? Individuelle Anforderungen? Dann ist Enterprise die richtige Wahl"
      >
        <div className="max-w-4xl mx-auto">
          <V28MarketingCard>
            <p className="text-lg text-slate-600 mb-6">
              Wenn Sie mehr als 15 Fahrzeuge haben oder individuelle Features wie
              White-Label-Landingpages, Custom-Integrationen oder einen dedizierten Account Manager
              benötigen, ist der <strong className="text-slate-900">Enterprise-Tarif</strong> die
              richtige Wahl.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing/enterprise">
                <V28Button variant="secondary">Enterprise-Tarif ansehen</V28Button>
              </Link>
              <Link to="/pricing">
                <V28Button variant="secondary">Alle Tarife vergleichen</V28Button>
              </Link>
            </div>
          </V28MarketingCard>
        </div>
      </V28MarketingSection>

      {/* FAQ: Business-spezifisch */}
      <V28MarketingSection background="white" title="Häufige Fragen zum Business-Tarif">
        <div className="max-w-3xl mx-auto">
          <V28MarketingCard contentClassName="p-0">
            <Accordion type="single" collapsible className="w-full">
              <V28AccordionItem
                value="item-1"
                question="Wie funktioniert das Partner-Netzwerk?"
                answer="Sie können Partner-Unternehmen in MyDispatch anlegen und Aufträge an diese vergeben. Partner können in ihrem eigenen Account die Aufträge einsehen und bearbeiten."
              />
              <V28AccordionItem
                value="item-2"
                question="Ist die Anzahl der Fahrzeuge wirklich unbegrenzt?"
                answer="Ja, im Business-Tarif gibt es keine Begrenzung bei Fahrzeugen und Fahrern. Sie zahlen einen festen Monatspreis, egal wie viele Fahrzeuge Sie haben."
              />
              <V28AccordionItem
                value="item-3"
                question="Kann ich später auf Enterprise upgraden?"
                answer="Ja, jederzeit! Der Upgrade erfolgt nahtlos ohne Datenverlust. Wir beraten Sie gerne zu den Vorteilen des Enterprise-Tarifs."
                isLast
              />
            </Accordion>
          </V28MarketingCard>
        </div>
      </V28MarketingSection>

      {/* Final CTA */}
      <V28MarketingSection background="canvas">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Bereit für professionelles Wachstum?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Registrieren Sie sich jetzt und nutzen Sie alle Business-Features für Ihr wachsendes
            Taxi- oder Mietwagenunternehmen.
          </p>
          <Link to="/auth?tariff=business">
            <V28Button variant="primary" size="lg" className="w-full">
              Jetzt Business-Tarif wählen
            </V28Button>
          </Link>
          <p className="text-sm text-slate-500 mt-4">Monatlich kündbar · Keine Setup-Gebühr</p>
        </div>
      </V28MarketingSection>
    </MarketingLayout>
  );
}
