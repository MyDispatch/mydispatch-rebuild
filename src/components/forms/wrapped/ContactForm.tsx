/* ==================================================================================
   CONTACT FORM - Public Contact Form
   ================================================================================== */

import { UseFormReturn } from "react-hook-form";
import { UnifiedForm, FormField } from "../UnifiedForm";
import { FORM_FIELDS_REGISTRY } from "@/config/form-fields-registry";

interface ContactFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
}

export function ContactForm({ form, onSubmit, loading }: ContactFormProps) {
  const { contact } = FORM_FIELDS_REGISTRY;

  const fields: FormField[] = [
    contact.salutation,
    contact.title,
    contact.name,
    contact.email,
    contact.phone,
    contact.company,
    contact.subject,
    contact.message,
    contact.agbAccepted,
  ];

  return (
    <UnifiedForm
      form={form}
      fields={fields}
      onSubmit={onSubmit}
      mode="inline"
      loading={loading}
      submitLabel="Nachricht senden"
      resetOnSuccess
      className="text-left"
    />
  );
}
