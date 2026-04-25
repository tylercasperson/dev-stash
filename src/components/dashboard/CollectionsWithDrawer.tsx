import CollectionCard from './CollectionCard';
import type { CollectionWithMeta } from '@/lib/db/collections';

interface CollectionsWithDrawerProps {
  collections: CollectionWithMeta[];
  gridClassName?: string;
}

export default function CollectionsWithDrawer({ collections, gridClassName }: CollectionsWithDrawerProps) {
  return (
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
          href={`/collections/${col.id}`}
        />
      ))}
    </div>
  );
}
