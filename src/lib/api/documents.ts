/**
 * HYPERION PHASE 2: Documents API Module
 */

import type { TypedSupabaseClient} from './client';
import { handleApiError } from './client';
import type { Tables, Enums } from '@/integrations/supabase/types';

export type Document = Tables<'documents'>;
export type DocumentType = Enums<'document_type'>;
export type EntityType = Enums<'document_entity_type'>;

export interface DocumentFilters {
  entity_id?: string;
  entity_type?: EntityType;
  document_type?: DocumentType;
  archived?: boolean;
}

export interface CreateDocumentInput {
  company_id: string;
  entity_id: string;
  entity_type: EntityType;
  document_type: DocumentType;
  file_url: string;
  name: string;
  file_size?: number;
  expiry_date?: string;
}

export interface DocumentsApi {
  list: (filters?: DocumentFilters) => Promise<Document[]>;
  getById: (id: string) => Promise<Document>;
  create: (data: CreateDocumentInput) => Promise<Document>;
  update: (id: string, data: Partial<Document>) => Promise<Document>;
  archive: (id: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export function createDocumentsApi(supabase: TypedSupabaseClient): DocumentsApi {
  return {
    async list(filters = {}) {
      try {
        let query = supabase
          .from('documents')
          .select('*')
          .eq('archived', filters.archived ?? false)
          .order('created_at', { ascending: false });

        if (filters.entity_id) {
          query = query.eq('entity_id', filters.entity_id);
        }
        if (filters.entity_type) {
          query = query.eq('entity_type', filters.entity_type);
        }
        if (filters.document_type) {
          query = query.eq('document_type', filters.document_type);
        }

        const { data, error } = await query;
        if (error) handleApiError(error, 'documents.list');
        return data || [];
      } catch (error) {
        handleApiError(error, 'documents.list');
      }
    },

    async getById(id) {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', id)
          .single();

        if (error) handleApiError(error, 'documents.getById');
        return data!;
      } catch (error) {
        handleApiError(error, 'documents.getById');
      }
    },

    async create(input) {
      try {
        const { data, error } = await supabase
          .from('documents')
          .insert([input])
          .select()
          .single();

        if (error) handleApiError(error, 'documents.create');
        return data!;
      } catch (error) {
        handleApiError(error, 'documents.create');
      }
    },

    async update(id, updates) {
      try {
        const { data, error } = await supabase
          .from('documents')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) handleApiError(error, 'documents.update');
        return data!;
      } catch (error) {
        handleApiError(error, 'documents.update');
      }
    },

    async archive(id) {
      try {
        const { error } = await supabase
          .from('documents')
          .update({ archived: true, archived_at: new Date().toISOString() })
          .eq('id', id);

        if (error) handleApiError(error, 'documents.archive');
      } catch (error) {
        handleApiError(error, 'documents.archive');
      }
    },

    async delete(id) {
      try {
        const { error } = await supabase
          .from('documents')
          .delete()
          .eq('id', id);

        if (error) handleApiError(error, 'documents.delete');
      } catch (error) {
        handleApiError(error, 'documents.delete');
      }
    },
  };
}
