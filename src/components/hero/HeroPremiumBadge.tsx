/* ==================================================================================
   HERO PREMIUM BADGE - WIEDERVERWENDBAR
   ==================================================================================
   ✅ Premium Badge mit Live-Indikator
   ✅ 100% V26.0 Design System konform
   ✅ Pulsing Dot Animation
   ✅ V40.14: Inline-Styles eliminiert → CSS-Klassen
   ================================================================================== */

interface HeroPremiumBadgeProps {
  text: string;
  showDot?: boolean;
}

export function HeroPremiumBadge({ text, showDot = true }: HeroPremiumBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm animate-fade-in v26-bg-beige-glow-08 border-2 v26-border-beige v26-shadow-glow-beige-20">
      {showDot && (
        <div className="h-2 w-2 rounded-full animate-pulse v26-bg-beige v26-shadow-glow-beige-8" />
      )}
      <span className="font-sans text-sm font-semibold v26-text-beige">{text}</span>
    </div>
  );
}
