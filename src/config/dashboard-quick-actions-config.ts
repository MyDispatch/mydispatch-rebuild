/* ==================================================================================
   DASHBOARD QUICK ACTIONS CONFIG V2.0
   ==================================================================================
   Zentrale Konfiguration für Quick Actions Panel pro Dashboard
   ================================================================================== */

export type ContextWidgetType = 
  | 'system-status' 
  | 'quick-stats' 
  | 'shortcuts' 
  | 'upcoming-events';

export interface DashboardQuickActionsConfig {
  // Quick Actions IDs (referenziert aus quickActionsMap in jeweiliger Page)
  quickActions: string[];
  
  // Recent Activity aktivieren/deaktivieren
  recentActivity: boolean;
  
  // Context Widget Typ
  contextWidget: ContextWidgetType;
  
  // Optional: Custom Context Widget Config
  contextWidgetConfig?: any;
}

export const DASHBOARD_QUICK_ACTIONS_CONFIG: Record<string, DashboardQuickActionsConfig> = {
  // Master Dashboard
  master: {
    quickActions: ['create-booking', 'new-driver'], // Beispiel-IDs
    recentActivity: true,
    contextWidget: 'system-status',
  },
  
  // Aufträge Dashboard
  auftraege: {
    quickActions: ['create-booking', 'export-bookings'],
    recentActivity: true,
    contextWidget: 'quick-stats',
    contextWidgetConfig: {
      statsType: 'bookings', // heute/woche/monat
    },
  },
  
  // Kunden Dashboard
  kunden: {
    quickActions: ['create-customer', 'export-customers'],
    recentActivity: true,
    contextWidget: 'quick-stats',
    contextWidgetConfig: {
      statsType: 'customers', // Top Kunden, Umsatz
    },
  },
  
  // Fahrer Dashboard
  fahrer: {
    quickActions: ['create-driver', 'schedule-shift'],
    recentActivity: true,
    contextWidget: 'upcoming-events',
    contextWidgetConfig: {
      eventsType: 'shifts', // Nächste Schichten
    },
  },
  
  // Fahrzeuge Dashboard
  fahrzeuge: {
    quickActions: ['create-vehicle', 'export-vehicles'],
    recentActivity: false,
    contextWidget: 'quick-stats',
    contextWidgetConfig: {
      statsType: 'vehicles', // Wartungen fällig, TÜV
    },
  },
  
  // Rechnungen Dashboard
  rechnungen: {
    quickActions: ['create-invoice', 'export-invoices'],
    recentActivity: true,
    contextWidget: 'quick-stats',
    contextWidgetConfig: {
      statsType: 'invoices', // Offene Rechnungen, Umsatz heute
    },
  },
  
  // Schichtzettel Dashboard
  schichtzettel: {
    quickActions: ['create-shift', 'export-shifts'],
    recentActivity: false,
    contextWidget: 'upcoming-events',
    contextWidgetConfig: {
      eventsType: 'shifts',
    },
  },
  
  // Dokumente Dashboard
  dokumente: {
    quickActions: ['upload-document', 'export-documents'],
    recentActivity: true,
    contextWidget: 'shortcuts',
    contextWidgetConfig: {
      shortcutsType: 'folders', // Schnellzugriff auf wichtige Ordner
    },
  },
  
  // Kostenstellen Dashboard
  kostenstellen: {
    quickActions: ['create-cost-center', 'export-cost-centers'],
    recentActivity: false,
    contextWidget: 'quick-stats',
    contextWidgetConfig: {
      statsType: 'budget', // Budget-Übersicht
    },
  },
  
  // Partner Dashboard
  partner: {
    quickActions: ['create-partner', 'export-partners'],
    recentActivity: true,
    contextWidget: 'shortcuts',
    contextWidgetConfig: {
      shortcutsType: 'partner-portal', // Partner-Portal, Verträge
    },
  },
  
  // Statistiken Dashboard
  statistiken: {
    quickActions: ['generate-report', 'export-statistics'],
    recentActivity: false,
    contextWidget: 'quick-stats',
    contextWidgetConfig: {
      statsType: 'top-metrics', // Top Kennzahlen
    },
  },
  
  // Kommunikation Dashboard
  kommunikation: {
    quickActions: ['new-message', 'settings'],
    recentActivity: true,
    contextWidget: 'shortcuts',
    contextWidgetConfig: {
      shortcutsType: 'team-contacts', // Team-Kontakte
    },
  },
  
  // Office Dashboard
  office: {
    quickActions: ['compose-email', 'templates'],
    recentActivity: true,
    contextWidget: 'shortcuts',
    contextWidgetConfig: {
      shortcutsType: 'email-templates', // Vorlagen, Entwürfe
    },
  },
  
  // Einstellungen Dashboard
  einstellungen: {
    quickActions: ['edit-profile', 'backup'],
    recentActivity: false,
    contextWidget: 'system-status',
  },
};
