import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

import { toast } from "@/lib/toast";

export function SWUpdater() {
  const [visible, setVisible] = useState(false);
  const { needRefresh, updateServiceWorker, offlineReady } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      console.info("Service Worker registriert", swUrl, registration);
    },
    onRegisterError(error) {
      console.error("Service Worker Fehler", error);
      toast({
        title: "PWA-Registrierung fehlgeschlagen",
        description: (error as Error)?.message ?? "Unbekannter Fehler",
        variant: "error"
      });
    }
  });

  useEffect(() => {
    if (offlineReady) {
      toast({ title: "Offline-Betrieb bereit", variant: "success" });
    }
  }, [offlineReady]);

  useEffect(() => {
    if (needRefresh) {
      setVisible(true);
    }
  }, [needRefresh]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-[998] w-full max-w-md -translate-x-1/2 rounded-xl border border-slate-700 bg-slate-900/95 p-4 shadow-lg">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">Neues Update verfügbar</p>
          <p className="text-xs text-slate-300">Bitte aktualisiere, um die neuesten Master-Funktionen zu erhalten.</p>
        </div>
        <div className="flex justify-end gap-2 text-sm">
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="rounded-md border border-slate-700 px-3 py-1 text-slate-200 transition hover:bg-slate-800"
          >
            Später
          </button>
          <button
            type="button"
            onClick={async () => {
              await updateServiceWorker(true);
              setVisible(false);
            }}
            className="rounded-md bg-primary-500 px-3 py-1 font-medium text-white transition hover:bg-primary-400"
          >
            Jetzt aktualisieren
          </button>
        </div>
      </div>
    </div>
  );
}
