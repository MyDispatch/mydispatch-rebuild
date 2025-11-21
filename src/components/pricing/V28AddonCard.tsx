/* ==================================================================================
   V28 ADDON CARD - FLAT DESIGN 2.0
   ==================================================================================
   ✅ No Glow-Effects (flat)
   ✅ Tailwind shadow-xl
   ✅ Slate borders & backgrounds
   ✅ Hover: scale + shadow-2xl
   ================================================================================== */

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { V28IconBox } from '@/components/design-system/V28IconBox';
import { cn } from '@/lib/utils';

interface V28AddonCardProps {
  icon: LucideIcon;
  title: string;
  price?: string;
  priceLabel?: string;
  description: string;
  children?: ReactNode;
  highlighted?: boolean;
}

export function V28AddonCard({
  icon,
  title,
  price,
  priceLabel,
  description,
  children,
  highlighted = false,
}: V28AddonCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white p-6 md:p-8 transition-all duration-300',
        'hover:shadow-2xl hover:scale-[1.01]',
        highlighted 
          ? 'border-2 border-slate-300 shadow-xl ring-1 ring-slate-200'
          : 'border border-slate-200 shadow-lg'
      )}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
        <V28IconBox icon={icon} variant="primary" className="shrink-0" />
        
        <div className="flex-1 min-w-0">
          <h3 className="text-xl md:text-2xl font-semibold mb-3 text-slate-900">
            {title}
          </h3>
          
          {price && (
            <div className="mb-4">
              <span className="text-2xl md:text-3xl font-bold text-slate-900">
                {price}
              </span>
              {priceLabel && (
                <span className="text-sm ml-2 text-slate-600">
                  {priceLabel}
                </span>
              )}
            </div>
          )}

          <p className="text-sm md:text-base leading-relaxed mb-5 text-slate-600">
            {description}
          </p>

          {children}
        </div>
      </div>
    </div>
  );
}
