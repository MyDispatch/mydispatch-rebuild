import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useDocuments } from '@/hooks/use-documents';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/db';
import { V28Button } from '@/components/design-system/V28Button';
import { Input } from '@/lib/compat';
import { handleError, handleSuccess } from '@/lib/error-handler';
import { logger } from '@/lib/logger';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useSubscription } from '@/hooks/use-subscription';
import { isEnterpriseTier } from '@/lib/subscription-utils';

const documentSchema = z.object({
  entity_type: z.enum(['driver', 'vehicle', 'customer']),
  entity_id: z.string().min(1, 'Bitte wählen Sie eine Entität'),
  document_type: z.enum(['fuehrerschein', 'p_schein', 'fahrzeugschein', 'tuev', 'versicherung', 'sonstiges']),
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein'),
  file: z.any().refine((file) => file?.length > 0, 'Bitte wählen Sie eine Datei'),
  expiry_date: z.date().optional(),
  tags: z.string().optional(),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

interface DocumentUploadFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  entities?: { drivers: Database['public']['Tables']['drivers']['Row'][]; vehicles: Database['public']['Tables']['vehicles']['Row'][]; customers: Database['public']['Tables']['customers']['Row'][]; };
  onUploadComplete?: (extractedData?: Record<string, unknown>) => void;
}

export function DocumentUploadForm({ onSuccess, onCancel, entities, onUploadComplete }: DocumentUploadFormProps) {
  const { profile } = useAuth();
  const { productId } = useSubscription();
  const { createDocument } = useDocuments();
  const [uploading, setUploading] = useState(false);
  const [processingOCR, setProcessingOCR] = useState(false);
  
  // Enterprise-Check für OCR
  const isEnterprise = productId ? isEnterpriseTier(productId) : false;
  
  // OCR-fähige Dokument-Typen
  const ocrSupportedTypes = ['fuehrerschein', 'tuev', 'versicherung'];

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      entity_type: 'driver',
      entity_id: '',
      document_type: 'fuehrerschein',
      name: '',
      tags: '',
    },
  });

  const selectedEntityType = form.watch('entity_type');

  const getEntityOptions = () => {
    if (!entities) return [];
    
    switch (selectedEntityType) {
      case 'driver':
        return entities.drivers.map((d) => ({
          value: d.id,
          label: `${d.first_name} ${d.last_name}`,
        }));
      case 'vehicle':
        return entities.vehicles.map((v) => ({
          value: v.id,
          label: v.license_plate,
        }));
      case 'customer':
        return entities.customers.map((c) => ({
          value: c.id,
          label: `${c.first_name} ${c.last_name}`,
        }));
      default:
        return [];
    }
  };

  const onSubmit = async (values: DocumentFormValues) => {
    try {
      setUploading(true);

      if (!profile?.company_id) {
        handleError(null, 'Unternehmensinformationen fehlen.', { title: 'Fehler' });
        return;
      }

      // Datei aus Input holen
      const file = values.file?.[0];
      if (!file) {
        handleError(null, 'Bitte wählen Sie eine Datei aus.', { title: 'Fehler' });
        return;
      }

      // Datei in Supabase Storage hochladen
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${profile.company_id}/${values.entity_type}/${values.entity_id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Public URL generieren
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Dokument in Datenbank speichern
      const documentData = {
        company_id: profile.company_id,
        entity_type: values.entity_type,
        entity_id: values.entity_id,
        document_type: values.document_type,
        name: values.name,
        file_url: publicUrl,
        expiry_date: values.expiry_date ? format(values.expiry_date, 'yyyy-MM-dd') : null,
        tags: values.tags ? values.tags.split(',').map((t) => t.trim()) : null,
      };

      // ✅ MISSION II: TanStack Query Hook statt direktem Supabase-Call (FIXED: await)
      await createDocument(documentData);

      // Enterprise: AI-OCR für unterstützte Dokumenttypen
      if (isEnterprise && ocrSupportedTypes.includes(values.document_type)) {
        try {
          setProcessingOCR(true);
          logger.debug('[DocumentUploadForm] Starting OCR', { documentType: values.document_type });
          
          // OCR-Type-Mapping
          const ocrTypeMap: Record<string, string> = {
            'fuehrerschein': 'driving_license',
            'tuev': 'tuev_report',
            'versicherung': 'insurance_policy'
          };
          
          const ocrType = ocrTypeMap[values.document_type];
          
          const { data: ocrData, error: ocrError } = await supabase.functions.invoke('ai-document-ocr', {
            body: { 
              document_type: ocrType,
              image_url: publicUrl
            }
          });
          
          if (!ocrError && ocrData && ocrData.confidence > 0.7) {
            logger.info('[DocumentUploadForm] OCR Success', { confidence: ocrData?.confidence });
            
            // Auto-Fill via Callback
            if (onUploadComplete) {
              onUploadComplete(ocrData.extracted_data);
            }
            
            const confidencePercent = Math.round(ocrData.confidence * 100);
            handleSuccess(
              `Dokument hochgeladen und Daten automatisch erkannt (${confidencePercent}% Genauigkeit).`,
              'OCR Erfolgreich'
            );
          } else {
            logger.warn('[DocumentUploadForm] OCR low confidence', { confidence: ocrData?.confidence });
            handleSuccess('Dokument wurde hochgeladen.', 'Erfolgreich');
          }
        } catch (ocrError) {
          logger.error('[DocumentUploadForm] OCR Error', ocrError as Error, {
            component: 'DocumentUploadForm',
            action: 'processOCR'
          });
          // Fallback: Normaler Upload war erfolgreich
          handleSuccess('Dokument wurde hochgeladen.', 'Erfolgreich');
        } finally {
          setProcessingOCR(false);
        }
      } else {
        handleSuccess('Dokument wurde hochgeladen.', 'Erfolgreich');
      }

      form.reset();
      onSuccess();
    } catch (error: Error | unknown) {
      handleError(error, 'Dokument konnte nicht hochgeladen werden.', { title: 'Fehler beim Hochladen' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="entity_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategorie *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie eine Kategorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="driver">Fahrer</SelectItem>
                    <SelectItem value="vehicle">Fahrzeug</SelectItem>
                    <SelectItem value="customer">Kunde</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="entity_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zugeordnet zu *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie eine Option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getEntityOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="document_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dokumenttyp *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie einen Typ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fuehrerschein">Führerschein</SelectItem>
                    <SelectItem value="p_schein">P-Schein</SelectItem>
                    <SelectItem value="fahrzeugschein">Fahrzeugschein</SelectItem>
                    <SelectItem value="tuev">TÜV</SelectItem>
                    <SelectItem value="versicherung">Versicherung</SelectItem>
                    <SelectItem value="sonstiges">Sonstiges</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dokumentname *</FormLabel>
                <FormControl>
                  <Input placeholder="z.B. Führerschein 2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Datei hochladen *</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => onChange(e.target.files)}
                    {...field}
                  />
                </FormControl>
                {isEnterprise && ocrSupportedTypes.includes(form.watch('document_type')) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    🤖 <span className="text-foreground">Enterprise:</span> Automatische Daten-Extraktion aktiviert
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiry_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ablaufdatum (optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <V28Button
                        variant="secondary"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'dd.MM.yyyy', { locale: de })
                        ) : (
                          <span>Datum wählen</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </V28Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      locale={de}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Tags (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="z.B. wichtig, ablaufend (kommagetrennt)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <V28Button type="button" variant="secondary" onClick={onCancel} className="w-full sm:w-auto" disabled={uploading || processingOCR}>
            Abbrechen
          </V28Button>
          <V28Button type="submit" variant="primary" disabled={uploading || processingOCR} className="w-full sm:w-auto">
            {processingOCR ? '🤖 Analysiere Dokument...' : uploading ? 'Hochladen...' : 'Hochladen'}
          </V28Button>
        </div>
      </form>
    </Form>
  );
}


