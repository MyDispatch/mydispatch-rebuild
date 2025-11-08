/* ==================================================================================
   TRAFFIC DISPLAY V20.0.0 - Verkehrslage für Dashboard Info Panel
   ==================================================================================
   Simple Mock-Implementation - kann später mit echter HERE Traffic API erweitert werden
   ================================================================================== */

import { useTrafficData } from '@/hooks/use-traffic-data';

export function TrafficDisplay() {
  const traffic = useTrafficData();
  const TrafficIcon = traffic.icon;

  return (
    <div className="flex items-center gap-2 shrink-0">
      <TrafficIcon className="h-4 w-4 text-slate-600" />
      <span className="text-xs font-medium text-slate-700">
        {traffic.label}
      </span>
    </div>
  );
}
