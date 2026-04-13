import StatsGrid from '@/components/dashboard/StatsGrid';
import CollectionCard from '@/components/dashboard/CollectionCard';
import ItemCard from '@/components/dashboard/ItemCard';
import { getCollectionsForUser, getDashboardStats } from '@/lib/db/collections';
import { getPinnedItems, getRecentItems } from '@/lib/db/items';

// TODO: Replace with session user once auth is wired up
const DEMO_USER_ID = 'cmnwf1nbu0000uhsvo9hk9avh';

export default async function DashboardPage() {
  const [stats, collections, pinnedItems, recentItems] = await Promise.all([
    getDashboardStats(DEMO_USER_ID),
    getCollectionsForUser(DEMO_USER_ID),
    getPinnedItems(DEMO_USER_ID),
    getRecentItems(DEMO_USER_ID),
  ]);

  const recentCollections = collections.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <StatsGrid
        totalItems={stats.totalItems}
        totalCollections={stats.totalCollections}
        favoriteItems={stats.favoriteItems}
        favoriteCollections={stats.favoriteCollections}
      />

      {/* Recent Collections */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Recent Collections</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
          <h2 className="mb-3 text-sm font-semibold text-foreground">Pinned Items</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
              />
            ))}
          </div>
        </section>
      )}

      {/* Recent Items */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Recent Items</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
            />
          ))}
        </div>
      </section>
    </div>
  );
}
