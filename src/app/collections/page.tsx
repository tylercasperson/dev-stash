import { auth } from '@/auth';
import { DEMO_USER_ID } from '@/lib/demo';
import { getCollectionsForUser } from '@/lib/db/collections';
import CollectionCard from '@/components/dashboard/CollectionCard';
import AddCollectionButton from '@/components/dashboard/AddCollectionButton';

export default async function CollectionsPage() {
  const session = await auth();
  const userId = session?.user?.id ?? DEMO_USER_ID;

  const collections = await getCollectionsForUser(userId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Collections</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {collections.length} {collections.length === 1 ? 'collection' : 'collections'}
          </span>
          <AddCollectionButton />
        </div>
      </div>

      {collections.length === 0 ? (
        <p className="text-sm text-muted-foreground">No collections yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
      )}
    </div>
  );
}
