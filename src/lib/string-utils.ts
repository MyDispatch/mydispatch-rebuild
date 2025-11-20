/* ==================================================================================
   STRING-UTILS - Zentrale String-Operationen
   ==================================================================================
   - Truncate, Slugify, Capitalize
   - Name-Formatierung
   - Text-Manipulation
   ================================================================================== */

// ============================================================================
// TEXT TRUNCATION
// ============================================================================

export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

export function truncateWords(text: string, maxWords: number, suffix: string = '...'): string {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + suffix;
}

// ============================================================================
// CASE CONVERSION
// ============================================================================

export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function capitalizeWords(text: string): string {
  if (!text) return '';
  return text
    .split(/\s+/)
    .map(word => capitalize(word))
    .join(' ');
}

export function toCamelCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
}

export function toKebabCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function toSnakeCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// ============================================================================
// SLUGIFY (URL-Safe Strings)
// ============================================================================

const DIACRITICS_MAP: Record<string, string> = {
  'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss',
  'Ä': 'Ae', 'Ö': 'Oe', 'Ü': 'Ue',
  'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a',
  'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
  'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
  'ó': 'o', 'ò': 'o', 'ô': 'o', 'õ': 'o',
  'ú': 'u', 'ù': 'u', 'û': 'u',
};

export function slugify(text: string): string {
  if (!text) return '';

  // Replace diacritics
  let slug = text
    .split('')
    .map(char => DIACRITICS_MAP[char] || char)
    .join('');

  // Convert to kebab-case and remove special chars
  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug;
}

// ============================================================================
// NAME FORMATTING
// ============================================================================

export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last || '?';
}

// getFullName moved to format-utils.ts to avoid duplication
// Use: import { getFullName } from '@/lib/format-utils';

export function formatName(
  firstName?: string | null,
  lastName?: string | null,
  options: { lastNameFirst?: boolean; uppercase?: boolean } = {}
): string {
  const { lastNameFirst = false, uppercase = false } = options;

  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';

  if (!first && !last) return 'Unbekannt';

  let name = lastNameFirst ? `${last}, ${first}` : `${first} ${last}`;
  name = name.trim();

  return uppercase ? name.toUpperCase() : name;
}

// ============================================================================
// TEXT CLEANING
// ============================================================================

export function removeExtraSpaces(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function removeDiacritics(text: string): string {
  return text
    .split('')
    .map(char => DIACRITICS_MAP[char] || char)
    .join('');
}

export function sanitizeInput(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/[^\w\s\-.,!?äöüÄÖÜß@]/g, '') // Remove special chars
    .trim();
}

// ============================================================================
// STRING COMPARISON
// ============================================================================

export function isEqualIgnoreCase(str1: string, str2: string): boolean {
  return str1.toLowerCase() === str2.toLowerCase();
}

export function containsIgnoreCase(text: string, search: string): boolean {
  return text.toLowerCase().includes(search.toLowerCase());
}

// ============================================================================
// EXCERPTS & SUMMARIES
// ============================================================================

export function createExcerpt(text: string, maxLength: number = 150): string {
  const cleaned = removeExtraSpaces(text);
  if (cleaned.length <= maxLength) return cleaned;

  // Find last sentence end before maxLength
  const excerpt = cleaned.slice(0, maxLength);
  const lastPeriod = excerpt.lastIndexOf('.');
  const lastExclamation = excerpt.lastIndexOf('!');
  const lastQuestion = excerpt.lastIndexOf('?');

  const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);

  if (lastSentenceEnd > maxLength * 0.6) {
    return cleaned.slice(0, lastSentenceEnd + 1);
  }

  return truncate(cleaned, maxLength);
}

// ============================================================================
// PLURALIZATION (German)
// ============================================================================

export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  if (count === 1) return singular;
  return plural || singular + 'e'; // Simple German pluralization
}

export function pluralizeWithCount(
  count: number,
  singular: string,
  plural?: string
): string {
  return `${count} ${pluralize(count, singular, plural)}`;
}

// ============================================================================
// MASKING
// ============================================================================

export function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;

  const visibleChars = Math.min(3, Math.floor(username.length / 2));
  const masked = username.slice(0, visibleChars) + '*'.repeat(username.length - visibleChars);

  return `${masked}@${domain}`;
}

export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return phone;

  const visible = cleaned.slice(-4);
  const masked = '*'.repeat(cleaned.length - 4);

  return masked + visible;
}

export function maskIBAN(iban: string): string {
  const cleaned = iban.replace(/\s/g, '');
  if (cleaned.length < 8) return iban;

  const start = cleaned.slice(0, 4);
  const end = cleaned.slice(-4);
  const masked = '*'.repeat(cleaned.length - 8);

  return `${start}${masked}${end}`;
}
