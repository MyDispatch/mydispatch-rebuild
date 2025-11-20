/* ==================================================================================
   V26 FEATURE CARD - HERO-QUALITÄT MIT GLOW-EFFEKTEN
   ==================================================================================
   ✅ Premium Glow-Design
   ✅ Icon-Box integriert
   ✅ Smooth Hover-Effekte mit Transform
   ✅ 300ms Transitions
   ================================================================================== */

import { LucideIcon } from "lucide-react";
import { V26IconBox } from "@/components/design-system/V26IconBox";
import { cn } from "@/lib/utils";

interface V26FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: string;
}

export function V26FeatureCard({ icon, title, description, delay = "0s" }: V26FeatureCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-300 animate-fade-in",
        "bg-card border-2 border-border shadow-md hover:shadow-lg hover:scale-105"
      )}
      style={{
        animationDelay: delay,
      }}
    >
      <div className="flex flex-col gap-4">
        <V26IconBox icon={icon} size="lg" />

        <div>
          <h3 className="font-sans text-xl font-semibold mb-2 text-foreground">{title}</h3>
          <p className="font-sans text-base leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
