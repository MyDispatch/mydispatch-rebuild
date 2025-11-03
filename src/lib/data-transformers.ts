/**
 * DATA TRANSFORMERS V1.0
 * 
 * Zentrale Transformations-Funktionen für:
 * - Supabase DB → Frontend Display
 * - Frontend Form → Supabase DB
 * - Export Formatting (PDF/Excel/CSV)
 */

import { format } from 'date-fns';
import { de } from 'date-fns/locale';

/**
 * Transform Supabase timestamp to readable German format
 */
export function formatTimestamp(timestamp: string | null | undefined): string {
  if (!timestamp) return '-';
  
  try {
    const date = new Date(timestamp);
    return format(date, 'dd.MM.yyyy HH:mm', { locale: de });
  } catch {
    return '-';
  }
}

/**
 * Transform Supabase date to German date format
 */
export function formatDate(date: string | null | undefined): string {
  if (!date) return '-';
  
  try {
    const parsedDate = new Date(date);
    return format(parsedDate, 'dd.MM.yyyy', { locale: de });
  } catch {
    return '-';
  }
}

/**
 * Transform currency amount (cents) to Euro display
 */
export function formatCurrency(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return '-';
  
  const euros = cents / 100;
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(euros);
}

/**
 * Transform percentage (0-1) to display format
 */
export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Transform boolean to German Yes/No
 */
export function formatBoolean(value: boolean | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return value ? 'Ja' : 'Nein';
}

/**
 * Transform status enum to German display
 */
export function formatStatus(status: string | null | undefined): string {
  if (!status) return '-';
  
  const statusMap: Record<string, string> = {
    'pending': 'Ausstehend',
    'in_progress': 'In Bearbeitung',
    'completed': 'Abgeschlossen',
    'cancelled': 'Storniert',
    'active': 'Aktiv',
    'inactive': 'Inaktiv',
    'archived': 'Archiviert',
  };
  
  return statusMap[status] || status;
}

/**
 * Transform address object to single-line string
 */
export interface Address {
  street?: string;
  city?: string;
  zip?: string;
  country?: string;
}

export function formatAddress(address: Address | null | undefined): string {
  if (!address) return '-';
  
  const parts = [
    address.street,
    address.zip && address.city ? `${address.zip} ${address.city}` : address.city,
    address.country,
  ].filter(Boolean);
  
  return parts.length > 0 ? parts.join(', ') : '-';
}

/**
 * Transform phone number to German format
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '-';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format: +49 123 4567890
  if (digits.startsWith('49')) {
    return `+49 ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  
  return phone;
}

/**
 * Transform list of items to comma-separated string
 */
export function formatList(items: string[] | null | undefined): string {
  if (!items || items.length === 0) return '-';
  return items.join(', ');
}

/**
 * Truncate long text with ellipsis
 */
export function truncateText(text: string | null | undefined, maxLength: number = 50): string {
  if (!text) return '-';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Transform file size (bytes) to human-readable format
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined) return '-';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Transform duration (seconds) to human-readable format
 */
export function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) return '-';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
}

/**
 * Transform coordinates to Google Maps link
 */
export interface Coordinates {
  lat: number;
  lng: number;
}

export function formatCoordinates(coords: Coordinates | null | undefined): string {
  if (!coords) return '-';
  return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
}

export function getGoogleMapsLink(coords: Coordinates | null | undefined): string | null {
  if (!coords) return null;
  return `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
}

/**
 * Transform enum to badge variant
 */
export type BadgeVariant = 'default' | 'success' | 'warning' | 'error';

export function getStatusBadgeVariant(status: string): BadgeVariant {
  const variantMap: Record<string, BadgeVariant> = {
    'completed': 'success',
    'active': 'success',
    'in_progress': 'warning',
    'pending': 'warning',
    'cancelled': 'error',
    'inactive': 'error',
    'archived': 'default',
  };
  
  return variantMap[status] || 'default';
}

/**
 * Sanitize user input for display
 */
export function sanitizeInput(input: string | null | undefined): string {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < >
    .trim();
}

/**
 * Parse CSV string to array
 */
export function parseCSV(csv: string): string[][] {
  const lines = csv.split('\n');
  return lines.map(line => line.split(',').map(cell => cell.trim()));
}

/**
 * Convert array of objects to CSV string
 */
export function arrayToCSV<T extends Record<string, any>>(
  data: T[],
  headers: (keyof T)[]
): string {
  const headerRow = headers.join(',');
  const dataRows = data.map(row => 
    headers.map(header => String(row[header] || '')).join(',')
  );
  
  return [headerRow, ...dataRows].join('\n');
}
