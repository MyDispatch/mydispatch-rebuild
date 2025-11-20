/* ==================================================================================
   INVOICE FORM DIALOG - Vollständige Rechnungserstellung
   ==================================================================================
   - Manuelle Rechnungserstellung (nicht nur aus Aufträgen)
   - Kunde, Betrag, Fälligkeitsdatum, Notizen
   - TypeScript-sicher mit Validierung
   ================================================================================== */

import { useState, FormEvent } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { handleError, handleSuccess } from "@/lib/error-handler";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { V28Button } from "@/components/design-system/V28Button";
import { Input } from "@/lib/compat";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InlineCustomerForm } from "@/components/forms/InlineCustomerForm";
import { UserPlus, FileText } from "lucide-react";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
}

interface InvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customers: Customer[];
  onSuccess: () => void;
  onCustomerCreated?: () => void;
}

interface InvoiceFormData {
  customer_id: string;
  amount: string;
  due_date: string;
  description: string;
  invoice_number: string;
  payment_method: "bar" | "rechnung" | "ec_karte" | "kreditkarte";
}

export function InvoiceFormDialog({
  open,
  onOpenChange,
  customers,
  onSuccess,
  onCustomerCreated,
}: InvoiceFormDialogProps) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showInlineCustomerForm, setShowInlineCustomerForm] = useState(false);
  const [formData, setFormData] = useState<InvoiceFormData>({
    customer_id: "",
    amount: "",
    due_date: new Date().toISOString().split("T")[0],
    description: "",
    invoice_number: `RE-${Date.now().toString().substring(0, 8)}`,
    payment_method: "rechnung",
  });

  const handleChange = (field: keyof InvoiceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile?.company_id) {
      handleError(new Error("Kein Unternehmen gefunden"), "Fehler");
      return;
    }

    // Validierung
    if (!formData.customer_id) {
      handleError(new Error("Bitte wählen Sie einen Kunden"), "Validierungsfehler");
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      handleError(new Error("Bitte geben Sie einen gültigen Betrag ein"), "Validierungsfehler");
      return;
    }

    setLoading(true);
    try {
      // Erstelle eine Rechnung als Booking ohne echte Fahrt (manual_invoice = true)
      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            company_id: profile.company_id,
            customer_id: formData.customer_id,
            price: parseFloat(formData.amount),
            payment_status: "pending",
            payment_method: formData.payment_method,
            pickup_address: "Manuelle Rechnung",
            dropoff_address: formData.description || "-",
            pickup_time: new Date().toISOString(),
            status: "completed", // Rechnung ist direkt "abgeschlossen"
            notes: formData.description,
            is_manual_invoice: true, // Flag für manuelle Rechnungen
          },
        ])
        .select()
        .single();

      if (error) throw error;

      handleSuccess("Rechnung erfolgreich erstellt");
      onSuccess();
      onOpenChange(false);

      // Reset Form
      setFormData({
        customer_id: "",
        amount: "",
        due_date: new Date().toISOString().split("T")[0],
        description: "",
        invoice_number: `RE-${Date.now().toString().substring(0, 8)}`,
        payment_method: "rechnung",
      });
    } catch (error) {
      handleError(error, "Fehler beim Erstellen der Rechnung");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-foreground" />
            Neue Rechnung erstellen
          </DialogTitle>
          <DialogDescription>
            Erstellen Sie eine manuelle Rechnung für einen Kunden
          </DialogDescription>
        </DialogHeader>

        {showInlineCustomerForm ? (
          <InlineCustomerForm
            onCustomerCreated={(customerId) => {
              setFormData((prev) => ({ ...prev, customer_id: customerId }));
              setShowInlineCustomerForm(false);
              if (onCustomerCreated) onCustomerCreated();
            }}
            onCancel={() => setShowInlineCustomerForm(false)}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Kunde */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="customer_id">Kunde *</Label>
                <V28Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInlineCustomerForm(true)}
                  className="h-8"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Neu
                </V28Button>
              </div>
              <Select
                value={formData.customer_id}
                onValueChange={(value) => handleChange("customer_id", value)}
                required
              >
                <SelectTrigger id="customer_id">
                  <SelectValue placeholder="Kunde auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.first_name} {customer.last_name}
                      {customer.email && ` (${customer.email})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rechnungsnummer */}
            <div className="space-y-2">
              <Label htmlFor="invoice_number">Rechnungsnummer</Label>
              <Input
                id="invoice_number"
                value={formData.invoice_number}
                onChange={(e) => handleChange("invoice_number", e.target.value)}
                placeholder="RE-12345678"
                disabled
              />
              <p className="text-xs text-muted-foreground">Wird automatisch generiert</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Betrag */}
              <div className="space-y-2">
                <Label htmlFor="amount">Betrag (€) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>

              {/* Fälligkeitsdatum */}
              <div className="space-y-2">
                <Label htmlFor="due_date">Fälligkeitsdatum *</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => handleChange("due_date", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Zahlungsmethode */}
            <div className="space-y-2">
              <Label htmlFor="payment_method">Zahlungsmethode</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => handleChange("payment_method", value)}
              >
                <SelectTrigger id="payment_method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rechnung">Rechnung</SelectItem>
                  <SelectItem value="bar">Barzahlung</SelectItem>
                  <SelectItem value="ec_karte">EC-Karte</SelectItem>
                  <SelectItem value="kreditkarte">Kreditkarte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Beschreibung */}
            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung / Notizen</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Leistungsbeschreibung, Referenz, etc."
                rows={3}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <V28Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Abbrechen
              </V28Button>
              <V28Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Erstelle..." : "Rechnung erstellen"}
              </V28Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
