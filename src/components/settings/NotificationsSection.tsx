/* ==================================================================================
   NOTIFICATIONS SECTION V18.3
   ==================================================================================
   E-Mail, SMS, Push-Benachrichtigungen
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/contexts/SettingsContext";

export function NotificationsSection() {
  const { companyData, setCompanyData } = useSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Benachrichtigungen</CardTitle>
        <CardDescription>
          Legen Sie fest, wie Sie über wichtige Ereignisse informiert werden
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="notification_email_bookings">E-Mail bei neuen Aufträgen</Label>
              <p className="text-xs text-muted-foreground">
                Benachrichtigung wenn ein neuer Auftrag erstellt wird
              </p>
            </div>
            <Switch
              id="notification_email_bookings"
              checked={companyData.notification_email_bookings !== false}
              onCheckedChange={(checked) =>
                setCompanyData({ ...companyData, notification_email_bookings: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="notification_email_messages">E-Mail bei neuen Nachrichten</Label>
              <p className="text-xs text-muted-foreground">
                Benachrichtigung bei neuen Chat-Nachrichten
              </p>
            </div>
            <Switch
              id="notification_email_messages"
              checked={companyData.notification_email_messages !== false}
              onCheckedChange={(checked) =>
                setCompanyData({ ...companyData, notification_email_messages: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="notification_sms">SMS-Benachrichtigungen</Label>
              <p className="text-xs text-muted-foreground">
                Benachrichtigungen per SMS (in Kürze verfügbar)
              </p>
            </div>
            <Switch
              id="notification_sms"
              checked={companyData.notification_sms || false}
              onCheckedChange={(checked) =>
                setCompanyData({ ...companyData, notification_sms: checked })
              }
              disabled
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="notification_push">Push-Benachrichtigungen</Label>
              <p className="text-xs text-muted-foreground">Browser-Benachrichtigungen (PWA)</p>
            </div>
            <Switch
              id="notification_push"
              checked={companyData.notification_push || false}
              onCheckedChange={(checked) =>
                setCompanyData({ ...companyData, notification_push: checked })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
