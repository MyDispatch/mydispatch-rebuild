/* ==================================================================================
   HYDRATION ERROR GUARD - V6.0
   ==================================================================================
   ✅ Detects React hydration errors
   ✅ Auto-reloads page on hydration mismatch
   ✅ User-friendly loading message (German)
   ================================================================================== */

import { useEffect, useState, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

export function HydrationErrorGuard({ children }: Props) {
  const [hydrationError, setHydrationError] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const handleHydrationError = (event: ErrorEvent) => {
      if (
        event.message?.includes("Hydration failed") ||
        event.message?.includes("Text content did not match") ||
        event.message?.includes("Hydration error")
      ) {
        setHydrationError(true);

        // Auto-reload after countdown
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              window.location.reload();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      }
    };

    window.addEventListener("error", handleHydrationError);

    return () => {
      window.removeEventListener("error", handleHydrationError);
    };
  }, []);

  if (hydrationError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-4">
            <RefreshCw className="h-16 w-16 text-slate-600 animate-spin" />
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            MyDispatch wird aktualisiert...
          </h2>

          <p className="text-slate-600 mb-4">
            Ein Synchronisierungsfehler wurde behoben. Die Seite wird in {countdown} Sekunden neu
            geladen.
          </p>

          <div className="bg-slate-100 p-3 rounded-lg">
            <p className="text-xs text-slate-500">
              Hydration-Fehler erkannt – automatische Wiederherstellung aktiv
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
