/* ==================================================================================
   ⚠️ LAYOUT FREEZE V28.1 - KEINE DESIGN/LAYOUT-ÄNDERUNGEN ERLAUBT!
   ==================================================================================
   DESIGN-SYSTEM: V28.1 Professional Minimalism (Slate-Palette)
   GESCHÜTZT: Header-Layout, Logo-Position, Button-Design, Höhe
   ERLAUBT: Technische Optimierungen (Navigation-Logik, A11y)
   VERBOTEN: Design-Änderungen, Layout-Anpassungen
   LETZTE FREIGABE: 2025-01-30
   ==================================================================================
   
   AUTH-HEADER V28.1 - PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ V28.1 Professional Gray-Blue Design
   ✅ Pure Tailwind mit Slate-Palette
   ✅ Context-aware Navigation
   ================================================================================== */

import { cn } from '@/lib/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getHomeRoute } from '@/lib/navigation-helpers';
import { Logo } from '@/components/shared/Logo';

interface AuthHeaderProps {
  companyName?: string;
  logoUrl?: string;
  className?: string;
}

export function AuthHeader({ 
  companyName = 'MyDispatch', 
  logoUrl,
  className 
}: AuthHeaderProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Context-aware Navigation - V18.5.2: Always navigate to /home
  const handleNavigateHome = () => {
    const homeRoute = getHomeRoute(searchParams);
    navigate(homeRoute);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 shadow-md h-16",
        className
      )}
    >
      <div className="px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <button
            onClick={handleNavigateHome}
            className="max-w-[120px] sm:max-w-[160px] md:max-w-[180px] cursor-pointer hover:opacity-80 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary bg-transparent border-none p-0"
            aria-label="Zur Startseite"
          >
            <Logo />
          </button>
          
          {/* CTA Button */}
          <button
            onClick={handleNavigateHome}
            className="h-11 px-8 font-semibold rounded-lg text-sm bg-slate-600 text-white border border-slate-600 shadow-sm hover:bg-slate-700 hover:shadow-md transition-all duration-300 whitespace-nowrap"
            aria-label="Zur Startseite"
          >
            <span className="hidden sm:inline">Zur Startseite</span>
            <span className="sm:hidden">Home</span>
          </button>
        </div>
      </div>
    </header>
  );
}
