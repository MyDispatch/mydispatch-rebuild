/* ==================================================================================
   CONTENT CONFIGURATION - SINGLE SOURCE OF TRUTH
   ==================================================================================
   ✅ Zentrale Text-Definitionen
   ✅ Buttons, Labels, Messages
   ✅ Keine Hardcoded Strings mehr
   ================================================================================== */

export const CONTENT_BUTTONS = {
  // CTAs
  getStarted: "Jetzt starten",
  learnMore: "Mehr erfahren",
  contactUs: "Kontakt aufnehmen",
  requestDemo: "Demo anfragen",

  // Actions
  save: "Speichern",
  cancel: "Abbrechen",
  delete: "Löschen",
  edit: "Bearbeiten",
  add: "Hinzufügen",
  create: "Erstellen",

  // Navigation
  back: "Zurück",
  next: "Weiter",
  close: "Schließen",
} as const;

export const CONTENT_FORMS = {
  labels: {
    email: "E-Mail-Adresse",
    password: "Passwort",
    name: "Name",
    company: "Firma",
    phone: "Telefonnummer",
    message: "Nachricht",
  },
  placeholders: {
    email: "ihre@email.de",
    password: "••••••••",
    name: "Max Mustermann",
    company: "Musterfirma GmbH",
    phone: "+49 30 12345678",
    message: "Ihre Nachricht an uns...",
  },
  errors: {
    required: "Dieses Feld ist erforderlich",
    invalidEmail: "Ungültige E-Mail-Adresse",
    passwordTooShort: "Passwort muss mindestens 8 Zeichen lang sein",
    invalidPhone: "Ungültige Telefonnummer",
  },
} as const;

export const CONTENT_SUCCESS = {
  saved: "Erfolgreich gespeichert",
  created: "Erfolgreich erstellt",
  deleted: "Erfolgreich gelöscht",
  sent: "Erfolgreich gesendet",
} as const;

export const CONTENT_ERRORS = {
  generic: "Ein Fehler ist aufgetreten",
  network: "Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung.",
  notFound: "Nicht gefunden",
  unauthorized: "Keine Berechtigung",
  serverError: "Serverfehler. Bitte versuchen Sie es später erneut.",
} as const;

export const CONTENT_LOADING = {
  loading: "Lädt...",
  saving: "Speichert...",
  deleting: "Löscht...",
  sending: "Sendet...",
} as const;

export const CONTENT_EMPTY = {
  noResults: "Keine Ergebnisse gefunden",
  noData: "Keine Daten vorhanden",
  createFirst: "Erstellen Sie Ihren ersten Eintrag",
} as const;

export const CONTENT_COMMON = {
  and: "und",
  or: "oder",
  yes: "Ja",
  no: "Nein",
  all: "Alle",
  none: "Keine",
} as const;

export const CONTENT_META = {
  defaultTitle: "MyDispatch - Disposition für Taxi & Mietwagen",
  defaultDescription:
    "Professionelle Dispositions-Software für Taxi-, Mietwagen- und Limousinen-Services. GPS-Tracking, Auftragsverwaltung, Rechnungsstellung - alles in einer Lösung.",
} as const;

// Hero Content
export const HERO_CONTENT = {
  headline: "Intelligente Flottensteuerung",
  subheadline: "Für Taxi, Mietwagen & Limousinen",
  description:
    "GPS-Tracking, Auftragsverwaltung & Rechnungsstellung - alles in einer Lösung. Made in Germany.",
  primaryCTA: "Jetzt starten",
  secondaryCTA: "Demo anfragen",
} as const;

// SEO Defaults
export const SEO_DEFAULTS = {
  defaultDescription:
    "Professionelle Dispositions-Software für Taxi-, Mietwagen- und Limousinen-Services. GPS-Tracking, Auftragsverwaltung, Rechnungsstellung - alles in einer Lösung.",
  keywords: [
    "Taxi Software",
    "Mietwagen Disposition",
    "GPS Tracking",
    "Flottenmanagement",
    "Auftragsverwaltung",
    "Taxi App",
    "Fahrzeugverwaltung",
  ],
} as const;

// Helper functions
export function getButtonText(key: keyof typeof CONTENT_BUTTONS): string {
  return CONTENT_BUTTONS[key];
}

export function getFormLabel(key: keyof typeof CONTENT_FORMS.labels): string {
  return CONTENT_FORMS.labels[key];
}

export function getErrorMessage(key: keyof typeof CONTENT_ERRORS): string {
  return CONTENT_ERRORS[key];
}
