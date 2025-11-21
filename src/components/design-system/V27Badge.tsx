/* ==================================================================================
   V27 BADGE - NORDIC SKY DESIGN
   ==================================================================================
   ✅ Variante 1 (primary): Champagne BG + Indigo Text (Premium)
   ✅ Variante 2 (secondary): Indigo BG + Champagne Text (Standard)
   ✅ 3px Border in Hintergrundfarbe
   ✅ 3D-Shadow-Effekt
   ✅ V27.0 NORDIC SKY KONFORM
   ================================================================================== */

import type { ReactNode } from 'react';
import { Badge } from '@/lib/compat';
import { PRIMARY_COLORS_V27 } from '@/lib/design-system/unified-design-tokens';
import { cn } from '@/lib/utils';

interface V27BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function V27Badge({ children, variant = 'primary', className }: V27BadgeProps) {
  const variantStyles = variant === 'primary'
    ? {
        backgroundColor: PRIMARY_COLORS_V27.champagne,
        color: PRIMARY_COLORS_V27.indigo,
        borderColor: PRIMARY_COLORS_V27.champagne,
      }
    : {
        backgroundColor: PRIMARY_COLORS_V27.indigo,
        color: PRIMARY_COLORS_V27.champagne,
        borderColor: PRIMARY_COLORS_V27.indigo,
      };

  return (
    <Badge
      variant="default"
      className={cn('px-4 py-1.5 text-sm font-semibold rounded-full', className)}
      style={{
        ...variantStyles,
        border: '3px solid',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
      }}
    >
      {children}
    </Badge>
  );
}
