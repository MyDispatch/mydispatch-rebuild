/**
 * HYPERION PHASE 2: Bookings API Module
 *
 * Alle CRUD-Operationen für Buchungen.
 * Kein direkter Supabase-Zugriff mehr in Hooks!
 */

import type { TypedSupabaseClient} from './client';
import { handleApiError } from './client';

// Define the actual structure since Supabase types are placeholders
export interface Booking {
  id: string;
  company_id: string;
  customer_id: string;
  driver_id: string | null;
  vehicle_id: string | null;
  partner_id: string | null;
  pickup_address: string;
  dropoff_address: string;
  pickup_time: string;
  dropoff_time: string | null;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_method: string | null;
  price: number;
  passengers: number;
  luggage: number;
  special_requests: string | null;
  created_at: string;
  updated_at: string | null;
  archived: boolean;
  is_offer: boolean;
  is_partner_booking?: boolean;
  offer_status: 'pending' | 'accepted' | 'rejected' | null;
  notes: string | null;
  partner_provision_manual?: number | null;
  cost_center_id?: string | null;
  vehicle_type?: string | null;
  is_airport_pickup?: boolean;
  is_train_station_pickup?: boolean;
  flight_number?: string | null;
  train_number?: string | null;
  terminal?: string | null;
  arrival_time?: string | null;
  wait_time?: number | null;
  meet_and_greet?: boolean;
  name_sign?: string | null;
  vat_rate?: number | null;
  assignment_type?: string | null;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'cancelled';

// ✅ HYPERION: Extended type with relations for frontend consumption
export interface BookingWithRelations extends Booking {
  customer?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
  } | null;
  driver?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  vehicle?: {
    id: string;
    license_plate: string;
    vehicle_class: string | null;
  } | null;
  partner?: {
    id: string;
    name: string;
  } | null;
}

export interface BookingFilters {
  status?: BookingStatus;
  payment_status?: PaymentStatus;
  customer_id?: string;
  driver_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface CreateBookingInput {
  pickup_address: string;
  dropoff_address: string;
  pickup_time: string;
  customer_id: string;
  company_id: string;
  passengers?: number;
  luggage?: number;
  special_requests?: string;
  price?: number;
}

export interface BookingsApi {
  list: (filters?: BookingFilters) => Promise<BookingWithRelations[]>;
  getById: (id: string) => Promise<Booking>;
  create: (data: CreateBookingInput) => Promise<Booking>;
  update: (id: string, data: Partial<Booking>) => Promise<Booking>;
  delete: (id: string) => Promise<void>;
  archive: (id: string) => Promise<void>;
}

export function createBookingsApi(supabase: TypedSupabaseClient): BookingsApi {
  return {
    async list(filters = {}) {
      try {
        let query = supabase
          .from('bookings')
          .select(`
            *,
            customer:customers(id, first_name, last_name, email),
            driver:drivers(id, first_name, last_name),
            vehicle:vehicles(id, license_plate, vehicle_class),
            partner:partners(id, name)
          `)
          .eq('archived', false)
          .order('pickup_time', { ascending: false });

        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.payment_status) {
          query = query.eq('payment_status', filters.payment_status);
        }
        if (filters.customer_id) {
          query = query.eq('customer_id', filters.customer_id);
        }
        if (filters.driver_id) {
          query = query.eq('driver_id', filters.driver_id);
        }
        if (filters.date_from) {
          query = query.gte('pickup_time', filters.date_from);
        }
        if (filters.date_to) {
          query = query.lte('pickup_time', filters.date_to);
        }

        const { data, error } = await query;

        if (error) handleApiError(error, 'bookings.list');
        return (data || []) as unknown as BookingWithRelations[];
      } catch (error) {
        handleApiError(error, 'bookings.list');
      }
    },

    async getById(id) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) handleApiError(error, 'bookings.getById');
        return data as unknown as Booking;
      } catch (error) {
        handleApiError(error, 'bookings.getById');
      }
    },

    async create(input) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .insert([input])
          .select()
          .single();

        if (error) handleApiError(error, 'bookings.create');
        return data as unknown as Booking;
      } catch (error) {
        handleApiError(error, 'bookings.create');
      }
    },

    async update(id, updates) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) handleApiError(error, 'bookings.update');
        return data as unknown as Booking;
      } catch (error) {
        handleApiError(error, 'bookings.update');
      }
    },

    async delete(id) {
      try {
        const { error } = await supabase
          .from('bookings')
          .delete()
          .eq('id', id);

        if (error) handleApiError(error, 'bookings.delete');
      } catch (error) {
        handleApiError(error, 'bookings.delete');
      }
    },

    async archive(id) {
      try {
        const { error } = await supabase
          .from('bookings')
          .update({ archived: true })
          .eq('id', id);

        if (error) handleApiError(error, 'bookings.archive');
      } catch (error) {
        handleApiError(error, 'bookings.archive');
      }
    },
  };
}
