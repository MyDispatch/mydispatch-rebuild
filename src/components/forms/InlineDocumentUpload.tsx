/* ==================================================================================
   INLINE DOCUMENT UPLOAD COMPONENT
   ==================================================================================
   Kompakte Dokumenten-Upload-Komponente für Integration in Formulare
   - Upload während der Dateneingabe
   - Vorschau hochgeladener Dokumente
   - Ablaufdatum-Verwaltung
   - Drag & Drop Support
   ================================================================================== */

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { V28Button } from "@/components/design-system/V28Button";
import { Input } from "@/lib/compat";
import { Label } from "@/components/ui/label";
import { handleError, handleSuccess } from "@/lib/error-handler";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, X, FileText, Eye } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { StatusIndicator } from "@/components/shared/StatusIndicator";

interface UploadedDocument {
  id: string;
  name: string;
  document_type: string;
  file_url: string;
  expiry_date?: string;
}

interface InlineDocumentUploadProps {
  entityType: "driver" | "vehicle" | "customer";
  entityId?: string; // Optional: Wenn Entity noch nicht existiert
  onUploadSuccess?: () => void;
  allowedDocumentTypes?: string[];
  compactMode?: boolean;
}

const DOCUMENT_TYPE_LABELS = {
  fuehrerschein: "Führerschein (Fahrerlaubnis)",
  p_schein: "P-Schein (Personenbeförderungsschein)",
  fahrzeugschein: "Fahrzeugschein (Zulassungsbescheinigung Teil I)",
  tuev: "TÜV (Hauptuntersuchung)",
  versicherung: "Versicherung (Versicherungsnachweis)",
  sonstiges: "Sonstiges (Weitere Dokumente)",
};

export function InlineDocumentUpload({
  entityType,
  entityId,
  onUploadSuccess,
  allowedDocumentTypes,
  compactMode = false,
}: InlineDocumentUploadProps) {
  const { profile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("fuehrerschein");
  const [documentName, setDocumentName] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);

  // Filter erlaubte Dokumenttypen
  const availableDocTypes = allowedDocumentTypes
    ? Object.entries(DOCUMENT_TYPE_LABELS).filter(([key]) => allowedDocumentTypes.includes(key))
    : Object.entries(DOCUMENT_TYPE_LABELS);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill document name from filename
      if (!documentName) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setDocumentName(nameWithoutExt);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !profile?.company_id) {
      handleError(null, "Bitte wählen Sie eine Datei aus.", { title: "Fehler" });
      return;
    }

    if (!entityId) {
      handleError(
        null,
        "Bitte speichern Sie zuerst die Hauptdaten, bevor Sie Dokumente hochladen.",
        {
          title: "Hinweis",
        }
      );
      return;
    }

    try {
      setUploading(true);

      // Upload to Supabase Storage
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${profile.company_id}/${entityType}/${entityId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("documents").getPublicUrl(filePath);

      // Save to database
      const documentData = {
        company_id: profile.company_id,
        entity_type: entityType,
        entity_id: entityId,
        document_type: documentType as
          | "fuehrerschein"
          | "p_schein"
          | "fahrzeugschein"
          | "tuev"
          | "versicherung"
          | "sonstiges",
        name: documentName || selectedFile.name,
        file_url: publicUrl,
        expiry_date: expiryDate ? format(expiryDate, "yyyy-MM-dd") : null,
      };

      const { data, error } = await supabase
        .from("documents")
        .insert([documentData])
        .select()
        .single();

      if (error) throw error;

      handleSuccess("Dokument wurde hochgeladen.", "Erfolgreich");

      // Add to uploaded docs list
      setUploadedDocs((prev) => [...prev, data]);

      // Reset form
      setSelectedFile(null);
      setDocumentName("");
      setExpiryDate(undefined);

      onUploadSuccess?.();
    } catch (error: any) {
      handleError(error, "Dokument konnte nicht hochgeladen werden.", { title: "Upload-Fehler" });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveDoc = async (docId: string) => {
    try {
      // SECURITY: Use Archiving instead of DELETE (SOLL-Vorgabe V18.3.24)
      const { error } = await supabase
        .from("documents")
        .update({
          archived: true,
          archived_at: new Date().toISOString(),
        })
        .eq("id", docId);

      if (error) throw error;

      setUploadedDocs((prev) => prev.filter((d) => d.id !== docId));

      handleSuccess("Dokument wurde entfernt.", "Erfolgreich");
    } catch (error: any) {
      handleError(error, "Dokument konnte nicht entfernt werden.", { title: "Fehler" });
    }
  };

  if (compactMode) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Dokumente</Label>
            {!entityId && (
              <span className="text-xs text-muted-foreground">
                Speichern Sie zuerst die Hauptdaten
              </span>
            )}
          </div>

          {entityId && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDocTypes.map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="h-9 cursor-pointer"
                  disabled={uploading}
                />
              </div>

              {selectedFile && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Dokumentname"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    className="h-9"
                  />
                  <V28Button
                    type="button"
                    size="sm"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="shrink-0"
                  >
                    {uploading ? "Uploading..." : "Hochladen"}
                  </V28Button>
                </div>
              )}
            </div>
          )}

          {uploadedDocs.length > 0 && (
            <div className="space-y-1">
              {uploadedDocs.map((doc, index) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between text-xs p-2 bg-background rounded"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="truncate text-sm">{doc.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {doc.document_type}
                    </span>
                  </div>
                  <V28Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDoc(doc.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </V28Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-muted/10">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Dokumente hochladen
        </h3>
        {!entityId && (
          <span className="text-xs text-muted-foreground">Speichern Sie zuerst die Hauptdaten</span>
        )}
      </div>

      {entityId && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="document-type">Dokumenttyp *</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="document-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableDocTypes.map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document-file">Datei *</Label>
              <Input
                id="document-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="cursor-pointer"
                disabled={uploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document-name">Dokumentname</Label>
              <Input
                id="document-name"
                placeholder="z.B. Führerschein 2024"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Ablaufdatum (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <V28Button
                    variant="secondary"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, "dd.MM.yyyy", { locale: de }) : "Datum wählen"}
                  </V28Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    locale={de}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <FileText className="h-4 w-4" />
              <span className="text-sm flex-1">{selectedFile.name}</span>
              <V28Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
              >
                <X className="h-4 w-4" />
              </V28Button>
            </div>
          )}

          <V28Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Dokument hochladen"}
          </V28Button>
        </div>
      )}

      {/* Uploaded Documents List */}
      {uploadedDocs.length > 0 && (
        <div className="space-y-2 border-t pt-4">
          <h4 className="text-sm font-medium">Hochgeladene Dokumente</h4>
          <div className="space-y-2">
            {uploadedDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2 bg-background rounded border"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{doc.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {DOCUMENT_TYPE_LABELS[doc.document_type as keyof typeof DOCUMENT_TYPE_LABELS]}
                    </div>
                  </div>
                  {doc.expiry_date && (
                    <div className="text-xs text-muted-foreground">
                      Ablauf: {format(new Date(doc.expiry_date), "dd.MM.yyyy")}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <V28Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(doc.file_url, "_blank")}
                  >
                    <Eye className="h-4 w-4" />
                  </V28Button>
                  <V28Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDoc(doc.id)}
                  >
                    <X className="h-4 w-4" />
                  </V28Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
