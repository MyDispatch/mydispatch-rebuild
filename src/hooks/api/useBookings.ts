/* ==================================================================================
   USE BOOKINGS - REACT QUERY HOOKS FOR BOOKINGS
   ==================================================================================
   Centralized hooks for Bookings data fetching
   ================================================================================== */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '@/api/bookings';
import { toast } from 'sonner';
import type { Booking, BookingInsert, BookingUpdate } from '@/api/types';

/**
 * Query key factory for bookings
 */
export const bookingsKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingsKeys.all, 'list'] as const,
  list: (filters?: any) => [...bookingsKeys.lists(), filters] as const,
  details: () => [...bookingsKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingsKeys.details(), id] as const,
  byStatus: (status: string) =>
    [...bookingsKeys.all, 'status', status] as const,
};

/**
 * Get all bookings
 */
export const useBookings = (options?: any) => {
  return useQuery({
    queryKey: bookingsKeys.list(options),
    queryFn: () => bookingsApi.getBookings(options),
  });
};

/**
 * Get single booking by ID
 */
export const useBooking = (id: string) => {
  return useQuery({
    queryKey: bookingsKeys.detail(id),
    queryFn: () => bookingsApi.getBookingById(id),
    enabled: !!id,
  });
};

/**
 * Get bookings by status
 */
export const useBookingsByStatus = (status: Booking['status']) => {
  return useQuery({
    queryKey: bookingsKeys.byStatus(status),
    queryFn: () => bookingsApi.getBookings({ filters: { status } }),
    enabled: !!status,
  });
};

/**
 * Create new booking
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, BookingInsert>({
    mutationFn: async (booking: BookingInsert) => {
      const result = await bookingsApi.createBooking(booking);
      if (result.error) {
        throw new Error(result.error.message);
      }
      if (!result.data) {
        throw new Error('No data returned from create booking');
      }
      return result.data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingsKeys.lists() });
      toast.success('Buchung erfolgreich erstellt');
    },
    onError: (error: Error) => {
      toast.error(`Fehler beim Erstellen: ${error.message}`);
    },
  });
};

/**
 * Update existing booking
 */
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, { id: string; updates: BookingUpdate }>({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: BookingUpdate;
    }) => {
      const result = await bookingsApi.updateBooking(id, updates);
      if (result.error) {
        throw new Error(result.error.message);
      }
      if (!result.data) {
        throw new Error('No data returned from update booking');
      }
      return result.data as Booking;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bookingsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingsKeys.detail(data.id) });
      toast.success('Buchung erfolgreich aktualisiert');
    },
    onError: (error: Error) => {
      toast.error(`Fehler beim Aktualisieren: ${error.message}`);
    },
  });
};

/**
 * Delete booking
 */
export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await bookingsApi.archiveBooking(id);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingsKeys.lists() });
      toast.success('Buchung erfolgreich archiviert');
    },
    onError: (error: Error) => {
      toast.error(`Fehler beim Löschen: ${error.message}`);
    },
  });
};
