/* ==================================================================================
   V26 TESTIMONIAL CARD - HERO-QUALITÄT MIT GLOW-EFFEKTEN
   ==================================================================================
   ✅ Premium Glow-Design
   ✅ Star Rating mit Beige
   ✅ Smooth Hover-Effekte
   ================================================================================== */

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface V26TestimonialCardProps {
  quote: string;
  company: string;
  rating: number;
}

export function V26TestimonialCard({ quote, company, rating }: V26TestimonialCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        "bg-white border-2 border-slate-200/50",
        isHovered ? "shadow-lg -translate-y-1" : "shadow-md"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="space-y-4">
        {/* Stars */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Sparkles key={i} className="h-5 w-5 text-slate-400 fill-slate-400" />
          ))}
        </div>

        {/* Quote */}
        <p className="font-sans text-base leading-relaxed text-slate-700">"{quote}"</p>

        {/* Company Info */}
        <div className="flex items-center gap-3 pt-2">
          <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold font-sans bg-slate-900 text-slate-50 shadow-md">
            {company.charAt(0)}
          </div>
          <div>
            <div className="font-sans font-semibold text-sm text-slate-900">{company}</div>
            <div className="flex gap-1 mt-1">
              {[...Array(rating)].map((_, i) => (
                <Sparkles key={i} className="h-3 w-3 text-slate-400 fill-slate-400" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
