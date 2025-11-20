/* ==================================================================================
   DATE-UTILS - Zentrale Date-Helper-Funktionen
   ==================================================================================
   - Date-Manipulation (add, subtract, diff)
   - Date-Vergleiche (isBefore, isAfter, isSame)
   - Business-Logic (isBusinessDay, isWeekend)
   - Relative Time (timeAgo, timeUntil)
   ================================================================================== */

import { 
  addDays, 
  addWeeks, 
  addMonths, 
  addYears,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
  isBefore,
  isAfter,
  isSameDay,
  isSameMonth,
  isSameYear,
  isToday,
  isTomorrow,
  isYesterday,
  isWeekend,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  parseISO,
} from 'date-fns';
import { de } from 'date-fns/locale';

// ============================================================================
// DATE PARSING
// ============================================================================

export function parseDate(date: string | Date | null | undefined): Date | null {
  if (!date) return null;
  if (date instanceof Date) return date;
  try {
    return parseISO(date);
  } catch {
    return null;
  }
}

export function toISOString(date: Date | string | null | undefined): string | null {
  const parsed = parseDate(date);
  if (!parsed) return null;
  return parsed.toISOString();
}

// ============================================================================
// DATE MANIPULATION
// ============================================================================

export function addTime(
  date: Date | string,
  amount: number,
  unit: 'days' | 'weeks' | 'months' | 'years'
): Date {
  const parsed = parseDate(date);
  if (!parsed) throw new Error('Invalid date');

  switch (unit) {
    case 'days': return addDays(parsed, amount);
    case 'weeks': return addWeeks(parsed, amount);
    case 'months': return addMonths(parsed, amount);
    case 'years': return addYears(parsed, amount);
  }
}

export function subtractTime(
  date: Date | string,
  amount: number,
  unit: 'days' | 'weeks' | 'months' | 'years'
): Date {
  const parsed = parseDate(date);
  if (!parsed) throw new Error('Invalid date');

  switch (unit) {
    case 'days': return subDays(parsed, amount);
    case 'weeks': return subWeeks(parsed, amount);
    case 'months': return subMonths(parsed, amount);
    case 'years': return subYears(parsed, amount);
  }
}

// ============================================================================
// DATE COMPARISON
// ============================================================================

export function isBeforeDate(date1: Date | string, date2: Date | string): boolean {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  if (!d1 || !d2) return false;
  return isBefore(d1, d2);
}

export function isAfterDate(date1: Date | string, date2: Date | string): boolean {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  if (!d1 || !d2) return false;
  return isAfter(d1, d2);
}

export function isSameDayDate(date1: Date | string, date2: Date | string): boolean {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  if (!d1 || !d2) return false;
  return isSameDay(d1, d2);
}

// ============================================================================
// DATE DIFFERENCES
// ============================================================================

export function daysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  if (!d1 || !d2) return 0;
  return Math.abs(differenceInDays(d2, d1));
}

export function hoursBetween(date1: Date | string, date2: Date | string): number {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  if (!d1 || !d2) return 0;
  return Math.abs(differenceInHours(d2, d1));
}

export function minutesBetween(date1: Date | string, date2: Date | string): number {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  if (!d1 || !d2) return 0;
  return Math.abs(differenceInMinutes(d2, d1));
}

// ============================================================================
// RELATIVE TIME (Deutsch)
// ============================================================================

export function timeAgo(date: Date | string | null): string {
  const parsed = parseDate(date);
  if (!parsed) return 'Unbekannt';

  const now = new Date();
  const minutes = differenceInMinutes(now, parsed);
  const hours = differenceInHours(now, parsed);
  const days = differenceInDays(now, parsed);

  if (minutes < 1) return 'gerade eben';
  if (minutes < 60) return `vor ${minutes} Min`;
  if (hours < 24) return `vor ${hours} Std`;
  if (days < 7) return `vor ${days} ${days === 1 ? 'Tag' : 'Tagen'}`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `vor ${weeks} ${weeks === 1 ? 'Woche' : 'Wochen'}`;
  }
  if (days < 365) {
    const months = differenceInMonths(now, parsed);
    return `vor ${months} ${months === 1 ? 'Monat' : 'Monaten'}`;
  }

  const years = differenceInYears(now, parsed);
  return `vor ${years} ${years === 1 ? 'Jahr' : 'Jahren'}`;
}

export function timeUntil(date: Date | string | null): string {
  const parsed = parseDate(date);
  if (!parsed) return 'Unbekannt';

  const now = new Date();
  const minutes = differenceInMinutes(parsed, now);
  const hours = differenceInHours(parsed, now);
  const days = differenceInDays(parsed, now);

  if (minutes < 0) return 'Überfällig';
  if (minutes < 1) return 'jetzt';
  if (minutes < 60) return `in ${minutes} Min`;
  if (hours < 24) return `in ${hours} Std`;
  if (days < 7) return `in ${days} ${days === 1 ? 'Tag' : 'Tagen'}`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `in ${weeks} ${weeks === 1 ? 'Woche' : 'Wochen'}`;
  }
  if (days < 365) {
    const months = differenceInMonths(parsed, now);
    return `in ${months} ${months === 1 ? 'Monat' : 'Monaten'}`;
  }

  const years = differenceInYears(parsed, now);
  return `in ${years} ${years === 1 ? 'Jahr' : 'Jahren'}`;
}

// ============================================================================
// BUSINESS LOGIC
// ============================================================================

export function isBusinessDay(date: Date | string): boolean {
  const parsed = parseDate(date);
  if (!parsed) return false;
  return !isWeekend(parsed);
}

export function addBusinessDays(date: Date | string, days: number): Date {
  let current = parseDate(date);
  if (!current) throw new Error('Invalid date');

  let addedDays = 0;
  while (addedDays < days) {
    current = addDays(current, 1);
    if (isBusinessDay(current)) {
      addedDays++;
    }
  }

  return current;
}

// ============================================================================
// DATE RANGES
// ============================================================================

export function getDateRange(
  range: 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth'
): { start: Date; end: Date } {
  const now = new Date();

  switch (range) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) };
    
    case 'yesterday':
      const yesterday = subDays(now, 1);
      return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
    
    case 'thisWeek':
      return { start: startOfWeek(now, { locale: de }), end: endOfWeek(now, { locale: de }) };
    
    case 'lastWeek':
      const lastWeek = subWeeks(now, 1);
      return { 
        start: startOfWeek(lastWeek, { locale: de }), 
        end: endOfWeek(lastWeek, { locale: de }) 
      };
    
    case 'thisMonth':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    
    case 'lastMonth':
      const lastMonth = subMonths(now, 1);
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
  }
}

// ============================================================================
// DATE STATUS
// ============================================================================

export function getDateStatus(date: Date | string | null): 'past' | 'today' | 'tomorrow' | 'future' {
  const parsed = parseDate(date);
  if (!parsed) return 'future';

  if (isToday(parsed)) return 'today';
  if (isTomorrow(parsed)) return 'tomorrow';
  if (isYesterday(parsed) || isBefore(parsed, new Date())) return 'past';
  return 'future';
}

export function isExpiringSoon(date: Date | string | null, days: number = 7): boolean {
  const parsed = parseDate(date);
  if (!parsed) return false;

  const now = new Date();
  const daysUntil = differenceInDays(parsed, now);

  return daysUntil >= 0 && daysUntil <= days;
}

export function isExpired(date: Date | string | null): boolean {
  const parsed = parseDate(date);
  if (!parsed) return false;
  return isBefore(parsed, new Date());
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

export function formatGermanDate(date: Date | string | null): string {
  const parsed = parseDate(date);
  if (!parsed) return 'Unbekannt';
  return format(parsed, 'dd.MM.yyyy', { locale: de });
}

export function formatGermanDateTime(date: Date | string | null): string {
  const parsed = parseDate(date);
  if (!parsed) return 'Unbekannt';
  return format(parsed, 'dd.MM.yyyy HH:mm', { locale: de });
}

export function formatGermanTime(date: Date | string | null): string {
  const parsed = parseDate(date);
  if (!parsed) return 'Unbekannt';
  return format(parsed, 'HH:mm', { locale: de });
}
