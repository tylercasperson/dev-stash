import { prisma } from '@/lib/prisma';

export interface CollectionWithMeta {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  dominantTypeColor: string;
  typeIcons: Array<{ icon: string; color: string; name: string }>;
  updatedAt: Date;
}

export async function getCollectionsForUser(userId: string): Promise<CollectionWithMeta[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      items: {
        include: {
          item: {
            include: { type: true },
          },
        },
      },
    },
  });

  return collections.map((col) => {
    const typeCounts = new Map<string, { count: number; icon: string; color: string; name: string }>();

    for (const ic of col.items) {
      const t = ic.item.type;
      const existing = typeCounts.get(t.id);
      if (existing) {
        existing.count++;
      } else {
        typeCounts.set(t.id, { count: 1, icon: t.icon, color: t.color, name: t.name });
      }
    }

    let dominantTypeColor = '#6b7280';
    let maxCount = 0;
    for (const meta of typeCounts.values()) {
      if (meta.count > maxCount) {
        maxCount = meta.count;
        dominantTypeColor = meta.color;
      }
    }

    const typeIcons = Array.from(typeCounts.values()).map(({ icon, color, name }) => ({
      icon,
      color,
      name,
    }));

    return {
      id: col.id,
      name: col.name,
      description: col.description,
      isFavorite: col.isFavorite,
      itemCount: col.items.length,
      dominantTypeColor,
      typeIcons,
      updatedAt: col.updatedAt,
    };
  });
}

export async function getDashboardStats(userId: string) {
  const [totalItems, totalCollections, favoriteItems, favoriteCollections] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
    prisma.collection.count({ where: { userId, isFavorite: true } }),
  ]);

  return { totalItems, totalCollections, favoriteItems, favoriteCollections };
}
