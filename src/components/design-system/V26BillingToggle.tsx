/* ==================================================================================
   V28 BILLING TOGGLE - PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ V28.1 Professional Gray-Blue Design
   ✅ Pure Tailwind mit Slate-Palette
   ✅ Smooth 300ms Transitions
   ================================================================================== */

import { useState } from 'react';
import { Badge } from '@/lib/compat';
import { cn } from '@/lib/utils';

interface V28BillingToggleProps {
  billingPeriod: 'monthly' | 'yearly';
  onToggle: (period: 'monthly' | 'yearly') => void;
  discountText?: string;
  className?: string;
}

export function V28BillingToggle({
  billingPeriod,
  onToggle,
  discountText = '-20%',
  className = '',
}: V28BillingToggleProps) {
  const [hoveredButton, setHoveredButton] = useState<'monthly' | 'yearly' | null>(null);

  return (
    <div
      className={cn(
        'inline-flex gap-1 p-1.5 rounded-lg bg-slate-100 border border-slate-200',
        className
      )}
    >
      {/* Monthly Button */}
      <button
        onClick={() => onToggle('monthly')}
        onMouseEnter={() => setHoveredButton('monthly')}
        onMouseLeave={() => setHoveredButton(null)}
        className={cn(
          'px-6 sm:px-8 py-3 rounded-lg font-semibold text-base transition-all duration-300',
          billingPeriod === 'monthly'
            ? 'bg-white text-slate-900 shadow-md'
            : 'bg-transparent text-slate-600 hover:text-slate-900'
        )}
      >
        Monatlich
      </button>

      {/* Yearly Button with Badge */}
      <button
        onClick={() => onToggle('yearly')}
        onMouseEnter={() => setHoveredButton('yearly')}
        onMouseLeave={() => setHoveredButton(null)}
        className={cn(
          'px-6 sm:px-8 py-3 rounded-lg font-semibold text-base inline-flex items-center gap-2 transition-all duration-300',
          billingPeriod === 'yearly'
            ? 'bg-white text-slate-900 shadow-md'
            : 'bg-transparent text-slate-600 hover:text-slate-900'
        )}
      >
        Jährlich
        <Badge
          className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-success-light text-success-text border border-success-border"
        >
          {discountText}
        </Badge>
      </button>
    </div>
  );
}

// Backward compatibility export
export const V26BillingToggle = V28BillingToggle;
