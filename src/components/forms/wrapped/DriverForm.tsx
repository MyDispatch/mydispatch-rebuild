/* ==================================================================================
   DRIVER FORM - Wrapped UnifiedForm for Drivers
   ================================================================================== */

import type { UseFormReturn } from 'react-hook-form';
import type { FormField } from '../UnifiedForm';
import { UnifiedForm } from '../UnifiedForm';
import { FORM_FIELDS_REGISTRY } from '@/config/form-fields-registry';
import { AddressInput } from '../AddressInput';

interface DriverFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  mode?: 'inline' | 'dialog';
  portal?: 'entrepreneur' | 'customer' | 'driver';
  dialogOpen?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
  loading?: boolean;
}

export function DriverForm({
  form,
  onSubmit,
  mode = 'dialog',
  portal = 'entrepreneur',
  dialogOpen,
  onDialogOpenChange,
  loading,
}: DriverFormProps) {
  const { driver } = FORM_FIELDS_REGISTRY;

  const fields: FormField[] = [
    driver.salutation,
    driver.title,
    driver.firstName,
    driver.lastName,
    driver.birthDate,
    driver.email,
    driver.phone,
    driver.mobile,
    // Address fields (will be grouped)
    driver.street,
    driver.streetNumber,
    driver.postalCode,
    driver.city,
    // License fields (required)
    driver.licenseNumber,
    driver.licenseExpiry,
    driver.licenseClasses,
    // Optional license fields
    driver.taxiLicenseNumber,
    driver.taxiLicenseExpiry,
    driver.pScheinNumber,
    driver.pScheinExpiryDate,
    driver.medicalCertificateExpiry,
    // Employment & Status
    driver.employmentType,
    driver.shiftStatus,
    driver.notes,
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
      dialogTitle="Fahrer bearbeiten"
      dialogDescription="Fahrerinformationen verwalten"
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
