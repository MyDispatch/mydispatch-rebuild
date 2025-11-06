/* ==================================================================================
   BOOKINGS API - BOOKINGS CRUD OPERATIONS
   ==================================================================================
   Centralized API for Bookings table
   ================================================================================== */

import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types/db';
import { handleSupabaseQuery } from './base';

export const bookingsApi = {
  /**
   * Fetch all bookings with relations
   */
  async getBookings(options: any = {}) {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        customer:customers(*),
        driver:drivers(*),
        vehicle:vehicles(*)
      `);

    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending });
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    return handleSupabaseQuery(query);
  },

  /**
   * Insert a new booking
   */
  async createBooking(booking: Partial<Booking>) {
    return handleSupabaseQuery(
      supabase.from('bookings').insert(booking as any)
    );
  },

  /**
   * Update a booking by ID
   */
  async updateBooking(id: string, updates: Partial<Booking>) {
    return handleSupabaseQuery(
      supabase.from('bookings').update(updates as any).eq('id', id)
    );
  },

  /**
   * Get a single booking by ID
   */
  async getBookingById(id: string) {
    return handleSupabaseQuery(
      supabase.from('bookings').select('*').eq('id', id).single()
    );
  },

  /**
   * Archive a booking by ID
   */
  async archiveBooking(id: string) {
    return handleSupabaseQuery(
      supabase.from('bookings').update({ archived: true } as any).eq('id', id)
    );
  },
};
