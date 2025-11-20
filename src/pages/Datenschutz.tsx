/* ==================================================================================
   V28.1 DATENSCHUTZ - PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ V28 Design System Components
   ✅ Slate-Farbpalette (Gray-Blue)
   ✅ DSGVO-konforme Datenschutzerklärung
   ✅ MyDispatch & NeXify Informationen
   ✅ EU-KI-Verordnung (AI Act) konform
   ✅ 100% V28.1 Typography & Spacing
   ================================================================================== */

import { ExternalLink, CheckCircle, Settings, Shield } from "lucide-react";
import { SEOHead } from "@/components/shared/SEOHead";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { V28HeroPremium } from "@/components/hero/V28HeroPremium";
import { PremiumDashboardContent } from "@/components/dashboard/PremiumDashboardContent";
import { V28MarketingSection } from "@/components/design-system/V28MarketingSection";
import { V28MarketingCard } from "@/components/design-system/V28MarketingCard";

const Datenschutz = () => {
  return (
    <MarketingLayout currentPage="legal">
      <SEOHead
        title="Datenschutzerklärung"
        description="DSGVO-konforme Datenschutzerklärung von MyDispatch. Erfahren Sie, wie wir Ihre Daten schützen und verarbeiten."
        canonical="/datenschutz"
      />

      {/* Hero Section - V28HeroPremium */}
      <V28HeroPremium
        variant="demo"
        backgroundVariant="3d-premium"
        badge={{ text: "DSGVO-konform", icon: Shield }}
        title="Datenschutzerklärung"
        subtitle="Stand: Januar 2025 | Deutschland & Niederlande"
        description="Erfahren Sie, wie wir Ihre Daten schützen und verarbeiten – transparent und DSGVO-konform."
        primaryCTA={{
          label: "Kontakt aufnehmen",
          onClick: () => (window.location.href = "/contact"),
        }}
        visual={<PremiumDashboardContent pageType="datenschutz" />}
      />

      {/* Content */}
      <V28MarketingSection background="canvas">
        <V28MarketingCard>
          <div className="space-y-8 md:space-y-12">
            {/* Intro */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <p className="font-sans text-base md:text-lg text-slate-900 font-medium leading-relaxed">
                MyDispatch nimmt den Schutz Ihrer personenbezogenen Daten sehr ernst. Diese
                Datenschutzerklärung informiert Sie umfassend über die Verarbeitung Ihrer Daten
                gemäß DSGVO, BDSG und der EU-KI-Verordnung (AI Act).
              </p>
            </div>

            {/* 1. Verantwortliche */}
            <div>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-5">
                1. Verantwortliche für die Datenverarbeitung
              </h2>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">
                    MyDispatch (Hauptverantwortlicher)
                  </h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    Ibrahim SIMSEK
                    <br />
                    Ensbachmühle 4<br />
                    D-94571 Schaufling, Deutschland
                  </p>
                  <p className="mt-2 font-sans text-slate-600">
                    E-Mail: info@my-dispatch.de
                    <br />
                    Tel: +49 170 8004423
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">
                    NeXify (Technologiepartner & Auftragsverarbeiter)
                  </h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    Pascal Courbois
                    <br />
                    Wallstrasse 9<br />
                    41334 Kaldenkirchen-Nettetal, Deutschland
                  </p>
                  <p className="mt-2 font-sans text-slate-600">
                    Unternehmenssitz: Graaf van Loonstraat 1E, 5921 JA Venlo, Niederlande
                  </p>
                  <p className="mt-2 font-sans text-slate-600">
                    E-Mail: support@nexify-automate.com
                    <br />
                    Tel: +31 6 133 188 56
                  </p>
                  <p className="mt-2 font-sans text-xs text-slate-500">
                    KvK-Nummer: 90483944 | USt-ID: NL865786276B01
                  </p>
                </div>
              </div>

              <div className="mt-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-sans text-sm text-slate-600">
                  <strong className="font-sans text-slate-900">Auftragsverarbeitung:</strong> NeXify
                  erbringt als Technologiepartner IT-Dienstleistungen für MyDispatch (Hosting,
                  technischer Support, Systementwicklung, Wartung). Die Datenverarbeitung erfolgt
                  ausschließlich nach Weisung von MyDispatch gemäß Art. 28 DSGVO. Ein
                  Auftragsverarbeitungsvertrag (AVV) wurde geschlossen.
                </p>
              </div>
            </div>

            {/* 2. Grundsätze */}
            <div>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                2. Grundsätze der Datenverarbeitung (Art. 5 DSGVO)
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">
                    Rechtmäßigkeit, Transparenz, Zweckbindung
                  </h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    Wir verarbeiten personenbezogene Daten nur auf Grundlage gesetzlicher
                    Erlaubnistatbestände (Art. 6, 9 DSGVO). Die Verarbeitung erfolgt transparent,
                    zweckgebunden und auf das notwendige Maß beschränkt (Datenminimierung). Ihre
                    Daten werden nicht für andere Zwecke weiterverarbeitet.
                  </p>
                </div>

                <div>
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">
                    Datensicherheit & Integrität (Art. 32 DSGVO)
                  </h3>
                  <p className="font-sans text-slate-600 mb-2 leading-relaxed">
                    <strong className="font-sans text-slate-900">
                      Technische und organisatorische Maßnahmen (TOM):
                    </strong>
                  </p>
                  <ul className="list-disc list-inside font-sans text-slate-600 space-y-1 ml-4">
                    <li>SSL/TLS-Verschlüsselung (TLS 1.3)</li>
                    <li>Zugriffskontrollen (RBAC - Role-Based Access Control)</li>
                    <li>Regelmäßige Backups (täglich, 30 Tage Aufbewahrung)</li>
                    <li>Firewalls und Multi-Faktor-Authentifizierung</li>
                    <li>Pseudonymisierung wo möglich</li>
                    <li>Mitarbeiterschulungen und Incident-Response-Prozess</li>
                    <li>Regelmäßige Penetrationstests</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Datenverarbeitung im MyDispatch-System */}
            <div>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                3. Datenverarbeitung im MyDispatch-System
              </h2>

              <div className="space-y-6">
                {/* 3.1 Unternehmer-Account */}
                <div className="border-l-4 border-slate-400 pl-4">
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">
                    3.1 Unternehmer-Account & Registrierung
                  </h3>
                  <div className="space-y-2 font-sans text-slate-600">
                    <p>
                      <strong className="font-sans text-slate-900">Verarbeitete Daten:</strong>{" "}
                      Vorname, Nachname, E-Mail, Telefon, Unternehmensname, Adresse, Umsatzsteuer-ID
                      (optional), Bankverbindung (pseudonymisiert über Stripe), Logo-Upload
                      (optional), Präferenzen
                    </p>
                    <p>
                      <strong className="font-sans text-slate-900">Rechtsgrundlage:</strong> Art. 6
                      Abs. 1 lit. b DSGVO (Vertragserfüllung), Art. 6 Abs. 1 lit. c DSGVO
                      (rechtliche Verpflichtung gem. § 14 HGB)
                    </p>
                    <p>
                      <strong className="font-sans text-slate-900">Zweck:</strong> Bereitstellung
                      der MyDispatch-Software, Vertragsabwicklung, Rechnungsstellung, Kundensupport,
                      Multi-Tenant-Isolierung
                    </p>
                    <p>
                      <strong className="font-sans text-slate-900">Speicherdauer:</strong> Dauer der
                      Geschäftsbeziehung + 10 Jahre (steuerrechtliche Aufbewahrungspflichten gem. §
                      147 AO, § 257 HGB)
                    </p>
                  </div>
                </div>

                {/* 3.2 Kundenverwaltung */}
                <div className="border-l-4 border-slate-400 pl-4">
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">
                    3.2 Kundenverwaltung (Endkunden der Taxi- und Mietwagen-Unternehmen)
                  </h3>
                  <div className="space-y-2 font-sans text-slate-600">
                    <p>
                      <strong className="font-sans text-slate-900">Verarbeitete Daten:</strong>{" "}
                      Vorname, Nachname, E-Mail, Telefon, Abholadresse, Zieladresse,
                      Zahlungsinformationen (pseudonymisiert über Stripe), Buchungshistorie,
                      Kundenstatus, DSGVO-Einwilligungen
                    </p>
                    <p>
                      <strong className="font-sans text-slate-900">Rechtsgrundlage:</strong> Art. 6
                      Abs. 1 lit. b DSGVO (Vertragserfüllung im Auftrag des Unternehmers), Art. 6
                      Abs. 1 lit. a DSGVO (Einwilligung für Marketing)
                    </p>
                    <p>
                      <strong className="font-sans text-slate-900">Speicherdauer:</strong> 3 Jahre
                      nach letzter Buchung (Gewährleistungsansprüche gem. §§ 195, 438 BGB), danach
                      Anonymisierung oder Löschung
                    </p>
                  </div>
                </div>

                {/* 3.3 Fahrerverwaltung */}
                <div className="border-l-4 border-slate-400 pl-4">
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">
                    3.3 Fahrerverwaltung & Beschäftigtendaten
                  </h3>
                  <div className="space-y-2 font-sans text-slate-600">
                    <p>
                      <strong className="font-sans text-slate-900">Verarbeitete Daten:</strong>{" "}
                      Vorname, Nachname, E-Mail, Telefon, Führerscheinnummer,
                      Führerschein-Ablaufdatum, P-Schein (Taxi-Lizenz), Profilfoto (optional),
                      Beschäftigungsstatus, Arbeitszeiten, Schichtdaten, Leistungsdaten,
                      Standortdaten während aktiver Fahrten (pseudonymisiert)
                    </p>
                    <p>
                      <strong className="font-sans text-slate-900">Rechtsgrundlage:</strong> Art. 6
                      Abs. 1 lit. b DSGVO (Arbeitsvertrag), Art. 6 Abs. 1 lit. c DSGVO (rechtliche
                      Verpflichtung gem. PBefG § 47 ff., ArbZG), § 26 BDSG
                      (Beschäftigtendatenschutz), Beschäftigtendatenschutzgesetz 2025 (in Kraft seit
                      01.01.2025)
                    </p>
                    <p>
                      <strong className="font-sans text-slate-900">GPS-Tracking:</strong>{" "}
                      Standortdaten werden nur während aktiver Schichten erfasst und ausschließlich
                      für Dispositionszwecke genutzt (§ 26 Abs. 1 BDSG). Keine Bewegungsprofile
                      außerhalb der Arbeitszeit.
                    </p>
                    <p>
                      <strong className="font-sans text-slate-900">Speicherdauer:</strong> Dauer des
                      Beschäftigungsverhältnisses + 10 Jahre (Lohnbuchhaltung gem. § 147 AO,
                      Sozialversicherungsnachweis gem. § 28p SGB IV)
                    </p>
                  </div>
                </div>

                {/* 3.4 Fahrzeugverwaltung */}
                <div className="border-l-4 border-slate-400 pl-4">
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">
                    3.4 Fahrzeugverwaltung
                  </h3>
                  <div className="space-y-2 font-sans text-slate-600">
                    <p>
                      <strong className="font-sans text-slate-900">Verarbeitete Daten:</strong>{" "}
                      Kennzeichen, Marke, Modell, Baujahr, Fahrgestellnummer (FIN), TÜV-Ablaufdatum,
                      Konzessionsnummer (pro Fahrzeug), Konzessionsdokument-Upload,
                      Versicherungsnummer, Betriebserlaubnis, Wartungsdaten, Kilometerstand
                    </p>
                    <p>
                      <strong className="font-sans text-slate-900">Rechtsgrundlage:</strong> Art. 6
                      Abs. 1 lit. b DSGVO (Vertragserfüllung), Art. 6 Abs. 1 lit. c DSGVO
                      (rechtliche Verpflichtung gem. PBefG § 47, 49, 51, StVZO, § 38 EnFG)
                    </p>
                    <p>
                      <strong className="font-sans text-slate-900">Speicherdauer:</strong> Dauer der
                      Fahrzeugnutzung + 10 Jahre
                    </p>
                  </div>
                </div>

                {/* 3.5 Beförderungsdaten (PBefG § 51) */}
                <div className="border-l-4 border-red-400 pl-4">
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">
                    3.5 Beförderungsdaten gemäß PBefG § 51
                  </h3>
                  <div className="space-y-2 font-sans text-slate-600">
                    <p>
                      <strong className="font-sans text-slate-900">
                        Gesetzliche Verpflichtung:
                      </strong>{" "}
                      Gemäß § 51 PBefG sind Taxiunternehmer verpflichtet, folgende Beförderungsdaten
                      zu erfassen und mindestens 30 Tage aufzubewahren:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Zeitpunkt und Ort der Aufnahme und Abgabe des Fahrgasts</li>
                      <li>Kennzeichen des Fahrzeugs</li>
                      <li>Entgelt für die Beförderung</li>
                      <li>Name des Fahrers (optional bei eindeutiger Fahrzeugzuordnung)</li>
                    </ul>
                    <p>
                      <strong className="font-sans text-slate-900">Rechtsgrundlage:</strong> Art. 6
                      Abs. 1 lit. c DSGVO i.V.m. § 51 PBefG (rechtliche Verpflichtung)
                    </p>
                    <p>
                      <strong className="font-sans text-slate-900">Speicherdauer:</strong>{" "}
                      Mindestens 30 Tage (PBefG § 51), danach Archivierung für Rechnungszwecke (10
                      Jahre gem. § 147 AO)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Künstliche Intelligenz */}
            <div>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                4. Künstliche Intelligenz & EU-KI-Verordnung (AI Act)
              </h2>

              <div className="bg-slate-50 p-6 rounded-xl mb-4 border border-slate-200">
                <p className="font-sans text-slate-600 leading-relaxed">
                  <strong className="font-sans text-slate-900">
                    KI-System-Klassifizierung gemäß EU AI Act (Verordnung (EU) 2024/1689):
                  </strong>
                  <br />
                  MyDispatch nutzt KI-Systeme der Risikoklasse "Minimales Risiko" (Art. 6, 69 EU AI
                  Act). Die eingesetzten KI-Funktionen dienen ausschließlich der Prozessoptimierung,
                  Nutzerfreundlichkeit und Entscheidungsunterstützung ohne Hochrisiko-Anwendungen.
                </p>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-slate-400 pl-4">
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">
                    4.1 KI-Assistent & Chatbot
                  </h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    <strong className="font-sans text-slate-900">Anbieter & Modelle:</strong>{" "}
                    MyDispatch AI (Google Gemini 2.5 Flash, Anthropic Claude Sonnet 4)
                    <br />
                    <strong className="font-sans text-slate-900">Hosting:</strong> Google Cloud
                    Platform (EU-Datacenter, DSGVO-konform)
                    <br />
                    <strong className="font-sans text-slate-900">Transparenz:</strong> AI Act Art.
                    52 - vollständige Transparenz über KI-Nutzung
                  </p>
                  <p className="font-sans text-slate-600 mt-2 leading-relaxed">
                    <strong className="font-sans text-slate-900">Datenschutz:</strong> Eingaben
                    werden anonymisiert verarbeitet, keine Speicherung von personenbezogenen Daten
                    im KI-Modell. Chat-Verlauf bleibt in Ihrer company_id isoliert.
                  </p>
                  <p className="font-sans text-slate-600 mt-2 leading-relaxed">
                    <strong className="font-sans text-slate-900">Speicherdauer:</strong>{" "}
                    Chat-Verlauf: 90 Tage, danach automatische Anonymisierung
                  </p>
                </div>

                <div className="border-l-4 border-slate-400 pl-4">
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">
                    4.2 ETA-Berechnung & Verkehrsdaten-KI
                  </h3>
                  <p className="font-sans text-slate-600 leading-relaxed">
                    <strong className="font-sans text-slate-900">Technologie:</strong> Google Maps
                    Directions API mit Traffic Matrix, Machine-Learning-basierte Routenoptimierung
                  </p>
                  <p className="font-sans text-slate-600 mt-2 leading-relaxed">
                    <strong className="font-sans text-slate-900">Verarbeitete Daten:</strong>{" "}
                    Start-/Zieladressen, Abhol-Zeitpunkt, Wetterdaten (anonymisiert), Verkehrsdaten
                    (anonymisiert), keine Fahrzeug-/Fahrer-Identifikation
                  </p>
                  <p className="font-sans text-slate-600 mt-2 leading-relaxed">
                    <strong className="font-sans text-slate-900">Speicherdauer:</strong>{" "}
                    ETA-Berechnungen: 5 Minuten Cache im SessionStorage, keine Langzeitspeicherung
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Externe Dienste */}
            <div>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                5. Externe Dienste & API-Integrationen
              </h2>

              <div className="space-y-4">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-sans font-semibold text-slate-900 mb-2">
                    Stripe (Zahlungsabwicklung & Abo-Verwaltung)
                  </h3>
                  <p className="font-sans text-sm text-slate-600 leading-relaxed">
                    <strong className="font-sans text-slate-900">Anbieter:</strong> Stripe Payments
                    Europe, Ltd., 1 Grand Canal Street Lower, Dublin, Irland
                    <br />
                    <strong className="font-sans text-slate-900">Zweck:</strong>{" "}
                    Abonnement-Verwaltung, Zahlungsabwicklung, Rechnungserstellung
                    <br />
                    <strong className="font-sans text-slate-900">Datentransfer:</strong> EU/EWR
                    (DSGVO-konform), USA nur mit EU-Standardvertragsklauseln
                    <br />
                    <strong className="font-sans text-slate-900">Weitere Infos:</strong>{" "}
                    <a
                      href="https://stripe.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:underline inline-flex items-center gap-1"
                    >
                      stripe.com/privacy <ExternalLink className="h-4 w-4 text-slate-900" />
                    </a>
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-sans font-semibold text-slate-900 mb-2">
                    Google APIs (Maps, Directions, Places, Traffic Matrix)
                  </h3>
                  <p className="font-sans text-sm text-slate-600 leading-relaxed">
                    <strong className="font-sans text-slate-900">Anbieter:</strong> Google Ireland
                    Limited, Gordon House, Barrow Street, Dublin 4, Irland
                    <br />
                    <strong className="font-sans text-slate-900">Zweck:</strong> Routenberechnung,
                    Adressvalidierung, Verkehrslage-Analyse
                    <br />
                    <strong className="font-sans text-slate-900">Datentransfer:</strong> EU/USA mit
                    Standardvertragsklauseln
                    <br />
                    <strong className="font-sans text-slate-900">Weitere Infos:</strong>{" "}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:underline inline-flex items-center gap-1"
                    >
                      policies.google.com/privacy{" "}
                      <ExternalLink className="h-4 w-4 text-slate-900" />
                    </a>
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-sans font-semibold text-slate-900 mb-2">
                    Resend.com (E-Mail-Versand)
                  </h3>
                  <p className="font-sans text-sm text-slate-600 leading-relaxed">
                    <strong className="font-sans text-slate-900">Anbieter:</strong> Resend Inc., USA
                    <br />
                    <strong className="font-sans text-slate-900">Zweck:</strong> Transaktionale
                    E-Mails, Rechnungen, Benachrichtigungen
                    <br />
                    <strong className="font-sans text-slate-900">Datentransfer:</strong> USA mit
                    EU-Standardvertragsklauseln gem. Art. 46 DSGVO
                    <br />
                    <strong className="font-sans text-slate-900">Domain:</strong>{" "}
                    send.nexify-automate.com (verifiziert, SPF/DKIM/DMARC)
                  </p>
                </div>
              </div>
            </div>

            {/* 6. Cookies */}
            <div>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                6. Cookies & Tracking-Technologien
              </h2>

              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl">
                  <h3 className="font-sans font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-slate-900" />
                    Essentielle Cookies (immer aktiv)
                  </h3>
                  <p className="font-sans text-sm text-slate-600 leading-relaxed">
                    Login-Session, CSRF-Token, Cookie-Präferenzen, Multi-Tenant-Isolierung
                    <br />
                    <strong className="font-sans text-slate-900">Rechtsgrundlage:</strong> Art. 6
                    Abs. 1 lit. f DSGVO (Systemsicherheit)
                    <br />
                    <strong className="font-sans text-slate-900">Speicherdauer:</strong>{" "}
                    Session-Ende bzw. 24 Stunden
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl">
                  <h3 className="font-sans font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-slate-900" />
                    Funktionale Cookies (optional, opt-in)
                  </h3>
                  <p className="font-sans text-sm text-slate-600 leading-relaxed">
                    Verkehrsdaten-Cache, ETA-Cache, Company-Data
                    <br />
                    <strong className="font-sans text-slate-900">Rechtsgrundlage:</strong> Art. 6
                    Abs. 1 lit. a DSGVO (Einwilligung über Cookie-Banner)
                    <br />
                    <strong className="font-sans text-slate-900">Speicherdauer:</strong> Siehe
                    jeweiliger max-age
                  </p>
                </div>

                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-sans text-sm text-slate-600 leading-relaxed">
                    <strong className="font-sans text-slate-900">Verwaltung & Widerruf:</strong> Sie
                    können Cookie-Einstellungen jederzeit über den Cookie-Banner anpassen oder
                    Cookies in Ihrem Browser vollständig löschen. Ohne essentielle Cookies ist die
                    Nutzung von MyDispatch nicht möglich (Login-Funktion).
                  </p>
                </div>
              </div>
            </div>

            {/* 7. Ihre Rechte */}
            <div>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                7. Ihre Rechte als betroffene Person (Art. 15-22 DSGVO)
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-sans font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-slate-900" />
                    Auskunftsrecht (Art. 15 DSGVO)
                  </h3>
                  <p className="font-sans text-xs text-slate-600">
                    Information über alle gespeicherten Daten, Verarbeitungszweck, Empfänger,
                    Speicherdauer
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-sans font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-slate-900" />
                    Berichtigungsrecht (Art. 16 DSGVO)
                  </h3>
                  <p className="font-sans text-xs text-slate-600">
                    Korrektur falscher oder unvollständiger Daten (auch direkt in Einstellungen
                    möglich)
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-sans font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-slate-900" />
                    Löschungsrecht (Art. 17 DSGVO)
                  </h3>
                  <p className="font-sans text-xs text-slate-600">
                    "Recht auf Vergessenwerden" - Ausnahme: gesetzliche Aufbewahrungspflichten
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-sans font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-slate-900" />
                    Datenportabilität (Art. 20 DSGVO)
                  </h3>
                  <p className="font-sans text-xs text-slate-600">
                    Export Ihrer Daten in maschinenlesbarem Format (JSON/CSV)
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-sans font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-slate-900" />
                    Widerspruchsrecht (Art. 21 DSGVO)
                  </h3>
                  <p className="font-sans text-xs text-slate-600">
                    Widerspruch gegen Verarbeitung auf Basis berechtigter Interessen
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-sans font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-slate-900" />
                    Einschränkung (Art. 18 DSGVO)
                  </h3>
                  <p className="font-sans text-xs text-slate-600">
                    Temporäre Einschränkung bei Bestreitung der Richtigkeit
                  </p>
                </div>
              </div>

              <div className="mt-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-sans font-semibold text-slate-900 mb-2">
                  Ausübung Ihrer Rechte
                </h3>
                <p className="font-sans text-sm text-slate-600 leading-relaxed">
                  Kontaktieren Sie uns per E-Mail:{" "}
                  <a href="mailto:info@my-dispatch.de" className="text-slate-700 hover:underline">
                    info@my-dispatch.de
                  </a>{" "}
                  oder per Post an: MyDispatch, Ibrahim SIMSEK, Ensbachmühle 4, D-94571 Schaufling.
                  <br />
                  Wir bearbeiten Ihre Anfrage innerhalb von 30 Tagen (Art. 12 Abs. 3 DSGVO).
                </p>
                <p className="font-sans text-sm text-slate-600 mt-2 leading-relaxed">
                  <strong className="font-sans text-slate-900">Beschwerderecht:</strong> Sie haben
                  das Recht, sich bei einer Aufsichtsbehörde zu beschweren (z.B. Bayerisches
                  Landesamt für Datenschutzaufsicht, Promenade 18, 91522 Ansbach,
                  <a
                    href="mailto:poststelle@lda.bayern.de"
                    className="text-slate-700 hover:underline"
                  >
                    poststelle@lda.bayern.de
                  </a>
                  ).
                </p>
              </div>
            </div>

            {/* 8. Speicherdauer */}
            <div>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                8. Speicherdauer (Art. 5 Abs. 1 lit. e DSGVO)
              </h2>

              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full font-sans text-sm border border-slate-200">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="text-left p-3 font-semibold text-slate-900">Datenart</th>
                      <th className="text-left p-3 font-semibold text-slate-900">Speicherdauer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 text-slate-900">Vertragsdaten (Unternehmer)</td>
                      <td className="p-3 text-slate-600">Vertragslaufzeit + 10 Jahre</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-900">Auftragsdaten (Buchungen)</td>
                      <td className="p-3 text-slate-600">10 Jahre (§ 147 AO, § 257 HGB)</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-900">Kundendaten (Endkunden)</td>
                      <td className="p-3 text-slate-600">3 Jahre nach letzter Buchung</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-900">Fahrerdaten (Beschäftigung)</td>
                      <td className="p-3 text-slate-600">Beschäftigung + 10 Jahre</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-900">Fahrzeugdaten (inkl. Konzession)</td>
                      <td className="p-3 text-slate-600">Nutzung + 10 Jahre</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-900">Kommunikationsdaten (Chat)</td>
                      <td className="p-3 text-slate-600">6 Monate, dann Löschung</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-900">Protokolldaten (Logs)</td>
                      <td className="p-3 text-slate-600">90 Tage (IT-Sicherheit)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="font-sans text-sm text-slate-600 mt-4 leading-relaxed">
                Nach Ablauf der Speicherfristen werden Daten automatisch anonymisiert oder gelöscht,
                sofern keine gesetzlichen Aufbewahrungspflichten oder laufende Rechtsstreitigkeiten
                bestehen.
              </p>
            </div>

            {/* 9. Änderungen */}
            <div>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                9. Änderungen dieser Datenschutzerklärung
              </h2>
              <p className="font-sans text-slate-600 leading-relaxed">
                Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen (z.B. bei
                neuen Funktionen, Rechtsänderungen, neuen Auftragsverarbeitern). Die aktuelle
                Version ist stets unter my-dispatch.de/datenschutz abrufbar. Wesentliche Änderungen
                werden per E-Mail an registrierte Nutzer angekündigt (mind. 30 Tage vor
                Inkrafttreten).
              </p>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-6 rounded-xl text-center border border-slate-200">
              <p className="font-sans text-sm text-slate-600">
                <strong className="font-sans text-slate-900">
                  Stand dieser Datenschutzerklärung:
                </strong>{" "}
                01. Januar 2025
                <br />
                <strong className="font-sans text-slate-900">Version:</strong> 2.0 (umfasst
                KI-Verordnung, NeXify-Integration, Multi-Tenant-Funktionalität)
              </p>
            </div>
          </div>
        </V28MarketingCard>
      </V28MarketingSection>
    </MarketingLayout>
  );
};

export default Datenschutz;
