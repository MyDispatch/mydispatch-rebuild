/* ==================================================================================
   V28 INFO BOX - FLAT DESIGN
   ==================================================================================
   ✅ bg-slate-50 (statt Canvas-Beige)
   ✅ border-slate-200 (1px, statt 3px)
   ✅ Rounded-2xl (konsistent)
   ✅ Semantische Text-Farben (text-slate-900, text-slate-600)
   ✅ Unterstützt verschiedene Typen (info, warning, legal)
   ================================================================================== */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Info, AlertTriangle, Scale } from 'lucide-react';

interface V28InfoBoxProps {
  children: ReactNode;
  type?: 'info' | 'warning' | 'legal';
  title?: string;
  className?: string;
}

const typeConfig = {
  info: {
    icon: Info,
    iconClass: 'text-slate-700',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-amber-600',
  },
  legal: {
    icon: Scale,
    iconClass: 'text-slate-700',
  },
};

export function V28InfoBox({
  children,
  type = 'info',
  title,
  className,
}: V28InfoBoxProps) {
  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'rounded-2xl p-6 md:p-8 border border-slate-200 bg-slate-50',
        'transition-shadow duration-200',
        type === 'legal' && 'shadow-lg hover:shadow-xl',
        className
      )}
    >
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <IconComponent className={cn('h-5 w-5 shrink-0', config.iconClass)} />
          <h3 className="text-base md:text-lg font-semibold text-slate-900">{title}</h3>
        </div>
      )}
      <div className="text-sm md:text-base text-slate-600 leading-relaxed">{children}</div>
    </div>
  );
}
