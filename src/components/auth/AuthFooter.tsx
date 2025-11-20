/* ==================================================================================
   ⚠️ LAYOUT FREEZE V28.1 - KEINE DESIGN/LAYOUT-ÄNDERUNGEN ERLAUBT!
   ==================================================================================
   DESIGN-SYSTEM: V28.1 Professional Minimalism (Slate-Palette)
   GESCHÜTZT: Footer-Layout, Links-Anordnung, Höhe, Typografie
   ERLAUBT: Technische Optimierungen (Routing, A11y)
   VERBOTEN: Design-Änderungen, Layout-Anpassungen
   LETZTE FREIGABE: 2025-01-30
   ==================================================================================
   
   AUTH-FOOTER V28.1 - Professional Minimalism
   ==================================================================================
   ✅ V28.1 Slate Design System
   ✅ Responsive Legal-Links
   ✅ B2B-Tonality, WCAG 2.1 AA
   ================================================================================== */

import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { COMPANY_INFO } from "@/lib/company-info";

interface AuthFooterProps {
  className?: string;
}

export function AuthFooter({ className }: AuthFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-b from-slate-50 to-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]",
        "h-16 sm:h-12",
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 h-full flex items-center">
        {/* Mobile: Kompakt in einer Zeile */}
        <div className="sm:hidden flex flex-col items-center justify-center gap-0.5 w-full">
          <p className="text-[9px] leading-tight text-slate-900">© {currentYear} my-dispatch.de</p>
          <div className="flex items-center gap-2">
            <Link
              to="/impressum"
              className="text-[9px] text-slate-600 hover:text-slate-900 transition-colors"
              aria-label="Zur Impressum-Seite"
            >
              Impressum
            </Link>
            <span className="text-[9px] text-slate-300">•</span>
            <Link
              to="/datenschutz"
              className="text-[9px] text-slate-600 hover:text-slate-900 transition-colors"
              aria-label="Zur Datenschutz-Seite"
            >
              Datenschutz
            </Link>
            <span className="text-[9px] text-slate-300">•</span>
            <Link
              to="/contact"
              className="text-[9px] text-slate-600 hover:text-slate-900 transition-colors"
              aria-label="Zur Kontakt-Seite"
            >
              Kontakt
            </Link>
          </div>
        </div>

        {/* Desktop: Mehrspaltig strukturiert */}
        <div className="hidden sm:flex items-center justify-between w-full h-full">
          <div className="flex items-center gap-4 h-full">
            <p className="text-[11px] text-slate-900">
              © {currentYear} my-dispatch.de by {COMPANY_INFO.ridehub.name}
            </p>
            <span className="text-[11px] text-slate-300">•</span>
            <span className="text-[11px] text-slate-600">Made in Germany</span>
          </div>
          <div className="flex items-center gap-5 h-full">
            {["Impressum", "Datenschutz", "AGB", "Kontakt"].map((label) => {
              const path = label === "Kontakt" ? "/contact" : `/${label.toLowerCase()}`;
              return (
                <Link
                  key={label}
                  to={path}
                  className="text-[11px] text-slate-600 hover:text-slate-900 transition-colors"
                  aria-label={`Zur ${label}-Seite`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
