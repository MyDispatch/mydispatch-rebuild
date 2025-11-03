/* ==================================================================================
   USE-INVOICES HOOK - React Query für Rechnungen
   ==================================================================================
   - Basiert auf bookings Tabelle mit payment_status
   - Smart Caching (30s staleTime)
   - Auto-Retry (3x Exponential Backoff)
   - Zentrale Fehlerbehandlung
   ================================================================================== */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { handleError, handleSuccess } from '@/lib/error-handler';

export function useInvoices() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Invoices (bookings mit price)
  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ['invoices', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return [];

      const { data, error } = await supabase
        .from('bookings')
        .select('id, customer_id, price, payment_status, payment_method, created_at')
        .eq('company_id', profile.company_id)
        .not('price', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map to invoice structure
      return data?.map(booking => ({
        ...booking,
        amount: booking.price,
        status: booking.payment_status,
      })) || [];
    },
    enabled: !!profile?.company_id,
    staleTime: 30000, // 30s
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Update Payment Status
  const updatePaymentStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pending' | 'paid' | 'overdue' | 'cancelled' }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          payment_status: status,
          ...(status === 'paid' ? { paid_at: new Date().toISOString() } : {})
        })
        .eq('id', id)
        .eq('company_id', profile?.company_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', profile?.company_id] });
      queryClient.invalidateQueries({ queryKey: ['bookings', profile?.company_id] });
      handleSuccess('Zahlungsstatus aktualisiert');
    },
    onError: (error) => {
      handleError(error, 'Status konnte nicht aktualisiert werden');
    },
  });

  // Mark as Paid
  const markAsPaid = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          payment_status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('company_id', profile?.company_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', profile?.company_id] });
      queryClient.invalidateQueries({ queryKey: ['bookings', profile?.company_id] });
      handleSuccess('Rechnung als bezahlt markiert');
    },
    onError: (error) => {
      handleError(error, 'Status konnte nicht aktualisiert werden');
    },
  });

  return {
    invoices,
    isLoading,
    error,
    updatePaymentStatus: updatePaymentStatus.mutate,
    markAsPaid: markAsPaid.mutate,
    isUpdating: updatePaymentStatus.isPending,
    isMarkingPaid: markAsPaid.isPending,
  };
}
