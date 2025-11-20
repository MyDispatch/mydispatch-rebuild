/* ==================================================================================
   PARTNER LIVE DASHBOARD V31.0
   ==================================================================================
   Shows partner-specific dashboard with branding and performance metrics
   ================================================================================== */

import { RenderingResolution } from "@/lib/rendering-quality";
import { useOptimizedRendering } from "@/hooks/useOptimizedRendering";
import { Briefcase, TrendingUp, Users, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PartnerLiveDashboardProps {
  variant?: "ipad" | "iphone" | "desktop";
  resolution?: RenderingResolution;
  branding?: {
    primaryColor?: string;
    logo?: string;
    name?: string;
  };
}

export default function PartnerLiveDashboard({
  variant = "ipad",
  resolution = "retina",
  branding,
}: PartnerLiveDashboardProps) {
  const { shouldRender, elementRef } = useOptimizedRendering(resolution);

  if (!shouldRender) {
    return <div ref={elementRef} className="w-full h-full bg-slate-50 animate-pulse" />;
  }

  const partnerName = branding?.name || "Partner Unternehmen";

  return (
    <div
      ref={elementRef}
      className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 p-6 overflow-auto"
    >
      {/* Header with Partner Branding */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{partnerName}</h2>
            <p className="text-sm text-slate-600">Partner-Dashboard</p>
          </div>
        </div>
      </div>

      {/* Performance KPIs */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-slate-700" />
            <span className="text-xs font-semibold text-slate-600">Aufträge</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">847</div>
          <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            <span>+23% vs. Vormonat</span> {/* ✅ Status Exception */}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-slate-700" />
            <span className="text-xs font-semibold text-slate-600">Fahrer</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">16</div>
          <div className="text-xs text-slate-600 mt-1">Aktiv im Netzwerk</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-4">
        <div className="text-sm font-semibold text-slate-900 mb-3">Aktuelle Aufträge</div>
        <div className="space-y-3">
          {[
            { id: "#2847", from: "Hamburg HBF", to: "Altona", status: "active", driver: "Max M." },
            { id: "#2846", from: "Airport", to: "City Center", status: "pending", driver: "-" },
            {
              id: "#2845",
              from: "Rathaus",
              to: "Hafencity",
              status: "completed",
              driver: "Lisa K.",
            },
          ].map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
            >
              <div className="flex-1">
                <div className="text-xs font-mono text-slate-600 mb-1">{order.id}</div>
                <div className="text-sm text-slate-900">
                  {order.from} → {order.to}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={cn(
                    "text-xs font-semibold px-2 py-1 rounded",
                    order.status === "active" && "bg-green-50 text-green-700", // ✅ Status Exception
                    order.status === "pending" && "bg-yellow-50 text-yellow-700", // ✅ Status Exception
                    order.status === "completed" && "bg-slate-100 text-slate-600"
                  )}
                >
                  {order.status === "active" && "Aktiv"}
                  {order.status === "pending" && "Wartend"}
                  {order.status === "completed" && "Fertig"}
                </div>
                <div className="text-xs text-slate-600 mt-1">{order.driver}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-600 mb-1">Kundenzufriedenheit</div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900">4.9</div>
            <div className="text-xs text-slate-600">aus 324 Bewertungen</div>
          </div>
        </div>
      </div>
    </div>
  );
}
