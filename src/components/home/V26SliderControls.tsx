/* ==================================================================================
   V26 SLIDER CONTROLS - HERO-QUALITÄT MIT GLOW-EFFEKTEN
   ==================================================================================
   ✅ Premium Button-Design
   ✅ Smooth Transitions
   ✅ Active State Indicators
   ================================================================================== */

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface V26SliderControlsProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
}

export function V26SliderControls({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onDotClick,
}: V26SliderControlsProps) {
  const [hoveredButton, setHoveredButton] = useState<"prev" | "next" | null>(null);

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        onMouseEnter={() => setHoveredButton("prev")}
        onMouseLeave={() => setHoveredButton(null)}
        className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300",
          "bg-slate-900 border-2 border-slate-200 text-slate-50",
          "shadow-md hover:shadow-lg",
          hoveredButton === "prev" && "scale-110"
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="flex gap-2">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => onDotClick(idx)}
            className={cn(
              "transition-all duration-300 rounded-full",
              currentSlide === idx
                ? "h-[10px] w-[10px] bg-slate-900 shadow-sm"
                : "h-2 w-2 bg-slate-200"
            )}
          />
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        onMouseEnter={() => setHoveredButton("next")}
        onMouseLeave={() => setHoveredButton(null)}
        className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300",
          "bg-slate-900 border-2 border-slate-200 text-slate-50",
          "shadow-md hover:shadow-lg",
          hoveredButton === "next" && "scale-110"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
