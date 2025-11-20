/* ==================================================================================
   V27 BUTTON - NORDIC SKY DESIGN
   ==================================================================================
   ✅ primary: Indigo BG + Champagne Text + Sky-Blue Hover
   ✅ secondary: Champagne BG + Indigo Text + Indigo Hover
   ✅ 3px Border = Text-Farbe
   ✅ Smooth Transitions (200ms)
   ✅ V27.0 NORDIC SKY KONFORM
   ================================================================================== */

import { ReactNode } from "react";
import { PRIMARY_COLORS_V27 } from "@/lib/design-system/unified-design-tokens";
import { cn } from "@/lib/utils";

interface V27ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function V27Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className,
  type = "button",
}: V27ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-xl font-sans font-semibold text-base transition-all duration-200",
        "h-12 px-8 flex items-center justify-center whitespace-nowrap",
        "border-[3px]",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      style={{
        backgroundColor: disabled
          ? "hsl(220, 13%, 91%)"
          : isPrimary
            ? PRIMARY_COLORS_V27.indigo
            : PRIMARY_COLORS_V27.champagne,
        color: disabled
          ? "hsl(220, 9%, 46%)"
          : isPrimary
            ? PRIMARY_COLORS_V27.champagne
            : PRIMARY_COLORS_V27.indigo,
        borderColor: disabled
          ? "hsl(220, 13%, 91%)"
          : isPrimary
            ? PRIMARY_COLORS_V27.champagne
            : PRIMARY_COLORS_V27.indigo,
      }}
      onMouseEnter={(e) => {
        if (!disabled && isPrimary) {
          e.currentTarget.style.boxShadow = `0 0 30px ${PRIMARY_COLORS_V27.sky}40`;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.boxShadow = "none";
        }
      }}
    >
      {children}
    </button>
  );
}
