/* ==================================================================================
   MAP WEATHER LIVE DASHBOARD V31.0
   ==================================================================================
   Shows GPS map with live traffic and weather information
   ================================================================================== */

import { RenderingResolution } from '@/lib/rendering-quality';
import { useOptimizedRendering } from '@/hooks/useOptimizedRendering';
import { MapPin, Navigation, Cloud, Wind, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapWeatherLiveDashboardProps {
  variant?: 'ipad' | 'iphone' | 'desktop';
  resolution?: RenderingResolution;
}

export default function MapWeatherLiveDashboard({ 
  variant = 'ipad',
  resolution = 'retina' 
}: MapWeatherLiveDashboardProps) {
  const { shouldRender, elementRef } = useOptimizedRendering(resolution);

  if (!shouldRender) {
    return <div ref={elementRef} className="w-full h-full bg-slate-50 animate-pulse" />;
  }

  return (
    <div ref={elementRef} className="w-full h-full bg-slate-100 relative overflow-hidden">
      {/* Map Background (Simplified) */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300">
        {/* Grid lines for map effect */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div key={`v-${i}`} className="absolute top-0 bottom-0 w-px bg-slate-400" style={{ left: `${i * 10}%` }} />
          ))}
          {[...Array(10)].map((_, i) => (
            <div key={`h-${i}`} className="absolute left-0 right-0 h-px bg-slate-400" style={{ top: `${i * 10}%` }} />
          ))}
        </div>
      </div>

      {/* Vehicle Markers */}
      <div className="absolute top-[25%] left-[30%] z-10">
        <div className="relative">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <Navigation className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <div className="bg-white px-2 py-1 rounded shadow-sm text-xs font-semibold">
              Fahrer #42
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-[60%] left-[55%] z-10">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <Navigation className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="absolute top-[40%] left-[70%] z-10">
        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
          <Navigation className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Traffic Alert */}
      <div className="absolute top-[35%] left-[45%] z-10">
        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg animate-pulse">
          <AlertCircle className="w-3 h-3" />
          Stau A2
        </div>
      </div>

      {/* Weather Widget */}
      <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-4 z-20 w-48">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-slate-600" />
            <span className="font-semibold text-slate-900">Hamburg</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">12°C</span>
        </div>
        <div className="text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-2">
            <Wind className="w-3 h-3" />
            <span>15 km/h NW</span>
          </div>
          <div>Bewölkt, leichter Regen</div>
        </div>
      </div>

      {/* GPS Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-3 z-20">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-slate-900">12 Fahrer</span>
            <span className="text-slate-600">aktiv</span>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs text-slate-600">9 frei</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <span className="text-xs text-slate-600">3 unterwegs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
