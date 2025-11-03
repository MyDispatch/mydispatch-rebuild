/* ==================================================================================
   V26 LOGO → V28 LOGO (DEPRECATED)
   ==================================================================================
   @deprecated Use inline logo implementation instead!
   
   This V26 component is deprecated and will be removed in v29.
   Implement logos directly inline for better customization.
   
   Migration:
   ```tsx
   // Old
   import { V26Logo } from '@/components/design-system/V26Logo';
   <V26Logo companyName="MyDispatch" size="lg" />
   
   // New - Inline implementation
   <div className="flex items-center gap-3">
     <div className="p-2 rounded-lg bg-slate-700"><Truck className="h-6 w-6 text-white" /></div>
     <span className="font-bold text-slate-900 text-xl">MyDispatch</span>
   </div>
   ```
   ================================================================================== */

import { cn } from '@/lib/utils';
import { Truck } from 'lucide-react';

interface V26LogoProps {
  companyName?: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const sizeConfig = {
  sm: {
    container: 'h-8',
    text: 'text-lg',
    icon: 'h-5 w-5',
  },
  md: {
    container: 'h-10',
    text: 'text-xl',
    icon: 'h-6 w-6',
  },
  lg: {
    container: 'h-14',
    text: 'text-2xl md:text-3xl',
    icon: 'h-8 w-8',
  },
};

export function V26Logo({
  companyName = 'MyDispatch',
  logoUrl,
  size = 'md',
  className,
  onClick,
}: V26LogoProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        'flex items-center gap-2 sm:gap-3',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${companyName} Logo`}
          className={cn('object-contain', config.container)}
        />
      ) : (
        <div
          className={cn('flex items-center gap-2 sm:gap-3')}
        >
        <div
          className="p-1.5 sm:p-2 rounded-lg bg-slate-700"
        >
          <Truck
            className={cn(config.icon, "text-white")}
          />
        </div>
        <span
          className={cn('font-bold text-slate-900', config.text)}
        >
            {companyName}
          </span>
        </div>
      )}
    </div>
  );
}
