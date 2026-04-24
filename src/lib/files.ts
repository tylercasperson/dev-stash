export const IMAGE_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
]);

export const FILE_MIME = new Set([
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/json',
  'application/x-yaml',
  'text/yaml',
  'application/xml',
  'text/xml',
  'text/csv',
  'application/toml',
]);

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export interface FileValidationError {
  valid: false;
  error: string;
}

export interface FileValidationSuccess {
  valid: true;
  isImage: boolean;
}

export type FileValidationResult = FileValidationError | FileValidationSuccess;

export function validateFile(mimeType: string, size: number): FileValidationResult {
  const isImage = IMAGE_MIME.has(mimeType);
  const isFile = FILE_MIME.has(mimeType);

  if (!isImage && !isFile) {
    return { valid: false, error: 'Unsupported file type' };
  }

  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_FILE_BYTES;
  if (size > maxBytes) {
    const limit = isImage ? '5 MB' : '10 MB';
    return { valid: false, error: `File exceeds ${limit} limit` };
  }

  return { valid: true, isImage };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
