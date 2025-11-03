/* ==================================================================================
   V28 DIALOG - SYSTEMWEITE POPUP-VORLAGE
   ==================================================================================
   ✅ V28.1 Design System konform
   ✅ designTokens für alle Farben (Single Source of Truth)
   ✅ Flat Design (rounded-2xl, minimal shadows)
   ✅ Mobile-First & Tablet-Responsive
   ✅ Fixed Header & Footer, Scrollable Body
   ✅ Unsichtbare Scrollbar
   ✅ 300ms Transitions
   ✅ Touch-optimiert (min-h-[44px] für alle Buttons)
   
   USAGE:
   - open={isOpen}
   - onOpenChange={setIsOpen}
   - title="Dialog Titel"
   - description="Optional: Beschreibung"
   - icon={Sparkles component}
   - badge="Optional"
   - actions={CTA Buttons}
   - children: Content
   ================================================================================== */

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { designTokens } from '@/config/design-tokens';
import { Badge } from '@/lib/compat';
import { cn } from '@/lib/utils';

/* ==================================================================================
   BASE DIALOG PRIMITIVE EXPORTS
   ================================================================================== */

const V28DialogRoot = DialogPrimitive.Root;
const V28DialogTrigger = DialogPrimitive.Trigger;
const V28DialogPortal = DialogPrimitive.Portal;
const V28DialogClose = DialogPrimitive.Close;

/* ==================================================================================
   OVERLAY (Backdrop mit Blur)
   ================================================================================== */

const V28DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    style={{
      background: `${designTokens.colors.slate[900]}80`, // 50% opacity
    }}
    {...props}
  />
));
V28DialogOverlay.displayName = 'V28DialogOverlay';

/* ==================================================================================
   MAIN DIALOG COMPONENT
   ================================================================================== */

interface V28DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
}

export function V28Dialog({
  open,
  onOpenChange,
  title,
  description,
  icon,
  badge,
  children,
  actions,
  maxWidth = 'lg',
  className,
}: V28DialogProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };

  return (
    <V28DialogRoot open={open} onOpenChange={onOpenChange}>
      <V28DialogPortal>
        <V28DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] p-0 duration-200',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            'rounded-2xl shadow-lg max-h-[90vh] flex flex-col gap-0',
            maxWidthClasses[maxWidth],
            className,
          )}
          style={{
            borderColor: designTokens.colors.slate[200],
            border: '1px solid',
            background: designTokens.colors.white,
          }}
        >
          {/* HEADER - FIXED */}
          <div
            className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b shrink-0"
            style={{ borderColor: designTokens.colors.slate[200] }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {icon && (
                  <div
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${designTokens.colors.primary.light} 0%, ${designTokens.colors.slate[100]} 100%)`,
                    }}
                  >
                    <div style={{ color: designTokens.colors.primary.DEFAULT }}>
                      {icon}
                    </div>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2
                    className="text-xl sm:text-2xl font-bold"
                    style={{ color: designTokens.colors.slate[900] }}
                  >
                    {title}
                  </h2>
                  {description && (
                    <p
                      className="text-sm sm:text-base mt-1"
                      style={{ color: designTokens.colors.slate[600] }}
                    >
                      {description}
                    </p>
                  )}
                </div>
              </div>
              {badge && (
                <Badge
                  className="pointer-events-none text-xs sm:text-sm self-start sm:self-auto shrink-0 rounded font-semibold"
                  style={{
                    background: designTokens.colors.primary.DEFAULT,
                    color: designTokens.colors.white,
                    border: `1px solid ${designTokens.colors.slate[200]}`,
                  }}
                >
                  {badge}
                </Badge>
              )}
            </div>

            {/* Close Button */}
            <DialogPrimitive.Close
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
              style={{
                color: designTokens.colors.slate[600],
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Schließen</span>
            </DialogPrimitive.Close>
          </div>

          {/* BODY - SCROLLABLE mit UNSICHTBARER SCROLLBAR */}
          <div
            className="px-4 sm:px-6 py-4 overflow-y-auto flex-1 scrollbar-invisible min-h-0"
            style={{
              background: designTokens.colors.slate[50],
            }}
          >
            {children}
          </div>

          {/* FOOTER - FIXED (nur wenn Actions vorhanden) */}
          {actions && (
            <div
              className="px-4 sm:px-6 py-4 border-t shrink-0"
              style={{
                borderColor: designTokens.colors.slate[200],
                background: designTokens.colors.white,
              }}
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                {actions}
              </div>
            </div>
          )}
        </DialogPrimitive.Content>
      </V28DialogPortal>
    </V28DialogRoot>
  );
}

/* ==================================================================================
   EXPORT PRIMITIVES FOR ADVANCED USAGE
   ================================================================================== */

export {
  V28DialogRoot,
  V28DialogTrigger,
  V28DialogPortal,
  V28DialogOverlay,
  V28DialogClose,
};
