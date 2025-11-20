/* ==================================================================================
   V28 CHAT WIDGET - PROFESSIONAL FLOATING CHATBOT
   ==================================================================================
   ✅ V28.1 Slate Design System
   ✅ Floating Action Button (rechts unten)
   ✅ Mobile-optimiert (44px Touch Target)
   ✅ Keyboard-accessible (Tab, Enter, Escape)
   ✅ WCAG 2.1 AA konform
   ✅ Lazy-Loading für Performance
   ================================================================================== */

import { useState, lazy, Suspense, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import { V28Button } from "@/components/design-system/V28Button";
import { Card } from "@/lib/compat";
import { cn } from "@/lib/utils";

const ChatInterface = lazy(() => import("./ChatInterface"));

interface V28ChatWidgetProps {
  className?: string;
}

export function V28ChatWidget({ className }: V28ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatConsent, setChatConsent] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);

  // Check for existing consent on mount
  useEffect(() => {
    const consent = localStorage.getItem("chat_consent_given");
    setChatConsent(consent === "true");
  }, []);

  // Handle chat button click with consent check
  const handleChatOpen = () => {
    if (!chatConsent) {
      setShowConsentDialog(true);
      return;
    }
    setIsOpen(true);
  };

  // Handle consent approval
  const handleConsentApprove = () => {
    localStorage.setItem("chat_consent_given", "true");
    setChatConsent(true);
    setShowConsentDialog(false);
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className={cn("fixed z-50", className, "bottom-4 right-4 sm:bottom-6 sm:right-6")}>
        <V28Button
          onClick={handleChatOpen}
          size="sm"
          className={cn(
            "h-14 w-14 p-0 rounded-full shadow-lg",
            "bg-slate-700 hover:bg-slate-800",
            "transition-all duration-200",
            "focus-visible:ring-2 focus-visible:ring-slate-500",
            "hover:scale-110"
          )}
          aria-label={isOpen ? "Chat schließen" : "Chat öffnen"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" aria-hidden="true" />
          ) : (
            <MessageSquare className="h-6 w-6 text-white" aria-hidden="true" />
          )}
        </V28Button>
      </div>

      {/* DSGVO Consent Dialog */}
      {showConsentDialog && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-dialog-title"
        >
          <Card className="max-w-md mx-4 p-6 shadow-2xl">
            <h3 id="consent-dialog-title" className="font-semibold text-lg mb-2 text-slate-900">
              Chat-Datenschutz
            </h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Um den AI-Assistenten zu nutzen, benötigen wir Ihre Einwilligung zur Verarbeitung
              Ihrer Chat-Nachrichten. Ihre Daten werden DSGVO-konform verarbeitet und nicht an
              Dritte weitergegeben.
            </p>
            <div className="flex gap-2">
              <V28Button
                variant="secondary"
                onClick={() => setShowConsentDialog(false)}
                className="flex-1"
              >
                Ablehnen
              </V28Button>
              <V28Button
                onClick={handleConsentApprove}
                variant="primary"
                className="flex-1 bg-slate-700 hover:bg-slate-800 text-white"
              >
                Zustimmen
              </V28Button>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Details in unserer{" "}
              <a
                href="/datenschutz"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-slate-900 transition-colors"
              >
                Datenschutzerklärung
              </a>
            </p>
          </Card>
        </div>
      )}

      {/* Chat Panel - Full Screen auf Mobile, Floating auf Desktop */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-[60]",
            // Mobile: Full-screen (komplett über alles)
            "inset-0 sm:inset-auto",
            // Desktop: Floating panel
            "sm:bottom-24 sm:right-6 sm:w-96 sm:max-w-md"
          )}
          role="dialog"
          aria-label="Chat-Fenster"
        >
          <Card
            className={cn(
              "shadow-2xl border-slate-200 bg-white",
              // Mobile: Full height
              "h-full sm:h-auto",
              // Desktop: Shadow
              "sm:shadow-2xl"
            )}
          >
            <Suspense
              fallback={
                <div className="h-full sm:h-96 flex items-center justify-center p-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin h-8 w-8 border-4 border-slate-700 border-t-transparent rounded-full" />
                    <p className="text-sm text-slate-600">Chat wird geladen...</p>
                  </div>
                </div>
              }
            >
              <ChatInterface onClose={() => setIsOpen(false)} />
            </Suspense>
          </Card>
        </div>
      )}
    </>
  );
}
