/* ==================================================================================
   ⚠️ LAYOUT FREEZE V28.1 - KEINE DESIGN/LAYOUT-ÄNDERUNGEN ERLAUBT!
   ==================================================================================
   DESIGN-SYSTEM: V28.1 Professional Minimalism (Slate-Palette)
   GESCHÜTZT: Card-Design, Border-Radius, Shadow, Padding
   ERLAUBT: Technische Optimierungen (Performance, A11y)
   VERBOTEN: Design-Änderungen, neue Varianten
   LETZTE FREIGABE: 2025-01-30
   ==================================================================================
   
   V28 AUTH CARD - FLAT DESIGN 2.0
   ==================================================================================
   ✅ Tailwind-native colors (bg-white, border-slate-200)
   ✅ Flat Design: rounded-2xl + shadow-lg
   ✅ NO gradients, NO v26-classes
   ✅ V28.1 PROFESSIONAL MINIMALISM
   ================================================================================== */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface V28AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function V28AuthCard({ children, className }: V28AuthCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white border border-slate-200 shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
}
