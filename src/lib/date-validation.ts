/* ==================================================================================
   DATUMS-VALIDIERUNG - Keine rückwirkenden Buchungen
   ==================================================================================
   - Nur Zukunftsdaten erlaubt
   - 5 Minuten Toleranz für aktuelle Zeit
   - Verwendet von Aufträgen, Angeboten, Rechnungen
   ================================================================================== */

import { addMinutes, isBefore, startOfDay } from 'date-fns';

/**
 * Prüft ob ein Datum in der Zukunft liegt (mit 5min Toleranz)
 */
export function isFutureDate(date: Date): boolean {
  const now = new Date();
  const toleranceDate = addMinutes(now, -5);
  return !isBefore(date, toleranceDate);
}

/**
 * Validiert ein Buchungsdatum mit Mindestvorlauf
 * @throws Error wenn Datum in Vergangenheit liegt oder Mindestvorlauf unterschreitet
 */
export function validateFutureBooking(pickupDate: Date, minimumLeadTimeMinutes?: number): void {
  if (!isFutureDate(pickupDate)) {
    throw new Error(
      'Rückwirkende Buchungen sind nicht erlaubt. Bitte wählen Sie einen Zeitpunkt in der Zukunft.'
    );
  }

  // Prüfe Mindestvorlauf (falls gesetzt)
  if (minimumLeadTimeMinutes && minimumLeadTimeMinutes > 0) {
    const now = new Date();
    const minPickupTime = addMinutes(now, minimumLeadTimeMinutes);

    if (isBefore(pickupDate, minPickupTime)) {
      const hours = Math.floor(minimumLeadTimeMinutes / 60);
      const minutes = minimumLeadTimeMinutes % 60;
      const leadTimeLabel = hours > 0
        ? minutes > 0
          ? `${hours},${minutes} Stunden`
          : `${hours} ${hours === 1 ? 'Stunde' : 'Stunden'}`
        : `${minutes} Minuten`;

      throw new Error(
        `Mindestvorlauf unterschritten. Aufträge müssen mindestens ${leadTimeLabel} im Voraus gebucht werden. Früheste mögliche Abholzeit: ${minPickupTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
      );
    }
  }
}

/**
 * Prüft ob ein Datum heute oder in der Zukunft liegt
 */
export function isTodayOrFuture(date: Date): boolean {
  const today = startOfDay(new Date());
  const checkDate = startOfDay(date);
  return !isBefore(checkDate, today);
}

/**
 * Formatiert Fehlermeldung für ungültige Datumsauswahl
 */
export function getDateValidationMessage(date: Date): string {
  const now = new Date();
  if (isBefore(date, now)) {
    return 'Das gewählte Datum liegt in der Vergangenheit. Bitte wählen Sie einen Zeitpunkt in der Zukunft.';
  }
  return '';
}

/**
 * Prüft ob Schichtzettel noch bearbeitbar ist
 * Fahrer: Nur am selben Tag
 * Unternehmer: Bis 10 Tage rückwirkend (gesetzliche Frist Deutschland)
 */
export function canEditShift(shiftDate: Date, isDriver: boolean): boolean {
  const today = startOfDay(new Date());
  const shift = startOfDay(shiftDate);
  const daysAgo = Math.floor((today.getTime() - shift.getTime()) / (1000 * 60 * 60 * 24));

  if (isDriver) {
    return daysAgo === 0; // Nur heute
  }

  return daysAgo <= 10; // Unternehmer: 10 Tage
}
