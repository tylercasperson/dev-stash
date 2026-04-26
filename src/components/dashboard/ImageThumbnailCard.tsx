'use client';

import { Pin, Star } from 'lucide-react';
import type { ItemCardProps } from './ItemCard';

export default function ImageThumbnailCard({
  id,
  title,
  fileUrl,
  isFavorite,
  isPinned,
  tags,
  onSelect,
}: Omit<ItemCardProps, 'layout'>) {
  return (
    <div
      onClick={() => onSelect?.(id)}
      className="group flex flex-col rounded-lg border border-border bg-card overflow-hidden cursor-pointer transition-colors hover:border-border/80"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {fileUrl ? (
          <img
            src={fileUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
            No preview
          </div>
        )}
        <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
          {isFavorite && <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 drop-shadow" />}
          {isPinned && <Pin className="h-3 w-3 text-white drop-shadow" />}
        </div>
      </div>

      <div className="flex flex-col gap-1 p-2">
        <span className="text-sm font-medium text-foreground leading-tight line-clamp-1">
          {title}
        </span>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
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
    </div>
  );
}
