/* ==================================================================================
   ZENTRALE API-SCHEMAS - V18.3.23
   ==================================================================================
   Shared Types zwischen Frontend und Backend zur Vermeidung von Diskrepanzen
   ================================================================================== */

/**
 * Weather API Response Schema
 * Verwendet von: supabase/functions/get-weather/index.ts
 */
export interface WeatherApiResponse {
  temp: number;
  description: string;
  icon: string;
  location: string;
  humidity: number;
  wind_speed: number; // km/h
  pressure: number | null; // hPa
  visibility: number | null; // meters
}

/**
 * Traffic API Response Schema
 * Verwendet von: supabase/functions/get-traffic/index.ts
 */
export interface TrafficApiResponse {
  jam_factor: number; // 0-10
  speed: number; // km/h
  status: string;
  route_summary?: string;
  delay_seconds?: number;
  retry_after?: number; // V18.5.3 Rate-Limit
  error?: string;
}

/**
 * AI Demand Prediction Response Schema
 * Verwendet von: supabase/functions/ai-demand-prediction/index.ts
 */
export interface DemandPredictionResponse {
  predictions: Array<{
    hour: number;
    expected_bookings: number;
    confidence: number; // 0-100
  }>;
  recommendations: Array<{
    type: 'info' | 'warning' | 'error';
    message: string;
    action?: string;
  }>;
}

/**
 * Type Guard für Weather Response Validierung
 */
export function isValidWeatherResponse(data: unknown): data is WeatherApiResponse {
  if (!data || typeof data !== 'object') return false;
  
  const d = data as Partial<WeatherApiResponse>;
  
  return (
    typeof d.temp === 'number' &&
    typeof d.description === 'string' &&
    typeof d.icon === 'string' &&
    typeof d.location === 'string' &&
    typeof d.humidity === 'number' &&
    typeof d.wind_speed === 'number' &&
    (d.pressure === null || typeof d.pressure === 'number') &&
    (d.visibility === null || typeof d.visibility === 'number')
  );
}

/**
 * Type Guard für Traffic Response Validierung
 */
export function isValidTrafficResponse(data: unknown): data is TrafficApiResponse {
  if (!data || typeof data !== 'object') return false;
  
  const d = data as Partial<TrafficApiResponse>;
  
  return (
    typeof d.jam_factor === 'number' &&
    typeof d.speed === 'number' &&
    typeof d.status === 'string'
  );
}

/**
 * Runtime Validation Helper
 * Wirft Error bei ungültigen Daten mit Details
 */
export function validateApiResponse<T>(
  data: unknown,
  validator: (data: unknown) => data is T,
  apiName: string
): T {
  if (!validator(data)) {
    console.error(`[${apiName}] Invalid API Response:`, data);
    throw new Error(`Ungültige ${apiName}-API-Response. Siehe Console für Details.`);
  }
  return data;
}
