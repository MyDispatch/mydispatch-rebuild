/* ==================================================================================
   VEHICLE FORM - Wrapped UnifiedForm for Vehicles
   ================================================================================== */

import type { UseFormReturn } from 'react-hook-form';
import type { FormField } from '../UnifiedForm';
import { UnifiedForm } from '../UnifiedForm';
import { FORM_FIELDS_REGISTRY } from '@/config/form-fields-registry';

interface VehicleFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  mode?: 'inline' | 'dialog';
  portal?: 'entrepreneur' | 'customer' | 'driver';
  dialogOpen?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
  loading?: boolean;
}

export function VehicleForm({
  form,
  onSubmit,
  mode = 'dialog',
  portal = 'entrepreneur',
  dialogOpen,
  onDialogOpenChange,
  loading,
}: VehicleFormProps) {
  const { vehicle } = FORM_FIELDS_REGISTRY;

  const fields: FormField[] = [
    vehicle.licensePlate,
    vehicle.concessionNumber,
    vehicle.vehicleClass,
    vehicle.manufacturer,
    vehicle.model,
    vehicle.year,
    vehicle.tuvExpiry,
    vehicle.insuranceExpiry,
    vehicle.capacityPassengers,
    vehicle.capacityLuggage,
    vehicle.vehicleStatus,
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
      dialogTitle="Fahrzeug bearbeiten"
      dialogDescription="Fahrzeuginformationen verwalten"
      dialogSize="md"
      resetOnSuccess
      closeOnSuccess
    />
  );
}
