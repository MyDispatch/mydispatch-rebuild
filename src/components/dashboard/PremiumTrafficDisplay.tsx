/* ==================================================================================
   PREMIUM TRAFFIC DISPLAY V28.1 - PURE TAILWIND
   ==================================================================================
   ✅ 100% Pure Tailwind - KEINE Token-Imports
   ✅ Slate Palette (Professional Gray-Blue)
   ✅ 1px Borders (V28.1 Spec)
   ✅ Tailwind Shadows
   ✅ KEINE V26 Components
   ✅ KEINE DashboardInfoCard
   ================================================================================== */

import { Navigation } from 'lucide-react';
import { usePremiumTrafficData } from '@/hooks/use-premium-traffic-data';

export function PremiumTrafficDisplay() {
  const traffic = usePremiumTrafficData();

  return (
    <div className="flex items-center gap-2 px-2.5 py-2 border border-slate-200 rounded-md bg-slate-50 flex-shrink-0">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
        <Navigation className="h-4 w-4 text-slate-700" />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900">
            Verkehr
          </span>
          <span className="text-[10px] font-medium text-slate-600">
            {traffic.label}
          </span>
        </div>
        <div className={`w-2 h-2 rounded-full ${traffic.statusClass} shadow-sm`} />
      </div>
    </div>
  );
}
