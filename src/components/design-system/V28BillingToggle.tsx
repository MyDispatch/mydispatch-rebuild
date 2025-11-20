/* ==================================================================================
   V28 BILLING TOGGLE - FLAT DESIGN 2.0
   ==================================================================================
   ✅ Slate-Gradient (statt Dunkelblau)
   ✅ Tailwind shadows (statt Custom Glow)
   ✅ Gray-Blue Palette
   ✅ Proper Spacing (mb-8 für Abstand)
   ================================================================================== */

import { V28Badge } from '@/components/design-system/V28Badge';
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
  return (
    <div
      className={cn(
        'inline-flex gap-1 p-1.5 rounded-xl bg-slate-100 border border-slate-200 shadow-lg',
        className
      )}
    >
      {/* Monthly Button */}
      <button
        onClick={() => onToggle('monthly')}
        className={cn(
          'px-6 sm:px-8 py-3 rounded-lg font-semibold text-base transition-all duration-200',
          billingPeriod === 'monthly'
            ? 'bg-white text-slate-900 shadow-md'
            : 'text-slate-600 hover:text-slate-900'
        )}
      >
        Monatlich
      </button>

      {/* Yearly Button with Badge */}
      <button
        onClick={() => onToggle('yearly')}
        className={cn(
          'px-6 sm:px-8 py-3 rounded-lg font-semibold text-base transition-all duration-200 inline-flex items-center gap-2',
          billingPeriod === 'yearly'
            ? 'bg-white text-slate-900 shadow-md'
            : 'text-slate-600 hover:text-slate-900'
        )}
      >
        Jährlich
        <V28Badge variant="primary">{discountText}</V28Badge>
      </button>
    </div>
  );
}
