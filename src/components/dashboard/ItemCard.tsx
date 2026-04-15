import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link as LinkIcon,
  Pin,
  Star,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

interface ItemCardProps {
  title: string;
  description: string | null | undefined;
  contentType: 'TEXT' | 'FILE' | 'URL';
  content: string | null | undefined;
  isFavorite: boolean;
  isPinned: boolean;
  typeName: string;
  typeIcon: string;
  typeColor: string;
  tags: string[];
  updatedAt: string;
  layout?: 'card' | 'row';
}

export default function ItemCard({
  title,
  description,
  contentType,
  content,
  isFavorite,
  isPinned,
  typeName,
  typeIcon,
  typeColor,
  tags,
  updatedAt,
  layout = 'card',
}: ItemCardProps) {
  const Icon = ICON_MAP[typeIcon] ?? File;
  const preview = description ?? (contentType === 'TEXT' && content ? content.split('\n')[0] : null);

  if (layout === 'row') {
    return (
      <div
        className="flex items-start gap-4 rounded-lg border border-border bg-card px-4 py-3.5 cursor-pointer transition-colors hover:border-border/80 hover:bg-card/80"
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
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 cursor-pointer transition-colors hover:border-border/80 hover:bg-card/80"
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
        <span className="shrink-0 text-[10px] text-muted-foreground capitalize">
          {typeName}
        </span>
      </div>
    </div>
  );
}
