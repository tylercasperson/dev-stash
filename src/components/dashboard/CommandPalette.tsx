'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderOpen } from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { ICON_MAP } from '@/lib/icon-map';
import ItemDetailDrawer from '@/components/dashboard/ItemDetailDrawer';
import { getSearchData } from '@/actions/search';
import type { SearchData } from '@/actions/search';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [data, setData] = useState<SearchData | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  useEffect(() => {
    getSearchData().then(setData);
  }, []);

  function handleSelectItem(id: string) {
    onOpenChange(false);
    setSelectedItemId(id);
  }

  function handleSelectCollection(id: string) {
    onOpenChange(false);
    router.push(`/collections/${id}`);
  }

  return (
    <>
      <CommandDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Search"
        description="Search items and collections"
      >
        <Command>
        <CommandInput placeholder="Search items and collections..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {data && data.items.length > 0 && (
            <CommandGroup heading="Items">
              {data.items.map((item) => {
                const Icon = ICON_MAP[item.typeIcon] ?? ICON_MAP['File'];
                return (
                  <CommandItem
                    key={item.id}
                    value={item.title}
                    onSelect={() => handleSelectItem(item.id)}
                  >
                    <Icon className="shrink-0" style={{ color: item.typeColor }} />
                    <span className="truncate">{item.title}</span>
                    <span className="ml-auto shrink-0 text-xs capitalize text-muted-foreground">
                      {item.typeName}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {data && data.items.length > 0 && data.collections.length > 0 && (
            <CommandSeparator />
          )}

          {data && data.collections.length > 0 && (
            <CommandGroup heading="Collections">
              {data.collections.map((col) => (
                <CommandItem
                  key={col.id}
                  value={col.name}
                  onSelect={() => handleSelectCollection(col.id)}
                >
                  <FolderOpen className="shrink-0 text-muted-foreground" />
                  <span className="truncate">{col.name}</span>
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    {col.itemCount} {col.itemCount === 1 ? 'item' : 'items'}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
        </Command>
      </CommandDialog>

      <ItemDetailDrawer itemId={selectedItemId} onClose={() => setSelectedItemId(null)} />
    </>
  );
}
