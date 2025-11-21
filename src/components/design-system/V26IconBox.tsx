/* ==================================================================================
   V26 ICON BOX → V28 ICON BOX (DEPRECATED)
   ==================================================================================
   @deprecated Use standard icon components instead!
   
   This V26 component is deprecated and will be removed in v29.
   Use inline icons with Tailwind classes for better flexibility.
   
   Migration:
   ```tsx
   // Old
   import { V26IconBox } from '@/components/design-system/V26IconBox';
   <V26IconBox icon={Users} size="lg" variant="primary" />
   
   // New
   <div className="w-16 h-16 rounded-lg bg-slate-700 flex items-center justify-center border-3 border-slate-200">
     <Users className="h-8 w-8 text-white" />
   </div>
   ```
   ================================================================================== */

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface V26IconBoxProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
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

export function V26IconBox({
  icon: Icon,
  size = 'md',
  variant = 'primary',
  className,
}: V26IconBoxProps) {
  const sizes = sizeMap[size];

  const variantClasses = variant === 'primary'
    ? 'bg-slate-700 border-slate-200 text-white'
    : 'bg-slate-100 border-slate-700 text-slate-700';

  return (
    <div
      className={cn(
        sizes.container,
        'rounded-lg flex items-center justify-center shrink-0 border-[3px]',
        variantClasses,
        className
      )}
    >
      <Icon
        className={sizes.icon}
      />
    </div>
  );
}
