/* ==================================================================================
   PERSON FORM - Wrapped UnifiedForm for Person Fields (Customers, Drivers, etc.)
   ==================================================================================
   ✅ Replaces PersonFormFields.tsx with UnifiedForm
   ✅ Uses PERSON_FIELDS from registry
   ✅ Support for both inline and dialog modes
   ================================================================================== */

import { UseFormReturn } from 'react-hook-form';
import { UnifiedForm, FormField } from '../UnifiedForm';
import { PERSON_FIELDS } from '@/config/form-fields-registry';

interface PersonFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  mode?: 'inline' | 'dialog';
  
  // Customization
  showExtendedFields?: boolean;
  requiredFields?: string[];
  
  // Dialog props
  dialogOpen?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
  dialogTitle?: string;
  dialogDescription?: string;
  
  loading?: boolean;
  submitLabel?: string;
}

export function PersonForm({
  form,
  onSubmit,
  mode = 'inline',
  showExtendedFields = true,
  requiredFields = ['first_name', 'last_name', 'email', 'phone'],
  dialogOpen,
  onDialogOpenChange,
  dialogTitle = 'Person bearbeiten',
  dialogDescription,
  loading,
  submitLabel = 'Speichern',
}: PersonFormProps) {
  // Base fields (always shown)
  const baseFields: FormField[] = [
    { ...PERSON_FIELDS.salutation, required: requiredFields.includes('salutation') },
    { ...PERSON_FIELDS.title },
    { ...PERSON_FIELDS.firstName, required: requiredFields.includes('first_name') },
    { ...PERSON_FIELDS.lastName, required: requiredFields.includes('last_name') },
    { ...PERSON_FIELDS.email, required: requiredFields.includes('email') },
    { ...PERSON_FIELDS.phone, required: requiredFields.includes('phone') },
  ];

  // Extended fields (optional)
  const extendedFields: FormField[] = showExtendedFields ? [
    { ...PERSON_FIELDS.mobile },
    { ...PERSON_FIELDS.birthDate },
    {
      name: 'address',
      label: 'Adresse',
      type: 'text',
      placeholder: 'Straße, Hausnummer, PLZ, Ort',
    },
    {
      name: 'notes',
      label: 'Notizen',
      type: 'textarea',
      placeholder: 'Interne Notizen...',
    },
  ] : [];

  const allFields = [...baseFields, ...extendedFields];

  return (
    <UnifiedForm
      form={form}
      fields={allFields}
      onSubmit={onSubmit}
      mode={mode}
      loading={loading}
      submitLabel={submitLabel}
      
      // Dialog props
      dialogOpen={dialogOpen}
      onDialogOpenChange={onDialogOpenChange}
      dialogTitle={dialogTitle}
      dialogDescription={dialogDescription}
      dialogSize="md"
      
      resetOnSuccess
      closeOnSuccess
    />
  );
}
