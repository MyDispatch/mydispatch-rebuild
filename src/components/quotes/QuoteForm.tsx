import React from "react";
import { useForm } from "react-hook-form";
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuotes } from "@/hooks/use-quotes";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

const quoteSchema = z.object({
  customer_id: z.string().min(1, "Kunde erforderlich"),
  pickup_address: z.string().min(1, "Abholadresse erforderlich"),
  dropoff_address: z.string().min(1, "Zieladresse erforderlich"),
  pickup_time: z.string().min(1, "Abholzeit erforderlich"),
  price: z.number().min(0, "Preis muss positiv sein"),
  notes: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

interface QuoteFormProps {
  quoteId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function QuoteForm({ quoteId, onSuccess, onCancel }: QuoteFormProps) {
  const { toast } = useToast();
  const { profile } = useAuth();
  const quotesHook = useQuotes();

  // ⚠️ SECURITY: Multi-tenant customer query with company_id filter
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
      return data as unknown as Array<{
        id: string;
        first_name: string;
        last_name: string;
        company_name?: string;
      }>;
    },
    enabled: !!profile?.company_id,
  });

  // ⚠️ SECURITY: Multi-tenant quote fetch with company_id filter
  const { data: quote } = useQuery({
    queryKey: ['quote', quoteId, profile?.company_id],
    queryFn: async () => {
      if (!quoteId || !profile?.company_id) return null;

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', quoteId)
        .eq('company_id', profile.company_id)
        .eq('is_offer', true)
        .single();
      if (error) throw error;
      return data as unknown as {
        id: string;
        customer_id: string;
        pickup_address: string;
        dropoff_address: string;
        pickup_time: string;
        price: number;
        notes?: string;
      };
    },
    enabled: !!quoteId && !!profile?.company_id,
  });

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      pickup_time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      price: 0,
    },
  });

  // Load quote data when editing
  React.useEffect(() => {
    if (!quote) {
      return;
    }
    
    if (typeof quote !== 'object' || !('customer_id' in quote)) {
      return;
    }
    
    form.reset({
      customer_id: quote.customer_id,
      pickup_address: quote.pickup_address,
      dropoff_address: quote.dropoff_address,
      pickup_time: format(new Date(quote.pickup_time), "yyyy-MM-dd'T'HH:mm"),
      price: quote.price || 0,
      notes: quote.notes || '',
    });
  }, [quote, form]);

  const onSubmit = async (data: QuoteFormData) => {
    // ⚠️ SECURITY: Guard against missing company_id
    if (!profile?.company_id) {
      toast({
        title: 'Fehler',
        description: 'Unternehmensinformationen fehlen. Bitte melden Sie sich erneut an.',
        variant: 'destructive',
      });
      return;
    }

    if (quoteId) {
      quotesHook.updateQuote(
        { id: quoteId, ...data },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    } else {
      quotesHook.createQuote(
        {
          ...data,
          offer_status: 'pending',
          booking_status: 'pending',
        },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Customer Selection */}
      <div className="space-y-2">
        <Label htmlFor="customer_id">Kunde *</Label>
        <Select
          value={form.watch('customer_id')}
          onValueChange={(value) => form.setValue('customer_id', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Kunde auswählen..." />
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
          <p className="text-sm text-red-600">{form.formState.errors.customer_id.message}</p>
        )}
      </div>

      {/* Pickup Address */}
      <div className="space-y-2">
        <Label htmlFor="pickup_address">Abholadresse *</Label>
        <Input
          {...form.register('pickup_address')}
          placeholder="z.B. Hauptstraße 1, 12345 Berlin"
        />
        {form.formState.errors.pickup_address && (
          <p className="text-sm text-red-600">{form.formState.errors.pickup_address.message}</p>
        )}
      </div>

      {/* Dropoff Address */}
      <div className="space-y-2">
        <Label htmlFor="dropoff_address">Zieladresse *</Label>
        <Input
          {...form.register('dropoff_address')}
          placeholder="z.B. Bahnhofstraße 10, 54321 München"
        />
        {form.formState.errors.dropoff_address && (
          <p className="text-sm text-red-600">{form.formState.errors.dropoff_address.message}</p>
        )}
      </div>

      {/* Pickup Time */}
      <div className="space-y-2">
        <Label htmlFor="pickup_time">Abholzeit *</Label>
        <Input
          type="datetime-local"
          {...form.register('pickup_time')}
        />
        {form.formState.errors.pickup_time && (
          <p className="text-sm text-red-600">{form.formState.errors.pickup_time.message}</p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Preis (€) *</Label>
        <Input
          type="number"
          step="0.01"
          {...form.register('price', { valueAsNumber: true })}
          placeholder="0.00"
        />
        {form.formState.errors.price && (
          <p className="text-sm text-red-600">{form.formState.errors.price.message}</p>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notizen</Label>
        <Textarea
          {...form.register('notes')}
          placeholder="Zusätzliche Informationen zum Angebot..."
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
        <V28Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={quotesHook.isCreating || quotesHook.isUpdating}
        >
          Abbrechen
        </V28Button>
        <V28Button
          type="submit"
          variant="primary"
          disabled={form.formState.isSubmitting || quotesHook.isCreating || quotesHook.isUpdating || !profile?.company_id}
        >
          {(form.formState.isSubmitting || quotesHook.isCreating || quotesHook.isUpdating) ? 'Speichere...' : quoteId ? 'Aktualisieren' : 'Erstellen'}
        </V28Button>
      </div>
    </form>
  );
}
