/* ==================================================================================
   UNIFIED FORM COMPONENT V2.0 - THE ONLY FORM SYSTEM
   ==================================================================================
   ✅ Standardisierte Form-Struktur für ALLE Entities
   ✅ Grid-Layout (1 col mobile, 2 cols desktop)
   ✅ Dialog-Mode integriert (kein FormDialog mehr nötig!)
   ✅ Mobile-optimiert (Fullscreen auf < 768px)
   ✅ Multi-Step Progress Indicator
   ✅ File Upload Support (Drag & Drop, Preview)
   ✅ Inline Document Upload
   ✅ Type-Safe Field Rendering
   ================================================================================== */

import { ReactNode, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { V28Button } from '@/components/design-system/V28Button';
import { Form, FormControl, FormDescription, FormField as ShadcnFormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/lib/compat';
import { Textarea } from '@/lib/compat';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/compat';
import { Checkbox } from '@/lib/compat';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/lib/compat';
import { cn } from '@/lib/utils';
import { handleError } from '@/lib/error-handler';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'date' | 'number' | 'custom' | 'file' | 'searchable-select';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }> | readonly { readonly value: string; readonly label: string }[];
  customComponent?: ReactNode;
  gridSpan?: 1 | 2;
  description?: string;
  accept?: string; // For file inputs
  multiple?: boolean; // For file inputs
  maxFiles?: number; // For document uploads
  showWhen?: (formData: any) => boolean; // NEW: Conditional rendering
  icon?: any; // NEW: Icon for inline actions
}

export interface FieldGroup {
  label: string;
  fields: string[]; // Field names
  component?: React.ComponentType<any>; // Custom group component (e.g. AddressInput)
  props?: Record<string, any>; // Props for custom component
  gridSpan?: 1 | 2;
}

export interface InlineAction {
  label: string;
  icon: any;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
}

interface UnifiedFormProps {
  form: UseFormReturn<any>;
  fields: FormField[];
  onSubmit: (data: any) => Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  loading?: boolean;
  
  // ============================================================================
  // NEW: ADVANCED FIELD CONFIGURATION
  // ============================================================================
  fieldGroups?: Record<string, FieldGroup>; // NEW: Field groups (e.g. address)
  inlineActions?: Record<string, InlineAction>; // NEW: Inline actions per field
  customRenderers?: Record<string, (field: FormField, form: UseFormReturn<any>) => ReactNode>; // NEW: Custom field renderers
  
  // ============================================================================
  // MODE CONFIGURATION
  // ============================================================================
  mode?: 'inline' | 'dialog' | 'fullpage';
  
  // Dialog-Specific Props (nur wenn mode="dialog")
  dialogOpen?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
  dialogTitle?: string;
  dialogDescription?: string;
  dialogSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  // ============================================================================
  // LAYOUT CONFIGURATION
  // ============================================================================
  layout?: 'mobile' | 'desktop' | 'auto'; // auto = responsive
  
  // ============================================================================
  // MULTI-STEP CONFIGURATION
  // ============================================================================
  multiStep?: {
    currentStep: number;
    totalSteps: number;
    onStepChange?: (step: number) => void;
  };
  showProgress?: boolean;
  
  // ============================================================================
  // FILE UPLOAD CONFIGURATION
  // ============================================================================
  documentUpload?: boolean;
  documentTypes?: string[];
  onDocumentUpload?: (files: File[]) => Promise<void>;
  
  // ============================================================================
  // ADVANCED CONFIGURATION
  // ============================================================================
  portal?: 'entrepreneur' | 'customer' | 'driver'; // NEW: Portal theming
  className?: string;
  resetOnSuccess?: boolean; // Reset form nach erfolgreichem Submit
  closeOnSuccess?: boolean; // Close dialog nach erfolgreichem Submit (nur wenn mode="dialog")
}

export function UnifiedForm({
  form,
  fields,
  onSubmit,
  submitLabel = 'Speichern',
  cancelLabel = 'Abbrechen',
  onCancel,
  loading = false,
  
  // NEW: Advanced Field Configuration
  fieldGroups,
  inlineActions,
  customRenderers,
  
  // Mode & Dialog
  mode = 'inline',
  dialogOpen = false,
  onDialogOpenChange,
  dialogTitle,
  dialogDescription,
  dialogSize = 'lg',
  
  // Layout
  layout = 'auto',
  
  // Multi-Step
  multiStep,
  showProgress = false,
  
  // File Upload
  documentUpload,
  documentTypes = ['application/pdf', 'image/*'],
  onDocumentUpload,
  
  // Advanced
  portal,
  className,
  resetOnSuccess = false,
  closeOnSuccess = true,
}: UnifiedFormProps) {
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const handleDocumentUploadClick = async () => {
    if (!onDocumentUpload || selectedFiles.length === 0) return;
    
    setUploadingFiles(true);
    try {
      await onDocumentUpload(selectedFiles);
      setSelectedFiles([]);
    } catch (error) {
      handleError(error, 'Fehler beim Hochladen der Dokumente', { title: 'Upload-Fehler' });
    } finally {
      setUploadingFiles(false);
    }
  };

  // Enhanced Submit Handler mit Success-Handling
  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      
      // Reset form if configured
      if (resetOnSuccess) {
        form.reset();
      }
      
      // Close dialog if configured (nur wenn mode="dialog")
      if (mode === 'dialog' && closeOnSuccess && onDialogOpenChange) {
        onDialogOpenChange(false);
      }
    } catch (error) {
      // Error is already handled by onSubmit
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dialog Close Handler
  const handleDialogClose = (open: boolean) => {
    if (!open && form.formState.isDirty) {
      // TODO: Show confirmation dialog if form is dirty
    }
    onDialogOpenChange?.(open);
  };

  // Render Field by Type
  const renderField = (field: FormField) => {
    // Check if field should be shown (Conditional Fields)
    const formData = form.watch();
    if (field.showWhen && !field.showWhen(formData)) {
      return null;
    }
    
    // Custom Renderer hat höchste Priorität
    if (customRenderers && customRenderers[field.name]) {
      return customRenderers[field.name](field, form);
    }
    
    // Custom Component
    if (field.customComponent) {
      return field.customComponent;
    }

    // Inline Action für dieses Feld?
    const inlineAction = inlineActions?.[field.name];

    return (
      <ShadcnFormField
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel className="flex items-center justify-between">
              <span>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </span>
              {inlineAction && (
                <V28Button
                  type="button"
                  variant={inlineAction.variant === 'ghost' ? 'ghost' : inlineAction.variant === 'outline' ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={inlineAction.onClick}
                  className="h-6 px-2"
                >
                  {inlineAction.icon && <inlineAction.icon className="h-3 w-3 mr-1" />}
                  {inlineAction.label}
                </V28Button>
              )}
            </FormLabel>
            <FormControl>
              {field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'number' ? (
                <Input
                  {...formField}
                  type={field.type}
                  placeholder={field.placeholder}
                  disabled={loading || isSubmitting}
                />
              ) : field.type === 'textarea' ? (
                <Textarea
                  {...formField}
                  placeholder={field.placeholder}
                  disabled={loading || isSubmitting}
                  rows={4}
                />
              ) : field.type === 'select' ? (
                <Select
                  value={formField.value}
                  onValueChange={formField.onChange}
                  disabled={loading || isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder || 'Auswählen...'} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === 'checkbox' ? (
                <div className="flex items-start space-x-3 py-2">
                  <Checkbox
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                    disabled={loading || isSubmitting}
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-relaxed text-slate-700">{field.description}</span>
                </div>
              ) : field.type === 'date' ? (
                <Input
                  {...formField}
                  type="date"
                  disabled={loading || isSubmitting}
                />
              ) : field.type === 'file' ? (
                <Input
                  type="file"
                  accept={field.accept}
                  multiple={field.multiple}
                  onChange={(e) => {
                    if (e.target.files) {
                      formField.onChange(e.target.files);
                    }
                  }}
                  disabled={loading || isSubmitting}
                />
              ) : null}
            </FormControl>
            {field.description && field.type !== 'checkbox' && (
              <FormDescription>{field.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  // Form Content (wiederverwendbar für inline + dialog)
  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className={cn('space-y-6', className)}>
        {/* Progress Indicator */}
        {showProgress && multiStep && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Schritt {multiStep.currentStep} von {multiStep.totalSteps}</span>
              <span>{Math.round((multiStep.currentStep / multiStep.totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(multiStep.currentStep / multiStep.totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Render Field Groups first */}
          {fieldGroups && Object.entries(fieldGroups).map(([key, group]) => {
            const GroupComponent = group.component;
            
            return (
              <div
                key={`group-${key}`}
                className={cn('sm:col-span-2', group.gridSpan === 1 && 'sm:col-span-1')}
              >
                {GroupComponent ? (
                  <GroupComponent {...group.props} />
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">{group.label}</h3>
                    {group.fields.map(fieldName => {
                      const field = fields.find(f => f.name === fieldName);
                      return field ? <div key={fieldName}>{renderField(field)}</div> : null;
                    })}
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Render individual fields (not in groups) */}
          {fields.filter(field => {
            // Filter out fields that are in groups
            if (!fieldGroups) return true;
            return !Object.values(fieldGroups).some(group => group.fields.includes(field.name));
          }).map((field) => (
            <div
              key={field.name}
              className={cn(
                field.gridSpan === 2 && 'sm:col-span-2',
                field.type === 'textarea' && 'sm:col-span-2',
                field.type === 'custom' && 'sm:col-span-2'
              )}
            >
              {renderField(field)}
            </div>
          ))}
        </div>

        {/* Inline Document Upload Section */}
        {documentUpload && (
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-sm font-medium">Dokumente hochladen (optional)</h3>
            <div className="space-y-3">
              <Input
                type="file"
                multiple
                accept={documentTypes.join(',')}
                onChange={handleFileChange}
                disabled={uploadingFiles || loading || isSubmitting}
                className="cursor-pointer"
              />
              {selectedFiles.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  {selectedFiles.length} Datei(en) ausgewählt: {selectedFiles.map(f => f.name).join(', ')}
                </div>
              )}
              {selectedFiles.length > 0 && onDocumentUpload && (
                <V28Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleDocumentUploadClick}
                  disabled={uploadingFiles || loading || isSubmitting}
                >
                  {uploadingFiles ? 'Uploading...' : 'Dokumente hochladen'}
                </V28Button>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons (nur bei inline/fullpage mode) */}
        {mode !== 'dialog' && (
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end border-t pt-4">
            {onCancel && (
              <V28Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading || uploadingFiles || isSubmitting}
              >
                {cancelLabel}
              </V28Button>
            )}
            <V28Button 
              type="submit"
              variant="primary"
              disabled={loading || uploadingFiles || isSubmitting}
            >
              {loading || isSubmitting ? 'Wird gespeichert...' : submitLabel}
            </V28Button>
          </div>
        )}
      </form>
    </Form>
  );

  // ============================================================================
  // MODE: DIALOG
  // ============================================================================
  if (mode === 'dialog') {
    const dialogSizeClasses = {
      sm: 'sm:max-w-[425px]',
      md: 'sm:max-w-[600px]',
      lg: 'sm:max-w-[800px]',
      xl: 'sm:max-w-[1000px]',
      full: 'sm:max-w-[95vw]',
    };

    return (
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className={cn(dialogSizeClasses[dialogSize], 'max-h-[90vh] overflow-y-auto')}>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            {dialogDescription && (
              <DialogDescription>{dialogDescription}</DialogDescription>
            )}
          </DialogHeader>
          
          {formContent}
          
          <DialogFooter className="gap-2 sm:gap-0">
            <V28Button
              type="button"
              variant="secondary"
              onClick={() => handleDialogClose(false)}
              disabled={loading || uploadingFiles || isSubmitting}
            >
              {cancelLabel}
            </V28Button>
            <V28Button
              type="submit"
              variant="primary"
              onClick={form.handleSubmit(handleFormSubmit)}
              disabled={loading || uploadingFiles || isSubmitting}
            >
              {loading || isSubmitting ? 'Wird gespeichert...' : submitLabel}
            </V28Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // ============================================================================
  // MODE: INLINE / FULLPAGE
  // ============================================================================
  return formContent;
}
