/* ==================================================================================
   USE FORCE RELOAD HOOK - V18.5.2
   ==================================================================================
   Prüft auf neue Builds und lädt automatisch neu
   ================================================================================== */

import { useEffect, useRef } from "react";
import { logger } from "@/lib/logger";

interface BuildInfo {
  timestamp: string;
  version: string;
  lastUpdate: string;
}

export function useForceReload(checkInterval = 30000) {
  const lastVersionRef = useRef<string | null>(null);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        // Cache-Busting mit Timestamp
        const response = await fetch(`/build-info.json?t=${Date.now()}`);

        if (!response.ok) return;

        const data: BuildInfo = await response.json();

        // Beim ersten Mal nur Version speichern
        if (lastVersionRef.current === null) {
          lastVersionRef.current = data.version;
          logger.info("🔧 Build-Version", { component: "useForceReload", version: data.version });
          return;
        }

        // Version hat sich geändert → Reload
        if (lastVersionRef.current !== data.version) {
          logger.info("🔄 Neue Version erkannt", {
            component: "useForceReload",
            version: data.version,
            lastUpdate: data.lastUpdate,
          });

          // Kurze Verzögerung damit User die Meldung sieht
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (error) {
        // Silently fail - Build-Info optional
        logger.debug("Build-Info check failed", { component: "useForceReload", error });
      }
    };

    // Initial check
    checkForUpdates();

    // Periodisches Prüfen
    const interval = setInterval(checkForUpdates, checkInterval);

    return () => clearInterval(interval);
  }, [checkInterval]);
}
