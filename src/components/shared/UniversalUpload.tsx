/* ==================================================================================
   UNIVERSAL UPLOAD COMPONENT - PHASE 4
   ==================================================================================
   ✅ Drag & Drop Support
   ✅ File Preview
   ✅ Progress Indicator
   ✅ Validation (Size, Type)
   ✅ Multiple Files
   ✅ Portal-Specific Theming
   ================================================================================== */

import { useState, useRef, DragEvent } from 'react';
import { V28Button } from '@/components/design-system/V28Button';
import { Upload, X, File, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { logger } from '@/lib/logger';

export interface UniversalUploadProps {
  /** Accepted file types (e.g., ['image/*', '.pdf']) */
  accept: string[];
  
  /** Max file size in MB */
  maxSize: number;
  
  /** Max number of files */
  maxFiles?: number;
  
  /** Upload handler */
  onUpload: (files: File[]) => Promise<void>;
  
  /** Drag & Drop */
  dragAndDrop?: boolean;
  
  /** Show Preview */
  showPreview?: boolean;
  
  /** Custom className */
  className?: string;
  
  /** Portal-Specific Theming */
  portal?: 'entrepreneur' | 'customer' | 'driver';
  
  /** Disabled */
  disabled?: boolean;
  
  /** Button Label */
  buttonLabel?: string;
  
  /** Description */
  description?: string;
}

/**
 * Universal Upload Component
 * 
 * Handles file uploads with validation, preview, and progress.
 * 
 * @example
 * <UniversalUpload
 *   accept={['image/*', '.pdf']}
 *   maxSize={5}
 *   maxFiles={3}
 *   onUpload={async (files) => {
 *     await uploadToSupabase(files);
 *   }}
 *   dragAndDrop
 *   showPreview
 * />
 */
export function UniversalUpload({
  accept,
  maxSize,
  maxFiles = 1,
  onUpload,
  dragAndDrop = true,
  showPreview = true,
  className,
  portal,
  disabled = false,
  buttonLabel = 'Datei auswählen',
  description,
}: UniversalUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSize) {
      toast.error(`${file.name} ist zu groß (max. ${maxSize}MB)`);
      return false;
    }

    // Check file type
    const fileType = file.type;
    const fileName = file.name;
    const isAccepted = accept.some(type => {
      if (type.startsWith('.')) {
        // Extension check
        return fileName.toLowerCase().endsWith(type.toLowerCase());
      } else if (type.includes('*')) {
        // Wildcard check (e.g., image/*)
        const [category] = type.split('/');
        return fileType.startsWith(category);
      } else {
        // Exact type check
        return fileType === type;
      }
    });

    if (!isAccepted) {
      toast.error(`${file.name} hat ein ungültiges Format`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);

    if (validFiles.length + selectedFiles.length > maxFiles) {
      toast.error(`Maximal ${maxFiles} Datei(en) erlaubt`);
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setIsUploading(true);
      await onUpload(selectedFiles);
      toast.success('Upload erfolgreich!');
      setSelectedFiles([]);
    } catch (error) {
      logger.error('[UniversalUpload] Upload failed', error as Error, { 
        component: 'UniversalUpload',
        fileCount: selectedFiles.length 
      });
      toast.error('Upload fehlgeschlagen!');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drag & Drop Area */}
      {dragAndDrop && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            isDragging && 'border-primary bg-primary/5',
            !isDragging && 'border-gray-300 hover:border-gray-400',
            disabled && 'opacity-50 cursor-not-allowed',
            // Portal-Specific Theming
            portal === 'customer' && 'border-portal-customer hover:border-portal-customer-hover',
            portal === 'driver' && 'border-portal-driver hover:border-portal-driver-hover'
          )}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Dateien hier ablegen oder
          </p>
          <V28Button
            type="button"
            variant="secondary"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
          >
            {buttonLabel}
          </V28Button>
          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Max. {maxSize}MB pro Datei • Max. {maxFiles} Datei(en)
          </p>
        </div>
      )}

      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={maxFiles > 1}
        accept={accept.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {/* File Preview */}
      {showPreview && selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Ausgewählte Dateien:</p>
          {selectedFiles.map((file, index) => (
            <Card key={index}>
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <V28Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(index)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </V28Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <V28Button
          onClick={handleUpload}
          disabled={disabled || isUploading}
          variant="primary"
          className={cn(
            'w-full',
            // Portal-Specific Theming
            portal === 'customer' && 'bg-portal-customer hover:bg-portal-customer-hover text-slate-900',
            portal === 'driver' && 'bg-portal-driver hover:bg-portal-driver-hover text-white'
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wird hochgeladen...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {selectedFiles.length} Datei(en) hochladen
            </>
          )}
        </V28Button>
      )}
    </div>
  );
}
