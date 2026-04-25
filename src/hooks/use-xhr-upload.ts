'use client';

import { useCallback, useState } from 'react';
import type { UploadResult } from '@/components/dashboard/FileUpload';

export function useXhrUpload(onChange: (result: UploadResult | null) => void) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return { upload, progress, error };
}
