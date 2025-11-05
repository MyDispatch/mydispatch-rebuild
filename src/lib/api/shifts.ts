/**
 * HYPERION PHASE 2: Shifts API Module
 */

import { TypedSupabaseClient, handleApiError } from './client';
import { Tables } from '@/integrations/supabase/types';

export type Shift = Tables<'shifts'>;

export interface ShiftFilters {
  driver_id?: string;
  date_from?: string;
  date_to?: string;
  status?: string;
}

export interface CreateShiftInput {
  company_id: string;
  driver_id: string;
  date: string;
  shift_start_time: string;
  shift_end_time?: string;
  vehicle_id: string;
  start_time?: string;
  end_time?: string;
  card_earnings?: number;
  cash_earnings?: number;
}

export interface ShiftsApi {
  list: (filters?: ShiftFilters) => Promise<Shift[]>;
  getById: (id: string) => Promise<Shift>;
  create: (data: CreateShiftInput) => Promise<Shift>;
  update: (id: string, data: Partial<Shift>) => Promise<Shift>;
  delete: (id: string) => Promise<void>;
}

export function createShiftsApi(supabase: TypedSupabaseClient): ShiftsApi {
  return {
    async list(filters = {}) {
      try {
        const query = supabase
          .from('shifts')
          .select('*')
          .order('shift_start_time', { ascending: false });

        const conditions: unknown[] = [];
        
        if (filters.driver_id) conditions.push(['driver_id', 'eq', filters.driver_id]);
        if (filters.date_from) conditions.push(['shift_start_time', 'gte', filters.date_from]);
        if (filters.date_to) conditions.push(['shift_end_time', 'lte', filters.date_to]);
        if (filters.status) conditions.push(['status', 'eq', filters.status]);

        let finalQuery: any = query;
        for (const [field, op, value] of conditions) {
          finalQuery = finalQuery[op](field, value);
        }

        const { data, error } = await finalQuery;
        if (error) handleApiError(error, 'shifts.list');
        return data || [];
      } catch (error) {
        handleApiError(error, 'shifts.list');
      }
    },

    async getById(id) {
      try {
        const { data, error } = await supabase
          .from('shifts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) handleApiError(error, 'shifts.getById');
        return data!;
      } catch (error) {
        handleApiError(error, 'shifts.getById');
      }
    },

    async create(input) {
      try {
        const { data, error } = await supabase
          .from('shifts')
          .insert([input])
          .select()
          .single();

        if (error) handleApiError(error, 'shifts.create');
        return data!;
      } catch (error) {
        handleApiError(error, 'shifts.create');
      }
    },

    async update(id, updates) {
      try {
        const { data, error } = await supabase
          .from('shifts')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) handleApiError(error, 'shifts.update');
        return data!;
      } catch (error) {
        handleApiError(error, 'shifts.update');
      }
    },

    async delete(id) {
      try {
        const { error } = await supabase
          .from('shifts')
          .delete()
          .eq('id', id);

        if (error) handleApiError(error, 'shifts.delete');
      } catch (error) {
        handleApiError(error, 'shifts.delete');
      }
    },
  };
}
