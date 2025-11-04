/* ==================================================================================
   LETTERHEAD-UPLOAD-SYSTEM V1.0
   ==================================================================================
   Drag & Drop Briefpapier-Upload mit Supabase Storage Integration
   ================================================================================== */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { V28Button } from "@/components/design-system/V28Button";
import { supabase } from "@/integrations/supabase/client";
import { handleError, handleSuccess } from "@/lib/error-handler";

interface LetterheadUploadProps {
  companyId: string;
  currentLetterheadUrl?: string | null;
  onUploadComplete: (url: string) => void;
}

export function LetterheadUpload({ companyId, currentLetterheadUrl, onUploadComplete }: LetterheadUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentLetterheadUrl || null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validierung: Nur Bildformate (PNG, JPG, PDF)
    const validFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!validFormats.includes(file.type)) {
      handleError(
        new Error('Ungültiges Dateiformat'),
        'Bitte wählen Sie eine PNG, JPG, WEBP oder PDF Datei',
        { showToast: true }
      );
      return;
    }

    // Validierung: Max. 5MB (Briefpapier kann größer sein)
    if (file.size > 5 * 1024 * 1024) {
      handleError(
        new Error('Datei zu groß'),
        'Die Datei darf maximal 5 MB groß sein',
        { showToast: true }
      );
      return;
    }

    setUploading(true);

    try {
      // Preview erstellen (nur für Bilder)
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // PDF: Keine Preview, aber Upload möglich
        setPreview(null);
      }

      // Dateiname: company_id + timestamp + extension
      const fileExt = file.name.split('.').pop();
      const fileName = `${companyId}/${Date.now()}.${fileExt}`;

      // Upload zu Supabase Storage
      const { data, error } = await supabase.storage
        .from('company-letterheads')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Public URL generieren
      const { data: { publicUrl } } = supabase.storage
        .from('company-letterheads')
        .getPublicUrl(fileName);

      // URL in companies-Tabelle speichern
      const { error: updateError } = await supabase
        .from('companies')
        .update({ letterhead_url: publicUrl })
        .eq('id', companyId);

      if (updateError) throw updateError;

      handleSuccess('Briefpapier erfolgreich hochgeladen', 'Erfolg');
      onUploadComplete(publicUrl);
    } catch (error) {
      handleError(
        error as Error, 
        'Fehler beim Hochladen des Briefpapiers',
        { showToast: true }
      );
      setPreview(currentLetterheadUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setUploading(true);
    try {
      // URL in companies-Tabelle entfernen
      const { error } = await supabase
        .from('companies')
        .update({ letterhead_url: null })
        .eq('id', companyId);

      if (error) throw error;

      setPreview(null);
      handleSuccess('Briefpapier erfolgreich entfernt', 'Erfolg');
      onUploadComplete('');
    } catch (error) {
      handleError(
        error as Error, 
        'Fehler beim Entfernen des Briefpapiers',
        { showToast: true }
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Briefpapier</CardTitle>
        <CardDescription>
          Briefpapier hochladen (PNG, JPG, WEBP, PDF - max. 5 MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview */}
        {preview && (
          <div className="relative w-full max-w-2xl mx-auto">
            <div className="aspect-[210/297] bg-muted rounded-lg flex items-center justify-center overflow-hidden border">
              <img 
                src={preview} 
                alt="Briefpapier-Vorschau" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <V28Button
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={handleRemove}
              disabled={uploading}
            >
              ✕
            </V28Button>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            id="letterhead-upload"
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
            onChange={handleChange}
            disabled={uploading}
          />
          
          <label 
            htmlFor="letterhead-upload" 
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            {uploading ? (
              <>
                <div className="h-8 w-8 text-primary animate-spin">↻</div>
                <p className="text-sm text-muted-foreground">Wird hochgeladen...</p>
              </>
            ) : (
              <>
                <div className="h-8 w-8 text-muted-foreground">↑</div>
                <p className="text-sm text-foreground font-medium">
                  Datei hier ablegen oder klicken zum Auswählen
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP, PDF (max. 5 MB)
                </p>
              </>
            )}
          </label>
        </div>

        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Ihr Briefpapier wird auf Rechnungen, Auftragsbestätigungen und Angeboten verwendet</p>
          <p>Empfohlene Größe: A4 (210x297mm) oder ähnlich</p>
          <p>Hochauflösend (300 DPI) für bessere Druckqualität</p>
        </div>
      </CardContent>
    </Card>
  );
}

