/**
 * ==================================================================================
 * MYDISPATCH V18.3 - ZENTRALES AMPELSYSTEM
 * ==================================================================================
 * 
 * Zweck: Einheitliche Status-Verwaltung für alle Entitäten im System
 * 
 * Features:
 * - Zentrale Definition aller Status-Typen
 * - Automatische Farbzuweisung (Ampelsystem: Grün, Gelb, Rot, Grau)
 * - Branchen-spezifische Logik (Taxi/Transport)
 * - Type-Safe mit TypeScript
 * - Einfache Erweiterbarkeit
 * 
 * Verwendung:
 * import { getDriverStatus, getDocumentStatus, StatusLevel } from '@/lib/status-system'
 * 
 * ==================================================================================
 */

// ==================================================================================
// STATUS LEVELS (Ampel-Farben)
// ==================================================================================

export type StatusLevel = 'success' | 'warning' | 'error' | 'neutral';

export interface StatusConfig {
  level: StatusLevel;
  label: string;
  colorClass: string;
  bgColorClass: string;
  borderColorClass: string;
  description?: string;
}

// ==================================================================================
// DRIVER STATUS (Fahrer-Status)
// ==================================================================================

export type DriverStatus = 'available' | 'busy' | 'offline' | 'break' | 'unavailable';

export const DRIVER_STATUS_CONFIG: Record<DriverStatus, StatusConfig> = {
  available: {
    level: 'success',
    label: 'Verfügbar',
    colorClass: 'text-status-success',
    bgColorClass: 'bg-status-success/10',
    borderColorClass: 'border-status-success/20',
    description: 'Fahrer ist einsatzbereit und kann Aufträge annehmen'
  },
  busy: {
    level: 'warning',
    label: 'Im Einsatz',
    colorClass: 'text-status-warning',
    bgColorClass: 'bg-status-warning/10',
    borderColorClass: 'border-status-warning/20',
    description: 'Fahrer führt aktuell einen Auftrag aus'
  },
  offline: {
    level: 'error',
    label: 'Offline',
    colorClass: 'text-status-error',
    bgColorClass: 'bg-status-error/10',
    borderColorClass: 'border-status-error/20',
    description: 'Fahrer ist nicht im Dienst oder nicht erreichbar'
  },
  break: {
    level: 'neutral',
    label: 'Pause',
    colorClass: 'text-muted-foreground',
    bgColorClass: 'bg-muted',
    borderColorClass: 'border-border',
    description: 'Fahrer ist in der Pause'
  },
  unavailable: {
    level: 'neutral',
    label: 'Nicht verfügbar',
    colorClass: 'text-muted-foreground',
    bgColorClass: 'bg-muted',
    borderColorClass: 'border-border',
    description: 'Fahrer ist temporär nicht verfügbar'
  }
};

// ==================================================================================
// VEHICLE STATUS (Fahrzeug-Status)
// ==================================================================================

export type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'out_of_service';

export const VEHICLE_STATUS_CONFIG: Record<VehicleStatus, StatusConfig> = {
  available: {
    level: 'success',
    label: 'Verfügbar',
    colorClass: 'text-status-success',
    bgColorClass: 'bg-status-success/10',
    borderColorClass: 'border-status-success/20',
    description: 'Fahrzeug ist einsatzbereit'
  },
  in_use: {
    level: 'warning',
    label: 'Im Einsatz',
    colorClass: 'text-status-warning',
    bgColorClass: 'bg-status-warning/10',
    borderColorClass: 'border-status-warning/20',
    description: 'Fahrzeug wird aktuell genutzt'
  },
  maintenance: {
    level: 'neutral',
    label: 'Wartung',
    colorClass: 'text-muted-foreground',
    bgColorClass: 'bg-muted',
    borderColorClass: 'border-border',
    description: 'Fahrzeug ist in Wartung'
  },
  out_of_service: {
    level: 'error',
    label: 'Außer Betrieb',
    colorClass: 'text-status-error',
    bgColorClass: 'bg-status-error/10',
    borderColorClass: 'border-status-error/20',
    description: 'Fahrzeug kann nicht eingesetzt werden'
  }
};

// ==================================================================================
// DOCUMENT STATUS (Dokument-Status basierend auf Ablaufdatum)
// ==================================================================================

export type DocumentStatus = 'valid' | 'expiring_soon' | 'expired';

export const DOCUMENT_STATUS_CONFIG: Record<DocumentStatus, StatusConfig> = {
  valid: {
    level: 'success',
    label: 'Gültig',
    colorClass: 'text-status-success',
    bgColorClass: 'bg-status-success/10',
    borderColorClass: 'border-status-success/20',
    description: 'Dokument ist gültig'
  },
  expiring_soon: {
    level: 'warning',
    label: 'Läuft ab',
    colorClass: 'text-status-warning',
    bgColorClass: 'bg-status-warning/10',
    borderColorClass: 'border-status-warning/20',
    description: 'Dokument läuft in den nächsten 30 Tagen ab'
  },
  expired: {
    level: 'error',
    label: 'Abgelaufen',
    colorClass: 'text-status-error',
    bgColorClass: 'bg-status-error/10',
    borderColorClass: 'border-status-error/20',
    description: 'Dokument ist abgelaufen und muss erneuert werden'
  }
};

// ==================================================================================
// INVOICE STATUS (Rechnungs-Status)
// ==================================================================================

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';

export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, StatusConfig> = {
  paid: {
    level: 'success',
    label: 'Bezahlt',
    colorClass: 'text-status-success',
    bgColorClass: 'bg-status-success/10',
    borderColorClass: 'border-status-success/20',
    description: 'Rechnung wurde vollständig bezahlt'
  },
  pending: {
    level: 'warning',
    label: 'Ausstehend',
    colorClass: 'text-status-warning',
    bgColorClass: 'bg-status-warning/10',
    borderColorClass: 'border-status-warning/20',
    description: 'Rechnung wartet auf Zahlung'
  },
  overdue: {
    level: 'error',
    label: 'Überfällig',
    colorClass: 'text-status-error',
    bgColorClass: 'bg-status-error/10',
    borderColorClass: 'border-status-error/20',
    description: 'Rechnung ist überfällig'
  },
  cancelled: {
    level: 'neutral',
    label: 'Storniert',
    colorClass: 'text-muted-foreground',
    bgColorClass: 'bg-muted',
    borderColorClass: 'border-border',
    description: 'Rechnung wurde storniert'
  }
};

// ==================================================================================
// BOOKING STATUS (Auftrags-Status)
// ==================================================================================

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export const BOOKING_STATUS_CONFIG: Record<BookingStatus, StatusConfig> = {
  pending: {
    level: 'warning',
    label: 'Ausstehend',
    colorClass: 'text-status-warning',
    bgColorClass: 'bg-status-warning/10',
    borderColorClass: 'border-status-warning/20',
    description: 'Auftrag wartet auf Bestätigung'
  },
  confirmed: {
    level: 'success',
    label: 'Bestätigt',
    colorClass: 'text-status-success',
    bgColorClass: 'bg-status-success/10',
    borderColorClass: 'border-status-success/20',
    description: 'Auftrag wurde bestätigt'
  },
  in_progress: {
    level: 'warning',
    label: 'In Arbeit',
    colorClass: 'text-status-warning',
    bgColorClass: 'bg-status-warning/10',
    borderColorClass: 'border-status-warning/20',
    description: 'Auftrag wird aktuell ausgeführt'
  },
  completed: {
    level: 'success',
    label: 'Abgeschlossen',
    colorClass: 'text-status-success',
    bgColorClass: 'bg-status-success/10',
    borderColorClass: 'border-status-success/20',
    description: 'Auftrag wurde erfolgreich abgeschlossen'
  },
  cancelled: {
    level: 'error',
    label: 'Storniert',
    colorClass: 'text-status-error',
    bgColorClass: 'bg-status-error/10',
    borderColorClass: 'border-status-error/20',
    description: 'Auftrag wurde storniert'
  }
};

// ==================================================================================
// TRAFFIC STATUS (Verkehrs-Status)
// ==================================================================================

export type TrafficStatus = 'free' | 'moderate' | 'congested';

export const TRAFFIC_STATUS_CONFIG: Record<TrafficStatus, StatusConfig> = {
  free: {
    level: 'success',
    label: 'Frei',
    colorClass: 'text-status-success',
    bgColorClass: 'bg-status-success/10',
    borderColorClass: 'border-status-success/20',
    description: 'Verkehr fließt frei'
  },
  moderate: {
    level: 'warning',
    label: 'Mäßig',
    colorClass: 'text-status-warning',
    bgColorClass: 'bg-status-warning/10',
    borderColorClass: 'border-status-warning/20',
    description: 'Verkehr ist mäßig'
  },
  congested: {
    level: 'error',
    label: 'Stau',
    colorClass: 'text-status-error',
    bgColorClass: 'bg-status-error/10',
    borderColorClass: 'border-status-error/20',
    description: 'Starker Stau'
  }
};

// ==================================================================================
// UTILITY FUNCTIONS (Branchen-Logik)
// ==================================================================================

/**
 * Ermittelt Dokument-Status basierend auf Ablaufdatum
 */
export function getDocumentStatus(expiryDate: string | Date | null): DocumentStatus {
  if (!expiryDate) return 'expired';
  
  const expiry = new Date(expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 30) return 'expiring_soon';
  return 'valid';
}

/**
 * Ermittelt Rechnungs-Status basierend auf Zahlungsstatus und Fälligkeitsdatum
 */
export function getInvoiceStatus(
  paymentStatus: 'paid' | 'pending' | 'cancelled',
  dueDate?: string | Date | null
): InvoiceStatus {
  if (paymentStatus === 'paid') return 'paid';
  if (paymentStatus === 'cancelled') return 'cancelled';
  
  if (!dueDate) return 'pending';
  
  const due = new Date(dueDate);
  const today = new Date();
  
  if (today > due) return 'overdue';
  return 'pending';
}

/**
 * Ermittelt Verkehrs-Status basierend auf Jam-Factor (HERE API)
 */
export function getTrafficStatusFromJamFactor(jamFactor: number): TrafficStatus {
  if (jamFactor < 3) return 'free';
  if (jamFactor < 6) return 'moderate';
  return 'congested';
}

/**
 * Ermittelt Fahrzeug-Status basierend auf Zuweisungen und Wartung
 */
export function getVehicleStatus(
  isInUse: boolean,
  isInMaintenance: boolean,
  isOutOfService: boolean
): VehicleStatus {
  if (isOutOfService) return 'out_of_service';
  if (isInMaintenance) return 'maintenance';
  if (isInUse) return 'in_use';
  return 'available';
}

/**
 * Generische Funktion: Hole Status-Config für beliebigen Status-Typ
 */
export function getStatusConfig<T extends string>(
  status: T,
  configMap: Record<T, StatusConfig>
): StatusConfig {
  return configMap[status] || {
    level: 'neutral',
    label: 'Unbekannt',
    colorClass: 'text-muted-foreground',
    bgColorClass: 'bg-muted',
    borderColorClass: 'border-border'
  };
}

/**
 * Zähle Status nach Level (für Statistiken)
 */
export function countByLevel(statuses: StatusConfig[]): Record<StatusLevel, number> {
  return statuses.reduce((acc, status) => {
    acc[status.level] = (acc[status.level] || 0) + 1;
    return acc;
  }, {} as Record<StatusLevel, number>);
}

/**
 * Filter Status nach Level
 */
export function filterByLevel(
  statuses: StatusConfig[],
  level: StatusLevel
): StatusConfig[] {
  return statuses.filter(s => s.level === level);
}

// ==================================================================================
// EXPORT ALL
// ==================================================================================

export const STATUS_SYSTEM = {
  driver: DRIVER_STATUS_CONFIG,
  vehicle: VEHICLE_STATUS_CONFIG,
  document: DOCUMENT_STATUS_CONFIG,
  invoice: INVOICE_STATUS_CONFIG,
  booking: BOOKING_STATUS_CONFIG,
  traffic: TRAFFIC_STATUS_CONFIG
} as const;
