/* ==================================================================================
   V28.1 TERMS - PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ V28 Design System Components
   ✅ Slate-Farbpalette (Gray-Blue)
   ✅ Konsistente Layout-Pattern
   ================================================================================== */

import { SEOHead } from '@/components/shared/SEOHead';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { V28HeroPremium } from '@/components/hero/V28HeroPremium';
import { PremiumDashboardContent } from '@/components/dashboard/PremiumDashboardContent';
import { V28MarketingSection } from '@/components/design-system/V28MarketingSection';
import { V28MarketingCard } from '@/components/design-system/V28MarketingCard';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <MarketingLayout currentPage="legal">
      <SEOHead 
        title="Nutzungsbedingungen"
        description="Nutzungsbedingungen für MyDispatch - Die professionelle Taxi & Mietwagen Dispositionssoftware"
        canonical="/terms"
      />

      {/* Hero Section */}
      <V28HeroPremium
        variant="home"
        backgroundVariant="3d-premium"
        badge={{ text: "Terms of Service", icon: FileText }}
        title="Nutzungsbedingungen"
        subtitle="Stand: 14. Oktober 2025"
        description="Transparente und faire Bedingungen für die Nutzung von MyDispatch. Vertragsrecht, Leistungsumfang, Service Level Agreements und Nutzungsrechte."
        primaryCTA={{
          label: 'Kontakt aufnehmen',
          onClick: () => navigate('/contact'),
          icon: FileText
        }}
        showPWAButton={true}
        visual={
          <PremiumDashboardContent pageType="nutzungsbedingungen" />
        }
        businessMetrics={[
          { label: 'Rechtssicherheit', value: '100%', sublabel: 'DSGVO-konform' },
          { label: 'Verfügbarkeit', value: '99%', sublabel: 'garantiert' },
          { label: 'Transparenz', value: 'A+', sublabel: 'vollständig' }
        ]}
        trustElements={true}
      />

      {/* Content */}
      <V28MarketingSection background="white">
        <V28MarketingCard>
          <div className="space-y-8 md:space-y-12">
            {/* 1. Geltungsbereich */}
            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                1. Geltungsbereich
              </h2>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed">
                Diese Nutzungsbedingungen regeln die Nutzung der MyDispatch-Plattform, einer Software-as-a-Service (SaaS) 
                Lösung für Taxi- und Mietwagenunternehmen, betrieben von RideHub Solutions, Inhaber Ibrahim SIMSEK, 
                Ensbachmühle 4, D-94571 Schaufling, Deutschland.
              </p>
            </section>

            {/* 2. Vertragsgegenstand */}
            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                2. Vertragsgegenstand
              </h2>
              <p className="font-sans text-slate-600 leading-relaxed mb-3">
                MyDispatch stellt eine cloudbasierte Dispositionssoftware bereit, die folgende Funktionen umfasst:
              </p>
              <ul className="list-disc pl-6 space-y-2 font-sans text-slate-600">
                <li>Auftrags- und Angebotsverwaltung</li>
                <li>Kunden-, Fahrer- und Fahrzeugverwaltung</li>
                <li>Rechnungserstellung und Buchhaltungsintegration</li>
                <li>Partner-Management (ab Business-Tarif)</li>
                <li>Statistiken und Reporting (ab Business-Tarif)</li>
                <li>Live-Traffic und Wetterdaten (ab Business-Tarif)</li>
              </ul>
            </section>

            {/* 3. Registrierung und Nutzerkonto */}
            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                3. Registrierung und Nutzerkonto
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">3.1 Registrierung</h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    Die Nutzung von MyDispatch erfordert eine Registrierung. Bei der Registrierung sind vollständige 
                    und wahrheitsgemäße Angaben zu machen. Der Nutzer ist verpflichtet, seine Daten aktuell zu halten.
                  </p>
                </div>
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">3.2 Zugangsdaten</h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    Der Nutzer ist verpflichtet, seine Zugangsdaten geheim zu halten und vor dem Zugriff Dritter 
                    zu schützen. Bei Verdacht auf Missbrauch ist MyDispatch unverzüglich zu informieren.
                  </p>
                </div>
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">3.3 Kontoberechtigung</h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    Ein Nutzerkonto darf nur von registrierten, geschäftsfähigen Personen oder vertretungsberechtigten 
                    Personen eines Unternehmens erstellt werden.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Nutzungsrechte */}
            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                4. Nutzungsrechte
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">4.1 Lizenzgewährung</h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    MyDispatch gewährt dem Nutzer ein nicht ausschließliches, nicht übertragbares Recht zur Nutzung 
                    der Software im Rahmen des gewählten Tarifs.
                  </p>
                </div>
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">4.2 Nutzungsbeschränkungen</h3>
                  <p className="font-sans text-slate-600 leading-relaxed mb-2">
                    Der Nutzer ist nicht berechtigt:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 font-sans text-slate-600">
                    <li>Die Software zu kopieren, zu modifizieren oder abgeleitete Werke zu erstellen</li>
                    <li>Die Software zurückzuentwickeln (Reverse Engineering)</li>
                    <li>Die Software an Dritte zu verkaufen, zu vermieten oder zu lizenzieren</li>
                    <li>Die Software für illegale Zwecke zu verwenden</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 5. Verfügbarkeit und Support */}
            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                5. Verfügbarkeit und Support
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">5.1 Verfügbarkeit</h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    MyDispatch strebt eine Verfügbarkeit von 99% pro Kalenderjahr an. Wartungsarbeiten werden nach 
                    Möglichkeit außerhalb der Geschäftszeiten durchgeführt.
                  </p>
                </div>
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">5.2 Support</h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    Support steht per E-Mail (info@my-dispatch.de) und Telefon (+49 170 8004423) während der 
                    Geschäftszeiten (Mo-Fr 09:00-18:00 Uhr) zur Verfügung.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Preise und Zahlung */}
            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                6. Preise und Zahlung
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">6.1 Tarifmodelle</h3>
                  <p className="font-sans text-slate-600 leading-relaxed mb-2">
                    MyDispatch bietet verschiedene Tarifmodelle an:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 font-sans text-slate-600">
                    <li>Starter: 39 €/Monat oder 374,40 €/Jahr (Bis zu 3 Fahrer/Fahrzeuge, Basisdisposition, Kunden-/Fahrerverwaltung, Auftragsverwaltung, Angebote & Rechnungen, Info-Landingpage)</li>
                    <li>Business: 99 €/Monat oder 950,40 €/Jahr (Keine Begrenzung bei Fahrern/Fahrzeugen, alle Starter-Features, Partner-Management, Live-Traffic & Wetter, Statistiken, Kunden-Portal, Buchungswidget, AI-Chatbot, API-Zugang)</li>
                    <li>Enterprise: Individuelle Preisgestaltung</li>
                    <li>Fleet & Driver Erweiterung: 9 €/Monat oder 86,40 €/Jahr pro zusätzlichem Fahrzeug oder Fahrer</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">6.2 Zahlungsbedingungen</h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    Die Zahlung erfolgt monatlich im Voraus per Lastschrift oder Kreditkarte über Stripe. 
                    Alle Preise verstehen sich zuzüglich der gesetzlichen Mehrwertsteuer.
                  </p>
                </div>
              </div>
            </section>

            {/* 7. Vertragslaufzeit und Kündigung */}
            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                7. Vertragslaufzeit und Kündigung
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">7.1 Vertragslaufzeit</h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    Der Vertrag wird auf unbestimmte Zeit geschlossen und verlängert sich automatisch monatlich.
                  </p>
                </div>
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">7.2 Kündigung</h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    Beide Parteien können den Vertrag mit einer Frist von 30 Tagen zum Monatsende kündigen. 
                    Die Kündigung bedarf der Textform (E-Mail genügt).
                  </p>
                </div>
              </div>
            </section>

            {/* 8. Datenschutz */}
            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                8. Datenschutz
              </h2>
              <p className="font-sans text-slate-600 leading-relaxed">
                Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung, 
                die unter <a href="/datenschutz" className="text-primary hover:underline">my-dispatch.de/datenschutz</a> abrufbar ist.
              </p>
            </section>

            {/* 9. Haftung */}
            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                9. Haftung
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">9.1 Haftungsausschluss</h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    MyDispatch haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit, für die Verletzung von Leben, 
                    Körper und Gesundheit sowie nach dem Produkthaftungsgesetz.
                  </p>
                </div>
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">9.2 Beschränkte Haftung</h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    Bei leichter Fahrlässigkeit haftet MyDispatch nur bei Verletzung wesentlicher Vertragspflichten 
                    (Kardinalpflichten). In diesem Fall ist die Haftung auf den vorhersehbaren, vertragstypischen Schaden begrenzt.
                  </p>
                </div>
              </div>
            </section>

            {/* 10. Gewährleistung */}
            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                10. Gewährleistung
              </h2>
              <p className="font-sans text-slate-600 leading-relaxed">
                MyDispatch gewährleistet, dass die Software im Wesentlichen gemäß der Leistungsbeschreibung funktioniert. 
                Bei Mängeln wird MyDispatch diese innerhalb angemessener Frist beheben.
              </p>
            </section>

            {/* 11. Schlussbestimmungen */}
            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                11. Schlussbestimmungen
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">11.1 Anwendbares Recht</h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.
                  </p>
                </div>
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">11.2 Gerichtsstand</h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    Gerichtsstand für alle Streitigkeiten ist, soweit gesetzlich zulässig, Deggendorf, Deutschland.
                  </p>
                </div>
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">11.3 Salvatorische Klausel</h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    Sollten einzelne Bestimmungen dieser Nutzungsbedingungen unwirksam sein oder werden, 
                    berührt dies die Wirksamkeit der übrigen Bestimmungen nicht.
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
              <p className="font-sans text-sm text-slate-600">
                <strong className="text-slate-900">RideHub Solutions</strong><br />
                Inhaber: Ibrahim SIMSEK<br />
                Ensbachmühle 4<br />
                D-94571 Schaufling, Deutschland<br />
                E-Mail: info@my-dispatch.de<br />
                Telefon: +49 170 8004423
              </p>
            </section>
          </div>
        </V28MarketingCard>
      </V28MarketingSection>
    </MarketingLayout>
  );
}
