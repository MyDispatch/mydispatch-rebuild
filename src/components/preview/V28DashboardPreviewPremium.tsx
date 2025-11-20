/* ==================================================================================
   V28 DASHBOARD PREVIEW PREMIUM V29.5 - HIGH-QUALITY MOCKUP RENDERER
   ==================================================================================
   ✅ Premium-Qualität Dashboard-Rendering für iPad-Mockup
   ✅ Realistische Daten mit professionellen Trends
   ✅ V28.1 Design System compliant (100% Slate)
   ✅ Live-Karte mit Fahrzeug-Pins
   ✅ Optimiert für scale(0.7) im iPad-Mockup
   ================================================================================== */

import { formatCurrency } from '@/lib/format-utils';
import { FileText, Users, Car, Euro, MapPin, Activity } from 'lucide-react';
import { V28StatCard, V28DashboardSection, V28DashboardCard } from '@/components/design-system';
import { DataGrid } from '@/components/smart-templates';

interface V28DashboardPreviewPremiumProps {
  scale?: number;
}

export function V28DashboardPreviewPremium({ 
  scale = 1 
}: V28DashboardPreviewPremiumProps) {
  // Premium Demo-Daten mit realistischen Werten
  const demoStats = {
    bookings: 127,
    revenue: 45280,
    drivers: 23,
    vehicles: 18,
    trends: {
      bookings: 12.5,
      revenue: 8.3,
      drivers: 0,
      vehicles: 0
    }
  };

  // Realistische Fahrzeug-Positionen für Karte (Berlin-Koordinaten)
  const vehiclePositions = [
    { lat: 52.52, lng: 13.405, status: 'busy' },
    { lat: 52.51, lng: 13.39, status: 'available' },
    { lat: 52.53, lng: 13.42, status: 'busy' },
    { lat: 52.50, lng: 13.41, status: 'available' },
    { lat: 52.52, lng: 13.38, status: 'busy' },
  ];

  return (
    <div 
      style={{ 
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${100 / scale}%`,
        height: `${100 / scale}%`
      }}
      className="bg-slate-50 min-h-screen"
    >
      <div className="p-8 space-y-8">
        {/* Header Section */}
        <V28DashboardSection background="white" className="py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                Dashboard
              </h1>
              <p className="text-base text-slate-600 mt-2">
                Heute • {new Date().toLocaleDateString('de-DE', { 
                  weekday: 'long', 
                  day: '2-digit', 
                  month: 'long' 
                })}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Activity className="w-4 h-4 text-green-500" />
              <span>Live</span>
            </div>
          </div>

          {/* KPI Grid */}
          <DataGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap="lg">
            <V28StatCard
              label="Aufträge heute"
              value={demoStats.bookings}
              change={{ value: demoStats.trends.bookings, trend: 'up' }}
              icon={FileText}
            />
            <V28StatCard
              label="Umsatz heute"
              value={formatCurrency(demoStats.revenue)}
              change={{ value: demoStats.trends.revenue, trend: 'up' }}
              icon={Euro}
            />
            <V28StatCard
              label="Aktive Fahrer"
              value={demoStats.drivers}
              icon={Users}
            />
            <V28StatCard
              label="Verfügbare Fahrzeuge"
              value={demoStats.vehicles}
              icon={Car}
            />
          </DataGrid>
        </V28DashboardSection>

        {/* Live-Karte Section */}
        <V28DashboardSection background="white" className="py-8">
          <V28DashboardCard 
            title="Live-Karte" 
            description="Fahrzeugstandorte in Echtzeit"
            icon={MapPin}
          >
            <div className="relative h-[400px] bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl overflow-hidden border border-slate-200">
              {/* Simulated Map Background */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-300"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Fahrzeug-Pins (vereinfacht) */}
              {vehiclePositions.map((pos, idx) => (
                <div
                  key={idx}
                  className="absolute w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                  style={{
                    left: `${20 + idx * 15}%`,
                    top: `${30 + (idx % 2) * 20}%`,
                    backgroundColor: pos.status === 'busy' ? '#ef4444' : '#22c55e',
                  }}
                >
                  <Car className="w-4 h-4 text-white" />
                </div>
              ))}

              {/* Center Marker (HQ) */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center shadow-2xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-slate-200">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-slate-700">Verfügbar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-slate-700">Im Einsatz</span>
                  </div>
                </div>
              </div>
            </div>
          </V28DashboardCard>
        </V28DashboardSection>

        {/* Activity List */}
        <V28DashboardSection background="white" className="py-8">
          <V28DashboardCard 
            title="Letzte Aktivitäten" 
            icon={Activity}
          >
            <div className="space-y-3">
              {[
                { time: 'vor 2 Min', text: 'Auftrag #5247 abgeschlossen', status: 'success' },
                { time: 'vor 5 Min', text: 'Neuer Auftrag #5248 erstellt', status: 'info' },
                { time: 'vor 12 Min', text: 'Fahrer zugewiesen #5246', status: 'info' },
                { time: 'vor 18 Min', text: 'Auftrag #5245 abgeschlossen', status: 'success' },
              ].map((activity, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-sm text-slate-900 font-medium">
                      {activity.text}
                    </span>
                  </div>
                  <span className="text-xs text-slate-600">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </V28DashboardCard>
        </V28DashboardSection>
      </div>
    </div>
  );
}
