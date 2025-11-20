/* ==================================================================================
   PWA INSTALL HOOK - MyDispatch V18.2.24
   ==================================================================================
   - beforeinstallprompt Event Handler
   - Install Prompt Management
   - iOS Safari Detection
   - Installation Status Tracking
   - CRITICAL FIX V18.2.24: Defensive React Import für Bundle-Stabilität
   ================================================================================== */

import * as React from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  promptInstall: () => Promise<void>;
  dismissPrompt: () => void;
}

export function usePWAInstall(): PWAInstallState {
  // CRITICAL FIX V18.2.24: Defensive React Check für Bundle-Stabilität
  // Verhindert "Cannot read properties of null (reading 'useState')" Fehler
  if (typeof React === 'undefined' || !React.useState) {
    // Fallback wenn React nicht verfügbar (SSR, Bundle-Fehler, etc.)
    return {
      isInstallable: false,
      isInstalled: false,
      isIOS: false,
      promptInstall: async () => {},
      dismissPrompt: () => {},
    };
  }

  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [isIOS, setIsIOS] = React.useState(false);

  React.useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check for iOS Safari
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
    
    if (isIOSDevice && !isInStandaloneMode) {
      setIsIOS(true);
      setIsInstallable(true);
    }

    // Listen for beforeinstallprompt (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    // Listen for appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);


    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = React.useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
      }

      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      throw error;
    }
  }, [deferredPrompt]);

  const dismissPrompt = React.useCallback(() => {
    setIsInstallable(false);
  }, []);

  return {
    isInstallable,
    isInstalled,
    isIOS,
    promptInstall,
    dismissPrompt,
  };
}
