/* ==================================================================================
   USE WEATHER DATA HOOK
   ==================================================================================
   Mock weather data hook - can be replaced with real API later
   ================================================================================== */

import { Cloud } from 'lucide-react';

export function useWeatherData() {
  // Mock Wetterdaten (später durch echte API ersetzen)
  return {
    temperature: 18,
    condition: 'teilweise bewölkt',
    icon: Cloud,
  };
}
