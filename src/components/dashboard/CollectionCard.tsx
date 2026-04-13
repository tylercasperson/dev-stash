import Link from 'next/link';
import { Star, Code, Sparkles, Terminal, StickyNote, File, Image, Link as LinkIcon } from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

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
}

export default function CollectionCard({
  id,
  name,
  description,
  isFavorite,
  itemCount,
  accentColor,
  typeIcons = [],
}: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${id}`}
      className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-4 transition-colors hover:border-border/80 hover:bg-card/80"
      style={{ borderLeftColor: accentColor, borderLeftWidth: '3px' }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
          {name}
        </span>
        {isFavorite && <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-500 text-yellow-500 mt-0.5" />}
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
    </Link>
  );
}
