/* ==================================================================================
   NUTZUNGSBEDINGUNGEN - TERMS OF SERVICE
   ==================================================================================
   ✅ Detaillierte Terms of Service für MyDispatch
   ✅ Service Level Agreements (SLAs)
   ✅ Nutzungsrechte und Haftung
   ✅ V28.1 Design System
   ================================================================================== */

import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { V28HeroPremium } from '@/components/hero/V28HeroPremium';
import { PremiumDashboardContent } from '@/components/dashboard/PremiumDashboardContent';
import { V28MarketingSection } from '@/components/design-system/V28MarketingSection';
import { V28MarketingCard } from '@/components/design-system/V28MarketingCard';
import { SEOHead } from '@/components/shared/SEOHead';
import { FileCheck, Shield, AlertTriangle, Clock, FileText } from 'lucide-react';

export default function Nutzungsbedingungen() {
  return (
    <MarketingLayout currentPage="legal">
      <SEOHead
        title="Nutzungsbedingungen"
        description="Terms of Service für die Nutzung der MyDispatch-Software"
        canonical="/nutzungsbedingungen"
      />

      {/* Hero Section */}
      <V28HeroPremium
        variant="home"
        backgroundVariant="3d-premium"
        badge={{ text: "Terms of Service", icon: FileText }}
        title="Nutzungsbedingungen"
        subtitle="Terms of Service für die Nutzung der MyDispatch-Software"
        description="Vertragsrecht, Leistungsumfang, Service Level Agreements und Nutzungsrechte. Transparent, rechtssicher und fair für alle Beteiligten."
        primaryCTA={{
          label: 'Kontakt aufnehmen',
          onClick: () => window.location.href = '/contact',
          icon: FileText
        }}
        showPWAButton={true}
        visual={
          <PremiumDashboardContent pageType="nutzungsbedingungen" />
        }
        businessMetrics={[
          { label: 'Rechtssicherheit', value: '100%', sublabel: 'DSGVO-konform' },
          { label: 'Verfügbarkeit', value: '99.9%', sublabel: 'garantiert' },
          { label: 'Transparenz', value: 'A+', sublabel: 'vollständig' }
        ]}
        trustElements={true}
      />

      <V28MarketingSection background="canvas">
          <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Inhaltsverzeichnis */}
            <V28MarketingCard className="ring-2 ring-slate-300 shadow-xl">
              <h2 className="font-sans text-xl font-semibold text-slate-900 mb-4">
                Inhaltsverzeichnis
              </h2>
              <nav className="grid gap-2">
                {[
                  '1. Geltungsbereich',
                  '2. Vertragsschluss und Registrierung',
                  '3. Leistungsumfang',
                  '4. Service Level Agreement (SLA)',
                  '5. Nutzungsrechte und Lizenz',
                  '6. Pflichten des Nutzers',
                  '7. Preise und Zahlung',
                  '8. Haftung und Gewährleistung',
                  '9. Datenschutz',
                  '10. Vertragslaufzeit und Kündigung'
                ].map((item, index) => (
                  <a
                    key={index}
                    href={`#section${index + 1}`}
                    className="font-sans text-sm text-slate-700 hover:text-slate-900 hover:underline transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </V28MarketingCard>

            {/* Section 1 */}
            <div id="section1">
            <V28MarketingCard className="transition-all duration-300 hover:shadow-2xl">
              <h2 className="font-sans text-xl font-semibold text-slate-900 mb-4">
                1. Geltungsbereich
              </h2>
              <div className="space-y-4">
                <p className="font-sans text-sm text-slate-600">
                  Diese Nutzungsbedingungen gelten für die Nutzung der MyDispatch-Software (nachfolgend "Software") durch 
                  Unternehmen im Taxi-, Mietwagen- und Limousinenverkehr (nachfolgend "Nutzer" oder "Kunde").
                </p>
                <p className="font-sans text-sm text-slate-600">
                  Anbieter der Software ist RideHub Solutions, Ibrahim Simsek, Ensbachmühle 4, 94571 Schaufling, Deutschland.
                </p>
              </div>
            </V28MarketingCard>
            </div>

            {/* Section 2 */}
            <div id="section2">
            <V28MarketingCard className="transition-all duration-300 hover:shadow-2xl">
              <h2 className="font-sans text-xl font-semibold text-slate-900 mb-4">
                2. Vertragsschluss und Registrierung
              </h2>
              <div className="space-y-4">
                <p className="font-sans text-sm text-slate-600">
                  <strong>2.1 Registrierung:</strong> Die Nutzung der Software setzt eine Registrierung voraus. Mit Absenden 
                  des Registrierungsformulars gibt der Nutzer ein verbindliches Angebot zum Abschluss eines Nutzungsvertrages ab.
                </p>
                <p className="font-sans text-sm text-slate-600">
                  <strong>2.2 Vertragsannahme:</strong> Der Vertrag kommt zustande, wenn wir die Registrierung per E-Mail 
                  bestätigen und die Zugangsdaten zur Verfügung stellen.
                </p>
                <p className="font-sans text-sm text-slate-600">
                  <strong>2.3 Geschäftsfähigkeit:</strong> Der Nutzer versichert, geschäftsfähig zu sein und im Namen eines 
                  rechtlich existierenden Unternehmens zu handeln.
                </p>
              </div>
            </V28MarketingCard>
            </div>

            {/* Section 3 */}
            <div id="section3">
            <V28MarketingCard className="transition-all duration-300 hover:shadow-2xl">
              <h2 className="font-sans text-xl font-semibold text-slate-900 mb-4">
                3. Leistungsumfang
              </h2>
              <div className="space-y-4">
                <p className="font-sans text-sm text-slate-600">
                  <strong>3.1 Kernfunktionen:</strong> Die Software umfasst folgende Funktionen:
                </p>
                <ul className="list-disc list-inside font-sans text-sm text-slate-600 space-y-2 ml-4">
                  <li>GPS-Echtzeit-Tracking von Fahrzeugen</li>
                  <li>Intelligente Auftragsdisposition</li>
                  <li>Kundenverwaltung und Buchungssystem</li>
                  <li>Automatische Rechnungsstellung</li>
                  <li>Fahrer- und Fahrzeugverwaltung</li>
                  <li>Reporting und Analytics</li>
                </ul>
                <p className="font-sans text-sm text-slate-600">
                  <strong>3.2 Tarifabhängige Funktionen:</strong> Einige Funktionen sind nur in bestimmten Tarifen 
                  (Business, Enterprise) verfügbar. Details siehe Tarifübersicht.
                </p>
              </div>
            </V28MarketingCard>
            </div>

            {/* Section 4 - SLA */}
            <div id="section4">
            <V28MarketingCard className="transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-slate-700" />
                <h2 className="font-sans text-xl font-semibold text-slate-900">
                  4. Service Level Agreement (SLA)
                </h2>
              </div>
              <div className="space-y-4">
                <p className="font-sans text-sm text-slate-600">
                  <strong>4.1 Verfügbarkeit (Uptime):</strong>
                </p>
                <ul className="list-disc list-inside font-sans text-sm text-slate-600 space-y-2 ml-4">
                  <li><strong>Starter:</strong> 99,0% (durchschnittlich 7,2h Ausfallzeit/Monat)</li>
                  <li><strong>Business:</strong> 99,5% (durchschnittlich 3,6h Ausfallzeit/Monat)</li>
                  <li><strong>Enterprise:</strong> 99,9% (durchschnittlich 43min Ausfallzeit/Monat)</li>
                </ul>
                <p className="font-sans text-sm text-slate-600">
                  <strong>4.2 Geplante Wartungsfenster:</strong> Wartungsarbeiten werden mind. 72h vorher angekündigt und 
                  finden außerhalb der Hauptgeschäftszeiten (nachts 02:00-05:00 Uhr) statt.
                </p>
                <p className="font-sans text-sm text-slate-600">
                  <strong>4.3 Support-Reaktionszeiten:</strong>
                </p>
                <ul className="list-disc list-inside font-sans text-sm text-slate-600 space-y-2 ml-4">
                  <li><strong>Starter:</strong> E-Mail-Support, Reaktionszeit 24h (Mo-Fr)</li>
                  <li><strong>Business:</strong> E-Mail + Telefon, Reaktionszeit 4h (Mo-Sa)</li>
                  <li><strong>Enterprise:</strong> Priority-Support, Reaktionszeit 1h (24/7)</li>
                </ul>
              </div>
            </V28MarketingCard>
            </div>

            {/* Section 5 */}
            <div id="section5">
            <V28MarketingCard className="transition-all duration-300 hover:shadow-2xl">
              <h2 className="font-sans text-xl font-semibold text-slate-900 mb-4">
                5. Nutzungsrechte und Lizenz
              </h2>
              <div className="space-y-4">
                <p className="font-sans text-sm text-slate-600">
                  <strong>5.1 Nutzungsrecht:</strong> Der Nutzer erhält ein nicht-exklusives, nicht übertragbares, auf die 
                  Vertragslaufzeit begrenztes Recht zur Nutzung der Software.
                </p>
                <p className="font-sans text-sm text-slate-600">
                  <strong>5.2 Verbotene Nutzung:</strong> Folgendes ist untersagt:
                </p>
                <ul className="list-disc list-inside font-sans text-sm text-slate-600 space-y-2 ml-4">
                  <li>Reverse Engineering, Dekompilierung oder Disassemblierung</li>
                  <li>Vermietung oder Weiterlizenzierung an Dritte</li>
                  <li>Entfernung von Copyright-Hinweisen oder Marken</li>
                  <li>Nutzung für illegale Zwecke</li>
              </ul>
              </div>
            </V28MarketingCard>
            </div>

            {/* Section 6 */}
            <div id="section6">
            <V28MarketingCard className="transition-all duration-300 hover:shadow-2xl">
              <h2 className="font-sans text-xl font-semibold text-slate-900 mb-4">
                6. Pflichten des Nutzers
              </h2>
              <div className="space-y-4">
                <p className="font-sans text-sm text-slate-600">
                  <strong>6.1 Zugangsdaten:</strong> Der Nutzer ist verpflichtet, seine Zugangsdaten geheim zu halten und 
                  nicht an Dritte weiterzugeben.
                </p>
                <p className="font-sans text-sm text-slate-600">
                  <strong>6.2 Datenpflege:</strong> Der Nutzer ist für die Richtigkeit und Aktualität der von ihm eingegebenen 
                  Daten verantwortlich.
                </p>
                <p className="font-sans text-sm text-slate-600">
                  <strong>6.3 Compliance:</strong> Der Nutzer verpflichtet sich, alle relevanten Gesetze (insbesondere PBefG, 
                  DSGVO) einzuhalten.
                </p>
              </div>
            </V28MarketingCard>
            </div>

            {/* Section 7 */}
            <div id="section7">
            <V28MarketingCard className="transition-all duration-300 hover:shadow-2xl">
              <h2 className="font-sans text-xl font-semibold text-slate-900 mb-4">
                7. Preise und Zahlung
              </h2>
              <div className="space-y-4">
                <p className="font-sans text-sm text-slate-600">
                  <strong>7.1 Preise:</strong> Es gelten die auf der Website angegebenen Preise zum Zeitpunkt der Bestellung. 
                  Alle Preise verstehen sich zzgl. gesetzlicher MwSt.
                </p>
                <p className="font-sans text-sm text-slate-600">
                  <strong>7.2 Zahlungsweise:</strong> Die Zahlung erfolgt monatlich oder jährlich im Voraus per SEPA-Lastschrift, 
                  Kreditkarte oder Rechnung.
                </p>
                <p className="font-sans text-sm text-slate-600">
                  <strong>7.3 Zahlungsverzug:</strong> Bei Zahlungsverzug behalten wir uns vor, den Zugang zur Software zu 
                  sperren. Der Nutzer ist zur Zahlung von Verzugszinsen verpflichtet.
                </p>
              </div>
            </V28MarketingCard>
            </div>

            {/* Section 8 */}
            <div id="section8">
            <V28MarketingCard className="transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-slate-700" />
                <h2 className="font-sans text-xl font-semibold text-slate-900">
                  8. Haftung und Gewährleistung
                </h2>
              </div>
              <div className="space-y-4">
                <p className="font-sans text-sm text-slate-600">
                  <strong>8.1 Gewährleistung:</strong> Wir gewährleisten, dass die Software im Wesentlichen den vertraglich 
                  vereinbarten Funktionen entspricht.
                </p>
                <p className="font-sans text-sm text-slate-600">
                  <strong>8.2 Haftungsbeschränkung:</strong> Wir haften nur für Vorsatz und grobe Fahrlässigkeit sowie für 
                  die Verletzung wesentlicher Vertragspflichten (Kardinalpflichten). Bei leichter Fahrlässigkeit ist die 
                  Haftung auf typische, vorhersehbare Schäden begrenzt.
                </p>
                <p className="font-sans text-sm text-slate-600">
                  <strong>8.3 Datensicherung:</strong> Der Nutzer ist selbst für regelmäßige Backups seiner Daten verantwortlich. 
                  Wir übernehmen keine Haftung für Datenverlust.
                </p>
              </div>
            </V28MarketingCard>
            </div>

            {/* Section 9 */}
            <div id="section9">
            <V28MarketingCard className="transition-all duration-300 hover:shadow-2xl">
              <h2 className="font-sans text-xl font-semibold text-slate-900 mb-4">
                9. Datenschutz
              </h2>
              <div className="space-y-4">
                <p className="font-sans text-sm text-slate-600">
                  Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung, die Bestandteil dieser 
                  Nutzungsbedingungen ist. Details siehe{' '}
                  <a href="/datenschutz" className="text-primary hover:underline">
                    Datenschutzerklärung
                  </a>.
                </p>
              </div>
            </V28MarketingCard>
            </div>

            {/* Section 10 */}
            <div id="section10">
            <V28MarketingCard className="transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-slate-700" />
                <h2 className="font-sans text-xl font-semibold text-slate-900">
                  10. Vertragslaufzeit und Kündigung
                </h2>
              </div>
              <div className="space-y-4">
                <p className="font-sans text-sm text-slate-600">
                  <strong>10.1 Mindestlaufzeit:</strong> Der Vertrag wird auf unbestimmte Zeit geschlossen. Es gibt keine 
                  Mindestlaufzeit.
                </p>
                <p className="font-sans text-sm text-slate-600">
                  <strong>10.2 Ordentliche Kündigung:</strong> Beide Parteien können den Vertrag mit einer Frist von 30 Tagen 
                  zum Monatsende kündigen.
                </p>
                <p className="font-sans text-sm text-slate-600">
                  <strong>10.3 Außerordentliche Kündigung:</strong> Das Recht zur außerordentlichen Kündigung aus wichtigem 
                  Grund bleibt unberührt. Ein wichtiger Grund liegt insbesondere vor bei:
                </p>
                <ul className="list-disc list-inside font-sans text-sm text-slate-600 space-y-2 ml-4">
                  <li>Zahlungsverzug von mehr als 2 Monaten</li>
                  <li>Schwerwiegenden Verstößen gegen diese Nutzungsbedingungen</li>
                  <li>Insolvenz einer Partei</li>
                </ul>
                <p className="font-sans text-sm text-slate-600">
                  <strong>10.4 Datenexport:</strong> Nach Kündigung haben Sie 30 Tage Zeit, Ihre Daten zu exportieren. 
                  Danach werden alle Daten DSGVO-konform gelöscht.
                </p>
              </div>
            </V28MarketingCard>
            </div>

            {/* Footer Note */}
            <div className="mt-12 text-center text-sm text-slate-500">
              <p>Stand: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long' })}</p>
              <p className="mt-2">Diese Nutzungsbedingungen unterliegen deutschem Recht.</p>
            </div>
          </div>
        </div>
      </V28MarketingSection>
    </MarketingLayout>
  );
}
