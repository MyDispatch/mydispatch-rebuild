/* ==================================================================================
   INLINE CUSTOMER CREATION: Für Auftragsformular
   ==================================================================================
   Erlaubt schnelle Kunden-Erstellung ohne Seitenwechsel
   ✅ V26: Verwendet CustomerForm wrapper (react-hook-form)
   ================================================================================== */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { CustomerForm } from './wrapped/CustomerForm';
import { V28Button } from '@/components/design-system/V28Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, X } from 'lucide-react';
import { handleError, handleSuccess } from '@/lib/error-handler';

// Zod Schema für Inline Customer Creation
const inlineCustomerSchema = z.object({
  salutation: z.enum(['Herr', 'Frau', 'Divers']).optional(),
  title: z.string().optional(),
  first_name: z.string().min(1, 'Vorname erforderlich'),
  last_name: z.string().min(1, 'Nachname erforderlich'),
  email: z.string().email('Ungültige E-Mail').optional().or(z.literal('')),
  phone: z.string().min(1, 'Telefon erforderlich'),
  street: z.string().optional(),
  street_number: z.string().optional(),
  postal_code: z.string().optional(),
  city: z.string().optional(),
  notes: z.string().optional(),
});

interface InlineCustomerFormProps {
  onCustomerCreated: (customerId: string) => void;
  onCancel: () => void;
}

export function InlineCustomerForm({ onCustomerCreated, onCancel }: InlineCustomerFormProps) {
  const { profile } = useAuth();

  const form = useForm({
    resolver: zodResolver(inlineCustomerSchema),
    defaultValues: {
      salutation: undefined,
      title: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      street: '',
      street_number: '',
      postal_code: '',
      city: '',
      notes: '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof inlineCustomerSchema>) => {
    if (!profile?.company_id) {
      handleError(new Error('Kein Unternehmen gefunden'), 'Kein Unternehmen gefunden');
      return;
    }

    try {
      const { data: customer, error } = await supabase
        .from('customers')
        .insert([{
          company_id: profile.company_id,
          salutation: data.salutation || null,
          title: data.title || null,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email || null,
          phone: data.phone || null,
          street: data.street || null,
          street_number: data.street_number || null,
          postal_code: data.postal_code || null,
          city: data.city || null,
          notes: data.notes || null,
        }])
        .select()
        .single();

      if (error) throw error;

      handleSuccess('Kunde erfolgreich angelegt');
      onCustomerCreated(customer.id);
    } catch (error) {
      handleError(error, 'Kunde konnte nicht angelegt werden');
    }
  };

  return (
    <Card className="border-primary">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-foreground" />
            <CardTitle className="text-lg">Neuen Kunden anlegen</CardTitle>
          </div>
          <V28Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </V28Button>
        </div>
        <CardDescription>
          Kunde wird direkt angelegt und für diesen Auftrag ausgewählt
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CustomerForm
          form={form}
          onSubmit={handleSubmit}
          mode="inline"
          portal="entrepreneur"
        />
        <div className="flex gap-2 pt-4">
          <V28Button 
            type="submit" 
            onClick={form.handleSubmit(handleSubmit)}
            disabled={form.formState.isSubmitting}
            variant="primary"
            className="flex-1"
          >
            {form.formState.isSubmitting ? 'Wird angelegt...' : 'Kunde anlegen'}
          </V28Button>
          <V28Button type="button" variant="secondary" onClick={onCancel}>
            Abbrechen
          </V28Button>
        </div>
      </CardContent>
    </Card>
  );
}
