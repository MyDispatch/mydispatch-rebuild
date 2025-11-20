/* ==================================================================================
   V28.1 AGB - PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ V28 Design System Components
   ✅ Slate-Farbpalette (Gray-Blue)
   ✅ Konsistente Layout-Pattern
   ✅ 100% V28.1 Typography & Spacing
   ================================================================================== */

import { FileText } from "lucide-react";
import { SEOHead } from "@/components/shared/SEOHead";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { V28HeroPremium } from "@/components/hero/V28HeroPremium";
import { PremiumDashboardContent } from "@/components/dashboard/PremiumDashboardContent";
import { V28MarketingSection } from "@/components/design-system/V28MarketingSection";
import { V28MarketingCard } from "@/components/design-system/V28MarketingCard";

const AGB = () => {
  return (
    <MarketingLayout currentPage="legal">
      <SEOHead
        title="Allgemeine Geschäftsbedingungen (AGB)"
        description="AGB von MyDispatch. Tarife, Leistungsumfang, Vertragsbedingungen und Haftung. Stand: 2025."
        canonical="/agb"
      />

      {/* Hero Section - V28HeroPremium */}
      <V28HeroPremium
        variant="demo"
        backgroundVariant="3d-premium"
        badge={{ text: "Vertragsrecht", icon: FileText }}
        title="Allgemeine Geschäftsbedingungen"
        subtitle="Stand: 2025"
        description="Tarife, Leistungsumfang und Vertragsbedingungen für MyDispatch-Kunden."
        primaryCTA={{
          label: "Kontakt aufnehmen",
          onClick: () => (window.location.href = "/contact"),
        }}
        visual={<PremiumDashboardContent pageType="agb" />}
      />

      {/* Content */}
      <V28MarketingSection background="canvas">
        <V28MarketingCard>
          <div className="space-y-8 md:space-y-12">
            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                § 1 Geltungsbereich
              </h2>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed">
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge, die zwischen
                MyDispatch.de by RideHub Solutions (nachfolgend „Anbieter") und ihren Kunden
                (nachfolgend „Kunde") über die Nutzung der MyDispatch-Software geschlossen werden.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                § 2 Vertragsgegenstand
              </h2>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed">
                Der Anbieter stellt dem Kunden eine cloudbasierte Dispositionssoftware für Taxi- und
                Mietwagenunternehmen zur Verfügung. Der Leistungsumfang ergibt sich aus der jeweils
                gewählten Tarifvariante (Starter, Business oder Enterprise).
              </p>
            </section>

            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                § 3 Vertragsschluss
              </h2>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed mb-3">
                Der Vertrag kommt durch die Registrierung des Kunden und die Bestätigung durch den
                Anbieter zustande. Mit der Registrierung gibt der Kunde ein verbindliches Angebot
                zum Abschluss eines Nutzungsvertrages ab.
              </p>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed">
                Der Anbieter behält sich vor, die Registrierung ohne Angabe von Gründen abzulehnen.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                § 4 Leistungsumfang
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-sans text-xl font-semibold text-slate-900 mb-3">
                    Starter-Tarif (39€/Monat)
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">
                        Basisdisposition für bis zu 3 aktive Fahrer/Fahrzeuge
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">Kundenverwaltung</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">Fahrerverwaltung</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">
                        Angebots- und Rechnungserstellung
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">E-Mail-Support</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-sans text-xl font-semibold text-slate-900 mb-3">
                    Business-Tarif (99€/Monat)
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">Alle Starter-Features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">
                        Keine Begrenzung bei Fahrern/Fahrzeugen
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">Partnerverwaltung</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">
                        Live-Verkehrsinformationen & Wetterdaten
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">
                        Erweiterte Statistiken & Reports
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">Kundenportal mit Login</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">
                        Landingpage mit Buchungs-Widget
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">
                        Priority-Support (E-Mail + Chat)
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-sans text-xl font-semibold text-slate-900 mb-3">
                    Enterprise-Tarif (Auf Anfrage)
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">Alle Business-Funktionen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">
                        White-Labeling (eigenes Branding)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">Custom Development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">Dedizierter Account Manager</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">24/7 Premium Support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">SLA-Garantien</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                      <span className="font-sans text-slate-600">On-Premise Hosting-Option</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                § 5 Preise und Zahlungsbedingungen
              </h2>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed mb-3">
                Die aktuellen Preise sind auf der Website des Anbieters unter /pricing einsehbar.
                Alle Preise verstehen sich zzgl. der gesetzlichen Mehrwertsteuer. Die Abrechnung
                erfolgt monatlich im Voraus über Stripe.
              </p>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed mb-3">
                Bei jährlicher Zahlung gewährt der Anbieter einen Rabatt von 20%.
              </p>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed">
                Zahlungen sind innerhalb von 14 Tagen nach Rechnungsstellung fällig. Bei
                Zahlungsverzug kann der Anbieter den Zugang vorübergehend sperren.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                § 6 Vertragslaufzeit und Kündigung
              </h2>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed mb-3">
                Der Vertrag wird auf unbestimmte Zeit geschlossen. Er kann von beiden Parteien mit
                einer Frist von 30 Tagen zum Monatsende gekündigt werden.
              </p>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed">
                Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt. Ein
                wichtiger Grund liegt insbesondere bei Zahlungsverzug von mehr als 30 Tagen oder bei
                schwerwiegenden Verstößen gegen diese AGB vor.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                § 7 Verfügbarkeit und Support
              </h2>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed mb-3">
                Der Anbieter bemüht sich um eine Verfügbarkeit der Software von 99,5% im
                Jahresmittel. Wartungsarbeiten werden nach Möglichkeit außerhalb der Geschäftszeiten
                durchgeführt und können zu vorübergehenden Einschränkungen führen.
              </p>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed">
                Der Support ist je nach Tarif per E-Mail (Starter), E-Mail + Chat (Business) oder
                24/7-Hotline (Enterprise) erreichbar. Die Reaktionszeiten variieren je nach Tarif
                und Schweregrad.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                § 8 PBefG § 44: Haftung bei Personenschäden
              </h2>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed mb-3">
                Die Haftung für Personenschäden ist gem. § 44 PBefG auf grobe Fahrlässigkeit und
                Vorsatz beschränkt. Sachschäden (Gepäck) werden nach HGB § 449 (Frachtrecht)
                geregelt, Höchstbetrag gem. § 542 HGB.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                § 9 PBefG § 51: Beförderungspflicht & Tarif
              </h2>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed mb-3">
                <strong className="font-sans text-slate-900">Beförderungspflicht:</strong> Gem. § 22
                PBefG besteht grundsätzlich eine Beförderungspflicht.
                <br />
                <strong className="font-sans text-slate-900">Entgelte:</strong> Preise sind gem. §
                51 PBefG festgelegt und transparent dargestellt.
                <br />
                <strong className="font-sans text-slate-900">Stornierung:</strong> Kostenfreie
                Stornierung bis 24 Stunden vor Abholung. Danach: Stornogebühr 50% des Fahrpreises.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                § 10 Pflichten des Kunden
              </h2>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed mb-3">
                Der Kunde verpflichtet sich:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                  <span className="font-sans text-slate-600">
                    Zugangsdaten vertraulich zu behandeln und nicht an Dritte weiterzugeben
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                  <span className="font-sans text-slate-600">
                    Die Software ausschließlich rechtmäßig und gemäß ihrer Zweckbestimmung zu nutzen
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                  <span className="font-sans text-slate-600">
                    Regelmäßige Datensicherungen durchzuführen
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                  <span className="font-sans text-slate-600">
                    Störungen und Sicherheitsvorfälle unverzüglich zu melden
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                  <span className="font-sans text-slate-600">
                    Keine Reverse-Engineering-Maßnahmen durchzuführen
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                § 11 Datenschutz und DSGVO
              </h2>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed mb-3">
                Die Verarbeitung personenbezogener Daten erfolgt gemäß der Datenschutzerklärung des
                Anbieters und den Bestimmungen der EU-Datenschutz-Grundverordnung (DSGVO).
              </p>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed mb-3">
                Der Anbieter tritt als Auftragsverarbeiter im Sinne der DSGVO auf. Ein separater
                Auftragsverarbeitungsvertrag (AVV) wird mit dem Kunden geschlossen.
              </p>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed">
                Alle Daten werden ausschließlich auf Servern innerhalb der EU (Deutschland)
                gespeichert. Eine Übermittlung in Drittländer erfolgt nicht.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                § 12 Haftung
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">
                    Allgemeine Haftungsbestimmungen
                  </h3>
                  <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed mb-3">
                    Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des
                    Körpers oder der Gesundheit sowie für Schäden, die auf einer vorsätzlichen oder
                    grob fahrlässigen Pflichtverletzung des Anbieters, seiner gesetzlichen Vertreter
                    oder Erfüllungsgehilfen beruhen.
                  </p>
                  <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed mb-3">
                    Im Übrigen haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten
                    (Kardinalpflichten). Die Haftung ist in diesem Fall auf den vorhersehbaren,
                    vertragstypischen Schaden begrenzt.
                  </p>
                  <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed">
                    Die Haftung für Datenverlust ist auf den typischen Wiederherstellungsaufwand
                    beschränkt, der bei regelmäßiger und gefahrentsprechender Anfertigung von
                    Sicherungskopien durch den Kunden eingetreten wäre.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">
                    Haftung bei Personenbeförderung (§ 44 PBefG)
                  </h3>
                  <p className="font-sans text-sm text-slate-600 mb-2">
                    <strong className="font-sans text-slate-900">
                      WICHTIG für Taxi- und Mietwagenunternehmer:
                    </strong>{" "}
                    Die MyDispatch-Software dient ausschließlich der Disposition und Verwaltung. Die
                    Haftung für Personenschäden während der Beförderung trägt das jeweilige
                    Transportunternehmen (Kunde), nicht der Software-Anbieter.
                  </p>
                  <p className="font-sans text-sm text-slate-600">
                    <strong className="font-sans text-slate-900">
                      § 44 PBefG - Haftungsbeschränkung:
                    </strong>{" "}
                    Bei Personenschäden während der Beförderung gelten die Haftungsgrenzen des
                    PBefG. Der Unternehmer haftet bis zur Höhe von 600.000 Euro für Personenschäden.
                    Eine ausreichende Haftpflichtversicherung ist obligatorisch (PBefG § 21 Abs. 1
                    Nr. 3).
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">
                    Gepäckhaftung (§ 449 HGB)
                  </h3>
                  <p className="font-sans text-sm text-slate-600">
                    <strong className="font-sans text-slate-900">
                      § 449 HGB - Haftung für Reisegepäck:
                    </strong>{" "}
                    Für Verlust, Beschädigung oder verspätete Auslieferung von Reisegepäck haftet
                    der Beförderer nach den Vorschriften des HGB. Die Haftung ist auf 1.500 Euro pro
                    Gepäckstück begrenzt, sofern kein höherer Wert vor Beförderungsbeginn angegeben
                    wurde. Der Kunde (Transportunternehmer) ist verpflichtet, diese Haftungsgrenzen
                    seinen Fahrgästen transparent zu kommunizieren.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">
                    Beförderungspflicht & Tarifbindung (§ 51 PBefG)
                  </h3>
                  <p className="font-sans text-sm text-slate-600">
                    <strong className="font-sans text-slate-900">
                      § 51 PBefG - Beförderungspflicht:
                    </strong>{" "}
                    Taxiunternehmer unterliegen der Beförderungspflicht. Sie sind verpflichtet,
                    Fahrgäste zu befördern, sofern keine wichtigen Gründe entgegenstehen (z.B.
                    Sicherheitsrisiken, Überfüllung, außerhalb des Pflichtfahrgebiets).
                  </p>
                  <p className="font-sans text-sm text-slate-600 mt-2">
                    <strong className="font-sans text-slate-900">Tarifbindung:</strong>{" "}
                    Taxiunternehmer müssen die genehmigten Tarife einhalten. Höhere Preise sind nur
                    bei Vorbestellung zulässig (Mietwagen mit Rückkehrpflicht). Die
                    MyDispatch-Software ermöglicht die Verwaltung unterschiedlicher Tarife für Taxi-
                    und Mietwagenfahrten.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                § 13 Stornierungen & Stornogebühren
              </h2>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed mb-3">
                <strong className="font-sans text-slate-900">
                  Stornoregelung (Branchenüblich für Taxi- und Mietwagenfahrten):
                </strong>
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                  <span className="font-sans text-slate-600">
                    <strong className="font-sans text-slate-900">
                      Mehr als 24 Stunden vor Abholung:
                    </strong>{" "}
                    Kostenfreie Stornierung
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                  <span className="font-sans text-slate-600">
                    <strong className="font-sans text-slate-900">
                      24-12 Stunden vor Abholung:
                    </strong>{" "}
                    50% des Fahrpreises als Stornogebühr
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                  <span className="font-sans text-slate-600">
                    <strong className="font-sans text-slate-900">
                      Weniger als 12 Stunden vor Abholung:
                    </strong>{" "}
                    100% des Fahrpreises als Stornogebühr
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-700 shrink-0"></span>
                  <span className="font-sans text-slate-600">
                    <strong className="font-sans text-slate-900">
                      No-Show (Kunde erscheint nicht):
                    </strong>{" "}
                    100% des Fahrpreises als Entschädigung
                  </span>
                </li>
              </ul>
              <p className="font-sans text-sm text-slate-600 mt-3">
                <strong className="font-sans text-slate-900">Hinweis:</strong> Diese Regelung gilt
                nur für Vorbestellungen (Mietwagen). Sofortbuchungen (Taxi-Bestellungen) können
                nicht storniert werden, sobald das Fahrzeug abgesendet wurde.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                § 14 Gewährleistung
              </h2>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed mb-3">
                Der Anbieter gewährleistet, dass die Software im Wesentlichen die in der
                Leistungsbeschreibung genannten Funktionen erfüllt. Geringfügige Abweichungen, die
                die Nutzbarkeit nicht wesentlich beeinträchtigen, stellen keinen Mangel dar.
              </p>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed">
                Mängel sind vom Kunden unverzüglich nach Feststellung zu rügen. Der Anbieter wird
                Mängel in angemessener Frist beseitigen.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                § 15 Änderungen der AGB
              </h2>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed mb-3">
                Der Anbieter behält sich vor, diese AGB mit einer Ankündigungsfrist von 30 Tagen zu
                ändern. Die Änderungen werden dem Kunden per E-Mail mitgeteilt.
              </p>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed">
                Widerspricht der Kunde den Änderungen nicht innerhalb von 30 Tagen nach Zugang der
                Mitteilung, gelten die Änderungen als akzeptiert. Der Anbieter wird den Kunden in
                der Änderungsmitteilung auf diese Folge hinweisen.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                § 16 Schlussbestimmungen
              </h2>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed mb-3">
                Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
                Gerichtsstand ist, soweit gesetzlich zulässig, Deggendorf.
              </p>
              <p className="font-sans text-base md:text-lg text-slate-600 leading-relaxed">
                Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der
                übrigen Bestimmungen hiervon unberührt. Die unwirksame Bestimmung wird durch eine
                wirksame ersetzt, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am
                nächsten kommt.
              </p>
            </section>

            <div className="bg-slate-50 rounded-xl p-6 mt-12 border border-slate-200">
              <p className="font-sans text-sm text-slate-600">
                <strong className="font-sans text-slate-900">Stand:</strong>{" "}
                {new Date().toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p className="font-sans text-sm text-slate-600 mt-2">
                <strong className="font-sans text-slate-900">Anbieter:</strong> Ibrahim SIMSEK
                <br />
                Ensbachmühle 4<br />
                D-94571 Schaufling
                <br />
                E-Mail: info@my-dispatch.de
                <br />
                Telefon: +49 170 8004423
              </p>
            </div>
          </div>
        </V28MarketingCard>
      </V28MarketingSection>
    </MarketingLayout>
  );
};

export default AGB;
