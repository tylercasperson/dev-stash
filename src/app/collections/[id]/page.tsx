import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { auth } from '@/auth';
import { DEMO_USER_ID } from '@/lib/demo';
import { COLLECTIONS_PER_PAGE } from '@/lib/constants';
import { getCollectionById } from '@/lib/db/collections';
import { getItemsByCollection } from '@/lib/db/items';
import ItemsWithDrawer from '@/components/dashboard/ItemsWithDrawer';
import CollectionDetailActions from '@/components/collections/CollectionDetailActions';
import PaginationControls from '@/components/ui/PaginationControls';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CollectionDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  const session = await auth();
  const userId = session?.user?.id ?? DEMO_USER_ID;

  const [collection, { items, total }] = await Promise.all([
    getCollectionById(userId, id),
    getItemsByCollection(userId, id, page, COLLECTIONS_PER_PAGE),
  ]);

  if (!collection) notFound();

  const totalPages = Math.ceil(total / COLLECTIONS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/collections"
          className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Collections
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-foreground">{collection.name}</h1>
            {collection.description && (
              <p className="mt-1 text-sm text-muted-foreground">{collection.description}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {total} {total === 1 ? 'item' : 'items'}
            </span>
            <CollectionDetailActions
              id={collection.id}
              name={collection.name}
              description={collection.description}
              isFavorite={collection.isFavorite}
            />
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No items in this collection yet.</p>
      ) : (
        <ItemsWithDrawer
          items={items}
          gridClassName="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"
        />
      )}

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        buildHref={(p) => `/collections/${id}?page=${p}`}
      />
    </div>
  );
}
