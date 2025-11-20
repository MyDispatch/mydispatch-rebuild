/* ==================================================================================
   V28 PRICING HERO - PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ V28HeroBackground (Slate-Gradient)
   ✅ Slate-900 Text (statt White)
   ✅ Clean & dezent
   ================================================================================== */

import { ReactNode } from "react";
import { V28HeroBackground } from "@/components/hero/V28HeroBackground";
import { V28Hero3DBackgroundClean } from "@/components/hero/V28Hero3DBackgroundClean";
import { V28Hero3DBackgroundPremium } from "@/components/hero/V28Hero3DBackgroundPremium";

interface V28PricingHeroProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
  backgroundVariant?: "flat" | "3d-clean" | "3d-premium";
}

export function V28PricingHero({
  title,
  subtitle,
  children,
  backgroundVariant = "flat",
}: V28PricingHeroProps) {
  return (
    <section className="relative min-h-[450px] sm:min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      {backgroundVariant === "3d-premium" ? (
        <V28Hero3DBackgroundPremium />
      ) : backgroundVariant === "3d-clean" ? (
        <V28Hero3DBackgroundClean />
      ) : (
        <V28HeroBackground />
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 animate-fade-in">
          <h1
            className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center font-extrabold tracking-tight text-slate-900 leading-tight"
            style={{ textWrap: "balance" }}
          >
            {title}
          </h1>

          <p
            className="font-sans text-base sm:text-lg md:text-xl lg:text-2xl text-center leading-relaxed text-slate-600 max-w-3xl mx-auto"
            style={{ textWrap: "pretty" }}
          >
            {subtitle}
          </p>

          {children && (
            <div className="pt-2 sm:pt-4 animate-fade-in-delayed flex justify-center">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
