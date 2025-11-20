/* ==================================================================================
   HERO TRUST STATS - WIEDERVERWENDBAR
   ==================================================================================
   ✅ 2x2 Grid Trust Stats
   ✅ 100% V26.0 Design System konform
   ✅ Hover-Effekte & Glow
   ✅ V40.14: Inline-Styles eliminiert → CSS-Klassen + Hover-Events
   ================================================================================== */

import { LucideIcon } from "lucide-react";

interface TrustStat {
  icon: LucideIcon;
  label: string;
  sublabel: string;
}

interface HeroTrustStatsProps {
  stats: TrustStat[];
  animationDelay?: string;
}

export function HeroTrustStats({ stats, animationDelay = "0.5s" }: HeroTrustStatsProps) {
  return (
    <div
      className="grid grid-cols-2 gap-4 lg:gap-6 max-w-xl mx-auto lg:mx-0 pt-8 animate-fade-in"
      style={{ animationDelay }}
    >
      {stats.map((stat, idx) => {
        const StatIcon = stat.icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl backdrop-blur-md v26-transition-colors hover-scale v26-bg-white-overlay-06 border-2 v26-border-beige-19 v26-shadow-card-standard hover:v26-bg-white-overlay-13 hover:v26-border-beige-31 hover:v26-shadow-card-hover"
          >
            <div className="p-2.5 rounded-xl flex-shrink-0 v26-bg-beige-glow-13 v26-shadow-icon-box">
              <StatIcon className="h-5 w-5 v26-text-beige" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="font-sans text-xl font-bold leading-none v26-text-beige">
                {stat.label}
              </div>
              <div className="font-sans text-xs leading-tight mt-1 truncate text-muted-foreground">
                {stat.sublabel}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
