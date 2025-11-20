/* ==================================================================================
   BOOKING WIDGET - REDIRECT ZU LOGIN/REGISTER + LAZY LOADING
   ==================================================================================
   Phase 2.3: Widget Performance - Lazy Loading optimiert
   - NUR für Business/Enterprise Tarife
   - Leitet Kunden zu Portal-Auth weiter statt direkter Buchung
   - Registrierung oder Login erforderlich
   ================================================================================== */

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/lib/compat';
import { V28Button } from '@/components/design-system/V28Button';
import { LogIn, UserPlus, Check } from 'lucide-react';
import { CI_COLORS_HEX } from '@/lib/design-system';
import { useNavigate } from 'react-router-dom';

interface BookingWidgetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  companyName: string;
  primaryColor?: string;
}

export function BookingWidget({ open, onOpenChange, companyId, companyName, primaryColor }: BookingWidgetProps) {
  const navigate = useNavigate();
  
  const handleNavigateToAuth = (mode: 'login' | 'register') => {
    const url = mode === 'register' 
      ? `/auth?company=${companyId}&mode=customer&tab=signup`
      : `/auth?company=${companyId}&mode=customer&tab=login`;
    navigate(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Online buchen bei {companyName}
          </DialogTitle>
          <DialogDescription className="text-center">
            Melden Sie sich an oder erstellen Sie ein Kundenkonto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-6">
          <V28Button 
            onClick={() => handleNavigateToAuth('login')} 
            className="w-full min-h-[44px] h-14 text-base sm:text-lg bg-primary text-primary-foreground"
            variant="primary"
          >
            <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            Anmelden
          </V28Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Oder
              </span>
            </div>
          </div>

          <V28Button 
            onClick={() => handleNavigateToAuth('register')} 
            className="w-full min-h-[44px] h-14 text-base sm:text-lg"
            variant="secondary"
          >
            <UserPlus className="mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            Konto erstellen
          </V28Button>

          <div className="mt-6 pt-6 border-t">
            <p className="text-center font-medium mb-3 text-foreground">
              Warum registrieren?
            </p>
            <ul className="space-y-2 text-sm sm:text-base">
              <li className="flex items-start">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-foreground mr-2 flex-shrink-0 mt-0.5" />
                <span>Schnelle und einfache Buchungen</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-foreground mr-2 flex-shrink-0 mt-0.5" />
                <span>Auftrags-Historie jederzeit einsehen</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-foreground mr-2 flex-shrink-0 mt-0.5" />
                <span>Rechnungen online verwalten</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-foreground mr-2 flex-shrink-0 mt-0.5" />
                <span>Gespeicherte Adressen nutzen</span>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
