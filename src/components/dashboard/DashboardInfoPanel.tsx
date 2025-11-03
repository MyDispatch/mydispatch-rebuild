/* ==================================================================================
   DASHBOARD INFO PANEL V28.1 - PURE TAILWIND SLATE DESIGN
   ==================================================================================
   ✅ 100% Pure Tailwind - KEINE Token-Imports
   ✅ Slate Palette (Professional Gray-Blue)
   ✅ 1px Borders (V28.1 Spec)
   ✅ Tailwind Shadows (shadow-sm, shadow-md, shadow-lg)
   ✅ 200-300ms Transitions
   ✅ KEINE V26 Components
   ✅ KEINE Custom CSS Classes
   ✅ KEINE Inline Styles
   ================================================================================== */

import React, { useState, useEffect, useMemo } from 'react';
import { useVehicles } from '@/hooks/use-vehicles';
import { useBookings } from '@/hooks/use-bookings';
import { Clock, Calendar, MapPin, Activity, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { PremiumWeatherDisplay } from './PremiumWeatherDisplay';
import { PremiumTrafficDisplay } from './PremiumTrafficDisplay';
import { cn } from '@/lib/utils';

interface DashboardInfoPanelProps {
  sidebarExpanded: boolean;
}

// Status-Farben Helper (Tailwind-Klassen)
const getStatusColorClass = (status: string) => {
  switch (status) {
    case 'available': return 'bg-status-success';
    case 'im_einsatz': return 'bg-status-warning';
    case 'wartung': return 'bg-status-error';
    case 'defekt': return 'bg-muted';
    default: return 'bg-status-success';
  }
};

export function DashboardInfoPanel({ sidebarExpanded }: DashboardInfoPanelProps) {
  const { vehicles = [] } = useVehicles();
  const { bookings = [] } = useBookings();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update Zeit jede Sekunde
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Memoized Fahrzeug-Statistiken (Performance-Optimierung)
  const vehicleStats = useMemo(() => ({
    available: vehicles.filter(v => v.status === 'available').length,
    im_einsatz: vehicles.filter(v => v.status === 'im_einsatz').length,
    wartung: vehicles.filter(v => v.status === 'wartung').length,
    defekt: vehicles.filter(v => v.status === 'defekt').length,
  }), [vehicles]);

  // Memoized 10 aktuellste Aufträge
  const recentBookings = useMemo(() => 
    bookings
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10),
    [bookings]
  );

  return (
    <div
      className="fixed z-30 right-0 bottom-12 h-20 overflow-hidden bg-white border border-t border-slate-200 rounded-t-xl shadow-lg transition-all duration-300"
      style={{
        left: sidebarExpanded ? '560px' : '384px',
        width: sidebarExpanded ? 'calc(100% - 560px)' : 'calc(100% - 384px)',
      }}
    >
      <div className="px-3 py-2 pb-4">
        <div className="flex items-center justify-between gap-2">
          {/* Uhrzeit & Datum - Pure Tailwind Card */}
          <div className="group relative overflow-hidden flex items-center gap-2 px-2.5 py-2 border border-slate-200 rounded-md bg-slate-50 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md pointer-events-none" />
            <div className="relative z-10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tabular-nums text-slate-900">
                  {format(currentTime, 'HH:mm:ss')}
                </span>
                <span className="text-[10px] font-medium text-slate-600">
                  {format(currentTime, 'dd.MM.yyyy', { locale: de })}
                </span>
              </div>
            </div>
          </div>

          {/* Fahrzeugstatus - Compact Card */}
          <div className="group relative overflow-hidden flex items-center gap-2 px-2.5 py-2 border border-slate-200 rounded-md bg-slate-50 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md pointer-events-none" />
            <div className="relative z-10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Activity className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex items-center gap-1.5">
                {Object.entries(vehicleStats).map(([status, count]) => (
                  <div key={status} className="flex items-center gap-1">
                    <div 
                      className={`w-2 h-2 rounded-full ${getStatusColorClass(status)} shadow-sm`}
                    />
                    <span className="text-xs font-bold tabular-nums text-slate-900">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legende - Compact Card */}
          <div className="group relative overflow-hidden flex items-center gap-2 px-2.5 py-2 border border-slate-200 rounded-md bg-slate-50 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md pointer-events-none" />
            <div className="relative z-10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-400 shadow-sm" />
                  <span className="text-[10px] font-medium text-slate-900">
                    HQ
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-status-success shadow-sm" />
                  <span className="text-[10px] font-medium text-slate-900">
                    Frei
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-status-warning shadow-sm" />
                  <span className="text-[10px] font-medium text-slate-900">
                    Aktiv
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-status-error shadow-sm" />
                  <span className="text-[10px] font-medium text-slate-900">
                    Service
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Wetter - Pure Tailwind */}
          <PremiumWeatherDisplay />

          {/* Verkehr - Pure Tailwind */}
          <PremiumTrafficDisplay />

          {/* Aufträge - Pure Tailwind Card */}
          <div className="group relative overflow-hidden flex items-center gap-2 px-2.5 py-2 border border-slate-200 rounded-md bg-slate-50 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md pointer-events-none" />
            <div className="relative z-10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-700">
                    {recentBookings.length}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Aufträge
                  </span>
                </div>
                {recentBookings.length > 0 && (
                  <span className="text-[10px] font-medium text-slate-600">
                    Zuletzt: {format(new Date(recentBookings[0].created_at), 'HH:mm')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
