/* ==================================================================================
   V28 DASHBOARD PREVIEW (DEPRECATED - USE ThematicDashboards INSTEAD)
   ==================================================================================
   ⚠️ DEPRECATED: Diese Komponente wird in V30.0 entfernt.
   ✅ ALTERNATIVE: Nutze stattdessen ThematicDashboards aus @/components/preview
   
   Migration:
   ```tsx
   // ALT:
   import { V28DashboardPreview } from '@/components/home';
   <V28DashboardPreview />
   
   // NEU:
   import { HomeDashboardPreview } from '@/components/preview';
   <HomeDashboardPreview />
   ```
   ================================================================================== */

import { FileText, Euro, Users, Car, Clock, TrendingUp } from "lucide-react";
import { V28BrowserMockup } from "./V28BrowserMockup";

interface V28DashboardPreviewProps {
  animationDelay?: string;
  title?: string;
}

/**
 * @deprecated Nutze stattdessen ThematicDashboards aus @/components/preview
 * Diese Component wird in V30.0 entfernt.
 */
export function V28DashboardPreview({
  animationDelay = "0.6s",
  title = "my-dispatch.de/dashboard",
}: V28DashboardPreviewProps) {
  return (
    <div className="hidden lg:block animate-fade-in" style={{ animationDelay }}>
      <V28BrowserMockup title={title}>
        {/* Dashboard Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 ring-1 ring-slate-200">
                <TrendingUp className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h3 className="font-sans text-base font-bold text-slate-900">Live-Dashboard</h3>
                <p className="font-sans text-xs text-slate-600">Echtzeit-Übersicht</p>
              </div>
            </div>
            <div className="px-2 py-1 rounded-lg bg-green-100 ring-1 ring-green-200">
              <span className="font-sans text-xs font-bold text-green-700">Live</span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 bg-white space-y-6">
          {/* KPI Cards Grid - Premium Design */}
          <div className="grid grid-cols-2 gap-4">
            {/* Aufträge */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 group">
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-xs font-medium text-slate-600">Aufträge</span>
                <div className="p-1.5 rounded-lg bg-slate-50">
                  <FileText className="w-4 h-4 text-slate-700" />
                </div>
              </div>
              <div className="font-sans text-2xl font-bold text-slate-900">142</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="font-sans text-xs font-semibold text-green-600">+12%</span>
              </div>
            </div>

            {/* Umsatz */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 group">
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-xs font-medium text-slate-600">Umsatz</span>
                <div className="p-1.5 rounded-lg bg-slate-50">
                  <Euro className="w-4 h-4 text-slate-700" />
                </div>
              </div>
              <div className="font-sans text-2xl font-bold text-slate-900">12.5k</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="font-sans text-xs font-semibold text-green-600">+8%</span>
              </div>
            </div>

            {/* Fahrer */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 group">
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-xs font-medium text-slate-600">Fahrer</span>
                <div className="p-1.5 rounded-lg bg-slate-50">
                  <Users className="w-4 h-4 text-slate-700" />
                </div>
              </div>
              <div className="font-sans text-2xl font-bold text-slate-900">28</div>
              <div className="font-sans text-xs text-slate-500 mt-1">Aktiv</div>
            </div>

            {/* Fahrzeuge */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 group">
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-xs font-medium text-slate-600">Fahrzeuge</span>
                <div className="p-1.5 rounded-lg bg-slate-50">
                  <Car className="w-4 h-4 text-slate-700" />
                </div>
              </div>
              <div className="font-sans text-2xl font-bold text-slate-900">35</div>
              <div className="font-sans text-xs text-slate-500 mt-1">Im Einsatz</div>
            </div>
          </div>

          {/* Activity List - Premium Design */}
          <div>
            <h4 className="font-sans text-sm font-semibold mb-3 text-slate-900">
              Letzte Aktivitäten
            </h4>
            <div className="space-y-2">
              {/* Activity Item 1 - Live */}
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-green-50">
                      <Car className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-sans text-sm font-medium text-slate-900">
                        Fahrt nach Frankfurt HBF
                      </div>
                      <div className="font-sans text-xs text-slate-600">
                        Max Mustermann • Fahrzeug #B-234
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0.5 rounded-md bg-green-100 ring-1 ring-green-200">
                    <span className="font-sans text-xs font-bold text-green-700">Live</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pl-9">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Clock className="w-3 h-3" />
                    <span className="font-sans text-xs">12:45 Uhr</span>
                  </div>
                  <span className="font-sans text-xs font-medium text-green-600">ETA: 13:20</span>
                </div>
              </div>

              {/* Activity Item 2 - Abgeschlossen */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 hover:shadow-md hover:scale-[1.01] transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-slate-100">
                      <TrendingUp className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-sans text-sm font-medium text-slate-900">
                        Flughafen-Transfer FRA
                      </div>
                      <div className="font-sans text-xs text-slate-600">
                        Anna Schmidt • Fahrzeug #B-187
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0.5 rounded-md bg-slate-200">
                    <span className="font-sans text-xs font-semibold text-slate-700">Erledigt</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pl-9">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Clock className="w-3 h-3" />
                    <span className="font-sans text-xs">11:30 Uhr</span>
                  </div>
                  <span className="font-sans text-xs font-medium text-slate-600">€85,50</span>
                </div>
              </div>

              {/* Activity Item 3 - Geplant */}
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-slate-50">
                      <Clock className="w-4 h-4 text-slate-700" />
                    </div>
                    <div>
                      <div className="font-sans text-sm font-medium text-slate-900">
                        City-Tour Mainz
                      </div>
                      <div className="font-sans text-xs text-slate-600">
                        Thomas Weber • Fahrzeug #B-092
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0.5 rounded-md border border-slate-300">
                    <span className="font-sans text-xs font-semibold text-slate-700">14:00</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pl-9">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Clock className="w-3 h-3" />
                    <span className="font-sans text-xs">Heute</span>
                  </div>
                  <span className="font-sans text-xs font-medium text-slate-600">3.5 Std.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </V28BrowserMockup>
    </div>
  );
}
