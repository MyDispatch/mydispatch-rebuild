/* ==================================================================================
   FEATURES CONFIGURATION - SINGLE SOURCE OF TRUTH
   ==================================================================================
   ✅ Zentrale Feature-Definitionen
   ✅ Icons, Beschreibungen, Benefits
   ✅ Kategorisierung für Homepage & Feature-Pages
   ================================================================================== */

export const FEATURES = [
  {
    id: "order-management",
    category: "core",
    title: "Intelligente Auftragsverwaltung",
    shortTitle: "Auftragsverwaltung",
    description:
      "Erfassen, planen und verwalten Sie alle Fahrten zentral. Mit intelligentem Routing und automatischer Fahrerzuweisung.",
    icon: "ClipboardList",
    benefits: [
      "Echtzeit-Übersicht aller Aufträge",
      "Automatische Fahrerzuweisung",
      "Intelligente Routenoptimierung",
      "Digitale Auftragsbestätigung",
      "SMS & E-Mail Benachrichtigungen",
    ],
    detailPagePath: "/features/auftragsverwaltung",
    showOnHomepage: true,
    priority: 1,
  },
  {
    id: "vehicle-management",
    category: "core",
    title: "Digitale Fuhrparkverwaltung",
    shortTitle: "Fahrzeugverwaltung",
    description:
      "Komplette Fahrzeugverwaltung mit TÜV-Überwachung, Wartungsplaner und automatischen Ablauf-Erinnerungen.",
    icon: "Car",
    benefits: [
      "Zentrale Fahrzeugverwaltung",
      "TÜV & HU Überwachung",
      "Wartungsplaner mit Erinnerungen",
      "Digitales Fahrtenbuch",
      "Schadensdokumentation",
    ],
    detailPagePath: "/features/fahrer-fahrzeuge",
    showOnHomepage: true,
    priority: 2,
  },
  {
    id: "driver-management",
    category: "core",
    title: "Fahrermanagement Pro",
    shortTitle: "Fahrerverwaltung",
    description:
      "Schichtplanung, digitale Schichtzettel, Führerscheinverwaltung und automatische Abrechnung.",
    icon: "Users",
    benefits: [
      "Digitale Schichtplanung",
      "Führerschein & P-Schein Verwaltung",
      "Automatische Schichtzettel",
      "Provisionsverwaltung",
      "Arbeitszeiterfassung",
    ],
    detailPagePath: "/features/fahrer-fahrzeuge",
    showOnHomepage: true,
    priority: 3,
  },
  {
    id: "invoicing",
    category: "core",
    title: "Professionelles Rechnungswesen",
    shortTitle: "Rechnungsstellung",
    description:
      "Erstellen Sie Angebote und Rechnungen in Sekunden mit automatischen Mahnungen und Zahlungsabgleich.",
    icon: "FileText",
    benefits: [
      "Automatische Rechnungserstellung",
      "Angebotsverwaltung",
      "Mahnwesen automatisiert",
      "DATEV-Export",
      "Zahlungsabgleich",
    ],
    detailPagePath: "/features/rechnungsstellung",
    showOnHomepage: true,
    priority: 4,
  },
  {
    id: "gps-tracking",
    category: "premium",
    title: "GPS-Echtzeit-Tracking",
    shortTitle: "GPS-Tracking",
    description:
      "Live-Ortung aller Fahrzeuge auf interaktiver Karte mit Routenverfolgung und Geofencing.",
    icon: "MapPin",
    benefits: [
      "Echtzeit-Fahrzeugortung",
      "Historische Routenverfolgung",
      "Geofencing & Zonen",
      "Geschwindigkeitsüberwachung",
      "Kilometerauswertung",
    ],
    detailPagePath: "/features/gps-tracking",
    showOnHomepage: true,
    priority: 5,
  },
  {
    id: "partner-network",
    category: "premium",
    title: "Partner-Netzwerk",
    shortTitle: "Partner",
    description:
      "Vergeben Sie Aufträge an Partner-Unternehmen und verwalten Sie Provisionen transparent.",
    icon: "Handshake",
    benefits: [
      "Partner-Verwaltung",
      "Auftragsvergabe an Partner",
      "Provisionsverwaltung",
      "Transparente Abrechnung",
      "Partner-Portal",
    ],
    detailPagePath: "/features/partner-network",
    showOnHomepage: true,
    priority: 6,
  },
  {
    id: "statistics",
    category: "analytics",
    title: "Live-Statistiken & KPIs",
    shortTitle: "Statistiken",
    description: "Echtzeit-Dashboards mit Umsätzen, Auslastung und Fahrerperformance.",
    icon: "TrendingUp",
    benefits: [
      "Echtzeit-Dashboards",
      "Umsatz & Erlöse",
      "Fahrzeugauslastung",
      "Fahrerperformance",
      "Custom Reports",
    ],
    detailPagePath: "/features/statistiken",
    showOnHomepage: true,
    priority: 7,
  },
  {
    id: "security",
    category: "compliance",
    title: "DSGVO-konform & Sicher",
    shortTitle: "Sicherheit",
    description: "Made in Germany mit höchsten Datenschutzstandards auf deutschen Servern.",
    icon: "Shield",
    benefits: [
      "100% DSGVO-konform",
      "Server in Deutschland",
      "ISO 27001 zertifiziert",
      "Ende-zu-Ende Verschlüsselung",
      "Regelmäßige Security-Audits",
    ],
    detailPagePath: "/legal/datenschutz",
    showOnHomepage: true,
    priority: 8,
  },
  {
    id: "customer-portal",
    category: "premium",
    title: "Kunden-Portal & Buchungswidget",
    shortTitle: "Kunden-Portal",
    description: "Ihre Kunden buchen online und verwalten Fahrten selbst.",
    icon: "Smartphone",
    benefits: [
      "Online-Buchungsformular",
      "Kunden-Self-Service Portal",
      "White-Label Branding",
      "Buchungsbestätigungen",
      "Rechnung per E-Mail",
    ],
    detailPagePath: "/features/customer-portal",
    showOnHomepage: true,
    priority: 9,
  },
  {
    id: "live-traffic",
    category: "premium",
    title: "Live-Traffic & Wetter",
    shortTitle: "Live-Traffic",
    description: "Echtzeit-Verkehrsinformationen und Wettervorhersage für optimale Routenplanung.",
    icon: "Globe",
    benefits: [
      "Echtzeit-Verkehrslage",
      "Wettervorhersage",
      "Optimierte Routenplanung",
      "Stau-Vermeidung",
      "Zeitersparnis",
    ],
    detailPagePath: "/features/live-traffic",
    showOnHomepage: true,
    priority: 10,
  },
  {
    id: "api",
    category: "technical",
    title: "REST API & Integrationen",
    shortTitle: "API",
    description:
      "Offene REST API für Drittanbieter-Integrationen und Schnittstellen zu Partnersystemen.",
    icon: "Code",
    benefits: [
      "RESTful API",
      "Webhooks",
      "DATEV-Integration",
      "Taxameter-Anbindung",
      "Custom Integrationen",
    ],
    detailPagePath: "/features/api",
    showOnHomepage: false,
    priority: 11,
  },
  {
    id: "automation",
    category: "premium",
    title: "Workflow-Automatisierung",
    shortTitle: "Automatisierung",
    description:
      "Automatisieren Sie wiederkehrende Aufgaben und sparen Sie Zeit mit intelligenten Workflows.",
    icon: "Zap",
    benefits: [
      "Automatische Auftragsbestätigung",
      "Auto-Mahnwesen",
      "Automatische Reports",
      "Erinnerungen & Benachrichtigungen",
      "Custom Workflows",
    ],
    detailPagePath: "/features/automatisierung",
    showOnHomepage: false,
    priority: 12,
  },
] as const;

// Feature-Kategorien
export const FEATURE_CATEGORIES = {
  core: {
    id: "core",
    name: "Kern-Features",
    description: "Grundlegende Funktionen für den täglichen Betrieb",
  },
  premium: {
    id: "premium",
    name: "Premium-Features",
    description: "Erweiterte Funktionen für mehr Effizienz",
  },
  analytics: {
    id: "analytics",
    name: "Analyse & Reporting",
    description: "Datenauswertung und Business Intelligence",
  },
  compliance: {
    id: "compliance",
    name: "Compliance & Sicherheit",
    description: "Rechtliche Anforderungen und Datenschutz",
  },
  technical: {
    id: "technical",
    name: "Technische Features",
    description: "Schnittstellen und Integrationen",
  },
} as const;

// Type exports
export type Feature = (typeof FEATURES)[number];
export type FeatureId = Feature["id"];
export type FeatureCategory = keyof typeof FEATURE_CATEGORIES;

// Helper functions
export function getFeatureById(featureId: FeatureId): Feature | undefined {
  return FEATURES.find((f) => f.id === featureId);
}

export function getFeaturesByCategory(category: FeatureCategory): Feature[] {
  return FEATURES.filter((f) => f.category === category);
}

export function getHomepageFeatures(): Feature[] {
  return FEATURES.filter((f) => f.showOnHomepage).sort((a, b) => a.priority - b.priority);
}

// Homepage Main Features (Top 6 für Hero/Above-the-Fold)
export const MAIN_FEATURES = FEATURES.filter((f) => f.showOnHomepage && f.priority <= 6).sort(
  (a, b) => a.priority - b.priority
) as Feature[];

// Industry-specific Features (für Branchen-Pages)
export const INDUSTRY_FEATURES = {
  taxi: [
    getFeatureById("order-management"),
    getFeatureById("gps-tracking"),
    getFeatureById("driver-management"),
    getFeatureById("invoicing"),
  ].filter(Boolean) as Feature[],

  mietwagen: [
    getFeatureById("vehicle-management"),
    getFeatureById("customer-portal"),
    getFeatureById("invoicing"),
    getFeatureById("statistics"),
  ].filter(Boolean) as Feature[],

  limousinen: [
    getFeatureById("customer-portal"),
    getFeatureById("vehicle-management"),
    getFeatureById("partner-network"),
    getFeatureById("invoicing"),
  ].filter(Boolean) as Feature[],
} as const;

// Get all features (convenience export)
export function getAllFeatures(): Feature[] {
  return [...FEATURES];
}
