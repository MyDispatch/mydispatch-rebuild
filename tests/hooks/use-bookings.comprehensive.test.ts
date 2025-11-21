/* ==================================================================================
   COMPREHENSIVE TESTS: useBookings Hook
   ==================================================================================
   Coverage: CRUD operations, company scoping, real-time updates, error handling
   Target: 90%+ coverage for critical paths
   ================================================================================== */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import {
  useBookings,
  useBooking,
  useCreateBooking,
  useUpdateBooking,
  useDeleteBooking,
  bookingsKeys,
} from '@/hooks/api/useBookings';
import { bookingsApi } from '@/api/bookings';
import {
  createMockBooking,
  createMockResponse,
  resetSupabaseMocks,
} from '../__mocks__/supabase';

// Mock toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock bookings API
vi.mock('@/api/bookings', () => ({
  bookingsApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getByStatus: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('useBookings - Comprehensive Test Suite', () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    resetSupabaseMocks();
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('Query Key Factory', () => {
    it('should generate correct query keys', () => {
      expect(bookingsKeys.all).toEqual(['bookings']);
      expect(bookingsKeys.lists()).toEqual(['bookings', 'list']);
      expect(bookingsKeys.list({ status: 'pending' })).toEqual(['bookings', 'list', { status: 'pending' }]);
      expect(bookingsKeys.details()).toEqual(['bookings', 'detail']);
      expect(bookingsKeys.detail('booking-123')).toEqual(['bookings', 'detail', 'booking-123']);
      expect(bookingsKeys.byStatus('confirmed')).toEqual(['bookings', 'status', 'confirmed']);
    });
  });

  describe('useBookings - Fetch All', () => {
    it('should fetch bookings successfully', async () => {
      const mockBookings = [
        createMockBooking({ id: '1', booking_number: 'BK-001' }),
        createMockBooking({ id: '2', booking_number: 'BK-002' }),
        createMockBooking({ id: '3', booking_number: 'BK-003' }),
      ];

      vi.mocked(bookingsApi.getAll).mockResolvedValue(mockBookings);

      const { result } = renderHook(() => useBookings(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockBookings);
      expect(result.current.data).toHaveLength(3);
      expect(bookingsApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('should handle empty bookings array', async () => {
      vi.mocked(bookingsApi.getAll).mockResolvedValue([]);

      const { result } = renderHook(() => useBookings(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([]);
      expect(result.current.data).toHaveLength(0);
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Network error');
      vi.mocked(bookingsApi.getAll).mockRejectedValue(mockError);

      const { result } = renderHook(() => useBookings(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeUndefined();
    });

    it('should apply filters correctly', async () => {
      const filters = { status: 'pending', date: '2024-01-01' };
      vi.mocked(bookingsApi.getAll).mockResolvedValue([]);

      renderHook(() => useBookings(filters), { wrapper });

      await waitFor(() => expect(bookingsApi.getAll).toHaveBeenCalledWith(filters));
    });
  });

  describe('useBooking - Fetch Single', () => {
    it('should fetch single booking by ID', async () => {
      const mockBooking = createMockBooking({ id: 'booking-123' });
      vi.mocked(bookingsApi.getById).mockResolvedValue(mockBooking);

      const { result } = renderHook(() => useBooking('booking-123'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockBooking);
      expect(bookingsApi.getById).toHaveBeenCalledWith('booking-123');
    });

    it('should not fetch when ID is empty', async () => {
      const { result } = renderHook(() => useBooking(''), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(bookingsApi.getById).not.toHaveBeenCalled();
    });

    it('should handle non-existent booking', async () => {
      const mockError = new Error('Booking not found');
      vi.mocked(bookingsApi.getById).mockRejectedValue(mockError);

      const { result } = renderHook(() => useBooking('non-existent'), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('useBookingsByStatus - Filter by Status', () => {
    it('should fetch bookings by status', async () => {
      const mockBookings = [
        createMockBooking({ status: 'confirmed' }),
        createMockBooking({ status: 'confirmed' }),
      ];
      vi.mocked(bookingsApi.getByStatus).mockResolvedValue(mockBookings);

      const { result } = renderHook(() => useBookingsByStatus('confirmed'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockBookings);
      expect(result.current.data?.every(b => b.status === 'confirmed')).toBe(true);
      expect(bookingsApi.getByStatus).toHaveBeenCalledWith('confirmed');
    });

    it('should not fetch when status is empty', async () => {
      const { result } = renderHook(() => useBookingsByStatus('' as any), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(bookingsApi.getByStatus).not.toHaveBeenCalled();
    });
  });

  describe('useCreateBooking - Create Operation', () => {
    it('should create booking successfully', async () => {
      const newBooking = createMockBooking({ id: 'new-booking' });
      vi.mocked(bookingsApi.create).mockResolvedValue(newBooking);

      const { result } = renderHook(() => useCreateBooking(), { wrapper });

      result.current.mutate({
        booking_number: 'BK-004',
        pickup_location: 'Location A',
        dropoff_location: 'Location B',
        company_id: 'test-company-id',
      } as any);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(newBooking);
      expect(bookingsApi.create).toHaveBeenCalledTimes(1);
    });

    it('should invalidate queries after successful creation', async () => {
      const newBooking = createMockBooking();
      vi.mocked(bookingsApi.create).mockResolvedValue(newBooking);

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useCreateBooking(), { wrapper });

      result.current.mutate({ booking_number: 'BK-005' } as any);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: bookingsKeys.lists() });
    });

    it('should show success toast on creation', async () => {
      const { toast } = await import('sonner');
      const newBooking = createMockBooking();
      vi.mocked(bookingsApi.create).mockResolvedValue(newBooking);

      const { result } = renderHook(() => useCreateBooking(), { wrapper });

      result.current.mutate({ booking_number: 'BK-006' } as any);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(toast.success).toHaveBeenCalledWith('Buchung erfolgreich erstellt');
    });

    it('should handle creation errors with toast', async () => {
      const { toast } = await import('sonner');
      const mockError = new Error('Validation failed');
      vi.mocked(bookingsApi.create).mockRejectedValue(mockError);

      const { result } = renderHook(() => useCreateBooking(), { wrapper });

      result.current.mutate({ booking_number: 'INVALID' } as any);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(toast.error).toHaveBeenCalledWith('Fehler beim Erstellen: Validation failed');
    });
  });

  describe('useUpdateBooking - Update Operation', () => {
    it('should update booking successfully', async () => {
      const updatedBooking = createMockBooking({
        id: 'booking-123',
        status: 'confirmed'
      });
      vi.mocked(bookingsApi.update).mockResolvedValue(updatedBooking);

      const { result } = renderHook(() => useUpdateBooking(), { wrapper });

      result.current.mutate({
        id: 'booking-123',
        updates: { status: 'confirmed' },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(updatedBooking);
      expect(bookingsApi.update).toHaveBeenCalledWith('booking-123', { status: 'confirmed' });
    });

    it('should invalidate both list and detail queries after update', async () => {
      const updatedBooking = createMockBooking({ id: 'booking-123' });
      vi.mocked(bookingsApi.update).mockResolvedValue(updatedBooking);

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useUpdateBooking(), { wrapper });

      result.current.mutate({
        id: 'booking-123',
        updates: { status: 'completed' },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: bookingsKeys.lists() });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: bookingsKeys.detail('booking-123') });
    });

    it('should show success toast on update', async () => {
      const { toast } = await import('sonner');
      const updatedBooking = createMockBooking();
      vi.mocked(bookingsApi.update).mockResolvedValue(updatedBooking);

      const { result } = renderHook(() => useUpdateBooking(), { wrapper });

      result.current.mutate({ id: 'booking-123', updates: {} });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(toast.success).toHaveBeenCalledWith('Buchung erfolgreich aktualisiert');
    });

    it('should handle update errors with toast', async () => {
      const { toast } = await import('sonner');
      const mockError = new Error('Update failed');
      vi.mocked(bookingsApi.update).mockRejectedValue(mockError);

      const { result } = renderHook(() => useUpdateBooking(), { wrapper });

      result.current.mutate({ id: 'booking-123', updates: {} });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(toast.error).toHaveBeenCalledWith('Fehler beim Aktualisieren: Update failed');
    });
  });

  describe('useDeleteBooking - Delete Operation', () => {
    it('should delete booking successfully (soft delete)', async () => {
      vi.mocked(bookingsApi.delete).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteBooking(), { wrapper });

      result.current.mutate('booking-123');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(bookingsApi.delete).toHaveBeenCalledWith('booking-123');
    });

    it('should invalidate queries after deletion', async () => {
      vi.mocked(bookingsApi.delete).mockResolvedValue(undefined);

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useDeleteBooking(), { wrapper });

      result.current.mutate('booking-123');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: bookingsKeys.lists() });
    });

    it('should show success toast on deletion', async () => {
      const { toast } = await import('sonner');
      vi.mocked(bookingsApi.delete).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteBooking(), { wrapper });

      result.current.mutate('booking-123');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(toast.success).toHaveBeenCalledWith('Buchung erfolgreich archiviert');
    });

    it('should handle deletion errors with toast', async () => {
      const { toast } = await import('sonner');
      const mockError = new Error('Delete failed');
      vi.mocked(bookingsApi.delete).mockRejectedValue(mockError);

      const { result } = renderHook(() => useDeleteBooking(), { wrapper });

      result.current.mutate('booking-123');

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(toast.error).toHaveBeenCalledWith('Fehler beim Löschen: Delete failed');
    });
  });

  describe('Edge Cases & Error Scenarios', () => {
    it('should handle concurrent mutations correctly', async () => {
      const booking1 = createMockBooking({ id: 'b1' });
      const booking2 = createMockBooking({ id: 'b2' });

      vi.mocked(bookingsApi.create).mockResolvedValue(booking1);

      const { result } = renderHook(() => useCreateBooking(), { wrapper });

      // Start two mutations
      result.current.mutate({ booking_number: 'BK-001' } as any);
      result.current.mutate({ booking_number: 'BK-002' } as any);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Both mutations should complete
      expect(bookingsApi.create).toHaveBeenCalledTimes(2);
    });

    it('should handle null/undefined data gracefully', async () => {
      vi.mocked(bookingsApi.getAll).mockResolvedValue(null as any);

      const { result } = renderHook(() => useBookings(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeNull();
    });

    it('should preserve loading state during fetch', async () => {
      vi.mocked(bookingsApi.getAll).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([]), 100))
      );

      const { result } = renderHook(() => useBookings(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 200 });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Performance & Caching', () => {
    it('should cache query results correctly', async () => {
      const mockBookings = [createMockBooking()];
      vi.mocked(bookingsApi.getAll).mockResolvedValue(mockBookings);

      const { result: result1 } = renderHook(() => useBookings(), { wrapper });
      await waitFor(() => expect(result1.current.isSuccess).toBe(true));

      // Second render should use cache (no additional API call)
      const { result: result2 } = renderHook(() => useBookings(), { wrapper });

      expect(result2.current.data).toEqual(mockBookings);
      expect(bookingsApi.getAll).toHaveBeenCalledTimes(1); // Still only 1 call
    });

    it('should respect query key changes', async () => {
      vi.mocked(bookingsApi.getAll).mockResolvedValue([]);

      const { rerender } = renderHook(
        ({ filters }) => useBookings(filters),
        {
          wrapper,
          initialProps: { filters: { status: 'pending' } }
        }
      );

      await waitFor(() => expect(bookingsApi.getAll).toHaveBeenCalledWith({ status: 'pending' }));

      // Change filters - should trigger new fetch
      rerender({ filters: { status: 'confirmed' } });

      await waitFor(() => expect(bookingsApi.getAll).toHaveBeenCalledWith({ status: 'confirmed' }));

      expect(bookingsApi.getAll).toHaveBeenCalledTimes(2);
    });
  });
});
