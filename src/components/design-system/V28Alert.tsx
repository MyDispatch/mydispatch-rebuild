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
        variant === 'info' && 'bg-info-light border-info-border text-foreground',
        variant === 'success' && 'bg-success-light border-success-border text-foreground',
        variant === 'warning' && 'bg-warning-light border-warning-border text-foreground',
        variant === 'error' && 'bg-error-light border-error-border text-foreground',
        className
      )}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <Icon
          className={cn(
            'h-5 w-5 flex-shrink-0 mt-0.5',
            variant === 'info' && 'text-info-text',
            variant === 'success' && 'text-success-text',
            variant === 'warning' && 'text-warning-text',
            variant === 'error' && 'text-error-text'
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
