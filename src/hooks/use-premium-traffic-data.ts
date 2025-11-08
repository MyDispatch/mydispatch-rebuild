/* ==================================================================================
   USE PREMIUM TRAFFIC DATA HOOK
   ==================================================================================
   Mock premium traffic data hook - can be replaced with real HERE Traffic API later
   ================================================================================== */

import { TrendingDown, TrendingUp } from 'lucide-react';

export function usePremiumTrafficData() {
  const hour = new Date().getHours();
  
  // Simuliere Verkehrslage basierend auf Tageszeit
  if (hour >= 7 && hour <= 9) {
    return { 
      status: 'hoch', 
      label: 'Morgenverkehr', 
      icon: TrendingUp,
      level: 'Hoch',
      statusClass: 'bg-status-error'
    };
  } else if (hour >= 16 && hour <= 19) {
    return { 
      status: 'mittel', 
      label: 'Feierabend', 
      icon: TrendingUp,
      level: 'Mittel',
      statusClass: 'bg-status-warning'
    };
  } else {
    return { 
      status: 'normal', 
      label: 'Fließend', 
      icon: TrendingDown,
      level: 'Normal',
      statusClass: 'bg-status-success'
    };
  }
}
