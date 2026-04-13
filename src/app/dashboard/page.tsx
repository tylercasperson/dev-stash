import StatsGrid from '@/components/dashboard/StatsGrid';
import CollectionCard from '@/components/dashboard/CollectionCard';
import ItemCard from '@/components/dashboard/ItemCard';
import { getCollectionsForUser, getDashboardStats } from '@/lib/db/collections';
import { mockItems, mockItemTypes } from '@/lib/mock-data';

// TODO: Replace with session user once auth is wired up
const DEMO_USER_ID = 'cmnwf1nbu0000uhsvo9hk9avh';

const typeMap = Object.fromEntries(mockItemTypes.map((t) => [t.id, t]));

const pinnedItems = mockItems.filter((i) => i.isPinned);
const recentItems = [...mockItems]
  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  .slice(0, 10);

export default async function DashboardPage() {
  const [stats, collections] = await Promise.all([
    getDashboardStats(DEMO_USER_ID),
    getCollectionsForUser(DEMO_USER_ID),
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
            {pinnedItems.map((item) => {
              const type = typeMap[item.typeId];
              return (
                <ItemCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  contentType={item.contentType}
                  content={item.content}
                  isFavorite={item.isFavorite}
                  isPinned={item.isPinned}
                  typeName={type?.name ?? ''}
                  typeIcon={type?.icon ?? 'File'}
                  typeColor={type?.color ?? '#6b7280'}
                  tags={item.tags}
                  updatedAt={item.updatedAt}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Recent Items */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Recent Items</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recentItems.map((item) => {
            const type = typeMap[item.typeId];
            return (
              <ItemCard
                key={item.id}
                title={item.title}
                description={item.description}
                contentType={item.contentType}
                content={item.content}
                isFavorite={item.isFavorite}
                isPinned={item.isPinned}
                typeName={type?.name ?? ''}
                typeIcon={type?.icon ?? 'File'}
                typeColor={type?.color ?? '#6b7280'}
                tags={item.tags}
                updatedAt={item.updatedAt}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
