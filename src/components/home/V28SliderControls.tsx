/* ==================================================================================
   V28 SLIDER CONTROLS - WCAG 2.1 AA COMPLIANT
   ==================================================================================
   ✅ rounded-xl Buttons (wie Pricing)
   ✅ shadow-sm hover:shadow-md
   ✅ hover:scale-[1.02]
   ✅ Arrows + Dots Navigation
   ✅ WCAG FIX: Pause Button für Auto-Play
   ✅ Wiederverwendbar
   ================================================================================== */

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { designTokens } from "@/config/design-tokens";

interface V28SliderControlsProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
  isPaused?: boolean;
  onTogglePause?: () => void;
}

export function V28SliderControls({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onDotClick,
  isPaused = false,
  onTogglePause,
}: V28SliderControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {/* WCAG FIX: Pause/Play Button */}
      {onTogglePause && (
        <button
          onClick={onTogglePause}
          className="p-2 rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-md hover:scale-[1.02] shadow-sm"
          style={{ color: designTokens.colors.primary.DEFAULT }}
          aria-label={
            isPaused ? "Automatische Wiedergabe starten" : "Automatische Wiedergabe pausieren"
          }
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>
      )}

      {/* Previous Button */}
      <button
        onClick={onPrevious}
        className="p-2 rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-md hover:scale-[1.02] shadow-sm"
        style={{ color: designTokens.colors.primary.DEFAULT }}
        aria-label="Vorheriges Testimonial"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Dots mit rounded-full */}
      <div className="flex gap-2" role="group" aria-label="Testimonial-Navigation">
        {[...Array(totalSlides)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => onDotClick(idx)}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                idx === currentSlide
                  ? designTokens.colors.primary.DEFAULT
                  : designTokens.colors.slate[300],
            }}
            aria-label={`Gehe zu Slide ${idx + 1}`}
            aria-current={idx === currentSlide ? "true" : "false"}
          />
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="p-2 rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-md hover:scale-[1.02] shadow-sm"
        style={{ color: designTokens.colors.primary.DEFAULT }}
        aria-label="Nächstes Testimonial"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
