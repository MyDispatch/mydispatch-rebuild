/* ==================================================================================
   PRICING LIVE DASHBOARD V31.0
   ==================================================================================
   Shows pricing tiers, payment status, and billing information
   ================================================================================== */

import { RenderingResolution } from "@/lib/rendering-quality";
import { useOptimizedRendering } from "@/hooks/useOptimizedRendering";
import { Check, CreditCard, Euro, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingLiveDashboardProps {
  variant?: "ipad" | "iphone" | "desktop";
  interactive?: boolean;
  resolution?: RenderingResolution;
}

export default function PricingLiveDashboard({
  variant = "ipad",
  resolution = "retina",
}: PricingLiveDashboardProps) {
  const { shouldRender, elementRef } = useOptimizedRendering(resolution);

  if (!shouldRender) {
    return <div ref={elementRef} className="w-full h-full bg-slate-50 animate-pulse" />;
  }

  return (
    <div
      ref={elementRef}
      className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 p-6 overflow-auto"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Tarifübersicht</h2>
        <p className="text-sm text-slate-600">Aktuelle Preise & Abrechnungen</p>
      </div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { name: "Starter", price: "49", users: "1-3", color: "bg-slate-100" },
          { name: "Business", price: "149", users: "4-10", color: "bg-violet-100", popular: true },
          { name: "Enterprise", price: "349", users: "Unlimitiert", color: "bg-slate-100" },
        ].map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "relative rounded-xl p-4 border-2",
              tier.popular ? "border-slate-600 shadow-lg" : "border-slate-200",
              tier.color
            )}
          >
            {tier.popular && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-700 text-white text-xs font-semibold rounded-full">
                Beliebt
              </span>
            )}
            <div className="text-sm font-semibold text-slate-700 mb-2">{tier.name}</div>
            <div className="flex items-baseline mb-3">
              <span className="text-3xl font-bold text-slate-900">{tier.price}</span>
              <span className="text-sm text-slate-600 ml-1">€/Monat</span>
            </div>
            <div className="text-xs text-slate-600">{tier.users} Nutzer</div>
          </div>
        ))}
      </div>

      {/* Payment Status */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-slate-700" />
            <span className="font-semibold text-slate-900">Zahlungsstatus</span>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-green-600">
            <Check className="w-4 h-4" />
            Aktiv
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Nächste Abrechnung</span>
            <span className="font-medium text-slate-900">15.02.2025</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Zahlungsmethode</span>
            <span className="font-medium text-slate-900">SEPA •••• 4321</span>
          </div>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Euro className="w-4 h-4 text-slate-700" />
            <span className="text-xs font-semibold text-slate-600">Umsatz MTD</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">3.847€</div>
          <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            <span>+12% vs. Vormonat</span> {/* ✅ Status Exception */}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="text-xs font-semibold text-slate-600 mb-2">Rechnungen</div>
          <div className="text-2xl font-bold text-slate-900">24</div>
          <div className="text-xs text-slate-600 mt-1">Diesen Monat</div>
        </div>
      </div>
    </div>
  );
}
