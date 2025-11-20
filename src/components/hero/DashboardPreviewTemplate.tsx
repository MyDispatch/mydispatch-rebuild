/* ==================================================================================
   DASHBOARD PREVIEW TEMPLATE - WIEDERVERWENDBAR
   ==================================================================================
   ✅ Komplettes Dashboard Mockup
   ✅ 100% V26.0 Design System konform
   ✅ Nutzt alle Dashboard-Komponenten
   ✅ V40.14: Inline-Styles eliminiert → CSS-Klassen
   ================================================================================== */

import { FileText, Euro, Users, Car, Clock, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/smart-templates/StatCard";
import { DashboardActivityItem } from "./DashboardActivityItem";

interface DashboardPreviewTemplateProps {
  animationDelay?: string;
}

export function DashboardPreviewTemplate({
  animationDelay = "0.6s",
}: DashboardPreviewTemplateProps) {
  return (
    <div className="hero-dashboard-preview hidden lg:block animate-fade-in v26-delay-500">
      <div className="relative">
        {/* Enhanced Glow Effect */}
        <div className="hero-dashboard-preview__glow absolute -inset-8 rounded-3xl blur-3xl opacity-40 animate-pulse" />

        {/* Premium Dashboard Mockup Container */}
        <div className="hero-dashboard-preview__container relative rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 hover-scale">
          {/* Premium Dashboard Header */}
          <div className="hero-dashboard-preview__header px-8 py-6 border-b backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="hero-dashboard-preview__header-icon-box p-3 rounded-xl">
                  <TrendingUp className="hero-dashboard-preview__header-icon h-5 w-5" />
                </div>
                <div>
                  <h3 className="hero-dashboard-preview__header-title font-sans text-lg font-bold">
                    MyDispatch Live-Dashboard
                  </h3>
                  <p className="hero-dashboard-preview__header-subtitle font-sans text-sm">
                    Echtzeit-Übersicht
                  </p>
                </div>
              </div>
              <div className="hero-dashboard-preview__live-badge px-3 py-1.5 rounded-lg backdrop-blur-sm animate-pulse">
                <span className="font-sans text-xs font-bold">Live</span>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-8 space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={FileText}
                label="Aufträge"
                value="142"
                change={{ value: 12, trend: "up" }}
              />
              <StatCard
                icon={Euro}
                label="Umsatz"
                value="12.5k"
                change={{ value: 8, trend: "up" }}
              />
              <StatCard icon={Users} label="Fahrer" value="28" />
              <StatCard icon={Car} label="Fahrzeuge" value="35" />
            </div>

            {/* Activity List */}
            <div>
              <h4 className="hero-dashboard-preview__section-title font-sans text-sm font-semibold mb-3">
                Letzte Aktivitäten
              </h4>
              <div className="space-y-2.5">
                <DashboardActivityItem
                  icon={Clock}
                  title="Fahrt nach Frankfurt"
                  subtitle="Max Mustermann"
                  time="12:45"
                  statusText="Bestätigt"
                  statusType="info"
                />
                <DashboardActivityItem
                  icon={Clock}
                  title="Flughafen-Transfer"
                  subtitle="Anna Schmidt"
                  time="13:20"
                  statusText="Bestätigt"
                  statusType="info"
                />
                <DashboardActivityItem
                  icon={Clock}
                  title="City-Tour"
                  subtitle="Thomas Weber"
                  time="14:00"
                  statusText="Bestätigt"
                  statusType="info"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
