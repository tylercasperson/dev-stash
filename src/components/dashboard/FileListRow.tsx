'use client';

import {
  Download,
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Pin,
  Star,
} from 'lucide-react';
import { formatFileSize } from '@/lib/files';
import { formatRelativeDate } from '@/lib/utils';
import type { ItemCardProps } from './ItemCard';

const EXT_ICON_MAP: Record<string, React.ElementType> = {
  pdf: FileText,
  doc: FileText, docx: FileText, rtf: FileText, odt: FileText, txt: FileText, md: FileText, log: FileText,
  zip: FileArchive, rar: FileArchive, '7z': FileArchive, tar: FileArchive, gz: FileArchive,
  xls: FileSpreadsheet, xlsx: FileSpreadsheet, csv: FileSpreadsheet, ods: FileSpreadsheet,
  js: FileCode, ts: FileCode, jsx: FileCode, tsx: FileCode, py: FileCode, rb: FileCode,
  java: FileCode, go: FileCode, rs: FileCode, cpp: FileCode, c: FileCode, cs: FileCode,
  html: FileCode, css: FileCode, json: FileCode, xml: FileCode, yaml: FileCode, yml: FileCode,
  sql: FileCode, sh: FileCode,
  png: FileImage, jpg: FileImage, jpeg: FileImage, gif: FileImage, svg: FileImage, webp: FileImage,
  mp4: FileVideo, mov: FileVideo, avi: FileVideo, mkv: FileVideo, webm: FileVideo,
  mp3: FileAudio, wav: FileAudio, ogg: FileAudio, flac: FileAudio, aac: FileAudio,
};

function getExtIcon(fileName: string | null | undefined): React.ElementType {
  if (!fileName) return File;
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  return EXT_ICON_MAP[ext] ?? File;
}

function getExtLabel(fileName: string | null | undefined): string {
  if (!fileName) return '';
  const ext = fileName.split('.').pop()?.toUpperCase();
  return ext ? `.${ext}` : '';
}

export default function FileListRow({
  id,
  title,
  fileName,
  fileSize,
  isFavorite,
  isPinned,
  tags,
  updatedAt,
  onSelect,
}: Omit<ItemCardProps, 'layout'>) {
  const Icon = getExtIcon(fileName);
  const extLabel = getExtLabel(fileName);

  return (
    <div
      onClick={() => onSelect?.(id)}
      className="group flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 cursor-pointer transition-colors hover:bg-muted/50"
    >
      {/* File type icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Left: title + ext on row 1, tags on row 2 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <span className="text-sm font-medium text-foreground truncate">{title}</span>
          {extLabel && (
            <span className="text-sm font-medium text-foreground truncate lowercase">{extLabel}</span>
          )}
          {isFavorite && <Star className="h-3 w-3 shrink-0 fill-yellow-500 text-yellow-500" />}
          {isPinned && <Pin className="h-3 w-3 shrink-0 text-muted-foreground" />}
        </div>
        {tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded px-1.5 py-0.5 text-[10px] bg-muted text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right: size · date · download — all on one row */}
      <div className="flex items-center gap-5 shrink-0">
        <span className="text-xs text-muted-foreground tabular-nums hidden sm:block">{fileSize != null ? formatFileSize(fileSize) : '—'}</span>
        <span className="text-xs text-muted-foreground tabular-nums hidden md:block w-24 text-right">{formatRelativeDate(updatedAt)}</span>
        <a
          href={`/api/download?itemId=${id}`}
          download={fileName ?? title}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Download file"
        >
          <Download className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
