/* ==================================================================================
   CITIES PREMIUM SECTION V28.6 - LOKALES SEO MIT WOW-EFFEKT
   ==================================================================================
   ✅ WaveBackground Integration (top + bottom)
   ✅ Floating Orbs Animation
   ✅ Gestaffelte Fade-In Animation (Wasserfall)
   ✅ Hover-Effekte auf jeder Stadt
   ✅ "Alle anzeigen" Toggle-Functionality
   ✅ Mobile-First Responsive Grid
   ================================================================================== */

import { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { V28MarketingSection } from '@/components/design-system/V28MarketingSection';

interface CitiesPremiumSectionProps {
  cities: string[];
  maxVisible?: number;
}

export function CitiesPremiumSection({
  cities,
  maxVisible = 30
}: CitiesPremiumSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedCities = showAll ? cities : cities.slice(0, maxVisible);

  return (
    <V28MarketingSection
      background="canvas"
      title="In über 50 deutschen Städten aktiv"
      description="MyDispatch unterstützt Taxi- und Mietwagenunternehmen in Metropolen und mittelgroßen Städten bei der digitalen Transformation."
      className="relative overflow-hidden"
    >
      {/* Floating Orbs */}
      <div className="absolute top-[20%] right-[5%] w-96 h-96 bg-slate-200 rounded-full blur-3xl opacity-20 animate-float-slow pointer-events-none" />
      <div className="absolute bottom-[15%] left-[8%] w-80 h-80 bg-slate-300 rounded-full blur-3xl opacity-15 animate-float-slow pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Badge */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-slate-100 border border-slate-200">
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-slate-700" />
          <span className="font-sans text-xs sm:text-sm font-semibold text-slate-700">
            Deutschlandweit verfügbar
          </span>
        </div>
      </div>

      {/* Cities Grid - Gestaffelte Animation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 relative z-10">
        {displayedCities.map((city, idx) => (
          <div
            key={idx}
            className="group px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-white border border-slate-200 text-center transition-all duration-300 hover:border-slate-400 hover:shadow-md hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: `${idx * 0.02}s` }}
          >
            <span className="font-sans text-xs sm:text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors line-clamp-1">
              {city}
            </span>
          </div>
        ))}
      </div>

      {/* "Alle anzeigen" Button (wenn mehr als maxVisible) */}
      {cities.length > maxVisible && (
        <div className="text-center mt-6 sm:mt-8 relative z-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-slate-100 border border-slate-200 font-sans text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-200 hover:border-slate-300 transition-all duration-300"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                Weniger anzeigen
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                Alle {cities.length} Städte anzeigen
              </>
            )}
          </button>
        </div>
      )}

      {/* Trust-Line */}
      <p className="text-center text-slate-600 mt-6 sm:mt-8 md:mt-10 text-xs sm:text-sm relative z-10">
        Ihre Stadt nicht dabei?{' '}
        <Link
          to="/contact"
          className="underline hover:text-slate-900 transition-colors font-semibold"
        >
          Kontaktieren Sie uns
        </Link>
        {' '}– wir expandieren kontinuierlich.
      </p>
    </V28MarketingSection>
  );
}
