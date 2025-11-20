/* ==================================================================================
   UNIFIED DIALOG - ZENTRALES DIALOG-SYSTEM
   ==================================================================================
   ✅ MyDispatch Design System
   ✅ Responsive (Mobile-optimiert)
   ✅ Accessibility (ARIA)
   ✅ Type-Safe Props
   ================================================================================== */

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/lib/compat";
import { V28Button } from "@/components/design-system/V28Button";
import { SafeIcon } from "@/components/base/SafeIcon";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ==================================================================================
// TYPES
// ==================================================================================

export interface UnifiedDialogProps {
  // Visibility
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Content
  title: string;
  description?: string;
  children: React.ReactNode;

  // Footer Actions
  primaryAction?: {
    label: string;
    onClick: () => void | Promise<void>;
    variant?: "default" | "destructive";
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };

  // State
  isLoading?: boolean;
  loadingText?: string;

  // Styling
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;

  // Behavior
  closeOnOutsideClick?: boolean;
  showCloseButton?: boolean;
}

// ==================================================================================
// SIZE MAPPING
// ==================================================================================

const SIZE_MAP = {
  sm: "max-w-sm", // 384px
  md: "max-w-md", // 448px
  lg: "max-w-lg", // 512px
  xl: "max-w-xl", // 576px
  full: "max-w-full", // Fullscreen mobile
} as const;

// ==================================================================================
// COMPONENT
// ==================================================================================

export function UnifiedDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  isLoading = false,
  loadingText = "Wird verarbeitet...",
  size = "md",
  className,
  closeOnOutsideClick = true,
  showCloseButton = true,
}: UnifiedDialogProps) {
  // Handle primary action with loading state
  const handlePrimaryAction = async () => {
    if (primaryAction && !isLoading) {
      await primaryAction.onClick();
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeOnOutsideClick ? onOpenChange : undefined}>
      <DialogContent
        className={cn(SIZE_MAP[size], "max-h-[90vh] overflow-y-auto", className)}
        onPointerDownOutside={(e) => {
          if (!closeOnOutsideClick) {
            e.preventDefault();
          }
        }}
      >
        {/* Header */}
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-semibold text-foreground pr-8">{title}</DialogTitle>

          {description && (
            <DialogDescription className="text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          )}

          {/* Custom Close Button (oben rechts) */}
          {showCloseButton && (
            <button
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className={cn(
                "absolute right-0 top-0",
                "rounded-sm opacity-70",
                "ring-offset-background transition-opacity",
                "hover:opacity-100",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "disabled:pointer-events-none",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              aria-label="Dialog schließen"
            >
              <SafeIcon icon={X} size="md" color="muted" />
            </button>
          )}
        </DialogHeader>

        {/* Content */}
        <div className="py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <SafeIcon icon={Loader2} size="xl" className="animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{loadingText}</p>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Footer (nur wenn Actions definiert) */}
        {(primaryAction || secondaryAction) && (
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {/* Secondary Action (Cancel/Close) */}
            {secondaryAction && (
              <V28Button
                type="button"
                variant="secondary"
                onClick={secondaryAction.onClick}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {secondaryAction.label}
              </V28Button>
            )}

            {/* Primary Action (Save/Confirm) */}
            {primaryAction && (
              <V28Button
                type="button"
                variant={primaryAction.variant === "destructive" ? "destructive" : "primary"}
                onClick={handlePrimaryAction}
                disabled={primaryAction.disabled || isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <SafeIcon icon={Loader2} size="sm" className="mr-2 animate-spin" />
                    {loadingText}
                  </>
                ) : (
                  primaryAction.label
                )}
              </V28Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ==================================================================================
// EXPORT HELPER COMPONENT: ConfirmDialog
// ==================================================================================

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  variant?: "default" | "destructive";
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Bestätigen",
  cancelLabel = "Abbrechen",
  onConfirm,
  variant = "default",
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <UnifiedDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      isLoading={isLoading}
      primaryAction={{
        label: confirmLabel,
        onClick: onConfirm,
        variant,
      }}
      secondaryAction={{
        label: cancelLabel,
        onClick: () => onOpenChange(false),
      }}
      closeOnOutsideClick={!isLoading}
    >
      {/* Leerer Content - Description reicht */}
      <div />
    </UnifiedDialog>
  );
}
