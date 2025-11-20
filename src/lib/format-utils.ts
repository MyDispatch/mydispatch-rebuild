/**
 * ==================================================================================
 * FORMAT-UTILS V18.3 - Zentrale Formatierungsfunktionen
 * ==================================================================================
 * ZWECK: Eliminiert Code-Duplizierung über alle Pages hinweg
 * - Deutsche Formatierung (DIN 5008)
 * - Konsistente Währung/Datum/Status-Labels
 * - Single Source of Truth für alle Formatierungen
 * ==================================================================================
 */

import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { logger } from "@/lib/logger";

/**
 * Währung formatieren (DIN 5008)
 * @example formatCurrency(1234.56) => "1.234,56 €"
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return "0,00 €";
  }

  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

/**
 * Datum formatieren (DD.MM.YYYY)
 * @example formatDate('2025-01-18') => "18.01.2025"
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";

  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(date, "dd.MM.yyyy", { locale: de });
  } catch (error) {
    logger.error("Date formatting error", error as Error, { component: "formatDate", dateString });
    return "-";
  }
}

/**
 * Datum + Zeit formatieren (DD.MM.YYYY HH:mm)
 * @example formatDateTime('2025-01-18T14:30:00Z') => "18.01.2025 14:30"
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "-";

  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(date, "dd.MM.yyyy HH:mm", { locale: de });
  } catch (error) {
    logger.error("DateTime formatting error", error as Error, {
      component: "formatDateTime",
      dateString,
    });
    return "-";
  }
}

/**
 * Zeit formatieren (HH:mm)
 * @example formatTime('2025-01-18T14:30:00Z') => "14:30"
 */
export function formatTime(dateString: string | null | undefined): string {
  if (!dateString) return "-";

  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(date, "HH:mm", { locale: de });
  } catch (error) {
    logger.error("Time formatting error", error as Error, { component: "formatTime", dateString });
    return "-";
  }
}

/**
 * Auftragsstatus formatieren (Booking Status)
 */
export function formatBookingStatus(status: string): string {
  const labelMap: Record<string, string> = {
    pending: "Ausstehend",
    confirmed: "Bestätigt",
    in_progress: "In Bearbeitung",
    completed: "Abgeschlossen",
    cancelled: "Storniert",
  };
  return labelMap[status] || status;
}

/**
 * Rechnungsstatus formatieren (Invoice Status)
 */
export function formatInvoiceStatus(status: string): string {
  const labelMap: Record<string, string> = {
    draft: "Entwurf",
    sent: "Versendet",
    paid: "Bezahlt",
    overdue: "Überfällig",
    cancelled: "Storniert",
  };
  return labelMap[status] || status;
}

/**
 * Angebotsstatus formatieren (Offer Status)
 */
export function formatOfferStatus(status: string): string {
  const labelMap: Record<string, string> = {
    draft: "Entwurf",
    sent: "Versendet",
    accepted: "Angenommen",
    declined: "Abgelehnt",
    expired: "Abgelaufen",
  };
  return labelMap[status] || status;
}

/**
 * Schichtstatus formatieren (Shift Status)
 */
export function formatShiftStatus(status: string): string {
  const labelMap: Record<string, string> = {
    available: "Verfügbar",
    busy: "Beschäftigt",
    on_break: "Pause",
    offline: "Offline",
  };
  return labelMap[status] || status;
}

/**
 * Zahlungsstatus formatieren (Payment Status)
 */
export function formatPaymentStatus(status: string): string {
  const labelMap: Record<string, string> = {
    pending: "Ausstehend",
    paid: "Bezahlt",
    failed: "Fehlgeschlagen",
    refunded: "Erstattet",
  };
  return labelMap[status] || status;
}

/**
 * Fahrzeugklasse formatieren (Vehicle Class)
 */
export function formatVehicleClass(vehicleClass: string): string {
  const labelMap: Record<string, string> = {
    "Standard Class": "Standard",
    "Business Class": "Business",
    "First Class": "First",
    Van: "Van",
    Bus: "Bus",
  };
  return labelMap[vehicleClass] || vehicleClass;
}

/**
 * Kombiniert Vor- und Nachnamen zu einem vollständigen Namen.
 *
 * @example
 * getFullName('Max', 'Mustermann') // "Max Mustermann"
 * getFullName('Max', null) // "Max"
 * getFullName(null, null) // "Unbekannt"
 *
 * WICHTIG: Weitere Name-Formatierungs-Funktionen in string-utils.ts:
 * - getInitials(firstName, lastName) → "MM"
 * - formatName(firstName, lastName, options) → Advanced formatting
 * - capitalizeWords(text) → "Max Mustermann"
 */
export function getFullName(firstName: string | null, lastName: string | null): string {
  if (!firstName && !lastName) return "Unbekannt";
  return [firstName, lastName].filter(Boolean).join(" ");
}

/**
 * Formatiert Prozentwerte nach DIN 5008
 * @example formatPercentage(99.8) => "99,8 %"
 */
export function formatPercentage(value: number): string {
  return (
    value.toLocaleString("de-DE", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }) + " %"
  ); // Leerzeichen vor %
}

/**
 * Formatiert Millisekunden
 * @example formatMilliseconds(45) => "45 ms"
 */
export function formatMilliseconds(value: number): string {
  return `${value} ms`; // Leerzeichen vor Einheit
}

/**
 * Formatiert große Zahlen mit deutschen Tausender-Trennzeichen
 * @example formatNumber(247) => "247"
 * @example formatNumber(1234) => "1.234"
 */
export function formatNumber(value: number): string {
  return value.toLocaleString("de-DE");
}

/**
 * Formatiert relative Zeitangaben
 * @example formatRelativeTime(2, 'hours') => "vor 2 Stunden"
 */
export function formatRelativeTime(value: number, unit: "hours" | "day" | "days"): string {
  const translations = {
    hours: value === 1 ? "vor 1 Stunde" : `vor ${value} Stunden`,
    day: `vor ${value} Tag`,
    days: `vor ${value} Tagen`,
  };
  return translations[unit];
}
