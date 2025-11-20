/* ==================================================================================
   BOOKINGS API - BOOKINGS CRUD OPERATIONS
   ==================================================================================
   Centralized API for Bookings table
   ================================================================================== */

import { supabase } from "@/integrations/supabase/client";
import { handleSupabaseError } from "./base";
import type { Booking, BookingInsert, BookingUpdate, QueryOptions } from "./types";

/**
 * Get all bookings with optional filters
 */
export const getBookings = async (options?: QueryOptions) => {
  const query = supabase
    .from("bookings")
    .select("*, customers(*), drivers(*), vehicles(*)")
    .eq("archived", false)
    .order("pickup_time", { ascending: false });

  if (options?.limit) query.limit(options.limit);
  if (options?.offset) query.range(options.offset, options.offset + (options.limit || 50) - 1);

  const { data, error } = await query;

  if (error) throw handleSupabaseError(error);
  return data;
};

/**
 * Get single booking by ID
 */
export const getBookingById = async (id: string) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, customers(*), drivers(*), vehicles(*)")
    .eq("id", id)
    .single();

  if (error) throw handleSupabaseError(error);
  return data;
};

/**
 * Create new booking
 */
export const createBooking = async (booking: BookingInsert) => {
  const { data, error } = await supabase.from("bookings").insert(booking).select().single();

  if (error) throw handleSupabaseError(error);
  return data;
};

/**
 * Update existing booking
 */
export const updateBooking = async (id: string, updates: BookingUpdate) => {
  const { data, error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw handleSupabaseError(error);
  return data;
};

/**
 * Delete booking (soft delete via archive)
 */
export const deleteBooking = async (id: string) => {
  const { error } = await supabase.from("bookings").update({ archived: true }).eq("id", id);

  if (error) throw handleSupabaseError(error);
  return true;
};

/**
 * Get bookings by status
 */
export const getBookingsByStatus = async (status: Booking["status"]) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, customers(*), drivers(*), vehicles(*)")
    .eq("status", status)
    .eq("archived", false)
    .order("pickup_time", { ascending: false });

  if (error) throw handleSupabaseError(error);
  return data;
};

export const bookingsApi = {
  getAll: getBookings,
  getById: getBookingById,
  create: createBooking,
  update: updateBooking,
  delete: deleteBooking,
  getByStatus: getBookingsByStatus,
};
