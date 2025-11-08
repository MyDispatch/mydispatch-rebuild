/* ==================================================================================
   TARIFF CALCULATOR - LIVE FARE CALCULATION
   ==================================================================================
   Phase 3.1: Taxi-Spezifische Features
   - HERE Maps API Integration (Distance Calculation)
   - Echtzeit-Preisberechnung
   - Tarif-Regeln basierend auf Zeit/Distanz (Supabase)
   ================================================================================== */

import { supabase } from '@/integrations/supabase/client';
import type { Tariff } from '@/integrations/supabase/types/core-tables';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Type helper for typed queries
type TypedSupabaseClient = typeof supabase & {
  from(table: 'tariff_definitions'): any;
};
const typedClient = supabase as TypedSupabaseClient;

interface TariffRules {
  basePrice: number;
  pricePerKm: number;
  pricePerMinute: number;
  waitingTimePerMinute?: number;
  nightSurcharge?: number; // 22:00 - 06:00
  weekendSurcharge?: number;
}

interface DistanceData {
  km: number;
  minutes: number;
}

/**
 * Calculate Fare based on Distance & Tariff Rules
 */
export const calculateFare = async (
  pickup: string,
  destination: string,
  companyId: string,
  dateTime?: Date
): Promise<number> => {
  try {
    // 1. Get Distance from Google Distance Matrix API
    const distance = await getDistance(pickup, destination);

    // 2. Load Company Tariff Rules
    const tariff = await getTariffRules(companyId);

    // 3. Calculate Base Fare
    let fare = tariff.basePrice +
               (distance.km * tariff.pricePerKm) +
               (distance.minutes * tariff.pricePerMinute);

    // 4. Apply Time-based Surcharges
    if (dateTime) {
      const hour = dateTime.getHours();
      const isNight = hour >= 22 || hour < 6;
      const isWeekend = dateTime.getDay() === 0 || dateTime.getDay() === 6;

      if (isNight && tariff.nightSurcharge) {
        fare += tariff.nightSurcharge;
      }

      if (isWeekend && tariff.weekendSurcharge) {
        fare += tariff.weekendSurcharge;
      }
    }

    return Math.round(fare * 100) / 100; // Round to 2 decimals
  } catch (error) {
    console.error('Fare calculation error:', error);
    return 0;
  }
};

/**
 * Get Distance using HERE Maps API (Routing v8)
 * Falls API nicht verfügbar, wird Mock Data verwendet
 */
const getDistance = async (
  pickup: string,
  destination: string
): Promise<DistanceData> => {
  try {
    const HERE_API_KEY = import.meta.env.VITE_HERE_API_KEY;

    if (!HERE_API_KEY) {
      console.warn('HERE API Key nicht gefunden, verwende Mock Data');
      return getMockDistance();
    }

    // HERE Routing API v8 - Calculate Route
    const response = await fetch(
      `https://router.hereapi.com/v8/routes?` +
      `transportMode=car&` +
      `origin=${encodeURIComponent(pickup)}&` +
      `destination=${encodeURIComponent(destination)}&` +
      `return=summary&` +
      `apikey=${HERE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HERE API Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const summary = route.sections[0]?.summary;

      if (summary) {
        return {
          km: summary.length / 1000, // Convert meters to km
          minutes: summary.duration / 60 // Convert seconds to minutes
        };
      }
    }

    // Fallback to mock data if route not found
    return getMockDistance();
  } catch (error) {
    console.error('Distance calculation error:', error);
    // Fallback to mock data on error
    return getMockDistance();
  }
};

/**
 * Mock Distance Data (Fallback)
 */
const getMockDistance = (): DistanceData => {
  const mockDistanceKm = Math.random() * 20 + 5; // 5-25km
  const mockMinutes = Math.round(mockDistanceKm * 2.5); // ~2.5 min per km

  return {
    km: mockDistanceKm,
    minutes: mockMinutes
  };
};

/**
 * Get Tariff Rules from Supabase
 * Falls keine Tarife gefunden werden, wird Default-Tarif verwendet
 */
const getTariffRules = async (companyId: string): Promise<TariffRules> => {
  try {
    const { data, error } = await typedClient
      .from('tariff_definitions')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn('Tariff fetch error, using default:', error);
      return getDefaultTariff();
    }

    if (data) {
      const tariff = data as Tariff;
      return {
        basePrice: tariff.base_price || 3.50,
        pricePerKm: tariff.price_per_km || 2.20,
        pricePerMinute: tariff.price_per_minute || 0.50,
        waitingTimePerMinute: tariff.waiting_time_per_minute,
        nightSurcharge: tariff.night_surcharge || 5.00,
        weekendSurcharge: tariff.weekend_surcharge || 2.50
      };
    }

    // No tariff found, return default
    return getDefaultTariff();
  } catch (error) {
    console.error('Tariff rules error:', error);
    return getDefaultTariff();
  }
};

/**
 * Default Tariff (Fallback)
 */
const getDefaultTariff = (): TariffRules => {
  return {
    basePrice: 3.50,
    pricePerKm: 2.20,
    pricePerMinute: 0.50,
    nightSurcharge: 5.00,
    weekendSurcharge: 2.50
  };
};

/**
 * Format Fare as Currency String
 */
export const formatFare = (fare: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(fare);
};
