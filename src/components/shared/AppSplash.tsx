/* ==================================================================================
   APP SPLASH SCREEN V26.0
   ==================================================================================
   Weißer Bildschirm mit MyDispatch Logo beim App-Start
   - Zeigt sich 2.5 Sekunden beim ersten Laden
   - V26 Design-System konform
   ================================================================================== */

import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export function AppSplash({ onComplete }: { onComplete: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Nach 2 Sekunden Fade-Out starten
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Nach 2.5 Sekunden komplett ausblenden
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 bg-background"
      style={{ opacity: fadeOut ? 0 : 1 }}
    >
      {/* Logo Container */}
      <div className="relative animate-fade-in">
        {/* Decorative Background Circle */}
        <div className="absolute inset-0 -m-8 rounded-full blur-3xl opacity-20 bg-primary" />

        {/* Logo Card */}
        <div className="relative rounded-3xl p-12 shadow-2xl border-2 bg-background border-border">
          <Logo className="scale-150" showTagline={false} />
        </div>

        {/* Loading Dots */}
        <div className="flex items-center justify-center space-x-2 mt-12">
          <div
            className="w-2.5 h-2.5 rounded-full animate-bounce bg-primary"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2.5 h-2.5 rounded-full animate-bounce bg-primary"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2.5 h-2.5 rounded-full animate-bounce bg-primary"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>

      {/* Tagline */}
      <p
        className="absolute bottom-16 text-sm font-medium tracking-wide animate-fade-in text-muted-foreground"
        style={{ animationDelay: "500ms" }}
      >
        simply arrive
      </p>
    </div>
  );
}
