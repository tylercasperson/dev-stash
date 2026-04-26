import { auth } from '@/auth';
import { DEMO_USER_ID } from '@/lib/demo';
import { COLLECTIONS_PER_PAGE } from '@/lib/constants';
import { getCollectionsForUser } from '@/lib/db/collections';
import CollectionCard from '@/components/dashboard/CollectionCard';
import AddCollectionButton from '@/components/dashboard/AddCollectionButton';
import PaginationControls from '@/components/ui/PaginationControls';

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function CollectionsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  const session = await auth();
  const userId = session?.user?.id ?? DEMO_USER_ID;

  const { collections, total } = await getCollectionsForUser(userId, page, COLLECTIONS_PER_PAGE);
  const totalPages = Math.ceil(total / COLLECTIONS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Collections</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {total} {total === 1 ? 'collection' : 'collections'}
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

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        buildHref={(p) => `/collections?page=${p}`}
      />
    </div>
  );
}
