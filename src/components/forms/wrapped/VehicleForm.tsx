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
    // Basic Vehicle Info
    vehicle.licensePlate,
    vehicle.concessionNumber,
    vehicle.vehicleClass,
    vehicle.vehicleStatus,

    // Vehicle Details (Task 10 - Lastenheft)
    vehicle.manufacturer,
    vehicle.model,
    vehicle.vin,
    vehicle.hsn,
    vehicle.tsn,
    vehicle.powerKw,
    vehicle.powerPs,
    vehicle.color,
    vehicle.buildYear,
    vehicle.firstRegistration,
    vehicle.mileage,

    // Compliance & Documents
    vehicle.tuvExpiry,
    vehicle.insuranceExpiry,
    vehicle.registrationDocumentUrl,
    vehicle.photos,

    // Capacity
    vehicle.capacityPassengers,
    vehicle.capacityLuggage,
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
      dialogSize="lg"
      resetOnSuccess
      closeOnSuccess
    />
  );
}
