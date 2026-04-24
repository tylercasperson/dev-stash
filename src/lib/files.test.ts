import { describe, it, expect } from 'vitest';
import { validateFile, formatFileSize, MAX_IMAGE_BYTES, MAX_FILE_BYTES } from './files';

describe('validateFile', () => {
  describe('unsupported types', () => {
    it('rejects unknown MIME type', () => {
      const result = validateFile('application/octet-stream', 1000);
      expect(result.valid).toBe(false);
      if (!result.valid) expect(result.error).toBe('Unsupported file type');
    });

    it('rejects video MIME type', () => {
      const result = validateFile('video/mp4', 1000);
      expect(result.valid).toBe(false);
    });
  });

  describe('image validation', () => {
    it('accepts valid image MIME types', () => {
      const types = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];
      for (const mimeType of types) {
        const result = validateFile(mimeType, 1000);
        expect(result.valid).toBe(true);
        if (result.valid) expect(result.isImage).toBe(true);
      }
    });

    it('accepts image at exactly the size limit', () => {
      const result = validateFile('image/png', MAX_IMAGE_BYTES);
      expect(result.valid).toBe(true);
    });

    it('rejects image exceeding 5 MB', () => {
      const result = validateFile('image/png', MAX_IMAGE_BYTES + 1);
      expect(result.valid).toBe(false);
      if (!result.valid) expect(result.error).toBe('File exceeds 5 MB limit');
    });
  });

  describe('file validation', () => {
    it('accepts valid file MIME types', () => {
      const types = [
        'application/pdf',
        'text/plain',
        'text/markdown',
        'application/json',
        'text/csv',
      ];
      for (const mimeType of types) {
        const result = validateFile(mimeType, 1000);
        expect(result.valid).toBe(true);
        if (result.valid) expect(result.isImage).toBe(false);
      }
    });

    it('accepts file at exactly the size limit', () => {
      const result = validateFile('application/pdf', MAX_FILE_BYTES);
      expect(result.valid).toBe(true);
    });

    it('rejects file exceeding 10 MB', () => {
      const result = validateFile('application/pdf', MAX_FILE_BYTES + 1);
      expect(result.valid).toBe(false);
      if (!result.valid) expect(result.error).toBe('File exceeds 10 MB limit');
    });
  });
});

describe('formatFileSize', () => {
  it('formats bytes under 1 MB as KB', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(51200)).toBe('50.0 KB');
    expect(formatFileSize(500 * 1024)).toBe('500.0 KB');
  });

  it('formats bytes at exactly 1 MB as MB', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
  });

  it('formats bytes over 1 MB as MB', () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
    expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
  });
});
