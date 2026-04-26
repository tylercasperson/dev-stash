import { auth } from '@/auth';
import { DEMO_USER_ID } from '@/lib/demo';
import { getFavoriteItems } from '@/lib/db/items';
import { getFavoriteCollections } from '@/lib/db/collections';
import FavoritesListView from '@/components/favorites/FavoritesListView';

export default async function FavoritesPage() {
  const session = await auth();
  const userId = session?.user?.id ?? DEMO_USER_ID;

  const [items, collections] = await Promise.all([
    getFavoriteItems(userId),
    getFavoriteCollections(userId),
  ]);

  const total = items.length + collections.length;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Favorites</h1>
        <span className="font-mono text-sm text-muted-foreground">
          {total} {total === 1 ? 'item' : 'items'}
        </span>
      </div>

      <FavoritesListView items={items} collections={collections} />
    </div>
  );
}
