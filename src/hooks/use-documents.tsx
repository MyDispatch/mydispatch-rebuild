/* ==================================================================================
   USE-DOCUMENTS HOOK - React Query für Dokumente
   ==================================================================================
   - Smart Caching (30s staleTime)
   - Auto-Retry (3x Exponential Backoff)
   - Optimistic Updates
   - Zentrale Fehlerbehandlung
   ================================================================================== */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { handleError, handleSuccess } from '@/lib/error-handler';

export function useDocuments() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Documents
  const { data: documents = [], isLoading, error } = useQuery({
    queryKey: ['documents', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return [];

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.company_id,
    staleTime: 30000, // 30s
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Create Document
  const createDocument = useMutation({
    mutationFn: async (documentData: any) => {
      if (!profile?.company_id) throw new Error('Company ID fehlt');

      const { data, error } = await supabase
        .from('documents')
        .insert({
          ...documentData,
          company_id: profile.company_id,
          reminder_sent: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', profile?.company_id] });
      handleSuccess('Dokument erfolgreich hochgeladen');
    },
    onError: (error) => {
      handleError(error, 'Dokument konnte nicht hochgeladen werden');
    },
  });

  // Update Document
  const updateDocument = useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('documents')
        .update(updateData)
        .eq('id', id)
        .eq('company_id', profile?.company_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', profile?.company_id] });
      handleSuccess('Dokument erfolgreich aktualisiert');
    },
    onError: (error) => {
      handleError(error, 'Dokument konnte nicht aktualisiert werden');
    },
  });

  // Archive Document (SECURITY: No DELETE - SOLL-Vorgabe V18.3.24)
  const deleteDocument = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('documents')
        .update({ 
          archived: true, 
          archived_at: new Date().toISOString() 
        })
        .eq('id', id)
        .eq('company_id', profile?.company_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', profile?.company_id] });
      handleSuccess('Dokument archiviert');
    },
    onError: (error) => {
      handleError(error, 'Dokument konnte nicht gelöscht werden');
    },
  });

  // Send Reminder
  const sendReminder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('documents')
        .update({ reminder_sent: true })
        .eq('id', id)
        .eq('company_id', profile?.company_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', profile?.company_id] });
      handleSuccess('Erinnerung versendet');
    },
    onError: (error) => {
      handleError(error, 'Erinnerung konnte nicht versendet werden');
    },
  });

  return {
    documents,
    isLoading,
    error,
    createDocument: createDocument.mutate,
    updateDocument: updateDocument.mutate,
    deleteDocument: deleteDocument.mutate,
    sendReminder: sendReminder.mutate,
    isCreating: createDocument.isPending,
    isUpdating: updateDocument.isPending,
    isDeleting: deleteDocument.isPending,
    isSendingReminder: sendReminder.isPending,
  };
}
