'use client';

import { Layers } from 'lucide-react';
import type { CollectionOption } from '@/lib/db/collections';

interface CollectionSelectorProps {
  collections: CollectionOption[];
  value: string[];
  onChange: (ids: string[]) => void;
}

export default function CollectionSelector({ collections, value, onChange }: CollectionSelectorProps) {
  if (collections.length === 0) {
    return (
      <p className="text-xs text-muted-foreground py-1">No collections yet</p>
    );
  }

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  return (
    <div className="max-h-40 overflow-y-auto rounded-md border border-input bg-background p-2 space-y-1">
      {collections.map((col) => {
        const checked = value.includes(col.id);
        return (
          <label
            key={col.id}
            className="flex items-center gap-2.5 px-1.5 py-1 rounded cursor-pointer hover:bg-muted text-sm select-none"
          >
            <input
              type="checkbox"
              className="accent-primary"
              checked={checked}
              onChange={() => toggle(col.id)}
            />
            <Layers className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">{col.name}</span>
          </label>
        );
      })}
    </div>
  );
}
