/* ==================================================================================
   TRAFFIC DISPLAY V20.0.0 - Verkehrslage für Dashboard Info Panel
   ==================================================================================
   Simple Mock-Implementation - kann später mit echter HERE Traffic API erweitert werden
   ================================================================================== */

import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { CI_COLORS_HEX } from '@/lib/design-system';

export function useTrafficData() {
  // Mock Verkehrsdaten (später durch echte HERE Traffic API ersetzen)
  const hour = new Date().getHours();
  
  // Simuliere Verkehrslage basierend auf Tageszeit
  if (hour >= 7 && hour <= 9) {
    return { status: 'hoch', label: 'Morgenverkehr', color: CI_COLORS_HEX.error, icon: TrendingUp };
  } else if (hour >= 16 && hour <= 19) {
    return { status: 'mittel', label: 'Feierabendverkehr', color: CI_COLORS_HEX.statusWarning, icon: TrendingUp };
  } else {
    return { status: 'normal', label: 'Fließend', color: CI_COLORS_HEX.statusSuccess, icon: TrendingDown };
  }
}

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
