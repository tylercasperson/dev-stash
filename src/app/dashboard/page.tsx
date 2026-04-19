import Link from 'next/link';
import StatsGrid from '@/components/dashboard/StatsGrid';
import CollectionCard from '@/components/dashboard/CollectionCard';
import ItemCard from '@/components/dashboard/ItemCard';
import { getCollectionsForUser, getDashboardStats } from '@/lib/db/collections';
import { getPinnedItems, getRecentItems } from '@/lib/db/items';
import { auth } from '@/auth';
import { DEMO_USER_ID } from '@/lib/demo';

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id ?? DEMO_USER_ID;

  const [stats, collections, pinnedItems, recentItems] = await Promise.all([
    getDashboardStats(userId),
    getCollectionsForUser(userId),
    getPinnedItems(userId),
    getRecentItems(userId),
  ]);

  const recentCollections = collections.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <StatsGrid
        totalItems={stats.totalItems}
        totalCollections={stats.totalCollections}
        favoriteItems={stats.favoriteItems}
        favoriteCollections={stats.favoriteCollections}
      />

      {/* Collections */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Collections</h2>
          <Link href="/collections" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recentCollections.map((col) => (
            <CollectionCard
              key={col.id}
              id={col.id}
              name={col.name}
              description={col.description}
              isFavorite={col.isFavorite}
              itemCount={col.itemCount}
              accentColor={col.dominantTypeColor}
              typeIcons={col.typeIcons}
            />
          ))}
        </div>
      </section>

      {/* Pinned Items */}
      {pinnedItems.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Pinned</h2>
          <div className="flex flex-col gap-2">
            {pinnedItems.map((item) => (
              <ItemCard
                key={item.id}
                title={item.title}
                description={item.description}
                contentType={item.contentType}
                content={item.content}
                isFavorite={item.isFavorite}
                isPinned={item.isPinned}
                typeName={item.typeName}
                typeIcon={item.typeIcon}
                typeColor={item.typeColor}
                tags={item.tags}
                updatedAt={item.updatedAt}
                layout="row"
              />
            ))}
          </div>
        </section>
      )}

      {/* Recent Items */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Recent Items</h2>
        <div className="flex flex-col gap-2">
          {recentItems.map((item) => (
            <ItemCard
              key={item.id}
              title={item.title}
              description={item.description}
              contentType={item.contentType}
              content={item.content}
              isFavorite={item.isFavorite}
              isPinned={item.isPinned}
              typeName={item.typeName}
              typeIcon={item.typeIcon}
              typeColor={item.typeColor}
              tags={item.tags}
              updatedAt={item.updatedAt}
              layout="row"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
