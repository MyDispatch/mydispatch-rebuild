/* ==================================================================================
   CONFIRM DIALOG V18.3.24 - SYSTEMWEITES CONFIRMATION-TEMPLATE
   ==================================================================================
   ✅ Ersetzt window.confirm() - NIEMALS Browser-Bestätigungen verwenden!
   ✅ Konsistentes Design mit Design-System
   ✅ Variants: default, destructive, warning
   ✅ Optionale Async-Actions (Loading-States)
   ================================================================================== */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { logger } from '@/lib/logger';

export type ConfirmVariant = 'default' | 'destructive' | 'warning';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel = 'Bestätigen',
  cancelLabel = 'Abbrechen',
  variant = 'default',
  loading = false
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      logger.error('[ConfirmDialog] Confirm action failed', error as Error, { component: 'ConfirmDialog' });
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <AlertCircle className="h-6 w-6 text-status-error" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-status-warning" />;
      default:
        return <CheckCircle2 className="h-6 w-6 text-foreground" />;
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {getIcon()}
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading || loading}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading || loading}
            className={getButtonVariant() === 'destructive' ? 'bg-status-error hover:bg-status-error/90' : ''}
          >
            {isLoading || loading ? 'Lädt...' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ==================================================================================
   HOOK: useConfirm - Einfache Nutzung des ConfirmDialogs
   ================================================================================== */

export function useConfirm() {
  const [state, setState] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ConfirmVariant;
    onConfirm?: () => void | Promise<void>;
  }>({
    open: false,
    title: '',
    description: ''
  });

  const confirm = (options: {
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ConfirmVariant;
    onConfirm: () => void | Promise<void>;
  }) => {
    setState({
      open: true,
      ...options
    });
  };

  const dialog = (
    <ConfirmDialog
      open={state.open}
      onOpenChange={(open) => setState(s => ({ ...s, open }))}
      onConfirm={state.onConfirm || (() => {})}
      title={state.title}
      description={state.description}
      confirmLabel={state.confirmLabel}
      cancelLabel={state.cancelLabel}
      variant={state.variant}
    />
  );

  return { confirm, dialog };
}
