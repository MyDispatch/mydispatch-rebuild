/**
 * FAQ DATA V18.5.0
 *
 * Häufig gestellte Fragen für Homepage und Marketing-Seiten
 * Kategorisiert für bessere Übersicht
 */

export interface FAQItem {
  question: string;
  answer: string;
  category: "tarife" | "funktionen" | "datenschutz" | "support";
}

export const FAQ_DATA: FAQItem[] = [
  // TARIFE & PREISE
  {
    question: "Welcher Tarif ist der richtige für mein Unternehmen?",
    answer:
      "Der Starter-Tarif eignet sich ideal für kleine Flotten bis 10 Fahrzeuge und bietet alle Basis-Features für professionelle Disposition. Der Business-Tarif ist perfekt für wachsende Unternehmen mit 10-50 Fahrzeugen, die erweiterte Features wie Partner-Netzwerk, Live-Statistiken und Kunden-Portal benötigen. Enterprise richtet sich an Großflotten ab 50 Fahrzeugen mit individuellen Anforderungen und ohne Ressourcen-Limits.",
    category: "tarife",
  },
  {
    question: "Kann ich den Tarif jederzeit wechseln?",
    answer:
      "Ja, Sie können jederzeit upgraden (sofort aktiv) oder downgraden (wirksam zum Monatsende). Es gibt keine Mindestlaufzeit oder versteckte Kosten. Bei Downgrades werden Features automatisch deaktiviert, alle Daten bleiben jedoch 90 Tage gespeichert für eventuelle spätere Upgrades.",
    category: "tarife",
  },
  {
    question: "Kann ich MyDispatch monatlich kündigen?",
    answer:
      "Ja, alle Tarife sind monatlich kündbar. Sie können jederzeit ohne Kündigungsfrist zum Monatsende kündigen. Es gibt keine Mindestvertragslaufzeit.",
    category: "tarife",
  },
  {
    question: "Was passiert bei Überschreitung der Limits?",
    answer:
      "Wenn Sie die Limits Ihres Tarifs (z.B. 10 Fahrzeuge im Starter) erreichen, erhalten Sie automatisch eine Benachrichtigung mit der Möglichkeit zum Upgrade. Sie können nicht mehr Ressourcen anlegen als Ihr Tarif erlaubt. Ein Downgrade ist nur möglich, wenn Sie unter den neuen Limits liegen.",
    category: "tarife",
  },

  // FUNKTIONEN
  {
    question: "Welche Features sind in allen Tarifen enthalten?",
    answer:
      "Alle Tarife beinhalten: Beliebig viele Aufträge, digitale Fuhrparkverwaltung mit TÜV-Erinnerungen, Rechnungserstellung, Schichtplanung, Dokumentenmanagement, Mobile App für Fahrer und 24/7 KI-gestützten Support. Der Hauptunterschied liegt in den Limits (Fahrzeuge/Fahrer) und erweiterten Features wie Partner-Netzwerk und Statistiken.",
    category: "funktionen",
  },
  {
    question: "Kann ich MyDispatch auch mobil nutzen?",
    answer:
      "Ja, MyDispatch ist vollständig mobiloptimiert. Die Web-App funktioniert in jedem Browser und kann als Progressive Web App (PWA) auf Smartphone und Tablet installiert werden. Zusätzlich gibt es dedizierte Apps für Fahrer (iOS & Android) zur Auftragsannahme und Navigation.",
    category: "funktionen",
  },
  {
    question: "Wie funktioniert das Partner-Netzwerk?",
    answer:
      "Mit dem Partner-Netzwerk (ab Business-Tarif) können Sie Aufträge an andere Taxi- oder Mietwagenunternehmen vergeben, wenn Ihre Kapazitäten erschöpft sind. Sie definieren Provisionen, Partner akzeptieren Aufträge über ihr eigenes MyDispatch-Portal, und die Abrechnung erfolgt automatisch am Monatsende. Ideal für Kooperationen und Lastspitzen.",
    category: "funktionen",
  },

  // DATENSCHUTZ & SICHERHEIT
  {
    question: "Sind meine Daten sicher?",
    answer:
      "Ja, Datenschutz und Sicherheit haben höchste Priorität. Alle Daten werden verschlüsselt (AES-256) auf ISO 27001-zertifizierten Servern in Deutschland gespeichert. MyDispatch ist zu 100% DSGVO-konform. Wir führen regelmäßige Sicherheitsaudits durch und bieten 2-Faktor-Authentifizierung für alle Benutzer.",
    category: "datenschutz",
  },
  {
    question: "Wo werden die Daten gespeichert?",
    answer:
      "Alle Daten werden ausschließlich in hochsicheren Rechenzentren in Deutschland gespeichert (Frankfurt am Main). Es erfolgt keine Datenübertragung in Drittländer. Die Infrastruktur ist ISO 27001-zertifiziert und erfüllt alle deutschen und europäischen Datenschutzstandards (DSGVO, BDSG).",
    category: "datenschutz",
  },
  {
    question: "Kann ich meine Daten exportieren?",
    answer:
      "Ja, Sie haben jederzeit das Recht auf Datenportabilität (DSGVO Art. 20). Sie können alle Ihre Daten in gängigen Formaten (CSV, JSON, PDF) exportieren. Dies umfasst Aufträge, Fahrzeuge, Fahrer, Rechnungen und Statistiken. Der Export ist direkt über die Einstellungen verfügbar.",
    category: "datenschutz",
  },

  // SUPPORT & ONBOARDING
  {
    question: "Wie schnell kann ich mit MyDispatch starten?",
    answer:
      "Sie können sofort loslegen! Die Registrierung dauert unter 2 Minuten. Nach der Anmeldung führt Sie ein interaktiver Onboarding-Assistent durch die wichtigsten Funktionen. Die meisten Unternehmen sind innerhalb von 1-2 Stunden vollständig eingerichtet. Bei Enterprise-Tarifen unterstützen wir Sie persönlich beim Setup und der Datenmigration.",
    category: "support",
  },
  {
    question: "Welchen Support bietet MyDispatch?",
    answer:
      "Alle Tarife beinhalten 24/7 KI-gestützten Support (Chat & E-Mail) mit durchschnittlich <5 Minuten Antwortzeit. Business-Kunden erhalten zusätzlich Prioritäts-Support. Enterprise-Kunden haben einen dedizierten Account Manager, persönliche Schulungen und eine SLA-Garantie mit 99,99% Uptime. Zusätzlich bieten wir umfangreiche Dokumentation und Video-Tutorials.",
    category: "support",
  },
  {
    question: "Gibt es Schulungen für mein Team?",
    answer:
      "Ja, für Enterprise-Kunden sind persönliche Schulungen (vor Ort oder online) inklusive. Business-Kunden können Schulungen optional hinzubuchen. Für Starter-Kunden bieten wir umfangreiche Video-Tutorials, Webinare und eine ausführliche Dokumentation. Der KI-Support hilft jederzeit bei Fragen zur Bedienung.",
    category: "support",
  },
];

// Gruppierung nach Kategorien
export const FAQ_BY_CATEGORY = {
  tarife: FAQ_DATA.filter((item) => item.category === "tarife"),
  funktionen: FAQ_DATA.filter((item) => item.category === "funktionen"),
  datenschutz: FAQ_DATA.filter((item) => item.category === "datenschutz"),
  support: FAQ_DATA.filter((item) => item.category === "support"),
};

export const FAQ_CATEGORIES = [
  { id: "tarife", label: "Tarife & Preise", count: FAQ_BY_CATEGORY.tarife.length },
  { id: "funktionen", label: "Funktionen", count: FAQ_BY_CATEGORY.funktionen.length },
  {
    id: "datenschutz",
    label: "Datenschutz & Sicherheit",
    count: FAQ_BY_CATEGORY.datenschutz.length,
  },
  { id: "support", label: "Support & Onboarding", count: FAQ_BY_CATEGORY.support.length },
] as const;
