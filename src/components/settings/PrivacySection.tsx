/* ==================================================================================
   PRIVACY SECTION V18.3
   ==================================================================================
   DSGVO-Einstellungen
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/contexts/SettingsContext';
import { DataExportDialog } from '@/components/settings/DataExportDialog';

export function PrivacySection() {
  const { companyData, setCompanyData } = useSettings();

  return (
    <div className="space-y-6">
      {/* DSGVO-Einstellungen */}
      <Card>
        <CardHeader>
          <CardTitle>
            Datenschutz-Einstellungen
          </CardTitle>
          <CardDescription>
            DSGVO-konforme Datenverarbeitungs-Einwilligungen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="privacy_data_processing">Datenverarbeitung</Label>
              <p className="text-xs text-muted-foreground">
                Erforderlich für grundlegende Funktionalität (kann nicht deaktiviert werden)
              </p>
            </div>
            <Switch
              id="privacy_data_processing"
              checked={companyData.privacy_data_processing !== false}
              disabled
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="privacy_marketing">Marketing-Kommunikation</Label>
              <p className="text-xs text-muted-foreground">
                Erlaubt Erhalt von Produkt-Updates und Angeboten
              </p>
            </div>
            <Switch
              id="privacy_marketing"
              checked={companyData.privacy_marketing || false}
              onCheckedChange={(checked) => setCompanyData({ ...companyData, privacy_marketing: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="privacy_analytics">Analyse & Statistiken</Label>
              <p className="text-xs text-muted-foreground">
                Erlaubt anonymisierte Nutzungsanalyse zur App-Verbesserung
              </p>
            </div>
            <Switch
              id="privacy_analytics"
              checked={companyData.privacy_analytics || false}
              onCheckedChange={(checked) => setCompanyData({ ...companyData, privacy_analytics: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* DSGVO Art. 20: Datenübertragbarkeit */}
      <Card>
        <CardHeader>
          <CardTitle>
            Datenexport (DSGVO Art. 20)
          </CardTitle>
          <CardDescription>
            Exportieren Sie Ihre personenbezogenen Daten im strukturierten Format
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <DataExportDialog />
        </CardContent>
      </Card>
    </div>
  );
}
