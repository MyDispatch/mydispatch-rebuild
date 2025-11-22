/**
 * =========================================
 * useFeatureAccess Hook - Tariff Feature Restrictions
 * =========================================
 * Checks if a feature is allowed based on company's tariff limits
 *
 * Usage:
 * ```tsx
 * const { allowed, limit, current, loading } = useFeatureAccess('drivers');
 *
 * if (!allowed) {
 *   return <TariffGuard feature="Unbegrenzte Fahrer" />;
 * }
 * ```
 *
 * Starter Limits: max_drivers=3, max_vehicles=3
 * Business: unlimited (limit=null)
 */

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface FeatureAccess {
  allowed: boolean;
  limit: number | null; // null = unlimited
  current: number;
  remaining: number | null; // null = unlimited
  loading: boolean;
  error: Error | null;
}

type FeatureKey = 'drivers' | 'vehicles' | 'bookings_per_month';

/**
 * Hook to check feature access based on tariff limits
 */
export function useFeatureAccess(feature: FeatureKey): FeatureAccess {
  const { company } = useAuth();
  const [currentCount, setCurrentCount] = useState<number>(0);

  // Query feature limits from company
  const { data: featureLimits, isLoading: limitsLoading } = useQuery({
    queryKey: ['featureLimits', company?.id],
    queryFn: async () => {
      if (!company?.id) return null;

      const { data, error } = await supabase
        .from('companies')
        .select('feature_limits')
        .eq('id', company.id)
        .single();

      if (error) throw error;
      return data?.feature_limits as Record<string, any> | null;
    },
    enabled: !!company?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query current count for the feature
  const { data: count, isLoading: countLoading, error } = useQuery({
    queryKey: ['featureCount', company?.id, feature],
    queryFn: async () => {
      if (!company?.id) return 0;

      let tableName: string;
      let countQuery;

      switch (feature) {
        case 'drivers':
          tableName = 'drivers';
          countQuery = supabase
            .from(tableName)
            .select('id', { count: 'exact', head: true })
            .eq('company_id', company.id)
            .eq('archived', false);
          break;

        case 'vehicles':
          tableName = 'vehicles';
          countQuery = supabase
            .from(tableName)
            .select('id', { count: 'exact', head: true })
            .eq('company_id', company.id)
            .eq('archived', false);
          break;

        case 'bookings_per_month':
          tableName = 'bookings';
          const startOfMonth = new Date();
          startOfMonth.setDate(1);
          startOfMonth.setHours(0, 0, 0, 0);

          countQuery = supabase
            .from(tableName)
            .select('id', { count: 'exact', head: true })
            .eq('company_id', company.id)
            .gte('created_at', startOfMonth.toISOString());
          break;

        default:
          return 0;
      }

      const { count, error } = await countQuery;
      if (error) throw error;
      return count || 0;
    },
    enabled: !!company?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Update current count
  useEffect(() => {
    if (count !== undefined) {
      setCurrentCount(count);
    }
  }, [count]);

  // Calculate access
  const limit = featureLimits?.[`max_${feature}`] ?? null;
  const allowed = limit === null || currentCount < limit;
  const remaining = limit === null ? null : Math.max(0, limit - currentCount);

  return {
    allowed,
    limit,
    current: currentCount,
    remaining,
    loading: limitsLoading || countLoading,
    error: error as Error | null,
  };
}

/**
 * Hook to check if a boolean feature is enabled
 * @example useFeatureEnabled('customer_portal') → true/false
 */
export function useFeatureEnabled(feature: string): boolean {
  const { company } = useAuth();

  const { data: featureLimits } = useQuery({
    queryKey: ['featureLimits', company?.id],
    queryFn: async () => {
      if (!company?.id) return null;

      const { data, error } = await supabase
        .from('companies')
        .select('feature_limits')
        .eq('id', company.id)
        .single();

      if (error) throw error;
      return data?.feature_limits as Record<string, any> | null;
    },
    enabled: !!company?.id,
    staleTime: 5 * 60 * 1000,
  });

  return featureLimits?.[`has_${feature}`] ?? false;
}
