/* ==================================================================================
   STARTER TARIF DETAIL PAGE - V28.1 COMPLIANT
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
import { Check, Rocket, MapPin, Users, FileText, Calendar } from "lucide-react";
import { STARTER_TARIFF } from "@/lib/tariff/tariff-definitions";
import { Accordion } from "@/components/ui/accordion";
import { V28AccordionItem } from "@/components/pricing/V28AccordionItem";
import { Link } from "react-router-dom";

export default function StarterDetail() {
  const includedFeatures = STARTER_TARIFF.features.filter((f) => f.included);

  return (
    <MarketingLayout currentPage="pricing">
      <SEOHead
        title="Starter-Tarif im Detail | MyDispatch"
        description="MyDispatch Starter: 39€/Monat für Einsteiger. GPS-Tracking, Disposition, Kundenverwaltung. Ideal für kleine Taxibetriebe mit bis zu 3 Fahrzeugen."
        canonical="/pricing/starter"
        keywords={[
          "Taxi Software Starter",
          "Mietwagen Software klein",
          "Dispositionssoftware Einsteiger",
          "Taxi Software 3 Fahrzeuge",
          "GPS Tracking Taxi",
        ]}
      />

      {/* Hero Section - Split Layout */}
      <V28MarketingSection background="white" className="pt-20 lg:pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Links: Text */}
          <div>
            <V28Badge variant="secondary" className="mb-6">
              Starter-Tarif
            </V28Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Perfekt für Einsteiger im Taxi- & Mietwagengeschäft
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Starten Sie mit allen essentiellen Features für professionelle Disposition,
              GPS-Tracking und Kundenverwaltung. Ideal für kleine Betriebe mit bis zu 3 Fahrzeugen.
            </p>
            <Link to="/auth?tariff=starter">
              <V28Button variant="primary" size="lg" className="w-full">
                Jetzt Starter wählen
              </V28Button>
            </Link>
          </div>

          {/* Rechts: Tarif-Card Preview */}
          <div className="bg-slate-50 p-8 rounded-2xl border-2 border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Rocket className="h-8 w-8 text-slate-700" />
              <h3 className="text-2xl font-bold text-slate-900">{STARTER_TARIFF.name}</h3>
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-slate-900">
                {STARTER_TARIFF.priceMonthlyFormatted}
              </span>
              <span className="text-slate-600">/Monat</span>
            </div>
            <ul className="space-y-3 mb-8">
              {includedFeatures.slice(0, 5).map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700">
                  <Check className="h-5 w-5 text-slate-700 shrink-0 mt-0.5" />
                  <span>{feature.name}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-500">
              Jahresabo: {STARTER_TARIFF.priceYearlyFormatted}/Jahr (20% gespart)
            </p>
          </div>
        </div>
      </V28MarketingSection>

      {/* Feature-Grid: Alle Starter-Features detailliert */}
      <V28MarketingSection
        background="canvas"
        title="Alle Starter-Features im Detail"
        description="Professionelle Disposition und Verwaltung – alles was Sie für den erfolgreichen Start brauchen"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <V28MarketingCard>
            <V28IconBox icon={MapPin} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">GPS-Tracking</h3>
            <p className="text-slate-600">
              Verfolgen Sie Ihre Fahrzeuge in Echtzeit und optimieren Sie Ihre Disposition.
            </p>
          </V28MarketingCard>

          <V28MarketingCard>
            <V28IconBox icon={FileText} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Auftragsverwaltung</h3>
            <p className="text-slate-600">
              Erfassen, verwalten und disponieren Sie Aufträge effizient und übersichtlich.
            </p>
          </V28MarketingCard>

          <V28MarketingCard>
            <V28IconBox icon={Users} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Kunden- & Fahrerverwaltung
            </h3>
            <p className="text-slate-600">
              Zentrale Verwaltung aller Kunden- und Fahrerdaten mit Kontakthistorie.
            </p>
          </V28MarketingCard>

          <V28MarketingCard>
            <V28IconBox icon={FileText} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Angebote & Rechnungen</h3>
            <p className="text-slate-600">
              Erstellen Sie professionelle Angebote und Rechnungen mit wenigen Klicks.
            </p>
          </V28MarketingCard>

          <V28MarketingCard>
            <V28IconBox icon={Calendar} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Basisdisposition</h3>
            <p className="text-slate-600">
              Einfache und intuitive Disposition Ihrer Aufträge und Fahrzeuge.
            </p>
          </V28MarketingCard>

          <V28MarketingCard>
            <V28IconBox icon={Rocket} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Info-Landingpage</h3>
            <p className="text-slate-600">
              Ihre eigene Landingpage mit Informationen zu Ihrem Unternehmen.
            </p>
          </V28MarketingCard>
        </div>
      </V28MarketingSection>

      {/* Use-Cases: Für wen ist Starter ideal? */}
      <V28MarketingSection
        background="white"
        title="Für wen ist der Starter-Tarif ideal?"
        description="Diese Unternehmen profitieren besonders vom Starter-Tarif"
      >
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-4xl mb-4">🚖</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Einzelunternehmer</h3>
            <p className="text-slate-600">
              Sie starten als Taxiunternehmer und brauchen eine professionelle Lösung für
              Disposition, Auftragserfassung und Kundenverwaltung – ohne komplizierte Einrichtung.
            </p>
          </div>
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Kleine Taxibetriebe (1-3 Fahrzeuge)
            </h3>
            <p className="text-slate-600">
              Sie haben bis zu 3 Fahrzeuge und möchten ohne hohe Investitionen professionell
              disponieren, Fahrer koordinieren und Aufträge digital verwalten.
            </p>
          </div>
        </div>
      </V28MarketingSection>

      {/* Vergleich: Starter vs. Business */}
      <V28MarketingSection
        background="canvas"
        title="Upgrade auf Business?"
        description="Mehr Fahrzeuge? Mehr Features? Dann ist Business die richtige Wahl"
      >
        <div className="max-w-4xl mx-auto">
          <V28MarketingCard>
            <p className="text-lg text-slate-600 mb-6">
              Wenn Sie mehr als 3 Fahrzeuge/Fahrer haben oder zusätzliche Features wie
              Partner-Netzwerk, Kunden-Portal, Statistiken oder API-Zugang benötigen, ist der{" "}
              <strong className="text-slate-900">Business-Tarif</strong> die richtige Wahl.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing/business">
                <V28Button variant="secondary">Business-Tarif ansehen</V28Button>
              </Link>
              <Link to="/pricing">
                <V28Button variant="secondary">Alle Tarife vergleichen</V28Button>
              </Link>
            </div>
          </V28MarketingCard>
        </div>
      </V28MarketingSection>

      {/* FAQ: Starter-spezifisch */}
      <V28MarketingSection background="white" title="Häufige Fragen zum Starter-Tarif">
        <div className="max-w-3xl mx-auto">
          <V28MarketingCard contentClassName="p-0">
            <Accordion type="single" collapsible className="w-full">
              <V28AccordionItem
                value="item-1"
                question="Kann ich später auf Business upgraden?"
                answer="Ja, jederzeit! Der Upgrade erfolgt nahtlos ohne Datenverlust. Die Differenz wird anteilig berechnet."
              />
              <V28AccordionItem
                value="item-2"
                question="Was passiert, wenn ich mehr als 3 Fahrzeuge habe?"
                answer="Sie können entweder auf Business upgraden oder das Fleet & Driver Add-On (9€/Monat pro zusätzlichem Fahrzeug/Fahrer) nutzen."
              />
              <V28AccordionItem
                value="item-3"
                question="Gibt es eine Kündigungsfrist?"
                answer="Nein. Monatliche Abos sind jederzeit kündbar. Jahresabos haben eine 12-Monats-Laufzeit mit automatischer Verlängerung."
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
            Bereit für Ihren Start?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Registrieren Sie sich jetzt und starten Sie in weniger als 5 Minuten mit professioneller
            Taxi-Disposition.
          </p>
          <Link to="/auth?tariff=starter">
            <V28Button variant="primary" size="lg" className="w-full">
              Jetzt Starter-Tarif wählen
            </V28Button>
          </Link>
          <p className="text-sm text-slate-500 mt-4">Monatlich kündbar · Keine Setup-Gebühr</p>
        </div>
      </V28MarketingSection>
    </MarketingLayout>
  );
}
