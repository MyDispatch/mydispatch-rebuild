/* ==================================================================================
   QUICK-ACTIONS REGISTRY - SINGLE SOURCE OF TRUTH
   ==================================================================================
   ⚠️ KRITISCH: Alle Quick-Action-Definitionen an EINER Stelle!
   
   REGEL: Jede Page hat GENAU 2 strategische Quick-Actions!
   ================================================================================== */

import { 
  Plus, 
  UserPlus, 
  Download, 
  Calendar, 
  FileText, 
  Car, 
  Power,
  Clock,
  List,
  Upload,
  Settings,
  BarChart3,
  Mail,
  type LucideIcon 
} from 'lucide-react';
import { logger } from '@/lib/logger';

export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  variant: 'default' | 'outline' | 'ghost';
  description?: string;
}

// ============================================================================
// UNTERNEHMER-DASHBOARD
// ============================================================================

export const ENTREPRENEUR_QUICK_ACTIONS = {
  dashboard: [
    {
      id: 'create-booking',
      label: 'Neuer Auftrag',
      icon: Plus,
      variant: 'default' as const,
      description: 'Schnell einen neuen Auftrag erstellen',
    },
    {
      id: 'create-customer',
      label: 'Neuer Kunde',
      icon: UserPlus,
      variant: 'outline' as const,
      description: 'Neuen Kunden anlegen',
    },
  ],
  
  auftraege: [
    {
      id: 'create-booking',
      label: 'Neuer Auftrag',
      icon: Plus,
      variant: 'default' as const,
    },
    {
      id: 'export-bookings',
      label: 'Export',
      icon: Download,
      variant: 'outline' as const,
    },
  ],
  
  kunden: [
    {
      id: 'create-customer',
      label: 'Kunde anlegen',
      icon: Plus,
      variant: 'default' as const,
    },
    {
      id: 'export-customers',
      label: 'Export',
      icon: Download,
      variant: 'outline' as const,
    },
  ],
  
  fahrer: [
    {
      id: 'create-driver',
      label: 'Fahrer anlegen',
      icon: UserPlus,
      variant: 'default' as const,
    },
    {
      id: 'schedule-shift',
      label: 'Schichtplan',
      icon: Calendar,
      variant: 'outline' as const,
    },
  ],
  
  fahrzeuge: [
    {
      id: 'create-vehicle',
      label: 'Fahrzeug anlegen',
      icon: Plus,
      variant: 'default' as const,
    },
    {
      id: 'export-vehicles',
      label: 'Export',
      icon: Download,
      variant: 'outline' as const,
    },
  ],
  
  rechnungen: [
    {
      id: 'create-invoice',
      label: 'Rechnung erstellen',
      icon: Plus,
      variant: 'default' as const,
    },
    {
      id: 'export-invoices',
      label: 'Export',
      icon: Download,
      variant: 'outline' as const,
    },
  ],
  
  schichtzettel: [
    {
      id: 'create-shift',
      label: 'Schicht erstellen',
      icon: Plus,
      variant: 'default' as const,
    },
    {
      id: 'export-shifts',
      label: 'Export',
      icon: Download,
      variant: 'outline' as const,
    },
  ],
  
  dokumente: [
    {
      id: 'upload-document',
      label: 'Dokument hochladen',
      icon: Upload,
      variant: 'default' as const,
    },
    {
      id: 'export-documents',
      label: 'Export',
      icon: Download,
      variant: 'outline' as const,
    },
  ],
  
  kostenstellen: [
    {
      id: 'create-cost-center',
      label: 'Kostenstelle anlegen',
      icon: Plus,
      variant: 'default' as const,
    },
    {
      id: 'export-cost-centers',
      label: 'Export',
      icon: Download,
      variant: 'outline' as const,
    },
  ],
  
  partner: [
    {
      id: 'create-partner',
      label: 'Partner anlegen',
      icon: Plus,
      variant: 'default' as const,
    },
    {
      id: 'export-partners',
      label: 'Export',
      icon: Download,
      variant: 'outline' as const,
    },
  ],
  
  statistiken: [
    {
      id: 'generate-report',
      label: 'Report erstellen',
      icon: BarChart3,
      variant: 'default' as const,
    },
    {
      id: 'export-statistics',
      label: 'Export',
      icon: Download,
      variant: 'outline' as const,
    },
  ],
  
  kommunikation: [
    {
      id: 'new-message',
      label: 'Neue Nachricht',
      icon: Plus,
      variant: 'default' as const,
    },
    {
      id: 'settings',
      label: 'Einstellungen',
      icon: Settings,
      variant: 'outline' as const,
    },
  ],
  
  office: [
    {
      id: 'compose-email',
      label: 'E-Mail schreiben',
      icon: Mail,
      variant: 'default' as const,
    },
    {
      id: 'templates',
      label: 'Vorlagen',
      icon: FileText,
      variant: 'outline' as const,
    },
  ],
  
  einstellungen: [
    {
      id: 'edit-profile',
      label: 'Profil bearbeiten',
      icon: Settings,
      variant: 'default' as const,
    },
    {
      id: 'backup',
      label: 'Backup',
      icon: Download,
      variant: 'outline' as const,
    },
  ],
} as const;

// ============================================================================
// KUNDENPORTAL
// ============================================================================

export const CUSTOMER_QUICK_ACTIONS = {
  'portal-dashboard': [
    {
      id: 'create-booking',
      label: 'Neue Buchung',
      icon: Plus,
      variant: 'default' as const,
      description: 'Jetzt buchen',
    },
    {
      id: 'view-bookings',
      label: 'Meine Buchungen',
      icon: List,
      variant: 'outline' as const,
      description: 'Buchungsverlauf',
    },
  ],
  
  'portal-bookings': [
    {
      id: 'create-booking',
      label: 'Neue Buchung',
      icon: Plus,
      variant: 'default' as const,
    },
    {
      id: 'export-bookings',
      label: 'Export',
      icon: Download,
      variant: 'outline' as const,
    },
  ],
} as const;

// ============================================================================
// FAHRERPORTAL
// ============================================================================

export const DRIVER_QUICK_ACTIONS = {
  'driver-dashboard': [
    {
      id: 'toggle-online',
      label: 'Online gehen',
      icon: Power,
      variant: 'default' as const,
      description: 'Verfügbarkeit ändern',
    },
    {
      id: 'start-shift',
      label: 'Schicht starten',
      icon: Clock,
      variant: 'outline' as const,
      description: 'Schicht beginnen',
    },
  ],
  
  'driver-rides': [
    {
      id: 'accept-ride',
      label: 'Fahrt annehmen',
      icon: Plus,
      variant: 'default' as const,
    },
    {
      id: 'view-history',
      label: 'Verlauf',
      icon: List,
      variant: 'outline' as const,
    },
  ],
  
  'driver-shifts': [
    {
      id: 'start-shift',
      label: 'Schicht starten',
      icon: Clock,
      variant: 'default' as const,
    },
    {
      id: 'export-shifts',
      label: 'Export',
      icon: Download,
      variant: 'outline' as const,
    },
  ],
  
  'driver-documents': [
    {
      id: 'upload-document',
      label: 'Dokument hochladen',
      icon: Upload,
      variant: 'default' as const,
    },
    {
      id: 'view-documents',
      label: 'Dokumente',
      icon: FileText,
      variant: 'outline' as const,
    },
  ],
  
  'driver-vehicles': [
    {
      id: 'select-vehicle',
      label: 'Fahrzeug wählen',
      icon: Car,
      variant: 'default' as const,
    },
    {
      id: 'report-issue',
      label: 'Problem melden',
      icon: FileText,
      variant: 'outline' as const,
    },
  ],
} as const;

// ============================================================================
// REGISTRY - ALL QUICK-ACTIONS
// ============================================================================

export const QUICK_ACTIONS_REGISTRY = {
  entrepreneur: ENTREPRENEUR_QUICK_ACTIONS,
  customer: CUSTOMER_QUICK_ACTIONS,
  driver: DRIVER_QUICK_ACTIONS,
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get Quick-Actions by Portal & Page
 * 
 * @param portal - Portal type (entrepreneur, customer, driver)
 * @param page - Page identifier
 * @param handlers - Object mapping action IDs to handler functions
 * 
 * @example
 * const actions = getQuickActionsForPage('entrepreneur', 'auftraege', {
 *   'create-booking': () => openBookingDialog(),
 *   'export-bookings': () => exportBookings(),
 * });
 */
export const getQuickActionsForPage = (
  portal: keyof typeof QUICK_ACTIONS_REGISTRY,
  page: string,
  handlers: Record<string, () => void>
): Array<QuickAction & { onClick: () => void }> => {
  const portalActions = QUICK_ACTIONS_REGISTRY[portal];
  
  // @ts-ignore - Dynamic key access
  const actions = portalActions[page] as QuickAction[] | undefined;
  
  if (!actions) {
    logger.warn('[QuickActions] No actions defined', { 
      component: 'quick-actions-registry',
      portal, 
      page 
    });
    return [];
  }
  
  return actions.map(action => ({
    ...action,
    onClick: handlers[action.id] || (() => logger.warn('[QuickActions] No handler', { 
      component: 'quick-actions-registry',
      actionId: action.id 
    })),
  }));
};

/**
 * Get All Available Pages for a Portal
 */
export const getAvailablePagesForPortal = (
  portal: keyof typeof QUICK_ACTIONS_REGISTRY
): string[] => {
  const portalActions = QUICK_ACTIONS_REGISTRY[portal];
  return Object.keys(portalActions);
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Portal = keyof typeof QUICK_ACTIONS_REGISTRY;
export type EntrepreneurPage = keyof typeof ENTREPRENEUR_QUICK_ACTIONS;
export type CustomerPage = keyof typeof CUSTOMER_QUICK_ACTIONS;
export type DriverPage = keyof typeof DRIVER_QUICK_ACTIONS;
