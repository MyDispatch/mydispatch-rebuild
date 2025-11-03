/* ==================================================================================
   TENANT LANDING FOOTER V28.1
   ==================================================================================
   ✅ Company-spezifische Legal Dialogs (nicht Navigation!)
   ✅ LegalDialog Integration
   ✅ Powered by MyDispatch Footer
   ✅ V28.1 Slate Design
   ================================================================================== */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LegalDialog } from '@/components/shared/LegalDialog';
import { cn } from '@/lib/utils';

interface TenantLandingFooterProps {
  companyName: string;
  primaryColor?: string;
  className?: string;
}

export function TenantLandingFooter({ 
  companyName, 
  primaryColor,
  className 
}: TenantLandingFooterProps) {
  const [legalDialog, setLegalDialog] = useState<'impressum' | 'datenschutz' | 'agb' | 'ki-transparenz' | 'cookie-policy' | null>(null);
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer 
        className={cn(
          "border-t border-slate-200 bg-white py-4",
          className
        )}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-slate-600">
              © {currentYear} {companyName}
            </p>

            {/* Legal Links - OPEN DIALOGS */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <button
                onClick={() => setLegalDialog('impressum')}
                className="text-sm text-slate-600 hover:text-slate-900 hover:underline transition-colors"
              >
                Impressum
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => setLegalDialog('datenschutz')}
                className="text-sm text-slate-600 hover:text-slate-900 hover:underline transition-colors"
              >
                Datenschutz
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => setLegalDialog('agb')}
                className="text-sm text-slate-600 hover:text-slate-900 hover:underline transition-colors"
              >
                AGB
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => setLegalDialog('ki-transparenz')}
                className="text-sm text-slate-600 hover:text-slate-900 hover:underline transition-colors"
              >
                KI-Transparenz
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => setLegalDialog('cookie-policy')}
                className="text-sm text-slate-600 hover:text-slate-900 hover:underline transition-colors"
              >
                Cookie-Policy
              </button>
            </div>

            {/* Powered by MyDispatch */}
            <p className="text-xs text-slate-500">
              Powered by{' '}
              <Link 
                to="/" 
                className="text-slate-700 hover:text-slate-900 font-medium hover:underline transition-colors"
              >
                MyDispatch
              </Link>
            </p>
          </div>
        </div>
      </footer>

      {/* Legal Dialog */}
      {legalDialog && (
        <LegalDialog
          open={true}
          onOpenChange={() => setLegalDialog(null)}
          type={legalDialog}
          companyName={companyName}
          primaryColor={primaryColor}
        />
      )}
    </>
  );
}
