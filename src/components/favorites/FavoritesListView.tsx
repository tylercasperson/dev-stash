'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Folder, ArrowUp, ArrowDown } from 'lucide-react';
import { ICON_MAP } from '@/lib/icon-map';
import ItemDetailDrawer from '@/components/dashboard/ItemDetailDrawer';
import type { ItemWithMeta } from '@/lib/db/items';
import type { FavoriteCollection } from '@/lib/db/collections';

type SortKey = 'name' | 'date' | 'type';
type SortDir = 'asc' | 'desc';

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

function SortBar({
  sortKey,
  sortDir,
  onSort,
}: {
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  const Arrow = sortDir === 'asc' ? ArrowUp : ArrowDown;
  return (
    <div className="flex items-center gap-1">
      {(['name', 'date', 'type'] as SortKey[]).map((key) => {
        const active = sortKey === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSort(key)}
            className={[
              'flex items-center gap-0.5 rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors',
              active
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/50',
            ].join(' ')}
          >
            {key}
            {active && <Arrow className="h-2.5 w-2.5" />}
          </button>
        );
      })}
    </div>
  );
}

function sortItems(items: ItemWithMeta[], key: SortKey, dir: SortDir): ItemWithMeta[] {
  const sorted = [...items].sort((a, b) => {
    if (key === 'name') return a.title.localeCompare(b.title);
    if (key === 'date') return a.updatedAt < b.updatedAt ? -1 : a.updatedAt > b.updatedAt ? 1 : 0;
    return a.typeName.localeCompare(b.typeName);
  });
  return dir === 'desc' ? sorted.reverse() : sorted;
}

function sortCollections(
  collections: FavoriteCollection[],
  key: SortKey,
  dir: SortDir,
): FavoriteCollection[] {
  const sorted = [...collections].sort((a, b) => {
    if (key === 'date') return a.updatedAt < b.updatedAt ? -1 : a.updatedAt > b.updatedAt ? 1 : 0;
    // 'type' falls back to name for collections
    return a.name.localeCompare(b.name);
  });
  return dir === 'desc' ? sorted.reverse() : sorted;
}

export default function FavoritesListView({ items, collections }: FavoritesListViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'date' ? 'desc' : 'asc');
    }
  }

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

  const sortedItems = sortItems(items, sortKey, sortDir);
  const sortedCollections = sortCollections(collections, sortKey, sortDir);

  return (
    <>
      <div className="flex items-center justify-end">
        <SortBar sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
      </div>

      {hasItems && (
        <section>
          <p className="mb-1 font-mono text-xs text-muted-foreground/60 uppercase tracking-widest">
            Items · {items.length}
          </p>
          <ul className="divide-y divide-border/40">
            {sortedItems.map((item) => {
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
            {sortedCollections.map((col) => (
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
