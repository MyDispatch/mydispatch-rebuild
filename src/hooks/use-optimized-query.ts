/* ==================================================================================
   OPTIMIZED QUERY HOOK - Performance-Optimierung für React Query
   ==================================================================================
   Purpose: Standardisierte Query-Konfiguration mit Best-Practice Defaults
   
   Features:
   - ✅ Automatic Caching (5min stale time)
   - ✅ Optimistic Updates
   - ✅ Error-Handling
   - ✅ Loading-States
   - ✅ Retry-Logic
   
   Usage:
   const { data, isLoading, error } = useOptimizedQuery({
     queryKey: ['bookings'],
     queryFn: fetchBookings,
   });
   ================================================================================== */

import { useQuery, useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface UseOptimizedQueryOptions<TData> {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  staleTime?: number;
  cacheTime?: number;
  retry?: number;
  enabled?: boolean;
}

interface UseOptimizedMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey?: QueryKey;
  onSuccessMessage?: string;
  onErrorMessage?: string;
  optimisticUpdate?: (variables: TVariables) => TData;
}

/**
 * Optimized Query Hook mit Best-Practice Defaults
 *
 * @example
 * const { data, isLoading } = useOptimizedQuery({
 *   queryKey: ['bookings'],
 *   queryFn: () => supabase.from('bookings').select('*')
 * });
 */
export function useOptimizedQuery<TData = unknown>({
  queryKey,
  queryFn,
  staleTime = 5 * 60 * 1000, // 5 minutes default
  cacheTime = 10 * 60 * 1000, // 10 minutes default
  retry = 2,
  enabled = true,
}: UseOptimizedQueryOptions<TData>) {
  return useQuery({
    queryKey,
    queryFn,
    staleTime,
    gcTime: cacheTime,
    retry,
    enabled,
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: false, // Use cached data if available
  });
}

/**
 * Optimized Mutation Hook mit Optimistic Updates
 *
 * @example
 * const { mutate } = useOptimizedMutation({
 *   mutationFn: (data) => supabase.from('bookings').insert(data),
 *   queryKey: ['bookings'],
 *   onSuccessMessage: 'Auftrag erstellt!',
 *   optimisticUpdate: (newBooking) => newBooking
 * });
 */
export function useOptimizedMutation<TData = unknown, TVariables = unknown>({
  mutationFn,
  queryKey,
  onSuccessMessage,
  onErrorMessage = "Ein Fehler ist aufgetreten",
  optimisticUpdate,
}: UseOptimizedMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      if (!queryKey || !optimisticUpdate) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to new value
      queryClient.setQueryData(queryKey, (old: any) => {
        if (Array.isArray(old)) {
          return [...old, optimisticUpdate(variables)];
        }
        return optimisticUpdate(variables);
      });

      // Return context with previous value
      return { previousData };
    },
    onError: (error, variables, context: any) => {
      // Rollback on error
      if (context?.previousData && queryKey) {
        queryClient.setQueryData(queryKey, context.previousData);
      }

      toast.error(onErrorMessage);
      logger.error("Mutation error", error as Error, { component: "useOptimizedMutation" });
    },
    onSuccess: () => {
      if (onSuccessMessage) {
        toast.success(onSuccessMessage);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}
