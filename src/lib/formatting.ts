/* ==================================================================================
   FORMATTING UTILITIES - DIN 5008 Konform (Deutsche Formatierung)
   ==================================================================================
   Erstellt: 2025-01-31
   Zweck: Zentrale Formatierungs-Funktionen nach DIN 5008
   Autor: NeXify AI MASTER
   Qualität: Logik-basiert, Type-Safe, Vollständig getestet
   ================================================================================== */

/**
 * Formatiert eine Zahl als Währung nach DIN 5008
 * Format: 1.234,56 €
 * 
 * @param value - Betrag in Euro (z.B. 1234.56)
 * @param currency - Währungssymbol (Default: '€')
 * @returns Formatierter Währungs-String (z.B. "1.234,56 €")
 */
export function formatCurrency(value: number, currency: string = '€'): string {
  if (isNaN(value) || !isFinite(value)) {
    return `0,00 ${currency}`;
  }

  // Auf 2 Dezimalstellen runden
  const rounded = Math.round(value * 100) / 100;
  
  // In String umwandeln und nach Dezimalpunkt trennen
  const parts = rounded.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '00';
  
  // Tausendertrenner (Punkte) einfügen
  const integerWithSeparators = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // Dezimalstellen auf 2 Stellen auffüllen
  const decimalFormatted = decimalPart.padEnd(2, '0').slice(0, 2);
  
  // Komma als Dezimaltrennzeichen
  return `${integerWithSeparators},${decimalFormatted} ${currency}`;
}

/**
 * Formatiert ein Datum nach DIN 5008
 * Format: DD.MM.YYYY oder DD.MM.YYYY HH:mm
 * 
 * @param date - Date-Objekt oder ISO-String
 * @param includeTime - Ob Uhrzeit angezeigt werden soll (Default: false)
 * @returns Formatierter Datums-String (z.B. "31.01.2025" oder "31.01.2025 14:30")
 */
export function formatDate(date: Date | string, includeTime: boolean = false): string {
  let dateObj: Date;
  
  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date');
  }

  // Tag, Monat, Jahr extrahieren
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();

  let formatted = `${day}.${month}.${year}`;

  // Uhrzeit hinzufügen, wenn gewünscht
  if (includeTime) {
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    formatted = `${formatted} ${hours}:${minutes}`;
  }

  return formatted;
}

/**
 * Formatiert eine Zahl mit Tausendertrennern nach DIN 5008
 * Format: 1.234.567 (Punkte als Tausendertrenner)
 * 
 * @param value - Zahl (z.B. 1234567)
 * @param decimals - Anzahl Dezimalstellen (Default: 0)
 * @returns Formatierter Zahlen-String (z.B. "1.234.567" oder "1.234.567,89")
 */
export function formatNumber(value: number, decimals: number = 0): string {
  if (isNaN(value) || !isFinite(value)) {
    return decimals > 0 ? `0,${'0'.repeat(decimals)}` : '0';
  }

  // Auf gewünschte Dezimalstellen runden
  const rounded = decimals > 0 
    ? Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
    : Math.round(value);

  // In String umwandeln
  const parts = rounded.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';

  // Tausendertrenner (Punkte) einfügen
  const integerWithSeparators = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Dezimalstellen formatieren (Komma als Dezimaltrennzeichen)
  if (decimals > 0) {
    const decimalFormatted = decimalPart.padEnd(decimals, '0').slice(0, decimals);
    return `${integerWithSeparators},${decimalFormatted}`;
  }

  return integerWithSeparators;
}

/**
 * Formatiert eine Prozentzahl nach DIN 5008
 * Format: 42 % (Leerzeichen vor %)
 * 
 * @param value - Prozentzahl (z.B. 42.5 für 42,5%)
 * @param decimals - Anzahl Dezimalstellen (Default: 0)
 * @returns Formatierter Prozent-String (z.B. "42 %" oder "42,5 %")
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  if (isNaN(value) || !isFinite(value)) {
    return `0 %`;
  }

  const formatted = formatNumber(value, decimals);
  return `${formatted} %`;
}

/**
 * Formatiert eine Telefonnummer (Deutsches Format)
 * Format: +49 123 456789 oder 0123 456789
 * 
 * @param phoneNumber - Telefonnummer (z.B. "0123456789" oder "+49123456789")
 * @returns Formatierte Telefonnummer
 */
export function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return '';

  // Nur Zahlen und + entfernen
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');

  // Internationales Format (+49...)
  if (cleaned.startsWith('+49')) {
    const rest = cleaned.slice(3);
    if (rest.length === 10) {
      // Mobilnummer: +49 123 456789
      return `+49 ${rest.slice(0, 3)} ${rest.slice(3)}`;
    } else if (rest.length === 11) {
      // Festnetz: +49 123 4567890
      return `+49 ${rest.slice(0, 3)} ${rest.slice(3, 7)} ${rest.slice(7)}`;
    }
    return cleaned;
  }

  // Nationales Format (0...)
  if (cleaned.startsWith('0')) {
    const rest = cleaned.slice(1);
    if (rest.length === 9 || rest.length === 10) {
      // 0123 456789 oder 0123 4567890
      return `0${rest.slice(0, 3)} ${rest.slice(3)}`;
    }
    return cleaned;
  }

  return phoneNumber;
}

/**
 * Formatiert eine Dauer in Stunden und Minuten
 * Format: 2h 30min oder 45min
 * 
 * @param minutes - Dauer in Minuten
 * @returns Formatierte Dauer
 */
export function formatDuration(minutes: number): string {
  if (isNaN(minutes) || minutes < 0) {
    return '0min';
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}min`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}min`;
  }
}

/**
 * Formatiert eine Datei-Größe
 * Format: 1.234,56 MB oder 1.234,56 KB
 * 
 * @param bytes - Datei-Größe in Bytes
 * @returns Formatierte Größe
 */
export function formatFileSize(bytes: number): string {
  if (isNaN(bytes) || bytes < 0) {
    return '0 B';
  }

  const kb = bytes / 1024;
  const mb = kb / 1024;
  const gb = mb / 1024;

  if (gb >= 1) {
    return `${formatNumber(gb, 2)} GB`;
  } else if (mb >= 1) {
    return `${formatNumber(mb, 2)} MB`;
  } else if (kb >= 1) {
    return `${formatNumber(kb, 2)} KB`;
  } else {
    return `${formatNumber(bytes, 0)} B`;
  }
}

