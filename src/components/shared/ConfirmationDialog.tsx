/* ==================================================================================
   DOPPELTE BESTÄTIGUNG - Für kritische Aktionen
   ==================================================================================
   - Schichtzettel Start/Ende/Pause
   - Auftrag abschließen
   - Wichtige Statusänderungen
   ================================================================================== */

import { useState, ReactNode } from 'react';
import { handleError } from '@/lib/error-handler';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { V28Button } from '@/components/design-system/V28Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ConfirmationDialogProps {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void>;
  requireDoubleConfirm?: boolean;
  variant?: 'default' | 'destructive';
}

export function ConfirmationDialog({
  trigger,
  title,
  description,
  confirmText = 'Bestätigen',
  cancelText = 'Abbrechen',
  onConfirm,
  requireDoubleConfirm = false,
  variant = 'default',
}: ConfirmationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [doubleChecked, setDoubleChecked] = useState(false);

  const handleConfirm = async () => {
    if (requireDoubleConfirm && !doubleChecked) {
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm();
      setOpen(false);
      setDoubleChecked(false);
    } catch (error) {
      handleError(error, 'Bestätigungsfehler', { showToast: false });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {requireDoubleConfirm && (
          <div className="flex items-center space-x-2 p-4 border rounded-md bg-muted/50">
            <Checkbox
              id="double-confirm"
              checked={doubleChecked}
              onCheckedChange={(checked) => setDoubleChecked(checked as boolean)}
            />
            <Label
              htmlFor="double-confirm"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Ich bestätige, dass ich diese Aktion durchführen möchte
            </Label>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading || (requireDoubleConfirm && !doubleChecked)}
            className={variant === 'destructive' ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}
          >
            {isLoading ? 'Wird verarbeitet...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
