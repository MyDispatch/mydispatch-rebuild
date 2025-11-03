/* ==================================================================================
   AUTO-UPDATE HOOK - V18.2.9
   ==================================================================================
   Automatische App-Aktualisierung ohne manuellen Reload
   - Service Worker Update-Detection
   - Automatischer Reload bei neuer Version
   - Stille Updates im Hintergrund
   ================================================================================== */

import * as React from 'react';
import { handleError, handleSuccess } from '@/lib/error-handler';
import { logger } from '@/lib/logger';

interface UpdateCheckOptions {
  checkInterval?: number; // in Millisekunden (Standard: 60 Sekunden)
  autoReload?: boolean; // Automatischer Reload (Standard: true)
  showNotification?: boolean; // Toast-Benachrichtigung (Standard: false)
}

export function useAutoUpdate(options: UpdateCheckOptions = {}) {
  // CRITICAL FIX V18.2.28: Defensive React Check (präventiv)
  if (typeof React === 'undefined' || !React.useEffect || !React.useRef) {
    logger.error('[useAutoUpdate] React Hooks nicht verfügbar', undefined, { component: 'useAutoUpdate' });
    // Fallback: Return dummy trigger
    return { triggerUpdate: () => {} };
  }

  const {
    checkInterval = 60000, // 1 Minute
    autoReload = true,
    showNotification = false,
  } = options;

  const updateCheckTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const serviceWorkerRef = React.useRef<ServiceWorker | null>(null);

  React.useEffect(() => {
    // Service Worker Registration prüfen
    if (!('serviceWorker' in navigator)) {
      logger.info('[Auto-Update] Service Worker nicht unterstützt', { component: 'useAutoUpdate' });
      return;
    }

    // Service Worker Update Handler
    const handleServiceWorkerUpdate = (registration: ServiceWorkerRegistration) => {
      const newWorker = registration.waiting || registration.installing;
      
      if (newWorker) {
        serviceWorkerRef.current = newWorker;

        // Warte auf State-Change
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            if (showNotification) {
              handleSuccess('Die App wird aktualisiert...', 'Update verfügbar');
            }

            // Automatischer Reload nach kurzer Verzögerung
            if (autoReload) {
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          }
        });

        // Sofort aktivieren (Skip Waiting)
        newWorker.postMessage({ type: 'SKIP_WAITING' });
      }
    };

    // Service Worker Registration abholen
    navigator.serviceWorker.ready.then((registration) => {
      // Update-Check bei Registration
      handleServiceWorkerUpdate(registration);

      // Periodische Update-Checks
      updateCheckTimerRef.current = setInterval(() => {
        registration.update().then((updatedRegistration) => {
          handleServiceWorkerUpdate(updatedRegistration);
        }).catch((error) => {
          handleError(error, 'Auto-Update Check fehlgeschlagen', { showToast: false });
        });
      }, checkInterval);

      // Event-Listener für neue Service Worker
      registration.addEventListener('updatefound', () => {
        handleServiceWorkerUpdate(registration);
      });
    });

    // Cleanup
    return () => {
      if (updateCheckTimerRef.current) {
        clearInterval(updateCheckTimerRef.current);
      }
    };
  }, [checkInterval, autoReload, showNotification]);

  // Manueller Update-Trigger
  const triggerUpdate = () => {
    if (serviceWorkerRef.current) {
      serviceWorkerRef.current.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  return { triggerUpdate };
}
