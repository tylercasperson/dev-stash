'use client';

import { Check, Copy, File, Pin, Star } from 'lucide-react';
import { ICON_MAP } from '@/lib/icon-map';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import TagList from '@/components/ui/TagList';
import type { ItemCardProps } from './ItemCard';

export default function ItemCardGrid({
  id,
  title,
  description,
  contentType,
  content,
  url,
  isFavorite,
  isPinned,
  typeName,
  typeIcon,
  typeColor,
  tags,
  onSelect,
}: Omit<ItemCardProps, 'layout'>) {
  const Icon = ICON_MAP[typeIcon] ?? File;
  const preview = description ?? (contentType === 'TEXT' && content ? content.split('\n')[0] : null);
  const copyValue = contentType === 'URL' ? url : contentType === 'TEXT' ? content : null;
  const { copied, copy } = useCopyToClipboard();

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    if (!copyValue) return;
    copy(copyValue);
  }

  return (
    <div
      onClick={() => onSelect?.(id)}
      className="relative flex flex-col gap-2 rounded-lg border border-border bg-card p-3 cursor-pointer transition-colors hover:border-border/80 hover:bg-card/80"
      style={{ borderLeftColor: typeColor, borderLeftWidth: '3px' }}
    >
      {/* Header */}
      <div className="flex items-start gap-2">
        <Icon className="h-4 w-4 mt-0.5 shrink-0" style={{ color: typeColor }} />
        <span className="flex-1 text-sm font-medium text-foreground leading-tight line-clamp-1">
          {title}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {isFavorite && <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />}
          {isPinned && <Pin className="h-3 w-3 text-muted-foreground" />}
        </div>
      </div>

      {/* Preview */}
      {preview && (
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-mono">
          {preview}
        </p>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-2">
        <TagList tags={tags} limit={3} />
        <span className="text-[10px] text-muted-foreground capitalize pr-6">{typeName}</span>
      </div>

      {copyValue && (
        <button
          onClick={handleCopy}
          className="absolute bottom-1.5 right-1.5 flex items-center justify-center p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="Copy content"
        >
          {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
        </button>
      )}
    </div>
  );
}
