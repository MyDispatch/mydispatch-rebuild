/* ==================================================================================
   PREMIUM WEATHER DISPLAY V28.1 - PURE TAILWIND
   ==================================================================================
   ✅ 100% Pure Tailwind - KEINE Token-Imports
   ✅ Slate Palette (Professional Gray-Blue)
   ✅ 1px Borders (V28.1 Spec)
   ✅ Tailwind Shadows
   ✅ KEINE V26 Components
   ✅ KEINE DashboardInfoCard
   ================================================================================== */

import { Cloud, CloudRain, Sun } from "lucide-react";

export function useWeatherData() {
  // Mock Wetterdaten (später durch echte API ersetzen)
  return {
    temperature: 18,
    condition: "Teilweise bewölkt",
    icon: Cloud,
  };
}

export function PremiumWeatherDisplay() {
  const weather = useWeatherData();

  return (
    <div className="flex items-center gap-2 px-2.5 py-2 border border-slate-200 rounded-md bg-slate-50 flex-shrink-0">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
        <weather.icon className="h-4 w-4 text-slate-700" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold tabular-nums text-slate-900">
          {weather.temperature}°C
        </span>
        <span className="text-[10px] font-medium text-slate-600">{weather.condition}</span>
      </div>
    </div>
  );
}
