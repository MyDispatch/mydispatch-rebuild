/* ==================================================================================
   USE COMPANY LOCATION HOOK - V18.2.8
   ==================================================================================
   - Zentraler Hook für Firmenstandort
   - Lädt Company-Daten inkl. Latitude/Longitude
   - Basis für Location-Aware Widgets (Wetter, Verkehr, GPS-Zentrum)
   - React Query Integration
   ================================================================================== */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { handleError } from '@/lib/error-handler';

export interface CompanyLocation {
  id: string;
  name: string;
  street?: string;
  street_number?: string;
  postal_code?: string;
  city?: string;
  address?: string; // Fallback
  latitude?: number;
  longitude?: number;
  timezone?: string;
  country_code?: string;
  phone_prefix?: string;
  full_address?: string;
  has_geocoded_location?: boolean;
}

interface UseCompanyLocationReturn {
  location: CompanyLocation | null;
  isLoading: boolean;
  error: Error | null;
  hasCoordinates: boolean;
  refetch: () => void;
}

/**
 * Hook zum Laden des Firmenstandorts
 * 
 * Verwendung:
 * ```tsx
 * const { location, hasCoordinates } = useCompanyLocation();
 * 
 * if (hasCoordinates) {
 *   // Zeige Wetter-Widget mit location.latitude, location.longitude
 * }
 * ```
 */
export function useCompanyLocation(): UseCompanyLocationReturn {
  const { profile } = useAuth();

  const { data: location, isLoading, error, refetch } = useQuery({
    queryKey: ['company-location', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) {
        throw new Error('Kein Unternehmen verfügbar');
      }

      // Verwende companies-Tabelle direkt (View wurde aus Security-Gründen entfernt)
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Unternehmen nicht gefunden');

      // Type-Casting: numeric → number (CRITICAL FIX)
      return {
        ...data,
        latitude: data.latitude ? Number(data.latitude) : null,
        longitude: data.longitude ? Number(data.longitude) : null,
      } as CompanyLocation;
    },
    enabled: !!profile?.company_id,
    staleTime: 1000 * 60 * 5, // 5 Minuten Cache
    gcTime: 1000 * 60 * 10, // 10 Minuten GC
  });

  // Prüfe, ob Koordinaten vorhanden sind (mit explizitem Type-Check)
  const hasCoordinates = !!(
    location?.latitude && 
    location?.longitude && 
    typeof location.latitude === 'number' && 
    typeof location.longitude === 'number' &&
    !isNaN(location.latitude) &&
    !isNaN(location.longitude)
  );

  return {
    location: location || null,
    isLoading,
    error: error as Error | null,
    hasCoordinates,
    refetch,
  };
}

/**
 * Helper: Gibt eine lesbare Adresse zurück (strukturiert oder Fallback)
 */
export function getDisplayAddress(location: CompanyLocation | null): string {
  if (!location) return 'Keine Adresse hinterlegt';

  // Strukturierte Adresse bevorzugen
  if (location.street && location.city) {
    const parts = [
      [location.street, location.street_number].filter(Boolean).join(' '),
      [location.postal_code, location.city].filter(Boolean).join(' '),
    ].filter(Boolean);
    
    return parts.join(', ');
  }

  // Fallback auf full_address (aus View)
  if (location.full_address) {
    return location.full_address;
  }

  // Fallback auf altes address-Feld
  if (location.address) {
    return location.address;
  }

  return 'Keine Adresse hinterlegt';
}

/**
 * Helper: Prüft ob Geocoding erforderlich ist
 */
export function needsGeocoding(location: CompanyLocation | null): boolean {
  if (!location) return false;
  
  // Hat strukturierte Adresse, aber keine Koordinaten
  const hasStructuredAddress = Boolean(location.street && location.city);
  const hasCoordinates = Boolean(location.latitude && location.longitude);
  
  return hasStructuredAddress && !hasCoordinates;
}
