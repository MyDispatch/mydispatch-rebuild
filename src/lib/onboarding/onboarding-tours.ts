/* ==================================================================================
   ONBOARDING TOURS DEFINITIONS V18.3.24
   ==================================================================================
   Definiert alle Onboarding-Touren für verschiedene Bereiche
   ================================================================================== */

import type { OnboardingStep } from '@/components/onboarding/OnboardingTour';

// ==================================================================================
// MAIN ONBOARDING TOUR (Erste Schritte)
// ==================================================================================

export const mainOnboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: '👋 Willkommen bei MyDispatch!',
    description: 'Wir zeigen Ihnen in 5 Minuten die wichtigsten Funktionen. Sie können die Tour jederzeit überspringen.',
    position: 'center',
    tips: [
      'Die Tour dauert ca. 5 Minuten',
      'Sie können jederzeit überspringen',
      'Alle Funktionen können später nochmal angesehen werden'
    ]
  },
  {
    id: 'dashboard',
    title: 'Das Dashboard - Ihre Zentrale',
    description: 'Hier sehen Sie alle wichtigen Kennzahlen auf einen Blick: Heutige Aufträge, verfügbare Fahrer, Umsatz und offene Rechnungen.',
    targetSelector: '[data-tour="dashboard-kpis"]',
    position: 'bottom',
    tips: [
      'KPI-Cards zeigen Echtzeit-Daten',
      'Klicken Sie auf eine Card für Details',
      'Trends vergleichen mit gestern (↑↓)'
    ]
  },
  {
    id: 'urgent-actions',
    title: 'Dringende Aktionen - Nichts verpassen',
    description: 'Kritische Aufgaben werden hier automatisch angezeigt: Ablaufende Dokumente, überfällige Rechnungen, unzugewiesene Aufträge.',
    targetSelector: '[data-tour="urgent-actions"]',
    position: 'top',
    tips: [
      '🔴 Rot = Kritisch (sofort handeln)',
      '🟡 Gelb = Wichtig (diese Woche)',
      '🔵 Blau = Information'
    ]
  },
  {
    id: 'navigation',
    title: 'Navigation - Alle Bereiche',
    description: 'In der Sidebar finden Sie alle Funktionen: Aufträge, Kunden, Fahrer, Fahrzeuge, Rechnungen und mehr.',
    targetSelector: '[data-tour="sidebar"]',
    position: 'right',
    tips: [
      'Klicken Sie auf ein Menü-Item zum Öffnen',
      'Sidebar kann eingeklappt werden',
      'Badge zeigt Anzahl offener Items'
    ]
  },
  {
    id: 'create-booking',
    title: 'Ersten Auftrag erstellen',
    description: 'Bereit für Ihren ersten Auftrag? Klicken Sie auf "Neuer Auftrag" und wir führen Sie durch den Prozess.',
    targetSelector: '[data-tour="new-booking"]',
    position: 'bottom',
    action: {
      label: 'Jetzt Auftrag erstellen',
      onClick: () => window.location.href = '/auftraege?action=new'
    },
    tips: [
      'Intelligente Adress-Suche hilft bei der Eingabe',
      'Preis wird automatisch berechnet',
      'Smart Assignment findet den besten Fahrer'
    ]
  },
  {
    id: 'help-system',
    title: 'Hilfe immer verfügbar',
    description: 'Brauchen Sie Unterstützung? Das Hilfe-System finden Sie in jedem Bereich. Detaillierte Erklärungen ohne Videos!',
    targetSelector: '[data-tour="help-button"]',
    position: 'left',
    tips: [
      'Context-sensitive Hilfe (passend zum Bereich)',
      'Suchfunktion über alle Artikel',
      'Quick-Actions für häufige Aufgaben'
    ]
  },
  {
    id: 'complete',
    title: '🎉 Geschafft!',
    description: 'Sie kennen jetzt die Grundlagen von MyDispatch. Viel Erfolg bei Ihrem Fahrdienst!',
    position: 'center',
    tips: [
      'Sie können die Tour jederzeit wiederholen',
      'Hilfe-Button finden Sie überall',
      'Support: support@my-dispatch.de'
    ]
  }
];

// ==================================================================================
// BOOKINGS ONBOARDING TOUR
// ==================================================================================

export const bookingsOnboardingSteps: OnboardingStep[] = [
  {
    id: 'bookings-intro',
    title: 'Auftrags-Verwaltung',
    description: 'Hier verwalten Sie alle Ihre Fahrtaufträge - von der Erstellung bis zur Abrechnung.',
    position: 'center',
    tips: [
      'Aufträge können auch als Angebote erstellt werden',
      'Status wird automatisch aktualisiert',
      'Export als PDF möglich'
    ]
  },
  {
    id: 'bookings-filters',
    title: 'Filter & Suche',
    description: 'Finden Sie Aufträge schnell mit Filtern nach Status, Datum, Kunde oder Fahrer.',
    targetSelector: '[data-tour="bookings-filters"]',
    position: 'bottom',
    tips: [
      'Mehrere Filter kombinierbar',
      'Gespeicherte Filter-Ansichten möglich',
      'Schnellfilter: Heute, Morgen, Diese Woche'
    ]
  },
  {
    id: 'bookings-bulk',
    title: 'Mehrfach-Aktionen',
    description: 'Wählen Sie mehrere Aufträge aus und führen Sie Aktionen gleichzeitig aus: Status ändern, PDF-Export, E-Mail versenden.',
    targetSelector: '[data-tour="bookings-bulk"]',
    position: 'top',
    tips: [
      'Checkbox in Tabelle aktiviert Multi-Select',
      'Bis zu 50 Aufträge gleichzeitig',
      'Spart enorm Zeit!'
    ]
  }
];

// ==================================================================================
// DRIVERS ONBOARDING TOUR
// ==================================================================================

export const driversOnboardingSteps: OnboardingStep[] = [
  {
    id: 'drivers-intro',
    title: 'Fahrer & Fahrzeuge',
    description: 'Verwalten Sie Ihre Fahrer und Fahrzeugflotte zentral - inklusive Dokumente und GPS-Tracking.',
    position: 'center',
    tips: [
      'Automatische Dokument-Ablauf-Warnungen',
      'GPS-Tracking in Echtzeit',
      'Schicht-Planung integriert'
    ]
  },
  {
    id: 'drivers-documents',
    title: 'Pflichtdokumente-Tracking',
    description: 'MyDispatch warnt automatisch bei ablaufenden Dokumenten: Führerschein, P-Schein, TÜV, Versicherungen.',
    targetSelector: '[data-tour="drivers-documents"]',
    position: 'bottom',
    tips: [
      'Rot = <7 Tage (kritisch)',
      'Gelb = <14 Tage (wichtig)',
      'Automatische E-Mail-Erinnerungen'
    ]
  },
  {
    id: 'drivers-gps',
    title: 'GPS-Tracking',
    description: 'Sehen Sie in Echtzeit, wo sich Ihre Fahrer befinden - nur während aktiver Schichten (DSGVO-konform).',
    targetSelector: '[data-tour="drivers-gps"]',
    position: 'right',
    tips: [
      'Daten werden nach 24h automatisch gelöscht',
      'Nur bei aktiver Schicht',
      'Datenschutz-konform nach DSGVO'
    ]
  }
];

// ==================================================================================
// EXPORT ALL TOURS
// ==================================================================================

export const onboardingTours = {
  main: mainOnboardingSteps,
  bookings: bookingsOnboardingSteps,
  drivers: driversOnboardingSteps
};
