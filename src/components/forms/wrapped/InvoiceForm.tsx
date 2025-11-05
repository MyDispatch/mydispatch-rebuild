/* ==================================================================================
   INVOICE FORM - Wrapped UnifiedForm for Invoices
   ================================================================================== */

import { UseFormReturn } from 'react-hook-form';
import { User } from 'lucide-react';
import { UnifiedForm, FormField } from '../UnifiedForm';
import { FORM_FIELDS_REGISTRY } from '@/config/form-fields-registry';
import { SearchableSelect } from '@/components/ui/SearchableSelect';

interface InvoiceFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: unknown) => Promise<void>;
  mode?: 'inline' | 'dialog';
  dialogOpen?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
  loading?: boolean;
  customers?: Array<{ id: string; first_name: string; last_name: string; email?: string }>;
}

export function InvoiceForm({
  form,
  onSubmit,
  mode = 'dialog',
  dialogOpen,
  onDialogOpenChange,
  loading,
  customers = [],
}: InvoiceFormProps) {
  const { invoice } = FORM_FIELDS_REGISTRY;

  const fields: FormField[] = [
    invoice.customer,
    invoice.bookingId,
    invoice.invoiceNumber,
    invoice.invoiceDate,
    invoice.dueDate,
    invoice.totalAmount,
    invoice.vatAmount,
    invoice.paymentMethod,
    invoice.paymentStatus,
    invoice.description,
    invoice.notes,
  ];

  return (
    <UnifiedForm
      form={form}
      fields={fields}
      onSubmit={onSubmit}
      mode={mode}
      loading={loading}
      dialogOpen={dialogOpen}
      onDialogOpenChange={onDialogOpenChange}
      dialogTitle="Rechnung erstellen"
      dialogDescription="Neue Rechnung anlegen"
      dialogSize="lg"
      customRenderers={{
        customer_id: (field, formInstance) => (
          <SearchableSelect
            options={customers.map(c => ({
              value: c.id,
              label: `${c.first_name} ${c.last_name}`,
              description: c.email,
              icon: User,
            }))}
            value={formInstance.watch(field.name)}
            onValueChange={(value) => formInstance.setValue(field.name, value)}
            placeholder="Kunde auswählen..."
          />
        ),
      }}
      resetOnSuccess
      closeOnSuccess
    />
  );
}
