/* ==================================================================================
   DOCUMENT FORM - Wrapped UnifiedForm for Documents
   ================================================================================== */

import { UseFormReturn } from "react-hook-form";
import { UnifiedForm, FormField } from "../UnifiedForm";
import { FORM_FIELDS_REGISTRY } from "@/config/form-fields-registry";

interface DocumentFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  mode?: "inline" | "dialog";
  dialogOpen?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
  loading?: boolean;
}

export function DocumentForm({
  form,
  onSubmit,
  mode = "dialog",
  dialogOpen,
  onDialogOpenChange,
  loading,
}: DocumentFormProps) {
  const { document } = FORM_FIELDS_REGISTRY;

  const fields: FormField[] = [
    document.entityType,
    document.entityId,
    document.documentType,
    document.name,
    document.file,
    document.expiryDate,
    document.tags,
    document.notes,
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
      dialogTitle="Dokument hochladen"
      dialogDescription="Neues Dokument hinzufügen"
      dialogSize="md"
      resetOnSuccess
      closeOnSuccess
    />
  );
}
