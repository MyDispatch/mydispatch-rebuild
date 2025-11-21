/* ==================================================================================
   SHIFT FORM - Wrapped UnifiedForm for Shifts
   ================================================================================== */

import type { UseFormReturn } from 'react-hook-form';
import { User, Car } from 'lucide-react';
import type { FormField } from '../UnifiedForm';
import { UnifiedForm } from '../UnifiedForm';
import { FORM_FIELDS_REGISTRY } from '@/config/form-fields-registry';
import { SearchableSelect } from '@/components/ui/SearchableSelect';

interface ShiftFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  mode?: 'inline' | 'dialog';
  dialogOpen?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
  loading?: boolean;
  drivers?: Array<{ id: string; first_name: string; last_name: string }>;
  vehicles?: Array<{ id: string; license_plate: string; vehicle_type?: string }>;
}

export function ShiftForm({
  form,
  onSubmit,
  mode = 'dialog',
  dialogOpen,
  onDialogOpenChange,
  loading,
  drivers = [],
  vehicles = [],
}: ShiftFormProps) {
  const { shift } = FORM_FIELDS_REGISTRY;

  const fields: FormField[] = [
    shift.driver,
    shift.vehicle,
    shift.shiftDate,
    shift.startTime,
    shift.endTime,
    shift.notes,
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
      dialogTitle="Schicht bearbeiten"
      dialogDescription="Schichtinformationen verwalten"
      dialogSize="md"
      customRenderers={{
        driver_id: (field, formInstance) => (
          <SearchableSelect
            options={drivers.map(d => ({
              value: d.id,
              label: `${d.first_name} ${d.last_name}`,
              icon: User,
            }))}
            value={formInstance.watch(field.name)}
            onValueChange={(value) => formInstance.setValue(field.name, value)}
            placeholder="Fahrer auswählen..."
          />
        ),
        vehicle_id: (field, formInstance) => (
          <SearchableSelect
            options={vehicles.map(v => ({
              value: v.id,
              label: v.license_plate,
              description: v.vehicle_type,
              icon: Car,
            }))}
            value={formInstance.watch(field.name)}
            onValueChange={(value) => formInstance.setValue(field.name, value)}
            placeholder="Fahrzeug auswählen..."
          />
        ),
      }}
      resetOnSuccess
      closeOnSuccess
    />
  );
}
