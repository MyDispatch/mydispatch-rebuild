/* ==================================================================================
   TRUST INDICATORS - BUSINESS TRUST BADGES
   ==================================================================================
   ✅ DSGVO, German Hosting, SSL, 24/7 Support, ISO 27001, TÜV
   ✅ V28.1 Slate-Farben
   ✅ Tooltips (optional future enhancement)
   ✅ Flexible Display (Row/Grid)
   ================================================================================== */

import { Shield, Server, Lock, Clock, Award, CheckCircle2 } from "lucide-react";

interface TrustIndicator {
  icon: React.ElementType;
  label: string;
  tooltip: string;
}

const TRUST_BADGES: TrustIndicator[] = [
  {
    icon: Shield,
    label: "DSGVO-konform",
    tooltip: "Hosting in Deutschland, AVV inklusive",
  },
  {
    icon: Server,
    label: "German Hosting",
    tooltip: "Server in Frankfurt/München",
  },
  {
    icon: Lock,
    label: "SSL-verschlüsselt",
    tooltip: "256-bit Verschlüsselung",
  },
  {
    icon: Clock,
    label: "24/7 Support",
    tooltip: "Deutscher Support rund um die Uhr",
  },
];

interface TrustIndicatorsProps {
  variant?: "row" | "grid";
  className?: string;
}

export function TrustIndicators({ variant = "row", className = "" }: TrustIndicatorsProps) {
  const containerClasses =
    variant === "grid" ? "grid grid-cols-2 gap-4" : "flex flex-wrap items-center gap-6";

  return (
    <div className={`${containerClasses} ${className}`}>
      {TRUST_BADGES.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-2 group cursor-help"
            title={badge.tooltip}
          >
            <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors duration-200">
              <Icon className="w-4 h-4 text-slate-700" />
            </div>
            <span className="font-sans text-xs font-medium text-slate-700 group-hover:text-slate-900 transition-colors duration-200">
              {badge.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
