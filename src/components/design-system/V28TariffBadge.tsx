/* ==================================================================================
   V28 TARIFF BADGE - CI-KONFORMES TARIF-BADGE
   ==================================================================================
   Ersetzt Emoji-basierte Tarif-Badges durch Lucide-Icon-basierte Badges
   - CI-Farben (Slate-Palette)
   - Lucide Check-Icon statt Emoji
   - Variants für active/inactive
   ================================================================================== */

import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface V28TariffBadgeProps {
  label: string;
  active?: boolean;
  className?: string;
}

export function V28TariffBadge({ label, active = true, className }: V28TariffBadgeProps) {
  const Icon = active ? Check : X;
  
  return (
    <span className={cn(
      "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200",
      active 
        ? "bg-slate-600 text-white hover:bg-slate-700" 
        : "bg-slate-200 text-slate-400",
      className
    )}>
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </span>
  );
}
