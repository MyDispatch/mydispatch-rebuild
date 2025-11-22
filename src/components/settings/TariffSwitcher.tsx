/* ==================================================================================
   TARIFF-SWITCHER COMPONENT - V18.2
   ==================================================================================
   NUR FÜR TEST-ACCOUNTS:
   - info@my-dispatch.de (Master Account)
   - courbois1981@gmail.com (Legacy Master)
   - demo@my-dispatch.de
   
   Ermöglicht Umstellung zwischen Starter & Business für Testing-Zwecke
   ================================================================================== */

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useAccountType } from '@/hooks/use-account-type';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { V28Button } from '@/components/design-system/V28Button';
import { supabase } from '@/integrations/supabase/client';
import { PRODUCT_IDS, getTierName } from '@/lib/subscription-utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { handleError, handleSuccess } from '@/lib/error-handler';

export function TariffSwitcher() {
  const { company } = useAuth();
  const { accountType, permissions } = useAccountType();
  const [switching, setSwitching] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState<'starter' | 'business'>('business');

  // Nur für Test-Accounts anzeigen
  if (!permissions.canSwitchTariff) {
    return null;
  }

  const currentTier = getTierName(company?.subscription_product_id);

  const handleSwitch = async () => {
    if (!company?.id) {
      handleError(new Error('Unternehmensdaten nicht gefunden'), 'Unternehmensdaten nicht gefunden');
      return;
    }

    try {
      setSwitching(true);
      
      // Monthly Product ID für gewählten Tarif
      const targetProductId = PRODUCT_IDS[selectedTariff][0];
      
      const { error } = await supabase
        .from('companies')
        .update({ 
          subscription_product_id: targetProductId,
          subscription_status: 'active' // Sicherstellen dass aktiv bleibt
        })
        .eq('id', company.id);

      if (error) throw error;

      handleSuccess(`Tarif erfolgreich auf ${selectedTariff.toUpperCase()} umgestellt`);
      
      // Seite neu laden um neue Berechtigungen zu laden
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      handleError(error, 'Tarif-Umstellung fehlgeschlagen');
    } finally {
      setSwitching(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle>Tarif-Umstellung (Test-Modus)</CardTitle>
        <CardDescription>
          Wechseln Sie zwischen Tarifen für Testing-Zwecke
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Diese Funktion ist nur für Test-Accounts verfügbar und erlaubt das freie Wechseln zwischen Tarifen ohne Bezahlung.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <p className="text-sm font-medium">
            Aktueller Tarif: <span className="text-foreground font-semibold">{currentTier}</span>
          </p>
          
          <Select value={selectedTariff} onValueChange={(value: 'starter' | 'business') => setSelectedTariff(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tarif wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="starter">Starter (Max. 3 Fahrer/Fahrzeuge)</SelectItem>
              <SelectItem value="business">Business (Keine Limits + Alle Features)</SelectItem>
            </SelectContent>
          </Select>

          <V28Button 
            onClick={handleSwitch}
            disabled={switching}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {switching ? 'Wird umgestellt...' : `Auf ${selectedTariff.toUpperCase()} umstellen`}
          </V28Button>
        </div>
      </CardContent>
    </Card>
  );
}
