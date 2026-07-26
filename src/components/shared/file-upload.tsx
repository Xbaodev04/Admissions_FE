"use client";

import * as React from "react";
import { CloudUpload, File, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  error?: string;
  className?: string;
}

export function FileUpload({
  value,
  onChange,
  accept = ".pdf,.png,.jpg,.jpeg,.docx",
  maxSizeMB = 10,
  label = "Kéo thả file vào đây hoặc chọn từ máy tính",
  error,
  className,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);

  const handleValidation = (file: File) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setLocalError(`File không được vượt quá ${maxSizeMB}MB.`);
      return false;
    }
    setLocalError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && handleValidation(droppedFile)) {
      onChange(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && handleValidation(selectedFile)) {
      onChange(selectedFile);
    }
  };

  const displayError = error || localError;

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200",
          isDragOver
            ? "border-cyan-500 bg-cyan-500/5"
            : displayError
            ? "border-rose-500/50 bg-rose-500/5"
            : "border-navy-700/50 hover:border-navy-600 bg-navy-800/20"
        )}
      >
        {value ? (
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <File className="h-6 w-6 text-cyan-400" />
            </div>
            <div className="text-left min-w-0 flex-1 max-w-[200px]">
              <p className="text-sm font-medium text-navy-200 truncate">
                {value.name}
              </p>
              <p className="text-xs text-navy-500">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setLocalError(null);
              }}
              className="p-1.5 rounded-lg hover:bg-navy-700 text-navy-400 hover:text-navy-200 transition-colors"
              title="Xóa file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <CloudUpload className="h-8 w-8 text-navy-500 mx-auto mb-2" />
            <p className="text-sm text-navy-300 mb-1">{label}</p>
            <label className="text-sm text-cyan-400 hover:text-cyan-300 cursor-pointer font-medium inline-block">
              Chọn từ máy tính
              <input
                type="file"
                className="hidden"
                accept={accept}
                onChange={handleFileInput}
              />
            </label>
            <p className="text-xs text-navy-500 mt-1">
              Định dạng: {accept.replace(/\./g, "").toUpperCase()} — Tối đa {maxSizeMB}MB
            </p>
          </>
        )}
      </div>

      {displayError && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}
