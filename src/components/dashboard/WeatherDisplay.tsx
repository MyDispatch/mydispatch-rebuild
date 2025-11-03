/* ==================================================================================
   WEATHER DISPLAY V20.0.0 - Wetterdaten für Dashboard Info Panel
   ==================================================================================
   Simple Mock-Implementation - kann später mit echter API erweitert werden
   ================================================================================== */

import { Cloud, CloudRain, Sun } from 'lucide-react';

export function useWeatherData() {
  // Mock Wetterdaten (später durch echte API ersetzen)
  return {
    temperature: 18,
    condition: 'teilweise bewölkt',
    icon: Cloud,
  };
}

export function WeatherDisplay() {
  const weather = useWeatherData();
  const WeatherIcon = weather.icon;

  return (
    <div className="flex items-center gap-2 shrink-0">
      <WeatherIcon className="h-4 w-4 text-slate-600" />
      <span className="text-xs font-medium text-slate-700">
        {weather.temperature}°C
      </span>
    </div>
  );
}
