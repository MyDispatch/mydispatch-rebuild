/* ==================================================================================
   V27 ICON BOX - NORDIC SKY MIT RUNDEN SHAPES
   ==================================================================================
   ✅ Variante 1 (primary): Indigo BG + Champagne Icon + Champagne Border
   ✅ Variante 2 (secondary): Champagne BG + Indigo Icon + Indigo Border
   ✅ Shape Options: circle, soft (rounded-2xl), squircle (rounded-3xl)
   ✅ Konsistente Größen (sm, md, lg)
   ✅ 3px Border = Icon-Farbe
   ✅ V27.0 NORDIC SKY KONFORM
   ================================================================================== */

import type { LucideIcon } from 'lucide-react';
import { PRIMARY_COLORS_V27 } from '@/lib/design-system/unified-design-tokens';
import { cn } from '@/lib/utils';

interface V27IconBoxProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  shape?: 'circle' | 'soft' | 'squircle';
  className?: string;
}

const sizeMap = {
  sm: {
    container: 'w-10 h-10',
    icon: 'h-5 w-5',
  },
  md: {
    container: 'w-12 h-12',
    icon: 'h-6 w-6',
  },
  lg: {
    container: 'w-16 h-16',
    icon: 'h-8 w-8',
  },
};

const shapeMap = {
  circle: 'rounded-full',
  soft: 'rounded-2xl',      // 16px - Empfohlen
  squircle: 'rounded-3xl',  // 24px
};

export function V27IconBox({
  icon: Icon,
  size = 'md',
  variant = 'primary',
  shape = 'soft',
  className,
}: V27IconBoxProps) {
  const sizes = sizeMap[size];
  const shapeClass = shapeMap[shape];

  return (
    <div
      className={cn(
        sizes.container,
        shapeClass,
        'flex items-center justify-center shrink-0 border-[3px] transition-all duration-200',
        className
      )}
      style={{
        backgroundColor: variant === 'primary' 
          ? PRIMARY_COLORS_V27.indigo 
          : PRIMARY_COLORS_V27.champagne,
        borderColor: variant === 'primary' 
          ? PRIMARY_COLORS_V27.champagne 
          : PRIMARY_COLORS_V27.indigo,
        color: variant === 'primary' 
          ? PRIMARY_COLORS_V27.champagne 
          : PRIMARY_COLORS_V27.indigo,
      }}
    >
      <Icon className={sizes.icon} />
    </div>
  );
}
