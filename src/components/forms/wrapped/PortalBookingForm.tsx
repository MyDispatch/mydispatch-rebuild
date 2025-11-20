/* ==================================================================================
   PORTAL BOOKING FORM - Simplified Booking Form for Customer Portal
   ==================================================================================
   ✅ Uses PORTAL_BOOKING_FIELDS from registry
   ✅ Simpler API than full BookingForm (no address splitting)
   ✅ Portal theming support
   ================================================================================== */

import { UseFormReturn } from "react-hook-form";
import { UnifiedForm, FormField } from "../UnifiedForm";
import { FORM_FIELDS_REGISTRY } from "@/config/form-fields-registry";

interface PortalBookingFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  mode?: "inline" | "dialog";
  portal?: "customer" | "entrepreneur";

  // Dialog props
  dialogOpen?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
  loading?: boolean;
}

export function PortalBookingForm({
  form,
  onSubmit,
  mode = "dialog",
  portal = "customer",
  dialogOpen,
  onDialogOpenChange,
  loading,
}: PortalBookingFormProps) {
  const { portalBooking } = FORM_FIELDS_REGISTRY;

  // Build simplified fields array for portal
  const fields: FormField[] = [
    portalBooking.pickupAddress,
    portalBooking.dropoffAddress,
    portalBooking.pickupTime,
    portalBooking.vehicleType,
    portalBooking.passengers,
    portalBooking.luggage,
    portalBooking.specialRequests,
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
      dialogTitle="Neue Buchung erstellen"
      dialogDescription="Geben Sie die Details für Ihre Buchung ein."
      dialogSize="lg"
      resetOnSuccess
      closeOnSuccess
    />
  );
}
