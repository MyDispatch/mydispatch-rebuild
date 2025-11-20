/* ==================================================================================
   V28 MARKETING CARD - FLAT DESIGN
   ==================================================================================
   ✅ Rounded-2xl (konsistent)
   ✅ border-slate-200 (1px, statt 3px)
   ✅ shadow-lg (Tailwind, statt Custom Glow)
   ✅ bg-white
   ================================================================================== */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface V28MarketingCardProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function V28MarketingCard({ 
  children, 
  className = '', 
  contentClassName = '',
  onMouseEnter,
  onMouseLeave
}: V28MarketingCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white border border-slate-200 shadow-lg',
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={cn('p-8', contentClassName)}>
        {children}
      </div>
    </div>
  );
}
