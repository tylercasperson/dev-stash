'use client';

import { useState } from 'react';
import { Check, Copy, File, Pin, Star } from 'lucide-react';
import { ICON_MAP } from '@/lib/icon-map';
import type { ItemCardProps } from './ItemCard';

export default function ItemCardRow({
  id,
  title,
  description,
  contentType,
  content,
  url,
  isFavorite,
  isPinned,
  typeIcon,
  typeColor,
  tags,
  updatedAt,
  onSelect,
}: Omit<ItemCardProps, 'layout'>) {
  const Icon = ICON_MAP[typeIcon] ?? File;
  const preview = description ?? (contentType === 'TEXT' && content ? content.split('\n')[0] : null);
  const copyValue = contentType === 'URL' ? url : contentType === 'TEXT' ? content : null;
  const [copied, setCopied] = useState(false);

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    if (!copyValue) return;
    navigator.clipboard.writeText(copyValue).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div
      onClick={() => onSelect?.(id)}
      className="group relative flex items-start gap-4 rounded-lg border border-border bg-card px-4 py-3.5 cursor-pointer transition-colors hover:border-border/80 hover:bg-card/80"
      style={{ borderLeftColor: typeColor, borderLeftWidth: '3px' }}
    >
      {/* Icon badge */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5"
        style={{ backgroundColor: `${typeColor}22` }}
      >
        <Icon className="h-4 w-4" style={{ color: typeColor }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-medium text-foreground leading-tight truncate">{title}</span>
            {isFavorite && <Star className="h-3 w-3 shrink-0 fill-yellow-500 text-yellow-500" />}
            {isPinned && <Pin className="h-3 w-3 shrink-0 text-muted-foreground" />}
          </div>
          <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">{updatedAt}</span>
        </div>
        {preview && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1 leading-relaxed">
            {preview}
          </p>
        )}
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded px-1.5 py-0.5 text-[10px] bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {copyValue && (
        <button
          onClick={handleCopy}
          className="absolute bottom-2 right-3 flex items-center justify-center h-6 w-6 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="Copy content"
        >
          {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
        </button>
      )}
    </div>
  );
}
