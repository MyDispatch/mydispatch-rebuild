/* ==================================================================================
   PRIVACY SECTION V18.3
   ==================================================================================
   DSGVO-Einstellungen + Chat-Consent
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { V28Button } from "@/components/design-system/V28Button";
import { StatusIndicator } from "@/components/shared/StatusIndicator";
import { useSettings } from "@/contexts/SettingsContext";
import { useChatConsent } from "@/hooks/use-chat-consent";
import { Separator } from "@/components/ui/separator";
import { DataExportDialog } from "@/components/settings/DataExportDialog";

export function PrivacySection() {
  const { companyData, setCompanyData } = useSettings();
  const {
    consent,
    hasActiveConsent,
    giveConsent,
    withdrawConsent,
    updating: consentUpdating,
  } = useChatConsent();

  return (
    <div className="space-y-6">
      {/* DSGVO-Einstellungen */}
      <Card>
        <CardHeader>
          <CardTitle>Datenschutz-Einstellungen</CardTitle>
          <CardDescription>DSGVO-konforme Datenverarbeitungs-Einwilligungen</CardDescription>
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
              onCheckedChange={(checked) =>
                setCompanyData({ ...companyData, privacy_marketing: checked })
              }
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
              onCheckedChange={(checked) =>
                setCompanyData({ ...companyData, privacy_analytics: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Chat-Consent */}
      <Card>
        <CardHeader>
          <CardTitle>Team-Chat Teilnahme</CardTitle>
          <CardDescription>
            Entscheiden Sie, ob Sie am Unternehmens-Chat teilnehmen möchten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Chat-Status</Label>
              <div>
                <StatusIndicator
                  type={hasActiveConsent ? "success" : "neutral"}
                  label={hasActiveConsent ? "Teilnahme aktiv" : "Nicht teilnehmend"}
                  size="md"
                />
              </div>
            </div>
            {hasActiveConsent ? (
              <V28Button
                variant="destructive"
                onClick={() => withdrawConsent()}
                disabled={consentUpdating}
                className="min-h-[44px] touch-manipulation"
              >
                {consentUpdating ? "Wird bearbeitet..." : "Teilnahme beenden"}
              </V28Button>
            ) : (
              <V28Button
                onClick={() => giveConsent()}
                disabled={consentUpdating}
                className="min-h-[44px] bg-primary hover:bg-primary/90 text-primary-foreground touch-manipulation"
              >
                {consentUpdating ? "Wird aktiviert..." : "Am Chat teilnehmen"}
              </V28Button>
            )}
          </div>

          <div className="bg-muted p-4 rounded-lg text-xs text-muted-foreground">
            <p className="font-medium mb-1">Hinweis:</p>
            <p>
              Durch die Teilnahme am Team-Chat können Sie mit Ihren Kollegen kommunizieren. Sie
              können die Teilnahme jederzeit beenden.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* DSGVO Art. 20: Datenübertragbarkeit */}
      <Card>
        <CardHeader>
          <CardTitle>Datenexport (DSGVO Art. 20)</CardTitle>
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
