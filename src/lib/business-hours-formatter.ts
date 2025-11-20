/* ==================================================================================
   BUSINESS HOURS FORMATTER V18.2.8
   ==================================================================================
   Nutzerfreundliche Formatierung von Öffnungszeiten
   ================================================================================== */

export function formatBusinessHours(hours: any): string {
  if (!hours || typeof hours !== 'object') {
    return 'Keine Öffnungszeiten angegeben';
  }

  // Konvertiere Object zu lesbarem Format
  const entries = Object.entries(hours);
  
  if (entries.length === 0) {
    return 'Keine Öffnungszeiten angegeben';
  }

  return entries
    .map(([day, time]) => {
      // Formatiere Zeit (füge "Uhr" hinzu wenn nicht vorhanden)
      const timeStr = String(time);
      const formattedTime = timeStr.toLowerCase().includes('uhr') 
        ? timeStr 
        : timeStr === 'Geschlossen' || timeStr === 'geschlossen'
          ? 'Geschlossen'
          : `${timeStr} Uhr`;
      
      return `${day}: ${formattedTime}`;
    })
    .join('\n');
}

export function formatSingleTime(time: string): string {
  if (!time) return '';
  
  // Wenn bereits "Uhr" enthalten, nicht nochmal hinzufügen
  if (time.toLowerCase().includes('uhr')) return time;
  
  // Spezialfälle
  if (time.toLowerCase() === 'geschlossen') return 'Geschlossen';
  if (time === '24/7' || time === '24h') return '24 Stunden geöffnet';
  
  // Standard-Zeit-Format (HH:MM - HH:MM)
  if (time.includes('-')) {
    return `${time} Uhr`;
  }
  
  return time;
}
