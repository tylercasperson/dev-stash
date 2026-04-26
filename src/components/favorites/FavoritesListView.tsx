'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Folder } from 'lucide-react';
import { ICON_MAP } from '@/lib/icon-map';
import ItemDetailDrawer from '@/components/dashboard/ItemDetailDrawer';
import type { ItemWithMeta } from '@/lib/db/items';
import type { FavoriteCollection } from '@/lib/db/collections';

interface FavoritesListViewProps {
  items: ItemWithMeta[];
  collections: FavoriteCollection[];
}

function TypeBadge({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
      style={{ color, backgroundColor: `${color}22` }}
    >
      {name}
    </span>
  );
}

export default function FavoritesListView({ items, collections }: FavoritesListViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const hasItems = items.length > 0;
  const hasCollections = collections.length > 0;

  if (!hasItems && !hasCollections) {
    return (
      <div className="py-16 text-center">
        <p className="font-mono text-sm text-muted-foreground">No favorites yet.</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground/60">
          Star items and collections to see them here.
        </p>
      </div>
    );
  }

  return (
    <>
      {hasItems && (
        <section>
          <p className="mb-1 font-mono text-xs text-muted-foreground/60 uppercase tracking-widest">
            Items · {items.length}
          </p>
          <ul className="divide-y divide-border/40">
            {items.map((item) => {
              const Icon = ICON_MAP[item.typeIcon] ?? ICON_MAP['File'];
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className="flex w-full items-center gap-3 px-2 py-2 text-left transition-colors hover:bg-muted/40 rounded"
                  >
                    <Icon className="h-4 w-4 shrink-0" style={{ color: item.typeColor }} />
                    <span className="min-w-0 flex-1 truncate font-mono text-sm text-foreground">
                      {item.title}
                    </span>
                    <TypeBadge name={item.typeName} color={item.typeColor} />
                    <span className="shrink-0 font-mono text-xs text-muted-foreground/60">
                      {item.updatedAt}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {hasItems && hasCollections && <div className="mt-6" />}

      {hasCollections && (
        <section>
          <p className="mb-1 font-mono text-xs text-muted-foreground/60 uppercase tracking-widest">
            Collections · {collections.length}
          </p>
          <ul className="divide-y divide-border/40">
            {collections.map((col) => (
              <li key={col.id}>
                <Link
                  href={`/collections/${col.id}`}
                  className="flex w-full items-center gap-3 px-2 py-2 transition-colors hover:bg-muted/40 rounded"
                >
                  <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate font-mono text-sm text-foreground">
                    {col.name}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground/60">
                    {col.itemCount} {col.itemCount === 1 ? 'item' : 'items'}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground/60">
                    {col.updatedAt}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ItemDetailDrawer itemId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}
