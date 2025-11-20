/* ==================================================================================
   EXPIRY-UTILS - Helper-Funktionen für Dokument-Ablauf
   ==================================================================================
   - Berechnet Ablauf-Status basierend auf Datum
   - Erzeugt deutsche Nachrichten
   ================================================================================== */

import { differenceInDays } from 'date-fns';

export type ExpiryStatus = 'success' | 'warning' | 'error' | 'neutral';

/**
 * Berechnet den Ablauf-Status basierend auf einem Datum
 */
export function getExpiryStatus(expiryDate: string | Date | null | undefined): ExpiryStatus {
  if (!expiryDate) return 'neutral';
  
  const date = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const today = new Date();
  const daysUntilExpiry = differenceInDays(date, today);
  
  if (daysUntilExpiry < 0) {
    return 'error'; // Abgelaufen
  } else if (daysUntilExpiry <= 30) {
    return 'warning'; // Läuft bald ab
  } else {
    return 'success'; // Gültig
  }
}

/**
 * Erzeugt eine deutsche Nachricht basierend auf dem Ablaufdatum
 */
export function getExpiryMessage(expiryDate: string | Date | null | undefined): string {
  if (!expiryDate) return 'Kein Ablaufdatum';
  
  const date = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const today = new Date();
  const daysUntilExpiry = differenceInDays(date, today);
  
  if (daysUntilExpiry < 0) {
    return `Abgelaufen (${Math.abs(daysUntilExpiry)} Tage)`;
  } else if (daysUntilExpiry === 0) {
    return 'Läuft heute ab';
  } else if (daysUntilExpiry <= 7) {
    return `Läuft in ${daysUntilExpiry} Tag${daysUntilExpiry !== 1 ? 'en' : ''} ab`;
  } else if (daysUntilExpiry <= 30) {
    return `Läuft in ${daysUntilExpiry} Tagen ab`;
  } else {
    return 'Gültig';
  }
}
