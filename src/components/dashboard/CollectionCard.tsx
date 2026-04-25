import Link from 'next/link';
import { File, Star } from 'lucide-react';
import { ICON_MAP } from '@/lib/icon-map';

interface TypeIcon {
  icon: string;
  color: string;
  name: string;
}

interface CollectionCardProps {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  accentColor: string;
  typeIcons?: TypeIcon[];
  href?: string;
  onSelect?: (id: string) => void;
}

export default function CollectionCard({
  id,
  name,
  description,
  isFavorite,
  itemCount,
  accentColor,
  typeIcons = [],
  href,
  onSelect,
}: CollectionCardProps) {
  const className = "group flex flex-col gap-2 rounded-lg border border-border bg-card p-4 cursor-pointer transition-colors hover:border-border/80 hover:bg-card/80";
  const style = { borderLeftColor: accentColor, borderLeftWidth: '3px' };

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
          {name}
        </span>
        {isFavorite && (
          <button
            type="button"
            // TODO: wire up favorite toggle action here
            onClick={(e) => { e.stopPropagation(); }}
            className="shrink-0"
            aria-label="Remove from favorites"
          >
            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500 mt-0.5" />
          </button>
        )}
      </div>

      {description && (
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
        {typeIcons.length > 0 && (
          <div className="flex items-center gap-1">
            {typeIcons.map((t) => {
              const Icon = ICON_MAP[t.icon] ?? File;
              return (
                <Icon
                  key={t.name}
                  className="h-3 w-3"
                  style={{ color: t.color }}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        {inner}
      </Link>
    );
  }

  return (
    <div onClick={() => onSelect?.(id)} className={className} style={style}>
      {inner}
    </div>
  );
}
