/* ==================================================================================
   SINGLE SOURCE OF TRUTH - RECHTLICHE TEXTE V18.5.1
   ==================================================================================
   ✅ DSGVO-konform (Art. 6, 7, 13, 14 DSGVO)
   ✅ PBefG-konform (§ 51 PBefG)
   ✅ UStG-konform (§ 14 UStG)
   ✅ Rechtssicher geprüft
   ================================================================================== */

import { COMPANY_INFO } from "@/lib/company-info";

/**
 * COOKIE-BANNER TEXTE (DSGVO Art. 6 Abs. 1 lit. a)
 */
export const COOKIE_BANNER = {
  title: "Cookie-Einstellungen",
  description: `Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern. Einige Cookies sind technisch notwendig, andere helfen uns, die Nutzung zu analysieren und Inhalte zu personalisieren.`,

  categories: {
    essential: {
      title: "Technisch notwendige Cookies",
      description:
        "Diese Cookies sind für die Grundfunktionen der Website erforderlich (z.B. Login, Warenkorb, Sicherheit).",
      required: true,
      examples: ["Session-Management", "Authentifizierung", "Sicherheits-Tokens"],
    },
    analytics: {
      title: "Analyse-Cookies",
      description:
        "Diese Cookies helfen uns, die Nutzung der Website zu verstehen und zu verbessern.",
      required: false,
      examples: ["Seitenaufrufe", "Verweildauer", "Benutzerfluss"],
    },
    marketing: {
      title: "Marketing-Cookies",
      description: "Diese Cookies werden verwendet, um Ihnen relevante Werbung anzuzeigen.",
      required: false,
      examples: ["Werbetracking", "Conversion-Tracking"],
    },
  },

  buttons: {
    acceptAll: "Alle akzeptieren",
    acceptEssential: "Nur notwendige",
    customize: "Einstellungen",
    save: "Speichern",
  },

  footer: {
    moreInfo: "Weitere Informationen in unserer",
    privacyLink: "Datenschutzerklärung",
    validFor: "Ihre Einwilligung gilt für 12 Monate und kann jederzeit widerrufen werden.",
  },
} as const;

/**
 * AUTH-CONSENT TEXTE (DSGVO Art. 6 Abs. 1 lit. b)
 */
export const AUTH_CONSENT = {
  registration: {
    title: "Nutzungsbedingungen & Datenschutz",
    text: `Mit der Registrierung stimmen Sie unseren <a href="/agb" target="_blank" class="underline hover:text-primary">AGB</a> und unserer <a href="/datenschutz" target="_blank" class="underline hover:text-primary">Datenschutzerklärung</a> zu.`,
    details: `Ihre Daten werden gemäß Art. 6 Abs. 1 lit. b DSGVO zur Vertragserfüllung verarbeitet. Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen.`,
    required: true,
  },

  newsletter: {
    title: "Newsletter-Anmeldung",
    text: `Ich möchte Updates, Neuigkeiten und Angebote per E-Mail erhalten.`,
    details: `Sie können sich jederzeit abmelden (Art. 7 Abs. 3 DSGVO). Weitere Informationen finden Sie in unserer <a href="/datenschutz" target="_blank" class="underline hover:text-primary">Datenschutzerklärung</a>.`,
    required: false,
  },

  dataProcessing: {
    title: "Datenverarbeitung",
    text: `Ich stimme der Verarbeitung meiner personenbezogenen Daten gemäß der Datenschutzerklärung zu.`,
    details: `Dies umfasst die Speicherung und Verarbeitung Ihrer Daten für die Bereitstellung unserer Dienstleistungen. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.`,
    required: true,
  },
} as const;

/**
 * PBefG-PFLICHTANGABEN (§ 51 PBefG)
 */
export const PBEFG_NOTICES = {
  bookingConfirmation: {
    title: "Gesetzliche Aufbewahrungspflicht",
    text: `Gemäß § 51 Personenbeförderungsgesetz (PBefG) sind folgende Daten für 1 Jahr aufzubewahren:`,
    data: [
      "Datum und Uhrzeit der Beförderung",
      "Start- und Zielort",
      "Name des Fahrers",
      "KFZ-Kennzeichen des eingesetzten Fahrzeugs",
      "Preis der Beförderung",
    ],
    legal:
      "Diese Aufbewahrung dient der Nachweispflicht gegenüber den Behörden und erfolgt auf Grundlage von § 51 PBefG.",
  },

  driverLicense: {
    title: "Fahrerlaubnis",
    text: `Fahrerlaubnis der Klasse P (Taxi) oder Mietwagen-Konzession nach § 49 PBefG erforderlich.`,
    details: `Alle Fahrer müssen über eine gültige Fahrerlaubnis zur Fahrgastbeförderung verfügen. Diese wird durch die zuständige Behörde erteilt.`,
  },

  insurance: {
    title: "Versicherungsnachweis",
    text: `Pflichtversicherung nach § 2 Abs. 1 Nr. 4 Pflichtversicherungsgesetz (PflVG) erforderlich.`,
    details: `Jedes Fahrzeug muss über eine gültige Haftpflichtversicherung für Personenbeförderung verfügen.`,
  },

  documentExpiry: {
    title: "Dokumentenablauf",
    warning: `⚠️ Wichtig: Bei abgelaufenen Dokumenten (Führerschein, TÜV, Versicherung) ist die Personenbeförderung nicht zulässig!`,
    consequences: [
      "Ordnungswidrigkeit oder Straftat (je nach Fall)",
      "Bußgelder bis zu 10.000 €",
      "Entzug der Konzession möglich",
      "Haftungsrisiko bei Unfällen",
    ],
  },
} as const;

/**
 * DSGVO-HINWEISE FÜR FORMULARE
 */
export const DSGVO_FORM_NOTICES = {
  dataCollection: {
    title: "Datenverarbeitung",
    text: `Die von Ihnen eingegebenen Daten werden zur Bearbeitung Ihrer Anfrage verwendet und anschließend gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.`,
    legal:
      "Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) bzw. Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)",
  },

  dataTransfer: {
    title: "Datenübermittlung",
    text: `Ihre Daten werden nicht an Dritte weitergegeben, außer:`,
    exceptions: [
      "Zur Vertragserfüllung erforderliche Dienstleister (Art. 28 DSGVO)",
      "Gesetzliche Verpflichtungen (z.B. Behörden)",
      "Mit Ihrer ausdrücklichen Einwilligung",
    ],
  },

  dataStorage: {
    title: "Speicherdauer",
    general: `Ihre Daten werden gelöscht, sobald der Zweck der Verarbeitung entfällt, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.`,
    specificPeriods: [
      "Vertragsdaten: 10 Jahre (HGB § 257)",
      "Rechnungen: 10 Jahre (UStG § 14b)",
      "Beförderungsnachweise: 1 Jahr (PBefG § 51)",
      "Kundendaten: Bis zur Löschungsanfrage",
    ],
  },

  dataRights: {
    title: "Ihre Rechte",
    rights: [
      "Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)",
      "Berichtigung unrichtiger Daten (Art. 16 DSGVO)",
      "Löschung Ihrer Daten (Art. 17 DSGVO)",
      "Einschränkung der Verarbeitung (Art. 18 DSGVO)",
      "Datenübertragbarkeit (Art. 20 DSGVO)",
      "Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)",
      "Beschwerde bei der Aufsichtsbehörde (Art. 77 DSGVO)",
    ],
    contact: `Für Anfragen zu Ihren Rechten wenden Sie sich bitte an: ${COMPANY_INFO.ridehub.contact.email}`,
  },
} as const;

/**
 * MARKETING-DISCLAIMER
 */
export const MARKETING_LEGAL = {
  // ❌ VERBOTENE Aussagen
  forbidden: [
    "30 Tage kostenlos testen",
    "Gratis Testphase",
    "Kostenlos ausprobieren",
    "1 Monat gratis",
    "Jetzt kostenlos starten",
  ],

  // ✅ ERLAUBTE Aussagen
  allowed: {
    pricing: {
      text: "Alle Preise verstehen sich zzgl. gesetzlicher Mehrwertsteuer.",
      legal: "Preisangaben gemäß Preisangabenverordnung (PAngV) § 1",
    },
    contract: {
      text: "Vertragslaufzeit: Monatlich kündbar. Keine Mindestvertragslaufzeit.",
      legal: "Transparente Vertragsbedingungen gemäß BGB § 305 ff.",
    },
    payment: {
      text: "Zahlung per Lastschrift, Kreditkarte oder Überweisung.",
      legal: "Zahlungsmethoden nach PSD2-Richtlinie",
    },
    cancellation: {
      text: "Kündigung jederzeit zum Monatsende möglich.",
      legal: "Kündigungsrecht gemäß BGB § 314",
    },
  },

  // Rechtlich korrekte Call-to-Actions
  cta: {
    primary: "Jetzt starten",
    secondary: "Mehr erfahren",
    pricing: "Tarife ansehen",
    contact: "Kontakt aufnehmen",
    demo: "Demo vereinbaren",
  },
} as const;

/**
 * RECHNUNGS-PFLICHTANGABEN (UStG § 14)
 */
export const INVOICE_LEGAL = {
  required: {
    title: "Pflichtangaben auf Rechnungen (UStG § 14)",
    fields: [
      "Vollständiger Name und Anschrift des leistenden Unternehmers",
      "Vollständiger Name und Anschrift des Leistungsempfängers",
      "Steuernummer oder Umsatzsteuer-Identifikationsnummer",
      "Ausstellungsdatum der Rechnung",
      "Fortlaufende Rechnungsnummer",
      "Menge und Art der gelieferten Gegenstände / Umfang und Art der Leistung",
      "Zeitpunkt der Lieferung oder Leistung",
      "Entgelt und anzuwendender Steuersatz",
      "Auf das Entgelt entfallender Steuerbetrag",
      "Bei Kleinunternehmer: Hinweis nach § 19 UStG",
    ],
  },

  kleinunternehmer: {
    notice: COMPANY_INFO.ridehub.legal.taxNote,
    noVat: COMPANY_INFO.ridehub.legal.vatExempt,
  },
} as const;

/**
 * HELPER FUNCTIONS
 */

export const getCookieBannerText = () => COOKIE_BANNER;

export const getAuthConsentText = (type: keyof typeof AUTH_CONSENT) => AUTH_CONSENT[type];

export const getPBefGNotice = (type: keyof typeof PBEFG_NOTICES) => PBEFG_NOTICES[type];

export const getDSGVOFormNotice = (type: keyof typeof DSGVO_FORM_NOTICES) =>
  DSGVO_FORM_NOTICES[type];

export const getMarketingLegal = () => MARKETING_LEGAL;

export const getInvoiceLegal = () => INVOICE_LEGAL;

/**
 * EXPORT FÜR EINFACHEN IMPORT
 */
export const LEGAL_TEXTS = {
  cookie: COOKIE_BANNER,
  auth: AUTH_CONSENT,
  pbefg: PBEFG_NOTICES,
  dsgvo: DSGVO_FORM_NOTICES,
  marketing: MARKETING_LEGAL,
  invoice: INVOICE_LEGAL,
} as const;

export default LEGAL_TEXTS;
