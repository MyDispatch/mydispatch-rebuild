/* ==================================================================================
   V28 FILE UPLOAD - DRAG & DROP FILE UPLOAD
   ==================================================================================
   ✅ Drag & drop support
   ✅ Click to upload
   ✅ Multiple files
   ✅ File type validation
   ✅ Progress indicator
   ================================================================================== */

import { useState, useRef, DragEvent } from "react";
import { cn } from "@/lib/utils";
import { Upload, File, X } from "lucide-react";
import { V28Button } from "./V28Button";
import { V28Progress } from "./V28Progress";

interface V28FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  className?: string;
}

export function V28FileUpload({
  onUpload,
  accept,
  multiple = true,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className,
}: V28FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndAddFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    validateAndAddFiles(selectedFiles);
  };

  const validateAndAddFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      if (file.size > maxSize) {
        console.warn(`File ${file.name} exceeds max size`);
        return false;
      }
      return true;
    });

    setFiles((prev) => (multiple ? [...prev, ...validFiles] : validFiles));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      await onUpload(files);

      clearInterval(interval);
      setProgress(100);

      // Reset after successful upload
      setTimeout(() => {
        setFiles([]);
        setProgress(0);
        setUploading(false);
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
      setProgress(0);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer",
          "transition-colors duration-200",
          isDragging ? "border-slate-700 bg-slate-50" : "border-slate-300 hover:border-slate-400"
        )}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
        <p className="text-sm text-slate-600 mb-2">
          Dateien hierher ziehen oder klicken zum Auswählen
        </p>
        <p className="text-xs text-slate-500">
          {accept ? `Erlaubte Formate: ${accept}` : "Alle Dateiformate erlaubt"}
          {" · "}
          Max. {(maxSize / 1024 / 1024).toFixed(0)}MB
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <File className="h-5 w-5 text-slate-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                <p className="text-xs text-slate-600">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload progress */}
      {uploading && <V28Progress value={progress} label="Uploading..." />}

      {/* Upload button */}
      {files.length > 0 && !uploading && (
        <V28Button onClick={handleUpload} variant="primary" fullWidth>
          {files.length} {files.length === 1 ? "Datei" : "Dateien"} hochladen
        </V28Button>
      )}
    </div>
  );
}
