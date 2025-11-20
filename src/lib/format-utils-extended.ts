/* ==================================================================================
   FORMAT UTILITIES EXTENDED - V18.2.8
   ==================================================================================
   Erweiterte Formatierungsfunktionen nach deutscher Rechtschreibreform
   und DIN 5008 - SYSTEMWEIT VERWENDEN!
   ================================================================================== */

/**
 * Formatiert Uhrzeit im deutschen 24h-Format
 * @param date - ISO Date String oder Date Object
 * @returns Formatierter String (z.B. "14:30 Uhr")
 */
export const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return (
    dateObj.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    }) + " Uhr"
  );
};

/**
 * Formatiert Datum + Uhrzeit im deutschen Format
 * @param date - ISO Date String oder Date Object
 * @returns Formatierter String (z.B. "15.01.2025, 14:30 Uhr")
 */
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const dateStr = dateObj.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timeStr = dateObj.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateStr}, ${timeStr} Uhr`;
};

/**
 * Formatiert Prozent-Wert nach DIN 5008
 * @param value - Prozent-Wert (z.B. 19.5)
 * @returns Formatierter String (z.B. "19,5 %")
 */
export const formatPercentage = (value: number): string => {
  const formatted = value.toLocaleString("de-DE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${formatted} %`; // Leerzeichen vor % (DIN 5008)
};

/**
 * Formatiert Distanz in Metern/Kilometern
 * @param meters - Distanz in Metern
 * @returns Formatierter String (z.B. "5,2 km" oder "850 m")
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`; // Leerzeichen vor Einheit
  }
  const km = meters / 1000;
  const formatted = km.toLocaleString("de-DE", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
  return `${formatted} km`; // Leerzeichen vor Einheit
};

/**
 * Formatiert Geschwindigkeit in km/h
 * @param kmh - Geschwindigkeit in km/h
 * @returns Formatierter String (z.B. "120 km/h")
 */
export const formatSpeed = (kmh: number): string => {
  return `${Math.round(kmh)} km/h`; // Leerzeichen vor Einheit
};

/**
 * Formatiert Dauer in Minuten/Stunden
 * @param minutes - Dauer in Minuten
 * @returns Formatierter String (z.B. "2 h 30 min" oder "45 min")
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (mins === 0) {
    return `${hours} h`;
  }
  return `${hours} h ${mins} min`;
};

/**
 * Formatiert vollständige Anrede (Herr/Frau/Divers + Titel + Name)
 * @param salutation - Anrede (Herr/Frau/Divers)
 * @param title - Titel (Dr./Prof./etc.)
 * @param firstName - Vorname
 * @param lastName - Nachname
 * @returns Formatierter String (z.B. "Herr Dr. Max Mustermann")
 */
export const formatFullName = (
  salutation?: string,
  title?: string,
  firstName?: string,
  lastName?: string
): string => {
  const parts = [salutation, title, firstName, lastName].filter(Boolean);

  return parts.join(" ");
};

/**
 * Formatiert Briefanrede nach deutscher Norm
 * @param salutation - Anrede (Herr/Frau/Divers)
 * @param title - Titel (Dr./Prof./etc.)
 * @param firstName - Vorname
 * @param lastName - Nachname
 * @returns Formatierter String (z.B. "Sehr geehrter Herr Dr. Mustermann,")
 */
export const formatLetterSalutation = (
  salutation?: string,
  title?: string,
  firstName?: string,
  lastName?: string
): string => {
  // Divers → geschlechtsneutrale Anrede
  if (salutation === "Divers") {
    return `Guten Tag ${firstName} ${lastName},`;
  }

  // Standard: Sehr geehrte/r Herr/Frau
  const prefix = salutation === "Frau" ? "Sehr geehrte" : "Sehr geehrter";
  const titlePart = title ? ` ${title}` : "";

  return `${prefix} ${salutation}${titlePart} ${lastName},`;
};

/**
 * Formatiert Adresse (einzeilig)
 * @param street - Straßenname
 * @param streetNumber - Hausnummer
 * @param postalCode - PLZ
 * @param city - Stadt
 * @returns Formatierter String (z.B. "Hauptstraße 42a, 80331 München")
 */
export const formatAddressSingleLine = (
  street?: string,
  streetNumber?: string,
  postalCode?: string,
  city?: string
): string => {
  if (!street || !city) return "";

  const streetPart = [street, streetNumber].filter(Boolean).join(" ");
  const cityPart = [postalCode, city].filter(Boolean).join(" ");

  return `${streetPart}, ${cityPart}`;
};

/**
 * Formatiert Telefonnummer im deutschen Format
 * @param phone - Telefonnummer (z.B. "+491708004423" oder "01708004423")
 * @returns Formatierter String (z.B. "+49 170 8004423")
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\s+/g, "").replace(/^00/, "+");

  // Deutsche Mobilnummer mit +49
  if (cleaned.startsWith("+49")) {
    const main = cleaned.substring(3);
    if (main.length >= 10) {
      return `+49 ${main.substring(0, 3)} ${main.substring(3)}`;
    }
    return cleaned;
  }

  // Deutsche Mobilnummer mit 0
  if (cleaned.startsWith("0") && cleaned.length >= 11) {
    const main = cleaned.substring(1);
    return `+49 ${main.substring(0, 3)} ${main.substring(3)}`;
  }

  return phone; // Fallback: Original-Format
};

/**
 * Formatiert Koordinaten (Latitude/Longitude)
 * @param lat - Breitengrad
 * @param lng - Längengrad
 * @returns Formatierter String (z.B. "48.1351°N, 11.5820°E")
 */
export const formatCoordinates = (lat: number, lng: number): string => {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";

  const latStr = Math.abs(lat).toFixed(4);
  const lngStr = Math.abs(lng).toFixed(4);

  return `${latStr}°${latDir}, ${lngStr}°${lngDir}`;
};
