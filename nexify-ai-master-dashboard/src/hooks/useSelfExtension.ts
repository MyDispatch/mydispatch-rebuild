import { useEffect } from "react";
import { selfExtensionSystem } from "../lib/agents/selfExtension";

/**
 * Hook für Self-Extension System
 * Führt automatisch Self-Extension Tasks aus
 */
export function useSelfExtension(interval: number = 60 * 60 * 1000) {
  // Default: 1 Stunde
  useEffect(() => {
    // Sofort ausführen
    selfExtensionSystem.runSelfExtension();

    // Dann periodisch
    const timer = setInterval(() => {
      selfExtensionSystem.runSelfExtension();
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);
}
