/* ==================================================================================
   COST CENTER FORM - Wrapped UnifiedForm for Cost Centers
   ================================================================================== */

import type { UseFormReturn } from 'react-hook-form';
import type { FormField } from '../UnifiedForm';
import { UnifiedForm } from '../UnifiedForm';
import { FORM_FIELDS_REGISTRY } from '@/config/form-fields-registry';

interface CostCenterFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  mode?: 'inline' | 'dialog';
  dialogOpen?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
  loading?: boolean;
}

export function CostCenterForm({
  form,
  onSubmit,
  mode = 'dialog',
  dialogOpen,
  onDialogOpenChange,
  loading,
}: CostCenterFormProps) {
  const { costCenter } = FORM_FIELDS_REGISTRY;

  const fields: FormField[] = [
    costCenter.name,
    costCenter.description,
    costCenter.budget,
    costCenter.isActive,
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
      dialogTitle="Kostenstelle bearbeiten"
      dialogDescription="Kostenstelleninformationen verwalten"
      dialogSize="sm"
      resetOnSuccess
      closeOnSuccess
    />
  );
}
