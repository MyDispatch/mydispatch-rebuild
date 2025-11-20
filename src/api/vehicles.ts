/* ==================================================================================
   VEHICLES API MODULE - HYPERION PHASE 2
   ==================================================================================
   ✅ Zentrale Abstraktion für Fahrzeug-Operationen
   ✅ Type-safe mit Supabase-Schema
   ✅ Konsistentes Error-Handling
   ================================================================================== */

import { TypedSupabaseClient, handleApiError } from './client';
import { Tables } from '@/integrations/supabase/types';

export type Vehicle = Tables<'vehicles'>;
export type VehicleInsert = Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>;
export type VehicleUpdate = Partial<VehicleInsert>;

export interface VehicleFilters {
  status?: string;
  archived?: boolean;
}

export interface VehiclesApi {
  list: (filters?: VehicleFilters) => Promise<Vehicle[]>;
  getById: (id: string) => Promise<Vehicle>;
  create: (data: VehicleInsert) => Promise<Vehicle>;
  update: (id: string, data: VehicleUpdate) => Promise<Vehicle>;
  archive: (id: string) => Promise<void>;
}

export function createVehiclesApi(supabase: TypedSupabaseClient): VehiclesApi {
  return {
    async list(filters = {}) {
      try {
        let query = supabase
          .from('vehicles')
          .select('*')
          .eq('archived', filters.archived ?? false)
          .order('license_plate');

        if (filters.status) {
          query = query.eq('status', filters.status as any);
        }

        const { data, error } = await query;
        if (error) handleApiError(error, 'vehicles.list');
        return data || [];
      } catch (error) {
        handleApiError(error, 'vehicles.list');
      }
    },

    async getById(id) {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) handleApiError(error, 'vehicles.getById');
        return data!;
      } catch (error) {
        handleApiError(error, 'vehicles.getById');
      }
    },

    async create(input) {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .insert([input])
          .select()
          .single();

        if (error) handleApiError(error, 'vehicles.create');
        return data!;
      } catch (error) {
        handleApiError(error, 'vehicles.create');
      }
    },

    async update(id, updates) {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) handleApiError(error, 'vehicles.update');
        return data!;
      } catch (error) {
        handleApiError(error, 'vehicles.update');
      }
    },

    async archive(id) {
      try {
        const { error } = await supabase
          .from('vehicles')
          .update({ archived: true })
          .eq('id', id);

        if (error) handleApiError(error, 'vehicles.archive');
      } catch (error) {
        handleApiError(error, 'vehicles.archive');
      }
    },
  };
}
