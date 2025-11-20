/* ==================================================================================
   PAYMENT SETTINGS SECTION V18.3
   ==================================================================================
   Rechnungs-Nummernkreise, Zahlungsbedingungen, MwSt
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/lib/compat";
import { Checkbox } from "@/components/ui/checkbox";
import { useSettings } from "@/contexts/SettingsContext";

export function PaymentSettingsSection() {
  const { companyData, setCompanyData } = useSettings();

  const paymentMethodOptions = [
    { id: "cash", label: "Bar" },
    { id: "invoice", label: "Rechnung" },
    { id: "card", label: "Karte" },
    { id: "paypal", label: "PayPal" },
  ];

  const togglePaymentMethod = (method: string) => {
    const currentMethods = companyData.payment_methods || ["cash", "invoice"];
    const updated = currentMethods.includes(method)
      ? currentMethods.filter((m) => m !== method)
      : [...currentMethods, method];
    setCompanyData({ ...companyData, payment_methods: updated });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zahlungseinstellungen</CardTitle>
        <CardDescription>Konfigurieren Sie Rechnungs- und Zahlungsparameter</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoice_start_number">Rechnungs-Startnummer</Label>
            <Input
              id="invoice_start_number"
              type="number"
              value={companyData.invoice_start_number || 1001}
              onChange={(e) =>
                setCompanyData({ ...companyData, invoice_start_number: parseInt(e.target.value) })
              }
              className="min-h-[44px] touch-manipulation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote_start_number">Angebots-Startnummer</Label>
            <Input
              id="quote_start_number"
              type="number"
              value={companyData.quote_start_number || 1001}
              onChange={(e) =>
                setCompanyData({ ...companyData, quote_start_number: parseInt(e.target.value) })
              }
              className="min-h-[44px] touch-manipulation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_term_days">Zahlungsziel (Tage)</Label>
            <Input
              id="payment_term_days"
              type="number"
              value={companyData.payment_term_days || 14}
              onChange={(e) =>
                setCompanyData({ ...companyData, payment_term_days: parseInt(e.target.value) })
              }
              className="min-h-[44px] touch-manipulation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder_before_due_days">
              Zahlungserinnerung vor Fälligkeit (Tage)
            </Label>
            <Input
              id="reminder_before_due_days"
              type="number"
              value={companyData.reminder_before_due_days || 3}
              onChange={(e) =>
                setCompanyData({
                  ...companyData,
                  reminder_before_due_days: parseInt(e.target.value),
                })
              }
              className="min-h-[44px] touch-manipulation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount_term_days">Skonto-Frist (Tage)</Label>
            <Input
              id="discount_term_days"
              type="number"
              value={companyData.discount_term_days || 7}
              onChange={(e) =>
                setCompanyData({ ...companyData, discount_term_days: parseInt(e.target.value) })
              }
              className="min-h-[44px] touch-manipulation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount_percentage">Skonto-Prozentsatz (%)</Label>
            <Input
              id="discount_percentage"
              type="number"
              step="0.1"
              value={companyData.discount_percentage || 2}
              onChange={(e) =>
                setCompanyData({ ...companyData, discount_percentage: parseFloat(e.target.value) })
              }
              className="min-h-[44px] touch-manipulation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_vat_rate">Standard-MwSt.-Satz (%)</Label>
            <Input
              id="default_vat_rate"
              type="number"
              step="0.1"
              value={companyData.default_vat_rate || 19}
              onChange={(e) =>
                setCompanyData({ ...companyData, default_vat_rate: parseFloat(e.target.value) })
              }
              className="min-h-[44px] touch-manipulation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote_validity_days">Angebots-Gültigkeit (Tage)</Label>
            <Input
              id="quote_validity_days"
              type="number"
              value={companyData.quote_validity_days || 30}
              onChange={(e) =>
                setCompanyData({ ...companyData, quote_validity_days: parseInt(e.target.value) })
              }
              className="min-h-[44px] touch-manipulation"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Akzeptierte Zahlungsmethoden</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {paymentMethodOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`payment_${option.id}`}
                  checked={(companyData.payment_methods || ["cash", "invoice"]).includes(option.id)}
                  onCheckedChange={() => togglePaymentMethod(option.id)}
                />
                <Label htmlFor={`payment_${option.id}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
