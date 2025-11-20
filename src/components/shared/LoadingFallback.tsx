/* ==================================================================================
   LOADING FALLBACK V18.5.2 - IMPROVED WITH TIMEOUT DETECTION
   ==================================================================================
   Angezeigt während Code Splitting / Lazy Loading
   Mit Timeout-Detection und Reload-Button nach 8 Sekunden
   ================================================================================== */

import { Loader2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { V28Button } from "@/components/design-system/V28Button";

export function LoadingFallback() {
  const [showReloadButton, setShowReloadButton] = useState(false);

  useEffect(() => {
    // Nach 8 Sekunden: Zeige Reload-Button
    const timeout = setTimeout(() => {
      setShowReloadButton(true);
    }, 8000);

    return () => clearTimeout(timeout);
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4 max-w-md text-center px-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Lädt...</p>
        
        {showReloadButton && (
          <div className="mt-4 p-4 border border-border rounded-lg space-y-3">
            <p className="text-sm text-foreground font-medium">
              Das Laden dauert ungewöhnlich lange
            </p>
            <V28Button 
              onClick={handleReload}
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Seite neu laden
            </V28Button>
          </div>
        )}
        
        <noscript>
          <div className="mt-4 p-4 bg-destructive/10 rounded-lg text-center">
            <p className="text-sm text-destructive font-medium">
              JavaScript ist erforderlich
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Bitte aktivieren Sie JavaScript in Ihrem Browser, um MyDispatch zu nutzen.
            </p>
          </div>
        </noscript>
      </div>
    </div>
  );
}
