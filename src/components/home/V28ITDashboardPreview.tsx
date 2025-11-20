/* ==================================================================================
   V28 IT DASHBOARD PREVIEW - IT-SUPPORT THEME
   ==================================================================================
   ✅ Browser-Mockup mit IT-Support Dashboard
   ✅ KPI Cards: Server Uptime, Tickets, Response Time, Monitors
   ✅ Activity List: Ticket-System
   ✅ V28.1 Design System (Slate, Flat, Premium Shadows)
   ================================================================================== */

import {
  Server,
  Shield,
  Clock,
  Monitor,
  Headphones,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { V28BrowserMockup } from "./V28BrowserMockup";

interface V28ITDashboardPreviewProps {
  animationDelay?: string;
}

export function V28ITDashboardPreview({ animationDelay = "0.6s" }: V28ITDashboardPreviewProps) {
  return (
    <div className="hidden lg:block animate-fade-in" style={{ animationDelay }}>
      <V28BrowserMockup title="support.nexify.nl/dashboard">
        {/* Dashboard Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 ring-1 ring-slate-200">
                <Monitor className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <h3 className="font-sans text-base font-bold text-slate-900">NeXify IT-Control</h3>
                <p className="font-sans text-xs text-slate-600">Echtzeit-Monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-sans text-xs font-semibold text-green-700">
                All Systems Operational
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 bg-white space-y-6">
          {/* KPI Cards Grid - 3D Design wie Home */}
          <div className="grid grid-cols-2 gap-4">
            {/* Server Uptime Card */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-xs font-medium text-slate-600">Server Uptime</span>
                <div className="p-1.5 rounded-lg bg-slate-50">
                  <Server className="w-4 h-4 text-slate-700" />
                </div>
              </div>
              <div className="font-sans text-2xl font-bold text-slate-900">99.97%</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="font-sans text-xs font-semibold text-green-600">
                  +0.02% Uptime
                </span>
              </div>
            </div>

            {/* Open Tickets Card */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-xs font-medium text-slate-600">Open Tickets</span>
                <div className="p-1.5 rounded-lg bg-slate-50">
                  <Headphones className="w-4 h-4 text-slate-700" />
                </div>
              </div>
              <div className="font-sans text-2xl font-bold text-slate-900">12</div>
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-600" />
                <span className="font-sans text-xs font-semibold text-red-600">3 Critical</span>
              </div>
            </div>

            {/* Response Time Card */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-xs font-medium text-slate-600">Avg. Response</span>
                <div className="p-1.5 rounded-lg bg-slate-50">
                  <Clock className="w-4 h-4 text-slate-700" />
                </div>
              </div>
              <div className="font-sans text-2xl font-bold text-slate-900">45 Min</div>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3 text-green-600" />
                <span className="font-sans text-xs font-semibold text-green-600">
                  Schnelle Response
                </span>
              </div>
            </div>

            {/* Active Monitors Card */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-xs font-medium text-slate-600">
                  Active Monitors
                </span>
                <div className="p-1.5 rounded-lg bg-slate-50">
                  <Shield className="w-4 h-4 text-slate-700" />
                </div>
              </div>
              <div className="font-sans text-2xl font-bold text-slate-900">87</div>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="font-sans text-xs font-semibold text-slate-600">24/7 Active</span>
              </div>
            </div>
          </div>

          {/* Activity List - 3D Design wie Home */}
          <div>
            <h4 className="font-sans text-sm font-semibold mb-3 text-slate-900">
              Recent Activities
            </h4>
            <div className="space-y-2">
              {/* Activity 1 - Completed */}
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-green-50 mt-0.5">
                      <Server className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-sans text-sm font-semibold text-slate-900 mb-1">
                        Server Migration abgeschlossen
                      </div>
                      <div className="font-sans text-xs text-slate-600">
                        Mainframe-03 → Cloud-EU-West
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded-md bg-green-100 border border-green-200">
                    <span className="font-sans text-xs font-bold text-green-700">Erledigt</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pl-9 pt-3">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Clock className="w-3 h-3" />
                    <span className="font-sans text-xs">11:30 Uhr</span>
                  </div>
                  <span className="font-sans text-xs text-slate-600">45 Min</span>
                </div>
              </div>

              {/* Activity 2 - In Progress */}
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-blue-50 mt-0.5">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-sans text-sm font-semibold text-slate-900 mb-1">
                        Firewall-Update läuft...
                      </div>
                      <div className="font-sans text-xs text-slate-600">Security-Patch 2024-10</div>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded-md bg-blue-100 border border-blue-200">
                    <span className="font-sans text-xs font-bold text-blue-700">Live</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pl-9 pt-3">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Clock className="w-3 h-3" />
                    <span className="font-sans text-xs">12:45 Uhr</span>
                  </div>
                  <span className="font-sans text-xs text-slate-600">In Progress</span>
                </div>
              </div>

              {/* Activity 3 - Scheduled */}
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-slate-100 mt-0.5">
                      <Clock className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-sans text-sm font-semibold text-slate-900 mb-1">
                        Backup-Check geplant
                      </div>
                      <div className="font-sans text-xs text-slate-600">
                        All Servers + Databases
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded-md border border-slate-300">
                    <span className="font-sans text-xs font-semibold text-slate-700">
                      14:00 Uhr
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pl-9 pt-3">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Clock className="w-3 h-3" />
                    <span className="font-sans text-xs">Geplant</span>
                  </div>
                  <span className="font-sans text-xs text-slate-600">Heute</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Status LEDs */}
          <div className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-sans text-xs text-slate-600">Servers Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="font-sans text-xs text-slate-600">Monitoring Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="font-sans text-xs text-slate-600">Updates Pending</span>
            </div>
          </div>
        </div>
      </V28BrowserMockup>
    </div>
  );
}
