'use client';

import { useState } from 'react';
import ItemCard from './ItemCard';
import ItemDetailDrawer from './ItemDetailDrawer';
import type { ItemWithMeta } from '@/lib/db/items';

interface ItemsWithDrawerProps {
  items: ItemWithMeta[];
  layout?: 'card' | 'row' | 'list';
  gridClassName?: string;
}

export default function ItemsWithDrawer({ items, layout, gridClassName }: ItemsWithDrawerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <div className={gridClassName}>
        {items.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            contentType={item.contentType}
            content={item.content}
            fileUrl={item.fileUrl}
            fileName={item.fileName}
            fileSize={item.fileSize}
            isFavorite={item.isFavorite}
            isPinned={item.isPinned}
            typeName={item.typeName}
            typeIcon={item.typeIcon}
            typeColor={item.typeColor}
            tags={item.tags}
            updatedAt={item.updatedAt}
            layout={layout}
            onSelect={setSelectedId}
          />
        ))}
      </div>
      <ItemDetailDrawer itemId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}
