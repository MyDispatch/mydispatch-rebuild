/* ==================================================================================
   V28 ALERT - NOTIFICATION COMPONENT
   ==================================================================================
   ✅ Multiple variants (info, success, warning, error)
   ✅ Closable
   ✅ Optional icon
   ✅ Title and description
   ================================================================================== */

import type { ReactNode} from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface V28AlertProps {
  children: ReactNode;
  title?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

export function V28Alert({
  children,
  title,
  variant = 'info',
  closable = false,
  onClose,
  className,
}: V28AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const Icon = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
  }[variant];

  return (
    <div
      className={cn(
        'rounded-xl p-4 border',
        // Variant styles
        variant === 'info' && 'bg-blue-50 border-blue-200 text-blue-900',
        variant === 'success' && 'bg-green-50 border-green-200 text-green-900',
        variant === 'warning' && 'bg-amber-50 border-amber-200 text-amber-900',
        variant === 'error' && 'bg-red-50 border-red-200 text-red-900',
        className
      )}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <Icon
          className={cn(
            'h-5 w-5 flex-shrink-0 mt-0.5',
            variant === 'info' && 'text-blue-600',
            variant === 'success' && 'text-green-600',
            variant === 'warning' && 'text-amber-600',
            variant === 'error' && 'text-red-600'
          )}
        />

        {/* Content */}
        <div className="flex-1">
          {title && <div className="font-semibold mb-1">{title}</div>}
          <div className="text-sm">{children}</div>
        </div>

        {/* Close button */}
        {closable && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
