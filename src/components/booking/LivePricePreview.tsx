/* ==================================================================================
   LIVE PRICE PREVIEW - TARIFF CALCULATOR UI
   ==================================================================================
   Phase 3.1: Taxi-Spezifische Features
   - Echtzeit-Preisberechnung während Adresseingabe
   - Loading States
   - Fehlertoleranz mit Fallback
   ================================================================================== */

import { useQuery } from '@tanstack/react-query';
import { calculateFare, formatFare } from '@/lib/tariff-calculator';
import { Euro, Loader2, AlertCircle } from 'lucide-react';
import { Badge } from '@/lib/compat';

interface LivePricePreviewProps {
  pickup: string;
  destination: string;
  companyId: string;
  dateTime?: Date;
  className?: string;
}

export const LivePricePreview = ({ 
  pickup, 
  destination, 
  companyId,
  dateTime,
  className = '' 
}: LivePricePreviewProps) => {
  const { data: price, isLoading, error } = useQuery({
    queryKey: ['fare', pickup, destination, companyId, dateTime],
    queryFn: () => calculateFare(pickup, destination, companyId, dateTime),
    enabled: !!pickup && !!destination && pickup.length > 3 && destination.length > 3,
    staleTime: 60000, // Cache 1min
    retry: 1
  });

  if (!pickup || !destination) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 text-muted-foreground ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Berechne Preis...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 text-destructive ${className}`}>
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">Preisberechnung nicht verfügbar</span>
      </div>
    );
  }

  if (!price || price === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Euro className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm text-muted-foreground">Geschätzter Preis</p>
          <p className="text-2xl font-bold text-foreground">
            {formatFare(price)}
          </p>
        </div>
      </div>
      <Badge variant="outline" className="text-xs">
        Unverbindlich
      </Badge>
    </div>
  );
};
