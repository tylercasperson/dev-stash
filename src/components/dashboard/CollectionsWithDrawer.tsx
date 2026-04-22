'use client';

import { useState } from 'react';
import CollectionCard from './CollectionCard';
import CollectionDetailDrawer from './CollectionDetailDrawer';
import type { CollectionWithMeta } from '@/lib/db/collections';

interface CollectionsWithDrawerProps {
  collections: CollectionWithMeta[];
  gridClassName?: string;
}

export default function CollectionsWithDrawer({ collections, gridClassName }: CollectionsWithDrawerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <div className={gridClassName}>
        {collections.map((col) => (
          <CollectionCard
            key={col.id}
            id={col.id}
            name={col.name}
            description={col.description}
            isFavorite={col.isFavorite}
            itemCount={col.itemCount}
            accentColor={col.dominantTypeColor}
            typeIcons={col.typeIcons}
            onSelect={setSelectedId}
          />
        ))}
      </div>
      <CollectionDetailDrawer collectionId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}
