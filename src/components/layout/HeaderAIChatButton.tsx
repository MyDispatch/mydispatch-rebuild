/* ==================================================================================
   HEADER AI-CHAT BUTTON - Global Access Point
   ==================================================================================
   - Wird im Header angezeigt (Desktop + Mobile)
   - Öffnet IntelligentAIChat im App-Mode
   - Unobtrusive Design, aber immer sichtbar
   ================================================================================== */

import React from "react";
import { V28Button } from "@/components/design-system/V28Button";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeviceType } from "@/hooks/use-device-type";

interface HeaderAIChatButtonProps {
  onClick: () => void;
  className?: string;
}

export function HeaderAIChatButton({ onClick, className }: HeaderAIChatButtonProps) {
  const { isMobile } = useDeviceType();

  return (
    <V28Button
      variant="ghost"
      size={isMobile ? "sm" : "md"}
      onClick={onClick}
      className={cn(
        "relative group transition-all duration-200 p-0",
        "hover:bg-primary/10 hover:text-primary",
        isMobile ? "h-10 w-10" : "",
        className
      )}
      aria-label="AI-Assistent öffnen"
      icon={isMobile ? MessageCircle : undefined}
    >
      {!isMobile && (
        <>
          <MessageCircle className="h-5 w-5 mr-2" />
          <span className="font-medium">AI-Assistent</span>
        </>
      )}

      {/* Pulse Animation für Aufmerksamkeit (optional) */}
      <span className="absolute top-0 right-0 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
      </span>
    </V28Button>
  );
}
