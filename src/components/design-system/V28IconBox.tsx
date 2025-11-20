/* ==================================================================================
   V28 ICON BOX - FLAT DESIGN 2.0
   ==================================================================================
   ✅ No borders (flat)
   ✅ Tailwind-native colors (bg-violet-100, bg-slate-100)
   ✅ Fixed shape: rounded-xl (12px)
   ✅ Hover: scale + shadow
   ✅ Simplified props (no shape variants)
   ================================================================================== */

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface V28IconBoxProps {
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'slate';
  className?: string;
}

export function V28IconBox({
  icon: Icon,
  variant = 'primary',
  className,
}: V28IconBoxProps) {
  return (
    <div
      className={cn(
        'w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ring-1 ring-slate-200',
        'transition-all duration-200',
        variant === 'primary' 
          ? 'bg-slate-100 text-slate-700'
          : variant === 'slate'
          ? 'bg-slate-100 text-slate-700'
          : 'bg-slate-50 text-slate-600',
        className
      )}
    >
      <Icon className="h-6 w-6" />
    </div>
  );
}
