/* ==================================================================================
   BOOKING FORM - Wrapped UnifiedForm for Bookings
   ==================================================================================
   ✅ Uses FORM_FIELDS_REGISTRY
   ✅ Conditional Fields (Airport, Train, Partner)
   ✅ Field Groups (Pickup Address, Dropoff Address)
   ✅ Inline Actions (New Customer)
   ✅ Custom Renderers (SearchableSelect for Customer/Driver/Vehicle)
   ✅ Portal Theming Support
   ================================================================================== */

import type { UseFormReturn } from 'react-hook-form';
import { UserPlus, Car, User } from 'lucide-react';
import type { FormField } from '../UnifiedForm';
import { UnifiedForm } from '../UnifiedForm';
import { FORM_FIELDS_REGISTRY } from '@/config/form-fields-registry';
import { AddressInput } from '../AddressInput';
import { SearchableSelect } from '@/components/ui/SearchableSelect';

interface BookingFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  mode?: 'inline' | 'dialog';
  portal?: 'entrepreneur' | 'customer' | 'driver';
  
  // Data for selects
  customers?: Array<{ id: string; first_name: string; last_name: string; email?: string }>;
  drivers?: Array<{ id: string; first_name: string; last_name: string; status?: string }>;
  vehicles?: Array<{ id: string; license_plate: string; vehicle_type?: string }>;
  partners?: Array<{ id: string; name: string }>;
  costCenters?: Array<{ id: string; name: string }>;
  
  // Callbacks
  onCreateCustomer?: () => void;
  
  // Dialog props
  dialogOpen?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
  loading?: boolean;
}

export function BookingForm({
  form,
  onSubmit,
  mode = 'dialog',
  portal = 'entrepreneur',
  customers = [],
  drivers = [],
  vehicles = [],
  partners = [],
  costCenters = [],
  onCreateCustomer,
  dialogOpen,
  onDialogOpenChange,
  loading,
}: BookingFormProps) {
  const { booking } = FORM_FIELDS_REGISTRY;

  // Build fields array from registry
  const fields: FormField[] = [
    booking.customer,
    booking.pickupDate,
    booking.pickupTime,
    // Pickup Address fields (will be grouped)
    booking.pickupStreet,
    booking.pickupStreetNumber,
    booking.pickupPostalCode,
    booking.pickupCity,
    // Dropoff Address fields (will be grouped)
    booking.dropoffStreet,
    booking.dropoffStreetNumber,
    booking.dropoffPostalCode,
    booking.dropoffCity,
    booking.passengers,
    booking.luggage,
    booking.vehicleType,
    booking.specialRequests,
    // Conditional: Airport Service
    booking.isAirportPickup,
    booking.flightNumber,
    booking.terminal,
    booking.airportArrivalTime,
    booking.airportWaitTime,
    booking.airportMeetAndGreet,
    booking.airportNameSign,
    // Conditional: Train Service
    booking.isTrainStationPickup,
    booking.trainNumber,
    // Note: Train service reuses airport fields (arrival_time, wait_time, meet_and_greet, name_sign)
    // Conditional: Partner
    booking.isPartnerBooking,
    booking.partnerId,
    booking.partnerProvisionManual,
    // Disposition
    booking.assignmentType,
    booking.driver,
    booking.vehicle,
    booking.costCenter,
    booking.status,
    // Payment (Updated for Migration 20251122000009: MwSt-Felder)
    booking.price,
    booking.vatRate, // Now dropdown: 0%, 7%, 19%
    booking.priceIncludesVat, // New: Inkl./Exkl. toggle
    booking.priceNet, // Auto-calculated (readonly)
    booking.vatAmount, // Auto-calculated (readonly)
    booking.paymentStatus,
    booking.paymentMethod,
  ];

  return (
    <UnifiedForm
      form={form}
      fields={fields}
      onSubmit={onSubmit}
      mode={mode}
      portal={portal}
      loading={loading}
      
      // Dialog props
      dialogOpen={dialogOpen}
      onDialogOpenChange={onDialogOpenChange}
      dialogTitle="Neuer Auftrag"
      dialogDescription="Erstellen Sie einen neuen Buchungsauftrag"
      dialogSize="xl"
      
      // Field Groups
      fieldGroups={{
        pickupAddress: {
          label: 'Abholadresse',
          fields: ['pickupStreet', 'pickupStreetNumber', 'pickupPostalCode', 'pickupCity'],
          component: AddressInput,
          props: {
            street: form.watch('pickupStreet') || '',
            streetNumber: form.watch('pickupStreetNumber') || '',
            postalCode: form.watch('pickupPostalCode') || '',
            city: form.watch('pickupCity') || '',
            onStreetChange: (value: string) => form.setValue('pickupStreet', value),
            onStreetNumberChange: (value: string) => form.setValue('pickupStreetNumber', value),
            onPostalCodeChange: (value: string) => form.setValue('pickupPostalCode', value),
            onCityChange: (value: string) => form.setValue('pickupCity', value),
            required: true,
          },
        },
        dropoffAddress: {
          label: 'Zieladresse',
          fields: ['dropoffStreet', 'dropoffStreetNumber', 'dropoffPostalCode', 'dropoffCity'],
          component: AddressInput,
          props: {
            street: form.watch('dropoffStreet') || '',
            streetNumber: form.watch('dropoffStreetNumber') || '',
            postalCode: form.watch('dropoffPostalCode') || '',
            city: form.watch('dropoffCity') || '',
            onStreetChange: (value: string) => form.setValue('dropoffStreet', value),
            onStreetNumberChange: (value: string) => form.setValue('dropoffStreetNumber', value),
            onPostalCodeChange: (value: string) => form.setValue('dropoffPostalCode', value),
            onCityChange: (value: string) => form.setValue('dropoffCity', value),
            required: true,
          },
        },
      }}
      
      // Inline Actions
      inlineActions={onCreateCustomer ? {
        customer: {
          label: 'Neu',
          icon: UserPlus,
          onClick: onCreateCustomer,
          variant: 'ghost',
        },
      } : undefined}
      
      // Custom Renderers
      customRenderers={{
        customer: (field, formInstance) => (
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
            portal={portal}
          />
        ),
        driver_id: (field, formInstance) => (
          <SearchableSelect
            options={drivers.map(d => ({
              value: d.id,
              label: `${d.first_name} ${d.last_name}`,
              description: d.status,
              icon: User,
            }))}
            value={formInstance.watch(field.name)}
            onValueChange={(value) => formInstance.setValue(field.name, value)}
            placeholder="Fahrer auswählen..."
            portal={portal}
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
            portal={portal}
          />
        ),
      }}
      
      resetOnSuccess
      closeOnSuccess
    />
  );
}
