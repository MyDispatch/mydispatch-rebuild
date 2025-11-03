/* ==================================================================================
   HOME TESTIMONIALS SECTION V28.1
   ================================================================================== */

import { useState, useEffect } from "react";
import { Building2, Star } from "lucide-react";
import { V28MarketingSection } from "@/components/design-system/V28MarketingSection";
import { V28MarketingCard } from "@/components/design-system/V28MarketingCard";
import { V28SliderControls } from "@/components/home";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";

export const HomeTestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  
  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  // Auto-play with pause control
  useEffect(() => {
    if (isSliderPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalPages);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalPages, isSliderPaused]);

  return (
    <V28MarketingSection
      background="white"
      title="Was unsere Kunden sagen"
      description="Professionelle Unternehmen vertrauen auf MyDispatch"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials
            .slice(currentSlide * testimonialsPerPage, (currentSlide + 1) * testimonialsPerPage)
            .map((testimonial, idx) => (
              <V28MarketingCard
                key={idx}
                className={cn(
                  "transition-all duration-300",
                  "hover:shadow-2xl hover:scale-[1.02]",
                  "relative overflow-hidden group"
                )}
                onMouseEnter={() => setIsSliderPaused(true)}
                onMouseLeave={() => setIsSliderPaused(false)}
              >
                {/* Hover-Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Rating Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4"
                        fill={i < testimonial.rating ? "#475569" : "none"}
                        stroke={i < testimonial.rating ? "#475569" : "#cbd5e1"}
                        strokeWidth={2}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="font-sans text-sm leading-relaxed mb-4 italic text-slate-600">
                    "{testimonial.quote}"
                  </p>

                  {/* Company */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-slate-600" />
                    </div>
                    <p className="font-sans text-sm font-semibold text-slate-900">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </V28MarketingCard>
            ))}
        </div>

        {/* Slider Controls */}
        <V28SliderControls
          currentSlide={currentSlide}
          totalSlides={totalPages}
          onPrevious={() => setCurrentSlide((prev) => (prev - 1 + totalPages) % totalPages)}
          onNext={() => setCurrentSlide((prev) => (prev + 1) % totalPages)}
          onDotClick={(idx) => setCurrentSlide(idx)}
          isPaused={isSliderPaused}
          onTogglePause={() => setIsSliderPaused(!isSliderPaused)}
        />
      </div>
    </V28MarketingSection>
  );
};

export default HomeTestimonialsSection;
