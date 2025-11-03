/**
 * Unit Tests - Dashboard Data Formatting
 * Phase 5: Testing Coverage
 */

import { describe, it, expect } from 'vitest';
import { format } from 'date-fns';

// Mock formatting functions (to be extracted from use-dashboard-queries)
const groupByDate = (
  bookings: Array<{ created_at: string; price: number }>
): Array<{ date: string; amount: number }> => {
  const grouped: Record<string, number> = {};

  bookings.forEach((booking) => {
    const date = format(new Date(booking.created_at), 'dd.MM');
    grouped[date] = (grouped[date] || 0) + booking.price;
  });

  return Object.entries(grouped).map(([date, amount]) => ({
    date,
    amount,
  }));
};

const countByStatus = (
  bookings: Array<{ status: string }>
): Array<{ status: string; value: number; label: string }> => {
  const counts: Record<string, number> = {};

  bookings.forEach((booking) => {
    const status = booking.status || 'unknown';
    counts[status] = (counts[status] || 0) + 1;
  });

  const statusLabels: Record<string, string> = {
    pending: 'Wartend',
    confirmed: 'Bestätigt',
    in_progress: 'In Bearbeitung',
    completed: 'Abgeschlossen',
    cancelled: 'Storniert',
  };

  return Object.entries(counts).map(([status, value]) => ({
    status,
    value,
    label: statusLabels[status] || status,
  }));
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

describe('Dashboard Data Formatting', () => {
  describe('groupByDate', () => {
    it('should group revenue by date (DD.MM)', () => {
      const bookings = [
        { created_at: '2025-10-20T10:00:00Z', price: 100 },
        { created_at: '2025-10-20T14:00:00Z', price: 50 },
        { created_at: '2025-10-21T10:00:00Z', price: 200 },
      ];

      const result = groupByDate(bookings);

      expect(result).toEqual([
        { date: '20.10', amount: 150 },
        { date: '21.10', amount: 200 },
      ]);
    });

    it('should handle empty bookings array', () => {
      const result = groupByDate([]);
      expect(result).toEqual([]);
    });

    it('should handle single booking', () => {
      const bookings = [{ created_at: '2025-10-20T10:00:00Z', price: 100 }];
      const result = groupByDate(bookings);
      expect(result).toEqual([{ date: '20.10', amount: 100 }]);
    });
  });

  describe('countByStatus', () => {
    it('should count bookings by status', () => {
      const bookings = [
        { status: 'pending' },
        { status: 'confirmed' },
        { status: 'pending' },
        { status: 'completed' },
      ];

      const result = countByStatus(bookings);

      expect(result).toEqual([
        { status: 'pending', value: 2, label: 'Wartend' },
        { status: 'confirmed', value: 1, label: 'Bestätigt' },
        { status: 'completed', value: 1, label: 'Abgeschlossen' },
      ]);
    });

    it('should handle empty bookings array', () => {
      const result = countByStatus([]);
      expect(result).toEqual([]);
    });

    it('should handle unknown status', () => {
      const bookings = [{ status: 'unknown_status' }];
      const result = countByStatus(bookings);
      expect(result[0].label).toBe('unknown_status');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('1.234,56 €');
      expect(formatCurrency(0)).toBe('0,00 €');
      expect(formatCurrency(1000000)).toBe('1.000.000,00 €');
    });

    it('should handle negative values', () => {
      expect(formatCurrency(-100)).toBe('-100,00 €');
    });

    it('should handle decimal precision', () => {
      expect(formatCurrency(10.999)).toBe('11,00 €');
      expect(formatCurrency(10.001)).toBe('10,00 €');
    });
  });
});
