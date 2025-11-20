/* ==================================================================================
   SCROLL-TO-TOP BUTTON V28.7 - PREMIUM UX
   ==================================================================================
   ✅ Erscheint ab 400px Scroll-Distanz (früher sichtbar)
   ✅ Smooth-Scroll zum Seitenanfang
   ✅ Premium Fade-In/Scale Animation
   ✅ Fixed Position (bottom-8 right-8)
   ✅ Hover-Glow-Effect
   ✅ ARIA Accessible
   ✅ Touch-optimiert (48x48px)
   ================================================================================== */

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // ✅ Früher sichtbar (400px statt 500px)
      setIsVisible(window.pageYOffset > 400);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        // Base styling - V28.1 Premium
        "fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-50",
        "w-12 h-12 rounded-full", // ✅ Touch-optimiert (48x48px)
        "bg-slate-900 text-white",
        "shadow-2xl hover:shadow-slate-400/50", // ✅ Hover-Glow
        "hover:bg-slate-800 hover:scale-110", // ✅ Scale-Effect
        "active:scale-95", // ✅ Click-Feedback
        "transition-all duration-300 ease-out",
        "flex items-center justify-center",
        // Visibility animation
        isVisible 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 translate-y-10 scale-90 pointer-events-none"
      )}
      aria-label="Zurück nach oben"
      title="Zurück nach oben"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
