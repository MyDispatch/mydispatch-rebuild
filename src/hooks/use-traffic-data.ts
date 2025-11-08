/* ==================================================================================
   USE TRAFFIC DATA HOOK
   ==================================================================================
   Mock traffic data hook - can be replaced with real HERE Traffic API later
   ================================================================================== */

import { TrendingDown, TrendingUp } from 'lucide-react';
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
