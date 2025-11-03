/* ==================================================================================
   OFFLINE INDICATOR - P1-OPTIMIERUNG V18.3.24
   ==================================================================================
   Zeigt Offline-Status im Customer-Portal mit Sync-Queue-Info
   ================================================================================== */

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check offline queue (von Service Worker)
    const checkOfflineQueue = () => {
      const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
      setPendingActions(queue.length);
    };

    checkOfflineQueue();
    const interval = setInterval(checkOfflineQueue, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (isOnline && pendingActions === 0) return null;

  return (
    <Alert variant={isOnline ? 'default' : 'destructive'} className="mb-4">
      <div className="flex items-center gap-3">
        {isOnline ? (
          <Wifi className="h-4 w-4 text-status-success" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <AlertDescription className="flex items-center gap-2 flex-1">
          {isOnline ? (
            <>
              <span>Verbindung wiederhergestellt.</span>
              {pendingActions > 0 && (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <Badge variant="secondary" className="text-xs">
                    {pendingActions} {pendingActions === 1 ? 'Aktion' : 'Aktionen'} werden synchronisiert...
                  </Badge>
                </>
              )}
            </>
          ) : (
            <>
              <span>Keine Internetverbindung.</span>
              <span className="text-xs text-muted-foreground">
                Ihre Änderungen werden automatisch synchronisiert, sobald Sie wieder online sind.
              </span>
            </>
          )}
        </AlertDescription>
      </div>
    </Alert>
  );
}
