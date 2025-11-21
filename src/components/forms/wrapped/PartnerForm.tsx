/* ==================================================================================
   PARTNER FORM - Wrapped UnifiedForm for Partners
   ================================================================================== */

import type { UseFormReturn } from 'react-hook-form';
import type { FormField } from '../UnifiedForm';
import { UnifiedForm } from '../UnifiedForm';
import { FORM_FIELDS_REGISTRY } from '@/config/form-fields-registry';

interface PartnerFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  mode?: 'inline' | 'dialog';
  dialogOpen?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
  loading?: boolean;
}

export function PartnerForm({
  form,
  onSubmit,
  mode = 'dialog',
  dialogOpen,
  onDialogOpenChange,
  loading,
}: PartnerFormProps) {
  const { partner } = FORM_FIELDS_REGISTRY;

  const fields: FormField[] = [
    partner.name,
    partner.email,
    partner.phone,
    partner.provisionPerBooking,
    partner.provisionPercentage,
    partner.onlineAccessEnabled,
    partner.notes,
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
      dialogTitle="Partner bearbeiten"
      dialogDescription="Partnerinformationen verwalten"
      dialogSize="md"
      resetOnSuccess
      closeOnSuccess
    />
  );
}
