/* ==================================================================================
   USE-TERMINATION-LOGS HOOK - TanStack Query für Termination Logs
   ==================================================================================
   ✅ MISSION II: STRANGLER FIG 2.0 - Migration from direct Supabase calls
   ✅ Smart Caching (30s staleTime)
   ✅ Auto-Retry (3x Exponential Backoff)
   ✅ Master-Account Only
   ================================================================================== */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError, handleSuccess } from '@/lib/error-handler';

interface TerminationLog {
  id: string;
  company_id: string;
  action_type: 'reminder' | 'warning' | 'block' | 'note';
  performed_by: string;
  notes?: string | null;
  created_at: string;
  performer?: {
    first_name: string;
    last_name: string;
  };
}

interface CreateTerminationLogData {
  company_id: string;
  action_type: 'reminder' | 'warning' | 'block' | 'note';
  performed_by: string;
  notes?: string | null;
}

export function useTerminationLogs(companyId?: string) {
  const queryClient = useQueryClient();

  // Fetch Termination Logs for specific company
  const { data: logs = [], isLoading, error } = useQuery({
    queryKey: ['termination_logs', companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .from('termination_logs')
        .select(`
          id,
          company_id,
          action_type,
          performed_by,
          notes,
          created_at
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Fetch performer details separately
      if (data && data.length > 0) {
        const performerIds = [...new Set(data.map(log => log.performed_by))];
        const { data: performers } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name')
          .in('user_id', performerIds);
        
        // Merge performer data
        const performerMap = new Map(performers?.map(p => [p.user_id, p]) || []);
        return data.map(log => ({
          ...log,
          performer: performerMap.get(log.performed_by),
        })) as TerminationLog[];
      }
      
      return (data || []) as TerminationLog[];
    },
    enabled: !!companyId,
    staleTime: 30000, // 30s
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Create Termination Log
  const createLog = useMutation({
    mutationFn: async (logData: CreateTerminationLogData) => {
      const { data, error } = await supabase
        .from('termination_logs')
        .insert(logData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['termination_logs', variables.company_id] });
      handleSuccess('Aktion erfolgreich protokolliert');
    },
    onError: (error) => {
      handleError(error, 'Log konnte nicht erstellt werden');
    },
  });

  return {
    logs,
    isLoading,
    error,
    createLog: createLog.mutateAsync, // Use mutateAsync for async/await
    isCreatingLog: createLog.isPending,
  };
}
