import Link from 'next/link';
import StatsGrid from '@/components/dashboard/StatsGrid';
import CollectionsWithDrawer from '@/components/dashboard/CollectionsWithDrawer';
import ItemsWithDrawer from '@/components/dashboard/ItemsWithDrawer';
import { getCollectionsForUser, getDashboardStats } from '@/lib/db/collections';
import { getPinnedItems, getRecentItems } from '@/lib/db/items';
import { auth } from '@/auth';
import { DEMO_USER_ID } from '@/lib/demo';
import { DASHBOARD_COLLECTIONS_LIMIT, DASHBOARD_RECENT_ITEMS_LIMIT } from '@/lib/constants';

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id ?? DEMO_USER_ID;

  const [stats, { collections }, pinnedItems, recentItems] = await Promise.all([
    getDashboardStats(userId),
    getCollectionsForUser(userId, 1, DASHBOARD_COLLECTIONS_LIMIT),
    getPinnedItems(userId),
    getRecentItems(userId, DASHBOARD_RECENT_ITEMS_LIMIT),
  ]);

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
          <h2 className="text-base font-semibold text-foreground">Collections</h2>
          <Link href="/collections" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            View all
          </Link>
        </div>
        <CollectionsWithDrawer
          collections={collections}
          gridClassName="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        />
      </section>

      {/* Pinned Items */}
      {pinnedItems.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">Pinned</h2>
          <ItemsWithDrawer items={pinnedItems} layout="row" gridClassName="flex flex-col gap-2" />
        </section>
      )}

      {/* Recent Items */}
      <section>
        <h2 className="mb-3 text-base font-semibold text-foreground">Recent Items</h2>
        <ItemsWithDrawer items={recentItems} layout="row" gridClassName="flex flex-col gap-2" />
      </section>
    </div>
  );
}
