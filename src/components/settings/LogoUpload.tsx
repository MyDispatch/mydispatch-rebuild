/* ==================================================================================
   LOGO-UPLOAD-SYSTEM V18.2.26
   ==================================================================================
   Drag & Drop Logo-Upload mit Supabase Storage Integration
   ================================================================================== */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { V28Button } from "@/components/design-system/V28Button";
import { supabase } from "@/integrations/supabase/client";
import { handleError, handleSuccess } from "@/lib/error-handler";

interface LogoUploadProps {
  companyId: string;
  currentLogoUrl?: string | null;
  onUploadComplete: (url: string) => void;
}

export function LogoUpload({ companyId, currentLogoUrl, onUploadComplete }: LogoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentLogoUrl || null);
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
    // Validierung: Nur Bildformate
    const validFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validFormats.includes(file.type)) {
      handleError(
        new Error('Ungültiges Dateiformat'),
        'Bitte wählen Sie eine PNG, JPG oder WEBP Datei',
        { showToast: true }
      );
      return;
    }

    // Validierung: Max. 2MB
    if (file.size > 2 * 1024 * 1024) {
      handleError(
        new Error('Datei zu groß'),
        'Die Datei darf maximal 2 MB groß sein',
        { showToast: true }
      );
      return;
    }

    setUploading(true);

    try {
      // Preview erstellen
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Dateiname: company_id + timestamp + extension
      const fileExt = file.name.split('.').pop();
      const fileName = `${companyId}/${Date.now()}.${fileExt}`;

      // Upload zu Supabase Storage
      const { data, error } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Public URL generieren
      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      // URL in companies-Tabelle speichern
      const { error: updateError } = await supabase
        .from('companies')
        .update({ logo_url: publicUrl })
        .eq('id', companyId);

      if (updateError) throw updateError;

      handleSuccess('Logo erfolgreich hochgeladen', 'Erfolg');
      onUploadComplete(publicUrl);
    } catch (error) {
      handleError(
        error as Error, 
        'Fehler beim Hochladen des Logos',
        { showToast: true }
      );
      setPreview(currentLogoUrl || null);
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
        .update({ logo_url: null })
        .eq('id', companyId);

      if (error) throw error;

      setPreview(null);
      handleSuccess('Logo erfolgreich entfernt', 'Erfolg');
      onUploadComplete('');
    } catch (error) {
      handleError(
        error as Error, 
        'Fehler beim Entfernen des Logos',
        { showToast: true }
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firmenlogo</CardTitle>
        <CardDescription>
          Logo hochladen (PNG, JPG, WEBP - max. 2 MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview */}
        {preview && (
          <div className="relative w-full max-w-xs mx-auto">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src={preview} 
                alt="Logo-Vorschau" 
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
            id="logo-upload"
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleChange}
            disabled={uploading}
          />
          
          <label 
            htmlFor="logo-upload" 
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
                  PNG, JPG, WEBP (max. 2 MB)
                </p>
              </>
            )}
          </label>
        </div>

        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Ihr Logo erscheint im Header und auf Ihrer Landingpage</p>
          <p>Empfohlene Größe: 200x60 Pixel (Breite x Höhe)</p>
          <p>Transparenter Hintergrund wird empfohlen</p>
        </div>
      </CardContent>
    </Card>
  );
}
