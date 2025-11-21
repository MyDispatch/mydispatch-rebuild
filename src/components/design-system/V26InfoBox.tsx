/* ==================================================================================
   V26 INFO BOX → V28 INFO BOX (DEPRECATED)
   ==================================================================================
   @deprecated Use Alert component from shadcn instead!

   This V26 component is deprecated and will be removed in v29.
   Use the standard shadcn Alert component for all info boxes.

   Migration:
   ```tsx
   // Old
   import { V26InfoBox } from '@/components/design-system/V26InfoBox';
   <V26InfoBox type="info" title="Info">Content</V26InfoBox>

   // New
   import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
   <Alert><AlertTitle>Info</AlertTitle><AlertDescription>Content</AlertDescription></Alert>
   ```
   ================================================================================== */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Info, AlertTriangle, Scale } from 'lucide-react';

interface V26InfoBoxProps {
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
    iconClass: 'text-warning-text',
  },
  legal: {
    icon: Scale,
    iconClass: 'text-slate-700',
  },
};

export function V26InfoBox({
  children,
  type = 'info',
  title,
  className,
}: V26InfoBoxProps) {
  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'p-4 rounded-lg text-xs sm:text-sm font-sans bg-slate-50 border border-slate-200',
        className
      )}
    >
      {title && (
        <div className="flex items-center gap-2 mb-2">
          <IconComponent
            className={cn('h-4 w-4 shrink-0', config.iconClass)}
          />
          <p
            className="font-semibold text-slate-900"
          >
            {title}
          </p>
        </div>
      )}
      <div className="text-slate-600">
        {children}
      </div>
    </div>
  );
}
