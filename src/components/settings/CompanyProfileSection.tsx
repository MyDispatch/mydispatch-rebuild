/* ==================================================================================
   COMPANY PROFILE SECTION V18.3
   ==================================================================================
   Firmenprofil mit KPI-Cards
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/lib/compat";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSettings } from "@/contexts/SettingsContext";

export function CompanyProfileSection() {
  const { companyData, setCompanyData } = useSettings();

  return (
    <div className="space-y-6">
      {/* KPI-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aufträge</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{companyData.total_bookings || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Gesamt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fahrer</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{companyData.total_drivers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Aktiv</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fahrzeuge</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{companyData.total_vehicles || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Im Einsatz</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Umsatz</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(
                companyData.monthly_revenue || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Monatlich</p>
          </CardContent>
        </Card>
      </div>

      {/* Firmenprofil */}
      <Card>
        <CardHeader>
          <CardTitle>Unternehmensprofil</CardTitle>
          <CardDescription>Verwalten Sie die Stammdaten Ihres Unternehmens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="company_name">Unternehmensname *</Label>
              <Input
                id="company_name"
                value={companyData.name}
                onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                required
                className="min-h-[44px] touch-manipulation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_email">E-Mail</Label>
              <Input
                id="company_email"
                type="email"
                value={companyData.email || ""}
                onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                className="min-h-[44px] touch-manipulation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_phone">Telefon</Label>
              <Input
                id="company_phone"
                type="tel"
                value={companyData.phone || ""}
                onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                className="min-h-[44px] touch-manipulation"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="company_address">Adresse</Label>
              <Textarea
                id="company_address"
                value={companyData.address || ""}
                onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                rows={3}
                className="min-h-[44px] touch-manipulation"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="tax_id" className="flex items-center gap-2">
                Umsatzsteuernummer (USt-IdNr.) *
                <span className="text-xs text-muted-foreground font-normal">(Obligatorisch)</span>
              </Label>
              <Input
                id="tax_id"
                value={companyData.tax_id}
                onChange={(e) => setCompanyData({ ...companyData, tax_id: e.target.value })}
                required
                placeholder="DE123456789"
                className="min-h-[44px] touch-manipulation"
              />
              {!companyData.tax_id && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Die Umsatzsteuernummer ist obligatorisch für die Nutzung.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg text-xs sm:text-sm text-muted-foreground">
            <p className="font-medium mb-1">DSGVO-Hinweis:</p>
            <p>
              Ihre Unternehmensdaten werden gemäß DSGVO geschützt und nur für die Nutzung der
              MyDispatch-App verwendet.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
