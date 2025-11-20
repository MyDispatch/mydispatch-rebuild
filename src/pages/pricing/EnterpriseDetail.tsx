/* ==================================================================================
   ENTERPRISE TARIF DETAIL PAGE - V28.1 COMPLIANT
   ==================================================================================
   ✅ V28.1 Design System (Slate-Palette)
   ✅ SEO-optimiert (Schema.org, Meta-Tags)
   ✅ Responsive & Mobile-first
   ✅ Alle Daten aus tariff-definitions.ts
   ✅ Kein Preis - nur "Kontakt aufnehmen" CTA
   ================================================================================== */

import { SEOHead } from '@/components/shared/SEOHead';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { V28MarketingSection } from '@/components/design-system/V28MarketingSection';
import { V28MarketingCard } from '@/components/design-system/V28MarketingCard';
import { V28IconBox } from '@/components/design-system/V28IconBox';
import { V28Button } from '@/components/design-system/V28Button';
import { V28Badge } from '@/components/design-system/V28Badge';
import { Check, Crown, Shield, Cpu, Headphones, Code, Settings } from 'lucide-react';
import { ENTERPRISE_TARIFF } from '@/lib/tariff/tariff-definitions';
import { Accordion } from '@/components/ui/accordion';
import { V28AccordionItem } from '@/components/pricing/V28AccordionItem';
import { Link } from 'react-router-dom';

export default function EnterpriseDetail() {
  const includedFeatures = ENTERPRISE_TARIFF.features.filter(f => f.included);

  return (
    <MarketingLayout currentPage="pricing">
      <SEOHead
        title="Enterprise-Tarif im Detail | MyDispatch"
        description="MyDispatch Enterprise: Individuelle Lösungen für Großflotten (15+ Fahrzeuge). White-Label, API-Zugang, Dedicated Support, maßgeschneiderte Features. Preis auf Anfrage."
        canonical="/pricing/enterprise"
        keywords={[
          'Taxi Software Enterprise',
          'Mietwagen Software Großflotte',
          'Dispositionssoftware individuell',
          'Taxi Software White Label',
          'Custom Development Taxi',
        ]}
      />

      {/* Hero Section - Split Layout */}
      <V28MarketingSection background="white" className="pt-20 lg:pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Links: Text */}
          <div>
            <V28Badge variant="primary" className="mb-6">
              Enterprise-Tarif
            </V28Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Maßgeschneiderte Lösungen für Großflotten
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Alle Business-Features plus White-Label-Branding, individuelle 
              Anpassungen, dedizierter Account Manager und 24/7 Premium-Support. 
              Perfekt für große Flotten ab 15 Fahrzeugen.
            </p>
            <Link to="/contact?subject=enterprise">
              <V28Button variant="primary" size="lg" className="w-full">
                Jetzt Beratungstermin anfragen
              </V28Button>
            </Link>
          </div>

          {/* Rechts: Tarif-Card Preview */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border-2 border-slate-700 shadow-2xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="h-8 w-8 text-yellow-400" />
              <h3 className="text-2xl font-bold">
                {ENTERPRISE_TARIFF.name}
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold">
                Auf Anfrage
              </span>
            </div>
            <ul className="space-y-3 mb-8">
              {includedFeatures.slice(0, 6).map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-slate-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-200">{feature.name}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-400">
              Individuelle Preisgestaltung basierend auf Ihren Anforderungen
            </p>
          </div>
        </div>
      </V28MarketingSection>

      {/* Feature-Grid: Alle Enterprise-Features detailliert */}
      <V28MarketingSection 
        background="canvas" 
        title="Alle Enterprise-Features im Detail"
        description="Maximale Flexibilität und individueller Support für Ihr Unternehmen"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <V28MarketingCard>
            <V28IconBox icon={Shield} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              White-Label Landingpages
            </h3>
            <p className="text-slate-600">
              Vollständig personalisierbare Landingpages mit Ihrem Branding und Logo.
            </p>
          </V28MarketingCard>

          <V28MarketingCard>
            <V28IconBox icon={Code} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Custom Integrationen
            </h3>
            <p className="text-slate-600">
              Maßgeschneiderte Schnittstellen zu Ihren bestehenden Systemen.
            </p>
          </V28MarketingCard>

          <V28MarketingCard>
            <V28IconBox icon={Headphones} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Dedizierter Account Manager
            </h3>
            <p className="text-slate-600">
              Ihr persönlicher Ansprechpartner für alle Fragen und Anliegen.
            </p>
          </V28MarketingCard>

          <V28MarketingCard>
            <V28IconBox icon={Shield} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              SLA-Garantie
            </h3>
            <p className="text-slate-600">
              Garantierte Verfügbarkeit und Reaktionszeiten für Ihr Business.
            </p>
          </V28MarketingCard>

          <V28MarketingCard>
            <V28IconBox icon={Settings} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Custom Development
            </h3>
            <p className="text-slate-600">
              Individuelle Features und Anpassungen nach Ihren Anforderungen.
            </p>
          </V28MarketingCard>

          <V28MarketingCard>
            <V28IconBox icon={Cpu} />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              24/7 Premium-Support
            </h3>
            <p className="text-slate-600">
              Rund-um-die-Uhr Support mit garantierten Reaktionszeiten.
            </p>
          </V28MarketingCard>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-6">
            ... und alle Business-Features: Partner-Management, Kunden-Portal, 
            Statistiken, API-Zugang, Team-Chat, Workflow-Automatisierung, GPS-Tracking, 
            Auftragsverwaltung und vieles mehr
          </p>
        </div>
      </V28MarketingSection>

      {/* Use-Cases: Für wen ist Enterprise ideal? */}
      <V28MarketingSection 
        background="white" 
        title="Für wen ist der Enterprise-Tarif ideal?"
        description="Diese Unternehmen profitieren besonders vom Enterprise-Tarif"
      >
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-4xl mb-4">🚖</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Große Flotten (15+ Fahrzeuge)
            </h3>
            <p className="text-slate-600">
              Sie betreiben eine große Fahrzeugflotte und benötigen individuelle 
              Anpassungen, White-Label-Branding und dedizierten Support.
            </p>
          </div>
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Taxizentralen & Konzern-Fuhrparks
            </h3>
            <p className="text-slate-600">
              Sie verwalten mehrere Standorte oder Tochterunternehmen und benötigen 
              eine zentrale Plattform mit individuellen Integrationen.
            </p>
          </div>
        </div>
      </V28MarketingSection>

      {/* Kontakt-CTA Section */}
      <V28MarketingSection 
        background="canvas" 
        title="Sprechen Sie mit unserem Sales-Team"
        description="Wir analysieren Ihre Anforderungen und erstellen ein maßgeschneidertes Angebot"
      >
        <div className="max-w-4xl mx-auto">
          <V28MarketingCard>
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl mb-2">📞</div>
                  <h4 className="font-semibold text-slate-900 mb-2">1. Erstkontakt</h4>
                  <p className="text-sm text-slate-600">
                    Kontaktieren Sie uns für ein unverbindliches Erstgespräch
                  </p>
                </div>
                <div>
                  <div className="text-4xl mb-2">🔍</div>
                  <h4 className="font-semibold text-slate-900 mb-2">2. Bedarfsanalyse</h4>
                  <p className="text-sm text-slate-600">
                    Wir analysieren gemeinsam Ihre Anforderungen und Prozesse
                  </p>
                </div>
                <div>
                  <div className="text-4xl mb-2">📋</div>
                  <h4 className="font-semibold text-slate-900 mb-2">3. Individuelles Angebot</h4>
                  <p className="text-sm text-slate-600">
                    Sie erhalten ein maßgeschneidertes Angebot mit Preisen
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/contact?subject=enterprise">
                  <V28Button variant="primary" size="lg">
                    Jetzt Beratungstermin anfragen
                  </V28Button>
                </Link>
                <Link to="/pricing">
                  <V28Button variant="secondary" size="lg">
                    Zurück zur Tarifübersicht
                  </V28Button>
                </Link>
              </div>
            </div>
          </V28MarketingCard>
        </div>
      </V28MarketingSection>

      {/* FAQ: Enterprise-spezifisch */}
      <V28MarketingSection 
        background="white" 
        title="Häufige Fragen zum Enterprise-Tarif"
      >
        <div className="max-w-3xl mx-auto">
          <V28MarketingCard contentClassName="p-0">
            <Accordion type="single" collapsible className="w-full">
              <V28AccordionItem
                value="item-1"
                question="Wie läuft die Bedarfsanalyse ab?"
                answer="In einem persönlichen Gespräch (vor Ort oder online) analysieren wir gemeinsam Ihre Prozesse, Anforderungen und Ziele. Auf Basis dieser Analyse erstellen wir ein individuelles Angebot."
              />
              <V28AccordionItem
                value="item-2"
                question="Was bedeutet White-Label?"
                answer="White-Label bedeutet, dass Sie die MyDispatch-Plattform mit Ihrem eigenen Branding (Logo, Farben, Domain) nutzen können. Für Ihre Kunden sieht es aus wie Ihre eigene Plattform."
              />
              <V28AccordionItem
                value="item-3"
                question="Welche Custom-Integrationen sind möglich?"
                answer="Wir können MyDispatch an praktisch jedes System anbinden: ERP, Buchhaltungssoftware, andere Dispositionssysteme, externe APIs und vieles mehr. Sprechen Sie uns an!"
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
            Bereit für eine individuelle Lösung?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Lassen Sie uns gemeinsam die perfekte Lösung für Ihr Unternehmen entwickeln. 
            Kontaktieren Sie unser Sales-Team noch heute.
          </p>
          <Link to="/contact?subject=enterprise">
            <V28Button variant="primary" size="lg" className="w-full">
              Jetzt Beratungstermin anfragen
            </V28Button>
          </Link>
          <p className="text-sm text-slate-500 mt-4">
            Unverbindliche Beratung · Individuelle Preisgestaltung
          </p>
        </div>
      </V28MarketingSection>
    </MarketingLayout>
  );
}
