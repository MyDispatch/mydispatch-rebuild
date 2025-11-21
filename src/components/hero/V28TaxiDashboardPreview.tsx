/* ==================================================================================
   V28 TAXI DASHBOARD PREVIEW - TAXI-AUTHENTISCH (PHASE 1 + 3)
   ==================================================================================
   ✅ Taxi-spezifische KPIs (Fahrten, Umsatz, Fahrer, Fahrzeuge)
   ✅ Taxi-spezifische Activities (Live-Fahrt, Abgeschlossen, Geplant)
   ✅ Taxi-Icon im Header
   ✅ Live-Badge mit Pulse-Animation
   ✅ 100% Tailwind-native (NO designTokens.colors!)
   ✅ V28.1 Design System Compliance
   ================================================================================== */

import { Car, Euro, Users, TrendingUp, Clock, MapPin } from 'lucide-react';
import { V28BrowserMockup } from '@/components/home/V28BrowserMockup';

interface V28TaxiDashboardPreviewProps {
  variant?: 'dashboard' | 'compact' | 'support' | 'mobile' | 'fleet' | 'ipad';
  animationDelay?: string;
}

export function V28TaxiDashboardPreview({
  variant = 'dashboard',
  animationDelay = '0.6s'
}: V28TaxiDashboardPreviewProps) {

  // Varianten-spezifische Daten
  const isSupportVariant = variant === 'support';
  const domain = isSupportVariant ? 'my-dispatch.de/support' : 'my-dispatch.de/dashboard';
  const headerTitle = isSupportVariant ? 'Support Dashboard' : 'Taxi-Dispatch Dashboard';
  const headerIcon = isSupportVariant ? Users : Car;

  // Dashboard Content (shared between variants)
  const dashboardContent = (
    <>
      {/* Dashboard Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-100 ring-1 ring-slate-200">
              {isSupportVariant ? (
                <Users className="w-5 h-5 text-slate-700" />
              ) : (
                <Car className="w-5 h-5 text-slate-700" />
              )}
            </div>
            <div>
              <h3 className="font-sans text-base font-bold text-slate-900">
                {headerTitle}
              </h3>
              <p className="font-sans text-xs text-slate-600">
                Echtzeit-Übersicht
              </p>
            </div>
          </div>
          {/* Live-Badge mit Pulse */}
          <div className="relative">
            <div className="absolute inset-0 bg-success rounded-lg blur-sm opacity-50 animate-pulse" />
            <div className="relative px-2 py-1 rounded-lg bg-success-light ring-1 ring-success-border">
              <span className="font-sans text-xs font-bold text-success-text">
                🟢 Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6 space-y-6 bg-white">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          {isSupportVariant ? (
            <>
              {/* Support: Tickets heute */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-xs font-medium text-slate-600">
                    Tickets
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-50">
                    <Users className="w-4 h-4 text-slate-700" />
                  </div>
                </div>
                <div className="font-sans text-2xl font-bold text-slate-900">
                  45
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-success-text" />
                  <span className="font-sans text-xs font-semibold text-success-text">
                    +8% heute
                  </span>
                </div>
              </div>

              {/* Support: Antwortzeit */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-xs font-medium text-slate-600">
                    Antwortzeit
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-50">
                    <Clock className="w-4 h-4 text-slate-700" />
                  </div>
                </div>
                <div className="font-sans text-2xl font-bold text-slate-900">
                  &lt; 2h
                </div>
                <div className="font-sans text-xs text-slate-500 mt-1">
                  Durchschnitt
                </div>
              </div>

              {/* Support: Zufriedenheit */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-xs font-medium text-slate-600">
                    Zufriedenheit
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-50">
                    <TrendingUp className="w-4 h-4 text-slate-700" />
                  </div>
                </div>
                <div className="font-sans text-2xl font-bold text-slate-900">
                  98%
                </div>
                <div className="font-sans text-xs text-slate-500 mt-1">
                  Kundenbewertung
                </div>
              </div>

              {/* Support: Lösungsrate */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-xs font-medium text-slate-600">
                    Lösungsrate
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-50">
                    <Car className="w-4 h-4 text-slate-700" />
                  </div>
                </div>
                <div className="font-sans text-2xl font-bold text-slate-900">
                  94%
                </div>
                <div className="font-sans text-xs text-slate-500 mt-1">
                  First Contact
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Taxi: Fahrten Heute */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-xs font-medium text-slate-600">
                    Fahrten
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-50">
                    <Car className="w-4 h-4 text-slate-700" />
                  </div>
                </div>
                <div className="font-sans text-2xl font-bold text-slate-900">
                  142
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-success-text" />
                  <span className="font-sans text-xs font-semibold text-success-text">
                    +12% heute
                  </span>
                </div>
              </div>

              {/* Taxi: Umsatz Heute */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-xs font-medium text-slate-600">
                    Umsatz
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-50">
                    <Euro className="w-4 h-4 text-slate-700" />
                  </div>
                </div>
                <div className="font-sans text-2xl font-bold text-slate-900">
                  12.5k
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-success-text" />
                  <span className="font-sans text-xs font-semibold text-success-text">
                    +8% heute
                  </span>
                </div>
              </div>

              {/* Taxi: Fahrer Aktiv */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-xs font-medium text-slate-600">
                    Fahrer
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-50">
                    <Users className="w-4 h-4 text-slate-700" />
                  </div>
                </div>
                <div className="font-sans text-2xl font-bold text-slate-900">
                  28
                </div>
                <div className="font-sans text-xs text-slate-500 mt-1">
                  Aktiv im Einsatz
                </div>
              </div>

              {/* Taxi: Fahrzeuge Verfügbar */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-xs font-medium text-slate-600">
                    Fahrzeuge
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-50">
                    <Car className="w-4 h-4 text-slate-700" />
                  </div>
                </div>
                <div className="font-sans text-2xl font-bold text-slate-900">
                  35
                </div>
                <div className="font-sans text-xs text-slate-500 mt-1">
                  Im Einsatz
                </div>
              </div>
            </>
          )}
        </div>

        {/* Activity List */}
        <div>
          <h4 className="font-sans text-sm font-semibold mb-3 text-slate-900">
            {isSupportVariant ? 'Letzte Support-Tickets' : 'Letzte Fahrten'}
          </h4>
          <div className="space-y-2">
            {isSupportVariant ? (
              <>
                {/* Support: Aktives Ticket */}
                <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-success-light">
                        <Users className="w-4 h-4 text-success-text" />
                      </div>
                      <div>
                        <div className="font-sans text-sm font-medium text-slate-900">
                          API-Integration Frage
                        </div>
                        <div className="font-sans text-xs text-slate-600">
                          Max Mustermann • #SUP-1234
                        </div>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 rounded-md bg-success-light ring-1 ring-success-border">
                      <span className="font-sans text-xs font-bold text-success-text">
                        In Bearbeitung
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pl-9">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3 h-3" />
                      <span className="font-sans text-xs">12:45 Uhr</span>
                    </div>
                    <span className="font-sans text-xs font-medium text-success-text">
                      Prio: Hoch
                    </span>
                  </div>
                </div>

                {/* Support: Abgeschlossenes Ticket */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 hover:shadow-md hover:scale-[1.01] transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-slate-100">
                        <TrendingUp className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <div className="font-sans text-sm font-medium text-slate-900">
                          Passwort zurückgesetzt
                        </div>
                        <div className="font-sans text-xs text-slate-600">
                          Anna Schmidt • #SUP-1187
                        </div>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 rounded-md bg-slate-200">
                      <span className="font-sans text-xs font-semibold text-slate-700">
                        Erledigt
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pl-9">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3 h-3" />
                      <span className="font-sans text-xs">11:30 Uhr</span>
                    </div>
                    <span className="font-sans text-xs font-medium text-slate-600">
                      15 Min
                    </span>
                  </div>
                </div>

                {/* Support: Geplant */}
                <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-slate-50">
                        <MapPin className="w-4 h-4 text-slate-700" />
                      </div>
                      <div>
                        <div className="font-sans text-sm font-medium text-slate-900">
                          Schulung neue Features
                        </div>
                        <div className="font-sans text-xs text-slate-600">
                          Thomas Weber • #SUP-1092
                        </div>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 rounded-md border border-slate-300">
                      <span className="font-sans text-xs font-semibold text-slate-700">
                        14:00
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pl-9">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3 h-3" />
                      <span className="font-sans text-xs">Heute</span>
                    </div>
                    <span className="font-sans text-xs font-medium text-slate-600">
                      1 Std.
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Taxi: Live-Fahrt */}
                <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-success-light">
                        <Car className="w-4 h-4 text-success-text" />
                      </div>
                      <div>
                        <div className="font-sans text-sm font-medium text-slate-900">
                          Frankfurt HBF → Flughafen
                        </div>
                        <div className="font-sans text-xs text-slate-600">
                          Max Mustermann • Taxi #B-234
                        </div>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 rounded-md bg-success-light ring-1 ring-success-border">
                      <span className="font-sans text-xs font-bold text-success-text">
                        Live
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pl-9">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3 h-3" />
                      <span className="font-sans text-xs">12:45 Uhr</span>
                    </div>
                    <span className="font-sans text-xs font-medium text-success-text">
                      ETA: 13:20
                    </span>
                  </div>
                </div>

                {/* Taxi: Abgeschlossene Fahrt */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 hover:shadow-md hover:scale-[1.01] transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-slate-100">
                        <TrendingUp className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <div className="font-sans text-sm font-medium text-slate-900">
                          Flughafen FRA → City
                        </div>
                        <div className="font-sans text-xs text-slate-600">
                          Anna Schmidt • Taxi #B-187
                        </div>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 rounded-md bg-slate-200">
                      <span className="font-sans text-xs font-semibold text-slate-700">
                        Erledigt
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pl-9">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3 h-3" />
                      <span className="font-sans text-xs">11:30 Uhr</span>
                    </div>
                    <span className="font-sans text-xs font-medium text-slate-600">
                      €85,50
                    </span>
                  </div>
                </div>

                {/* Taxi: Geplante Fahrt */}
                <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-slate-50">
                        <MapPin className="w-4 h-4 text-slate-700" />
                      </div>
                      <div>
                        <div className="font-sans text-sm font-medium text-slate-900">
                          City-Tour Mainz
                        </div>
                        <div className="font-sans text-xs text-slate-600">
                          Thomas Weber • Taxi #B-092
                        </div>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 rounded-md border border-slate-300">
                      <span className="font-sans text-xs font-semibold text-slate-700">
                        14:00
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pl-9">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3 h-3" />
                      <span className="font-sans text-xs">Heute</span>
                    </div>
                    <span className="font-sans text-xs font-medium text-slate-600">
                      3.5 Std.
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  // iPad-Variante: NUR Dashboard-Content ohne Browser-Mockup
  if (variant === 'ipad') {
    return (
      <div
        className="animate-fade-in"
        style={{ animationDelay }}
      >
        {dashboardContent}
      </div>
    );
  }

  // Standard-Variante: MIT Browser-Mockup
  return (
    <div
      className="hidden lg:block animate-fade-in"
      style={{ animationDelay }}
    >
      <V28BrowserMockup title={domain}>
        {dashboardContent}
      </V28BrowserMockup>
    </div>
  );
}
