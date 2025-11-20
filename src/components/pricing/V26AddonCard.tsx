/* ==================================================================================
   V26 ADDON CARD - HERO-QUALITÄT MIT GLOW-EFFEKTEN
   ==================================================================================
   ✅ Premium Glow-Design
   ✅ Icon-Box integriert
   ✅ Smooth Hover-Effekte
   ================================================================================== */

import { ReactNode, useState } from "react";
import { LucideIcon } from "lucide-react";
import { V26IconBox } from "@/components/design-system/V26IconBox";
import { cn } from "@/lib/utils";

interface V26AddonCardProps {
  icon: LucideIcon;
  title: string;
  price?: string;
  priceLabel?: string;
  description: string;
  children?: ReactNode;
  highlighted?: boolean;
}

export function V26AddonCard({
  icon,
  title,
  price,
  priceLabel,
  description,
  children,
  highlighted = false,
}: V26AddonCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "rounded-2xl p-8 transition-all duration-300 animate-fade-in bg-white",
        highlighted ? "border-4 border-slate-700" : "border-2 border-slate-200"
      )}
      style={{
        boxShadow: highlighted
          ? isHovered
            ? "0 0 60px rgba(51, 65, 85, 0.45), 0 35px 70px -15px rgba(51, 65, 85, 0.4)"
            : "0 0 50px rgba(51, 65, 85, 0.4), 0 30px 60px -15px rgba(51, 65, 85, 0.35)"
          : isHovered
            ? "0 0 30px rgba(51, 65, 85, 0.25), 0 20px 40px -10px rgba(51, 65, 85, 0.2)"
            : "0 10px 30px -5px rgba(51, 65, 85, 0.15)",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-5">
        <V26IconBox icon={icon} size="lg" />
        <div className="flex-1">
          <h3 className="font-sans text-2xl font-semibold mb-3 v26-text-primary">{title}</h3>

          {price && (
            <div className="mb-4">
              <span className="font-sans text-3xl font-extrabold v26-text-primary">{price}</span>
              {priceLabel && (
                <span className="font-sans text-sm font-normal ml-1 v26-text-tertiary">
                  {priceLabel}
                </span>
              )}
            </div>
          )}

          <p className="font-sans text-base font-normal leading-relaxed mb-5 v26-text-secondary">
            {description}
          </p>

          {children}
        </div>
      </div>
    </div>
  );
}
