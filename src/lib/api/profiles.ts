/**
 * HYPERION PHASE 2: Profiles API Module
 */

import type { TypedSupabaseClient} from './client';
import { handleApiError } from './client';
import type { Tables } from '@/integrations/supabase/types';

export type Profile = Tables<'profiles'>;

export interface ProfileFilters {
  company_id?: string;
  user_id?: string;
}

export interface ProfilesApi {
  list: (filters?: ProfileFilters) => Promise<Profile[]>;
  getById: (id: string) => Promise<Profile>;
  getByUserId: (userId: string) => Promise<Profile>;
  update: (id: string, data: Partial<Profile>) => Promise<Profile>;
}

export function createProfilesApi(supabase: TypedSupabaseClient): ProfilesApi {
  return {
    async list(filters = {}) {
      try {
        let query = supabase
          .from('profiles')
          .select('*')
          .order('first_name');

        if (filters.company_id) {
          query = query.eq('company_id', filters.company_id);
        }
        if (filters.user_id) {
          query = query.eq('user_id', filters.user_id);
        }

        const { data, error } = await query;
        if (error) handleApiError(error, 'profiles.list');
        return data || [];
      } catch (error) {
        handleApiError(error, 'profiles.list');
      }
    },

    async getById(id) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) handleApiError(error, 'profiles.getById');
        return data!;
      } catch (error) {
        handleApiError(error, 'profiles.getById');
      }
    },

    async getByUserId(userId) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) handleApiError(error, 'profiles.getByUserId');
        return data!;
      } catch (error) {
        handleApiError(error, 'profiles.getByUserId');
      }
    },

    async update(id, updates) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) handleApiError(error, 'profiles.update');
        return data!;
      } catch (error) {
        handleApiError(error, 'profiles.update');
      }
    },
  };
}
