/* ==================================================================================
   TARIFF SYSTEM V2 HOOK - DATABASE-DRIVEN
   ==================================================================================
   Single Source of Truth für Tarife aus tariff_system_v2 + add_ons Tabellen
   Ersetzt alte statische Tarif-Definitionen
   ================================================================================== */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Typen aus Supabase DB
type TariffRow = Database['public']['Tables']['tariff_system_v2']['Row'];
type AddOnRow = Database['public']['Tables']['add_ons']['Row'];

export interface TariffFeature {
  module: string;
  included: boolean;
  limit?: number;
  description: string;
}

export function useTariffSystemV2() {
  // Lade aktive Tarife aus DB
  const { data: tariffs, isLoading: tariffsLoading, error: tariffsError } = useQuery({
    queryKey: ['tariffs-v2'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tariff_system_v2')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('[useTariffSystemV2] Error loading tariffs:', error);
        throw error;
      }

      return data as TariffRow[];
    },
    staleTime: 1000 * 60 * 5, // 5 Minuten
  });

  // Lade aktive Add-Ons aus DB
  const { data: addOns, isLoading: addOnsLoading, error: addOnsError } = useQuery({
    queryKey: ['add-ons-v2'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('add_ons')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('[useTariffSystemV2] Error loading add-ons:', error);
        throw error;
      }

      return data as AddOnRow[];
    },
    staleTime: 1000 * 60 * 5, // 5 Minuten
  });

  // Helper: Finde Tarif by Product ID (für Subscription-Check)
  const getTariffByProductId = (productId: string | null | undefined): TariffRow | undefined => {
    if (!productId || !tariffs) return undefined;
    return tariffs.find(t => t.stripe_product_ids.includes(productId));
  };

  // Helper: Finde Tarif by Tariff ID
  const getTariffById = (tariffId: string): TariffRow | undefined => {
    if (!tariffs) return undefined;
    return tariffs.find(t => t.tariff_id === tariffId);
  };

  // Helper: Check ob Feature im Tarif enthalten ist
  const hasFeature = (tariffId: string, module: string): boolean => {
    const tariff = getTariffById(tariffId);
    if (!tariff) return false;
    
    // Features ist Json type - muss über unknown gecasted werden
    const features = tariff.features as unknown as TariffFeature[] | undefined;
    if (!features || !Array.isArray(features)) return false;
    
    const feature = features.find(f => f.module === module);
    return feature?.included ?? false;
  };

  // Helper: Get Feature Limit
  const getFeatureLimit = (tariffId: string, module: string): number | null => {
    const tariff = getTariffById(tariffId);
    if (!tariff) return null;
    
    const features = tariff.features as unknown as TariffFeature[] | undefined;
    if (!features || !Array.isArray(features)) return null;
    
    const feature = features.find(f => f.module === module);
    return feature?.limit ?? null;
  };

  // Helper: Get applicable Add-Ons für Tarif
  const getApplicableAddOns = (tariffId: string): AddOnRow[] => {
    if (!addOns) return [];
    return addOns.filter(addon => addon.applicable_to_tariffs.includes(tariffId));
  };

  // Helper: Get Add-On by ID
  const getAddOnById = (addOnId: string): AddOnRow | undefined => {
    if (!addOns) return undefined;
    return addOns.find(addon => addon.add_on_id === addOnId);
  };

  // Helper: Get Tier Name (für UI)
  const getTierName = (productId: string | null | undefined): string => {
    const tariff = getTariffByProductId(productId);
    return tariff?.marketing_title ?? 'Unbekannt';
  };

  // Helper: Check ob Limit erreicht
  const exceedsLimit = (
    tariffId: string,
    resource: 'drivers' | 'vehicles' | 'users',
    currentCount: number
  ): boolean => {
    const tariff = getTariffById(tariffId);
    if (!tariff) return false;

    let limit: number;
    switch (resource) {
      case 'drivers':
        limit = tariff.limit_drivers;
        break;
      case 'vehicles':
        limit = tariff.limit_vehicles;
        break;
      case 'users':
        limit = tariff.limit_users;
        break;
      default:
        return false;
    }
    
    // -1 bedeutet unbegrenzt
    if (limit === -1) return false;
    
    return currentCount >= limit;
  };

  return {
    // Data
    tariffs: tariffs ?? [],
    addOns: addOns ?? [],
    
    // Loading States
    isLoading: tariffsLoading || addOnsLoading,
    
    // Errors
    error: tariffsError || addOnsError,
    
    // Helper Functions
    getTariffByProductId,
    getTariffById,
    hasFeature,
    getFeatureLimit,
    getApplicableAddOns,
    getAddOnById,
    getTierName,
    exceedsLimit,
  };
}
