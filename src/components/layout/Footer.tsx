/* ==================================================================================
   FOOTER V45.0 - PREMIUM VIBRANT PROFESSIONAL
   ==================================================================================
   ✅ Premium Vibrant Professional Farbpalette
   ✅ Verbesserte Kontraste und Lesbarkeit
   ✅ Business Tarif Premium Features
   ✅ 100% V45.0 Design System konform
   ================================================================================== */

import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { designTokens } from '@/config/design-tokens';

interface FooterProps {
  sidebarExpanded: boolean;
}

export function Footer({ sidebarExpanded }: FooterProps) {
  return (
    <footer 
      className={cn(
        "fixed bottom-0 right-0 h-16 sm:h-12",
        "transition-all ease-in-out backdrop-blur-md border-t shadow-lg"
      )}
      style={{
        zIndex: designTokens.zIndex.footer,
        left: sidebarExpanded ? '240px' : '64px',
        width: sidebarExpanded ? 'calc(100% - 240px)' : 'calc(100% - 64px)',
        transitionDuration: '300ms',
        boxShadow: designTokens.shadows.card,
        backgroundColor: designTokens.colors.slate[50],
        borderColor: designTokens.colors.slate[200],
        borderTopWidth: 1,
        borderStyle: 'solid',
      }}
    >
      <div className="container mx-auto px-8 h-full flex items-center">
        {/* Mobile: Kompakt */}
        <div className="sm:hidden flex flex-col items-center justify-center gap-0.5 w-full">
          <p className="text-[10px] leading-tight text-slate-900">
            © 2025 my-dispatch.de
          </p>
          <div className="flex items-center gap-2">
            {['Impressum', 'Datenschutz', 'Kontakt'].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                {i > 0 && <span className="text-[10px] text-slate-300">•</span>}
                <Link 
                  to={label === 'Kontakt' ? '/contact' : `/legal/${label.toLowerCase()}`}
                  aria-label={label}
                  className="text-[10px] text-slate-700 hover:text-blue-600 transition-colors font-medium min-h-[44px] min-w-[44px] flex items-center justify-center px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  {label}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Mehrspaltig */}
        <div className="hidden sm:flex items-center justify-between w-full h-full">
          <div className="flex items-center gap-4 h-full">
            <p className="text-[12px] text-slate-800 font-medium">
              © 2025 my-dispatch.de by RideHub Solutions
            </p>
            <span className="text-[12px] text-slate-400">•</span>
            <span className="text-[12px] text-slate-700 font-medium">Made in Germany</span>
          </div>
          <div className="flex items-center gap-5 h-full">
            {['Impressum', 'Datenschutz', 'AGB', 'Kontakt'].map((label) => (
              <Link 
                key={label}
                to={label === 'Kontakt' ? '/contact' : `/legal/${label.toLowerCase()}`}
                aria-label={label}
                className="text-[12px] text-slate-700 hover:text-blue-600 transition-colors font-medium min-h-[44px] flex items-center px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
