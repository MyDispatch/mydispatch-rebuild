/* ==================================================================================
   V28 BADGE - FLAT & CLEAN
   ==================================================================================
   ✅ 1px border (subtle)
   ✅ Tailwind colors (bg-violet-50, border-violet-200)
   ✅ Small padding (px-3 py-1)
   ✅ Flat shadow (no 3D)
   ================================================================================== */

import type { ReactNode } from 'react';
import { Badge } from '@/lib/compat';
import { cn } from '@/lib/utils';

interface V28BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function V28Badge({ children, variant = 'primary', className }: V28BadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'px-3 py-1 text-xs font-semibold rounded-full',
        variant === 'primary'
          ? 'border-slate-300 bg-slate-100 text-slate-800'
          : 'border-slate-200 bg-slate-50 text-slate-700',
        className
      )}
    >
      {children}
    </Badge>
  );
}
