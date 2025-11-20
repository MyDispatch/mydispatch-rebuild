/* ==================================================================================
   PWA INSTALL BUTTON - Install Prompt für PWA
   ==================================================================================
   Erstellt: 2025-01-31
   Zweck: PWA-Installation aktivieren
   Autor: NeXify AI MASTER
   ================================================================================== */

import { useState, useEffect } from "react";
import { V28Button } from "@/components/design-system/V28Button";
import { Download, X } from "lucide-react";
import { useDeviceType } from "@/hooks/use-device-type";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const { isMobile } = useDeviceType();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true);
        setShowButton(false);
      }
    };

    checkInstalled();
    const interval = setInterval(checkInstalled, 1000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearInterval(interval);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
      setShowButton(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowButton(false);
    setDeferredPrompt(null);
  };

  if (isInstalled || !showButton || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-4 max-w-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 text-sm mb-1">MyDispatch installieren</h3>
            <p className="text-xs text-slate-600">
              Installieren Sie MyDispatch für schnelleren Zugriff und Offline-Nutzung.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Schließen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <V28Button
            onClick={handleInstall}
            variant="primary"
            size="sm"
            className="flex-1 min-h-[44px]"
          >
            <Download className="h-4 w-4 mr-2" />
            Installieren
          </V28Button>
          <V28Button onClick={handleDismiss} variant="ghost" size="sm" className="min-h-[44px]">
            Später
          </V28Button>
        </div>
      </div>
    </div>
  );
}
