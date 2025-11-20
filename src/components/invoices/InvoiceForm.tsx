import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Calendar } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { de } from "date-fns/locale";

const invoiceSchema = z.object({
  customer_id: z.string().min(1, "Kunde erforderlich"),
  invoice_date: z.string(),
  due_date: z.string(),
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]),
  payment_method: z.string().optional(),
  internal_notes: z.string().optional(),
  currency: z.string().default("EUR"),
  vat_rate: z.number().default(19),
  items: z.array(
    z.object({
      description: z.string().min(1, "Beschreibung erforderlich"),
      quantity: z.number().min(1, "Mindestens 1"),
      unit_price: z.number().min(0, "Preis muss positiv sein"),
    })
  ).min(1, "Mindestens eine Position erforderlich"),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  invoiceId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  company_name?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
}

interface Invoice {
  id: string;
  customer_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  payment_method?: string;
  internal_notes?: string;
  currency: string;
  invoice_items?: InvoiceItem[];
}

interface Profile {
  company_id: string;
}

export function InvoiceForm({ invoiceId, onSuccess, onCancel }: InvoiceFormProps) {
  const { toast } = useToast();
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [totalAmount, setTotalAmount] = useState(0);

  // ⚠️ SECURITY FIX: Multi-tenant customer query with company_id filter
  const { data: customers } = useQuery({
    queryKey: ['customers', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) {
        return [];
      }

      const { data, error } = await supabase
        .from('customers')
        .select('id, first_name, last_name, company_name')
        .eq('company_id', profile.company_id)
        .eq('archived', false)
        .order('last_name');
      if (error) throw error;
      return data as unknown as Customer[];
    },
    enabled: !!profile?.company_id,
  });

  // Fetch invoice if editing
  const { data: invoice } = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: async () => {
      if (!invoiceId) return null;
      const { data, error } = await supabase
        .from('invoices')
        .select('*, invoice_items(*)')
        .eq('id', invoiceId)
        .single();
      if (error) throw error;
      return data as unknown as Invoice;
    },
    enabled: !!invoiceId,
  });

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoice_date: format(new Date(), 'yyyy-MM-dd'),
      due_date: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      status: "draft",
      currency: "EUR",
      vat_rate: 19,
      items: [{ description: "", quantity: 1, unit_price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Load invoice data when editing
  useEffect(() => {
    if (invoice) {
      form.reset({
        customer_id: invoice.customer_id,
        invoice_date: format(new Date(invoice.invoice_date), 'yyyy-MM-dd'),
        due_date: format(new Date(invoice.due_date), 'yyyy-MM-dd'),
        status: invoice.status,
        payment_method: invoice.payment_method || undefined,
        internal_notes: invoice.internal_notes || undefined,
        currency: invoice.currency,
        vat_rate: 19, // Default VAT rate
        items: invoice.invoice_items?.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })) || [{ description: "", quantity: 1, unit_price: 0 }],
      });
    }
  }, [invoice, form]);

  // Calculate totals
  useEffect(() => {
    const items = form.watch('items');
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.quantity * item.unit_price);
    }, 0);
    const vatRate = form.watch('vat_rate') || 19;
    const total = subtotal * (1 + vatRate / 100);
    setTotalAmount(total);
  }, [form.watch('items'), form.watch('vat_rate')]);

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: InvoiceFormData) => {
      const { data: profile } = (await supabase
        .from('profiles')
        .select('company_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single()) as unknown as { data: Profile | null };

      if (!profile) throw new Error("Profil nicht gefunden");

      // Calculate amounts
      const subtotal = data.items.reduce((sum, item) => 
        sum + (item.quantity * item.unit_price), 0
      );
      const vatAmount = subtotal * (data.vat_rate / 100);
      const total = subtotal + vatAmount;

      // Generate invoice number if new
      let invoiceNumber = invoice?.invoice_number;
      if (!invoiceId) {
        const { count } = await supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', profile.company_id);
        invoiceNumber = `RE-${(count || 0) + 1001}`;
      }

      interface InvoiceInsertData {
        company_id: string;
        customer_id: string;
        invoice_number: string | undefined;
        invoice_date: string;
        due_date: string;
        status: string;
        payment_method?: string;
        internal_notes?: string;
        currency: string;
        subtotal: number;
        tax_amount: number;
        total_amount: number;
        created_by?: string;
      }
      
      const invoiceData: InvoiceInsertData = {
        company_id: profile.company_id,
        customer_id: data.customer_id,
        invoice_number: invoiceNumber,
        invoice_date: data.invoice_date,
        due_date: data.due_date,
        status: data.status,
        payment_method: data.payment_method,
        internal_notes: data.internal_notes,
        currency: data.currency,
        subtotal: subtotal,
        tax_amount: vatAmount,
        total_amount: total,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      };

      let savedInvoiceId = invoiceId;

      if (invoiceId) {
        // Update existing invoice
        const { error } = await supabase
          .from('invoices')
          .update(invoiceData)
          .eq('id', invoiceId);
        if (error) throw error;

        // Archive old items (Soft-Delete workaround - delete then recreate)
        await supabase
          .from('invoice_items')
          .delete()
          .eq('invoice_id', invoiceId);
      } else {
        // Create new invoice
        const { data: newInvoice, error } = (await supabase
          .from('invoices')
          .insert([invoiceData])
          .select()
          .single()) as unknown as { data: { id: string } | null; error: any };
        if (error) throw error;
        if (!newInvoice) throw new Error("Invoice konnte nicht erstellt werden");
        savedInvoiceId = newInvoice.id;
      }

      // Insert items
      const itemsData = data.items.map((item, index) => ({
        invoice_id: savedInvoiceId,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.quantity * item.unit_price,
        position: index + 1,
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsData);
      if (itemsError) throw itemsError;

      return savedInvoiceId;
    },
    onSuccess: () => {
      toast({
        title: invoiceId ? "Rechnung aktualisiert" : "Rechnung erstellt",
        description: "Die Rechnung wurde erfolgreich gespeichert.",
      });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: error instanceof Error ? error.message : "Rechnung konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    },
  });

  return (
    <form onSubmit={form.handleSubmit((data) => saveMutation.mutate(data))} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rechnungsdetails</CardTitle>
          <CardDescription>Grundlegende Informationen zur Rechnung</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_id">Kunde *</Label>
              <Select
                value={form.watch('customer_id')}
                onValueChange={(value) => form.setValue('customer_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kunde auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {customers?.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.company_name || `${customer.first_name} ${customer.last_name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.customer_id && (
                <p className="text-sm text-destructive">{form.formState.errors.customer_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.watch('status')}
                onValueChange={(value) => form.setValue('status', value as "draft" | "sent" | "paid" | "overdue" | "cancelled")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Entwurf</SelectItem>
                  <SelectItem value="sent">Versendet</SelectItem>
                  <SelectItem value="paid">Bezahlt</SelectItem>
                  <SelectItem value="overdue">Überfällig</SelectItem>
                  <SelectItem value="cancelled">Storniert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice_date">Rechnungsdatum</Label>
              <Input
                id="invoice_date"
                type="date"
                {...form.register('invoice_date')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Fälligkeitsdatum</Label>
              <Input
                id="due_date"
                type="date"
                {...form.register('due_date')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vat_rate">MwSt.-Satz (%)</Label>
              <Input
                id="vat_rate"
                type="number"
                {...form.register('vat_rate', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_method">Zahlungsmethode</Label>
              <Select
                value={form.watch('payment_method')}
                onValueChange={(value) => form.setValue('payment_method', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Zahlungsmethode wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Bar</SelectItem>
                  <SelectItem value="invoice">Rechnung</SelectItem>
                  <SelectItem value="card">Karte</SelectItem>
                  <SelectItem value="transfer">Überweisung</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="internal_notes">Interne Notizen</Label>
            <Textarea
              id="internal_notes"
              {...form.register('internal_notes')}
              placeholder="Interne Notizen..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Rechnungspositionen</CardTitle>
              <CardDescription>Fügen Sie Positionen zur Rechnung hinzu</CardDescription>
            </div>
            <V28Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => append({ description: "", quantity: 1, unit_price: 0 })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Position hinzufügen
            </V28Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-start border-b pb-4 last:border-0">
              <div className="flex-1 space-y-2">
                <Label>Beschreibung *</Label>
                <Input
                  {...form.register(`items.${index}.description`)}
                  placeholder="Leistungsbeschreibung"
                />
                {form.formState.errors.items?.[index]?.description && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.items[index]?.description?.message}
                  </p>
                )}
              </div>

              <div className="w-24 space-y-2">
                <Label>Menge *</Label>
                <Input
                  type="number"
                  {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                  min="1"
                />
              </div>

              <div className="w-32 space-y-2">
                <Label>Einzelpreis *</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...form.register(`items.${index}.unit_price`, { valueAsNumber: true })}
                  min="0"
                />
              </div>

              <div className="w-32 space-y-2">
                <Label>Gesamt</Label>
                <div className="h-10 flex items-center font-semibold text-foreground">
                  {new Intl.NumberFormat('de-DE', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  }).format(
                    (form.watch(`items.${index}.quantity`) || 0) * 
                    (form.watch(`items.${index}.unit_price`) || 0)
                  )}
                </div>
              </div>

              {fields.length > 1 && (
                <V28Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="mt-8"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </V28Button>
              )}
            </div>
          ))}

          <Separator />

          <div className="space-y-2 max-w-sm ml-auto">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Zwischensumme:</span>
              <span className="font-medium text-foreground">
                {new Intl.NumberFormat('de-DE', { 
                  style: 'currency', 
                  currency: 'EUR' 
                }).format(
                  form.watch('items').reduce((sum, item) => 
                    sum + (item.quantity * item.unit_price), 0
                  )
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">MwSt. ({form.watch('vat_rate')}%):</span>
              <span className="font-medium text-foreground">
                {new Intl.NumberFormat('de-DE', { 
                  style: 'currency', 
                  currency: 'EUR' 
                }).format(
                  form.watch('items').reduce((sum, item) => 
                    sum + (item.quantity * item.unit_price), 0
                  ) * (form.watch('vat_rate') / 100)
                )}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-foreground">Gesamtsumme:</span>
              <span className="text-foreground">
                {new Intl.NumberFormat('de-DE', { 
                  style: 'currency', 
                  currency: 'EUR' 
                }).format(totalAmount)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <V28Button type="button" variant="secondary" onClick={onCancel}>
          Abbrechen
        </V28Button>
        <V28Button type="submit" variant="primary" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? "Speichern..." : (invoiceId ? "Aktualisieren" : "Erstellen")}
        </V28Button>
      </div>
    </form>
  );
}
