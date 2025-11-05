/* ==================================================================================
   CUSTOMER FORM - Wrapped UnifiedForm for Customers
   ================================================================================== */

import { UseFormReturn } from 'react-hook-form';
import { UnifiedForm, FormField } from '../UnifiedForm';
import { FORM_FIELDS_REGISTRY } from '@/config/form-fields-registry';
import { AddressInput } from '../AddressInput';

interface CustomerFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: unknown) => Promise<void>;
  mode?: 'inline' | 'dialog';
  portal?: 'entrepreneur' | 'customer' | 'driver';
  dialogOpen?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
  loading?: boolean;
}

export function CustomerForm({
  form,
  onSubmit,
  mode = 'dialog',
  portal = 'entrepreneur',
  dialogOpen,
  onDialogOpenChange,
  loading,
}: CustomerFormProps) {
  const { customer } = FORM_FIELDS_REGISTRY;

  const fields: FormField[] = [
    customer.salutation,
    customer.title,
    customer.firstName,
    customer.lastName,
    customer.birthDate,
    customer.email,
    customer.phone,
    customer.mobile,
    // Address fields (will be grouped)
    customer.street,
    customer.streetNumber,
    customer.postalCode,
    customer.city,
    // Business fields
    customer.taxId,
    customer.customerNumber,
    customer.creditLimit,
    customer.outstandingBalance,
    customer.paymentTerms,
    customer.notes,
    customer.hasPortalAccess,
  ];

  return (
    <UnifiedForm
      form={form}
      fields={fields}
      onSubmit={onSubmit}
      mode={mode}
      portal={portal}
      loading={loading}
      dialogOpen={dialogOpen}
      onDialogOpenChange={onDialogOpenChange}
      dialogTitle="Kunde bearbeiten"
      dialogDescription="Kundeninformationen verwalten"
      dialogSize="lg"
      fieldGroups={{
        address: {
          label: 'Adresse',
          fields: ['street', 'street_number', 'postal_code', 'city'],
          component: AddressInput,
          props: {
            street: form.watch('street') || '',
            streetNumber: form.watch('street_number') || '',
            postalCode: form.watch('postal_code') || '',
            city: form.watch('city') || '',
            onStreetChange: (value: string) => form.setValue('street', value),
            onStreetNumberChange: (value: string) => form.setValue('street_number', value),
            onPostalCodeChange: (value: string) => form.setValue('postal_code', value),
            onCityChange: (value: string) => form.setValue('city', value),
            required: true,
          },
        },
      }}
      resetOnSuccess
      closeOnSuccess
    />
  );
}
