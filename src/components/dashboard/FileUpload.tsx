'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { formatFileSize } from '@/lib/files';

export interface UploadResult {
  url: string;
  fileName: string;
  fileSize: number;
}

interface FileUploadProps {
  itemType: 'file' | 'image';
  value: UploadResult | null;
  onChange: (result: UploadResult | null) => void;
}

const IMAGE_ACCEPT = '.png,.jpg,.jpeg,.gif,.webp,.svg';
const FILE_ACCEPT = '.pdf,.txt,.md,.json,.yaml,.yml,.xml,.csv,.toml,.ini';

export default function FileUpload({ itemType, value, onChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const upload = useCallback(
    (file: File) => {
      setError(null);
      setProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload');

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      };

      xhr.onload = () => {
        setProgress(null);
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText) as UploadResult;
          onChange(data);
        } else {
          const err = JSON.parse(xhr.responseText) as { error: string };
          setError(err.error ?? 'Upload failed');
        }
      };

      xhr.onerror = () => {
        setProgress(null);
        setError('Upload failed');
      };

      xhr.send(formData);
    },
    [onChange],
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
  }

  if (value) {
    return (
      <div className="relative rounded-lg border border-border overflow-hidden">
        {itemType === 'image' ? (
          <img
            src={value.url}
            alt={value.fileName}
            className="w-full max-h-48 object-contain bg-muted"
          />
        ) : (
          <div className="flex items-center gap-3 p-4 bg-muted/30">
            <FileText className="h-8 w-8 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{value.fileName}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(value.fileSize)}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute top-2 right-2 rounded-full bg-background/80 p-1 hover:bg-background transition-colors"
          aria-label="Remove file"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors ${
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-muted-foreground/50'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {progress !== null ? (
          <div className="w-full flex flex-col items-center gap-2">
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">Uploading {progress}%</span>
          </div>
        ) : (
          <>
            {itemType === 'image' ? (
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Drop {itemType === 'image' ? 'an image' : 'a file'} here or{' '}
                <span className="text-primary">browse</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {itemType === 'image'
                  ? 'PNG, JPG, GIF, WebP, SVG up to 5 MB'
                  : 'PDF, TXT, MD, JSON, YAML, XML, CSV up to 10 MB'}
              </p>
            </div>
          </>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={itemType === 'image' ? IMAGE_ACCEPT : FILE_ACCEPT}
        onChange={handleChange}
      />
    </div>
  );
}
