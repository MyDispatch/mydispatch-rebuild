/* ==================================================================================
   PWA INSTALL BUTTON - MyDispatch V18.2.24
   ==================================================================================
   - Install Prompt für Android/Desktop
   - iOS Safari Install-Anleitung (Dialog)
   - Installation Status Tracking
   - CRITICAL FIX V18.2.24: Defensive React Import + Error Boundary
   ================================================================================== */

import * as React from 'react';
import { V28Button } from '@/components/design-system/V28Button';
import { cn } from '@/lib/utils';
import { Download, Smartphone, Share, Plus } from 'lucide-react';
import { usePWAInstall } from '@/hooks/use-pwa-install';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PWAInstallButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  fullWidth?: boolean;
}

export function PWAInstallButton({ 
  variant = 'default', 
  size = 'lg',
  className = '',
  fullWidth = false 
}: PWAInstallButtonProps) {
  // CRITICAL FIX V18.2.24: Defensive React Check
  if (typeof React === 'undefined' || !React.useState) {
    return null; // Fail silently if React not available
  }

  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const [showIOSDialog, setShowIOSDialog] = React.useState(false);
  const { toast } = useToast();

  // Button nicht anzeigen wenn bereits installiert
  if (isInstalled) {
    return null;
  }

  // Button immer anzeigen (auch wenn nicht installierbar in Entwicklung)

  const handleClick = async () => {
    logger.info('[PWA Button] Click', {
      component: 'PWAInstallButton',
      isIOS,
      isInstallable
    });
    
    // iOS: Zeige Anleitung
    if (isIOS) {
      setShowIOSDialog(true);
      return;
    }

    // Prüfe ob Installation verfügbar ist
    if (!isInstallable) {
      logger.warn('[PWA Button] Not installable', {
        component: 'PWAInstallButton',
        action: 'handleClick'
      });
      toast({
        title: 'App-Installation',
        description: 'Ihr Browser unterstützt aktuell keine App-Installation oder die App wurde bereits installiert. Bitte verwenden Sie Chrome oder Edge.',
        variant: 'default',
      });
      return;
    }

    // Versuche Installation
    try {
      logger.info('[PWA Button] Calling promptInstall', {
        component: 'PWAInstallButton',
        action: 'promptInstall'
      });
      await promptInstall();
      toast({
        title: 'Installation gestartet',
        description: 'Bitte folgen Sie den Anweisungen Ihres Browsers.',
      });
    } catch (error) {
      logger.error('[PWA Button] Install error', error as Error, {
        component: 'PWAInstallButton',
        action: 'promptInstall'
      });
      toast({
        title: 'Installation fehlgeschlagen',
        description: 'Bitte stellen Sie sicher, dass Sie die Seite über HTTPS aufrufen und versuchen Sie es erneut.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <V28Button
        size={size === 'default' ? 'md' : size === 'icon' ? 'sm' : size}
        variant={variant === 'default' ? 'primary' : variant === 'outline' ? 'secondary' : 'ghost'}
        onClick={handleClick}
        className={cn(
          fullWidth ? 'w-full' : 'w-full sm:w-auto',
          'text-foreground border-foreground',
          className
        )}
      >
        <Download className="mr-2 h-5 w-5 text-foreground" />
        App installieren
      </V28Button>

      {/* iOS Install Dialog */}
      <AlertDialog open={showIOSDialog} onOpenChange={setShowIOSDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              MyDispatch als App installieren
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Installieren Sie MyDispatch auf Ihrem iPhone/iPad für schnellen Zugriff und ein App-ähnliches Erlebnis:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-foreground">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Teilen-Button antippen</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tippen Sie auf das <Share className="inline h-4 w-4 mx-1" /> Teilen-Symbol in der Safari-Menüleiste
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-foreground">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Zum Home-Bildschirm hinzufügen</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Wählen Sie <Plus className="inline h-4 w-4 mx-1" /> „Zum Home-Bildschirm" aus der Liste
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-foreground">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Bestätigen</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tippen Sie auf „Hinzufügen" oben rechts
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 mt-4">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Tipp:</strong> Die App erscheint dann auf Ihrem Home-Bildschirm und kann wie jede andere App geöffnet werden.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Verstanden</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
