/* ==================================================================================
   TARIFF CALCULATOR - LIVE FARE CALCULATION
   ==================================================================================
   Phase 3.1: Taxi-Spezifische Features
   - Google Distance Matrix API Integration
   - Echtzeit-Preisberechnung
   - Tarif-Regeln basierend auf Zeit/Distanz
   ================================================================================== */

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
 * Get Distance using Google Distance Matrix API
 */
const getDistance = async (
  pickup: string,
  destination: string
): Promise<DistanceData> => {
  // TODO: Replace with actual Google Distance Matrix API call
  // For now, return mock data
  const mockDistanceKm = Math.random() * 20 + 5; // 5-25km
  const mockMinutes = Math.round(mockDistanceKm * 2.5); // ~2.5 min per km
  
  return {
    km: mockDistanceKm,
    minutes: mockMinutes
  };
  
  /* PRODUCTION IMPLEMENTATION:
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?` +
    `origins=${encodeURIComponent(pickup)}&` +
    `destinations=${encodeURIComponent(destination)}&` +
    `key=${GOOGLE_MAPS_API_KEY}`
  );
  
  const data = await response.json();
  const element = data.rows[0].elements[0];
  
  return {
    km: element.distance.value / 1000,
    minutes: element.duration.value / 60
  };
  */
};

/**
 * Get Tariff Rules from Supabase
 */
const getTariffRules = async (companyId: string): Promise<TariffRules> => {
  // TODO: Fetch from Supabase tariff_definitions table
  // For now, return default tariff
  return {
    basePrice: 3.50,
    pricePerKm: 2.20,
    pricePerMinute: 0.50,
    nightSurcharge: 5.00,
    weekendSurcharge: 2.50
  };
  
  /* PRODUCTION IMPLEMENTATION:
  const { data, error } = await supabase
    .from('tariff_definitions')
    .select('*')
    .eq('company_id', companyId)
    .single();
  
  if (error) throw error;
  
  return {
    basePrice: data.base_price,
    pricePerKm: data.price_per_km,
    pricePerMinute: data.price_per_minute,
    nightSurcharge: data.night_surcharge,
    weekendSurcharge: data.weekend_surcharge
  };
  */
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
