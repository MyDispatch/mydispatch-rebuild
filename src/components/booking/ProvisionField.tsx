/* ==================================================================================
   PROVISIONS-FELD COMPONENT
   ==================================================================================
   Bedingtes Feld für manuelle Provisions-Eingabe in Aufträgen
   ================================================================================== */

import { useState, useEffect } from 'react';
import { Input } from '@/lib/compat';
import { Label } from '@/components/ui/label';
import { Info, AlertCircle } from 'lucide-react';
import { calculateProvision, validateManualProvision, formatProvisionDisplay } from '@/lib/provision-utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/lib/compat';

interface ProvisionFieldProps {
  bookingPrice: number;
  partnerProvisionRate?: number;
  currentManualProvision?: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
}

export function ProvisionField({
  bookingPrice,
  partnerProvisionRate = 0,
  currentManualProvision,
  onChange,
  disabled = false,
}: ProvisionFieldProps) {
  const [manualValue, setManualValue] = useState<string>(
    currentManualProvision !== null && currentManualProvision !== undefined
      ? currentManualProvision.toString()
      : ''
  );
  const [error, setError] = useState<string | undefined>();

  // Berechne aktuelle Provision
  const provisionCalc = calculateProvision(
    bookingPrice,
    partnerProvisionRate,
    currentManualProvision
  );

  // Berechne automatische Provision für Info
  const automaticCalc = calculateProvision(bookingPrice, partnerProvisionRate, null);

  useEffect(() => {
    // Sync mit externen Änderungen
    if (currentManualProvision !== null && currentManualProvision !== undefined) {
      setManualValue(currentManualProvision.toString());
    } else {
      setManualValue('');
    }
  }, [currentManualProvision]);

  const handleChange = (value: string) => {
    setManualValue(value);

    const validation = validateManualProvision(value, bookingPrice);

    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setError(undefined);
    onChange(validation.numericValue !== undefined ? validation.numericValue : null);
  };

  const handleReset = () => {
    setManualValue('');
    setError(undefined);
    onChange(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="manual-provision" className="text-sm font-medium">
          Provision (optional)
        </Label>
        {automaticCalc.type === 'automatic' && (
          <Badge variant="outline" className="text-xs">
            Auto: {formatProvisionDisplay(automaticCalc)}
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <Input
          id="manual-provision"
          type="number"
          step="0.01"
          min="0"
          max={bookingPrice}
          placeholder={
            automaticCalc.type === 'automatic'
              ? `Standard: ${automaticCalc.amount.toFixed(2)} €`
              : 'Manuellen Betrag eingeben'
          }
          value={manualValue}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
          className={error ? 'border-destructive' : ''}
        />

        {manualValue && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Auf automatische Berechnung zurücksetzen
          </button>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {!error && automaticCalc.type === 'automatic' && !manualValue && (
        <Alert className="py-2 bg-muted/50">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Automatische Berechnung: {partnerProvisionRate}% von{' '}
            {new Intl.NumberFormat('de-DE', {
              style: 'currency',
              currency: 'EUR',
            }).format(bookingPrice)}
          </AlertDescription>
        </Alert>
      )}

      {manualValue && !error && (
        <Alert className="py-2 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Manuelle Provision aktiviert. Überschreibt automatische Berechnung.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}