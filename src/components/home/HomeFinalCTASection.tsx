/* ==================================================================================
   HOME FINAL CTA SECTION V28.1 - "SIMPLY ARRIVE" BRANDING
   ================================================================================== */

import { useNavigate } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { V28MarketingSection } from "@/components/design-system/V28MarketingSection";
import { V28MarketingCard } from "@/components/design-system/V28MarketingCard";
import { V28Button } from "@/components/design-system/V28Button";

export const HomeFinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <V28MarketingSection background="white" className="relative overflow-hidden">
      {/* Premium Background Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-slate-50/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-50/50 to-transparent" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-slate-200 rounded-full blur-3xl opacity-25 animate-float-slow pointer-events-none" />
      <div
        className="absolute bottom-[15%] left-[5%] w-[400px] h-[400px] bg-slate-300 rounded-full blur-3xl opacity-20 animate-float-slow pointer-events-none"
        style={{ animationDelay: "3s" }}
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* "simply arrive" Logo-Style Badge */}
        <div className="inline-flex flex-col items-center gap-3 mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900 border border-slate-700 shadow-lg">
            <BadgeCheck className="w-5 h-5 text-primary-foreground" />
            <span className="font-sans text-base font-bold text-primary-foreground tracking-wide">
              MyDispatch
            </span>
          </div>
          <span className="font-sans text-xl sm:text-2xl md:text-3xl font-light italic text-slate-600">
            simply arrive
          </span>
        </div>

        {/* Title */}
        <h2 className="font-sans font-bold tracking-tight mb-6 text-slate-900 text-3xl sm:text-4xl md:text-5xl">
          Bereit für die Zukunft der Disposition?
        </h2>

        {/* Description */}
        <p className="font-sans leading-relaxed mb-12 text-slate-600 max-w-3xl mx-auto text-center text-base sm:text-lg md:text-xl">
          Starten Sie jetzt mit{" "}
          <strong className="text-slate-900">monatlich kündbarem Tarif</strong> – ohne Kreditkarte,
          ohne Risiko, ohne Vertragsbindung. Erleben Sie, wie moderne Disposition funktioniert.
        </p>

        {/* Trust-Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-12 max-w-4xl mx-auto">
          {[
            { value: "450+", label: "Unternehmen vertrauen uns" },
            { value: "99.9%", label: "Garantierte Uptime" },
            { value: "24/7", label: "Premium-Support" },
          ].map((stat, idx) => (
            <V28MarketingCard
              key={idx}
              className="p-5 md:p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fade-in"
            >
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 leading-none">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600 leading-snug">{stat.label}</div>
            </V28MarketingCard>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <V28Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/auth?mode=signup")}
            className="shadow-xl hover:shadow-2xl px-8 py-6 text-base md:text-lg"
          >
            <BadgeCheck className="w-5 h-5 mr-2" />
            Jetzt starten
          </V28Button>
          <V28Button
            variant="secondary"
            size="lg"
            onClick={() => navigate("/demo")}
            className="shadow-lg hover:shadow-xl px-8 py-6 text-base md:text-lg"
          >
            Live-Demo ansehen
          </V28Button>
        </div>

        {/* Trust-Line */}
        <div className="flex flex-col items-center justify-center space-y-3 w-full">
          <p className="font-sans text-sm text-slate-600 text-center">
            <strong className="text-slate-900">DSGVO-konform</strong> · Made in Germany · Monatlich
            kündbar
          </p>
          <p className="font-sans text-xs text-slate-500 italic text-center">
            MyDispatch – simply arrive. Die moderne Art der Disposition.
          </p>
        </div>
      </div>
    </V28MarketingSection>
  );
};

export default HomeFinalCTASection;
