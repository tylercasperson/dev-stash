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

export interface PaginatedCollections {
  collections: CollectionWithMeta[];
  total: number;
}

export async function getCollectionsForUser(
  userId: string,
  page = 1,
  perPage?: number,
): Promise<PaginatedCollections> {
  const where = { userId };
  const include = {
    items: {
      select: {
        item: {
          select: {
            type: { select: { id: true, color: true, icon: true, name: true } },
          },
        },
      },
    },
  };

  const [rawCollections, total] = await Promise.all([
    prisma.collection.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      ...(perPage !== undefined ? { skip: (page - 1) * perPage, take: perPage } : {}),
      include,
    }),
    prisma.collection.count({ where }),
  ]);

  const collections = rawCollections.map((col) => {
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

    // TODO: at scale, replace this in-process aggregation with a GROUP BY SQL query
    // or a denormalized dominantTypeColor column updated on item mutations.
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

  return { collections, total };
}

export interface SidebarItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

export interface SidebarCollection {
  id: string;
  name: string;
  dominantTypeColor: string;
}

export interface SidebarData {
  itemTypes: SidebarItemType[];
  favoriteCollections: SidebarCollection[];
  recentCollections: SidebarCollection[];
}

const collectionItemsInclude = {
  items: {
    select: {
      item: {
        select: {
          type: { select: { id: true, color: true } },
        },
      },
    },
  },
} as const;

function getDominantTypeColor(
  items: Array<{ item: { type: { id: string; color: string } } }>,
): string {
  const typeCounts = new Map<string, { count: number; color: string }>();
  for (const ic of items) {
    const t = ic.item.type;
    const existing = typeCounts.get(t.id);
    if (existing) {
      existing.count++;
    } else {
      typeCounts.set(t.id, { count: 1, color: t.color });
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
  return dominantTypeColor;
}

export async function getSidebarData(userId: string): Promise<SidebarData> {
  const [itemTypes, favoriteCollections, recentCollections] = await Promise.all([
    prisma.itemType.findMany({
      where: { isSystem: true },
      include: {
        _count: { select: { items: { where: { userId } } } },
      },
    }),
    prisma.collection.findMany({
      where: { userId, isFavorite: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: collectionItemsInclude,
    }),
    prisma.collection.findMany({
      where: { userId, isFavorite: false },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: collectionItemsInclude,
    }),
  ]);

  const mappedItemTypes: SidebarItemType[] = itemTypes.map((t) => ({
    id: t.id,
    name: t.name,
    icon: t.icon,
    color: t.color,
    count: t._count.items,
  }));

  const mappedFavorites: SidebarCollection[] = favoriteCollections.map((col) => ({
    id: col.id,
    name: col.name,
    dominantTypeColor: getDominantTypeColor(col.items),
  }));

  const mappedRecents: SidebarCollection[] = recentCollections.map((col) => ({
    id: col.id,
    name: col.name,
    dominantTypeColor: getDominantTypeColor(col.items),
  }));

  return {
    itemTypes: mappedItemTypes,
    favoriteCollections: mappedFavorites,
    recentCollections: mappedRecents,
  };
}

export interface FavoriteCollection {
  id: string;
  name: string;
  itemCount: number;
  updatedAt: string;
}

export async function getFavoriteCollections(userId: string): Promise<FavoriteCollection[]> {
  const collections = await prisma.collection.findMany({
    where: { userId, isFavorite: true },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      name: true,
      updatedAt: true,
      _count: { select: { items: true } },
    },
  });

  return collections.map((col) => ({
    id: col.id,
    name: col.name,
    itemCount: col._count.items,
    updatedAt: col.updatedAt.toISOString().split('T')[0],
  }));
}

export interface CollectionDetailItem {
  id: string;
  title: string;
  typeName: string;
  typeIcon: string;
  typeColor: string;
}

export interface CollectionDetail {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  items: CollectionDetailItem[];
  createdAt: string;
  updatedAt: string;
}

export async function getCollectionById(
  userId: string,
  collectionId: string,
): Promise<CollectionDetail | null> {
  const collection = await prisma.collection.findFirst({
    where: { id: collectionId, userId },
    include: {
      items: {
        orderBy: { addedAt: 'desc' },
        select: {
          item: {
            select: {
              id: true,
              title: true,
              type: { select: { name: true, icon: true, color: true } },
            },
          },
        },
      },
    },
  });
  if (!collection) return null;

  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    isFavorite: collection.isFavorite,
    items: collection.items.map((ic) => ({
      id: ic.item.id,
      title: ic.item.title,
      typeName: ic.item.type.name,
      typeIcon: ic.item.type.icon,
      typeColor: ic.item.type.color,
    })),
    createdAt: collection.createdAt.toISOString().split('T')[0],
    updatedAt: collection.updatedAt.toISOString().split('T')[0],
  };
}

export interface CollectionOption {
  id: string;
  name: string;
}

export async function getCollectionOptions(userId: string): Promise<CollectionOption[]> {
  return prisma.collection.findMany({
    where: { userId },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });
}

export interface UpdateCollectionData {
  name: string;
  description: string | null;
}

export async function updateCollectionById(
  userId: string,
  collectionId: string,
  data: UpdateCollectionData,
): Promise<CollectionWithMeta | null> {
  const existing = await prisma.collection.findFirst({
    where: { id: collectionId, userId },
  });
  if (!existing) return null;

  const updated = await prisma.collection.update({
    where: { id: collectionId },
    data: { name: data.name, description: data.description },
    include: {
      items: {
        select: {
          item: {
            select: {
              type: { select: { id: true, color: true, icon: true, name: true } },
            },
          },
        },
      },
    },
  });

  const typeCounts = new Map<string, { count: number; icon: string; color: string; name: string }>();
  for (const ic of updated.items) {
    const t = ic.item.type;
    const entry = typeCounts.get(t.id);
    if (entry) { entry.count++; } else { typeCounts.set(t.id, { count: 1, icon: t.icon, color: t.color, name: t.name }); }
  }

  let dominantTypeColor = '#6b7280';
  let maxCount = 0;
  for (const meta of typeCounts.values()) {
    if (meta.count > maxCount) { maxCount = meta.count; dominantTypeColor = meta.color; }
  }

  return {
    id: updated.id,
    name: updated.name,
    description: updated.description,
    isFavorite: updated.isFavorite,
    itemCount: updated.items.length,
    dominantTypeColor,
    typeIcons: Array.from(typeCounts.values()).map(({ icon, color, name }) => ({ icon, color, name })),
    updatedAt: updated.updatedAt,
  };
}

export async function deleteCollectionById(
  userId: string,
  collectionId: string,
): Promise<boolean> {
  const existing = await prisma.collection.findFirst({
    where: { id: collectionId, userId },
  });
  if (!existing) return false;

  await prisma.collection.delete({ where: { id: collectionId } });
  return true;
}

export interface CreateCollectionData {
  name: string;
  description: string | null;
}

export async function createCollection(
  userId: string,
  data: CreateCollectionData,
): Promise<CollectionWithMeta> {
  const collection = await prisma.collection.create({
    data: {
      name: data.name,
      description: data.description,
      userId,
    },
    include: {
      items: {
        select: {
          item: {
            select: {
              type: { select: { id: true, color: true, icon: true, name: true } },
            },
          },
        },
      },
    },
  });

  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    isFavorite: collection.isFavorite,
    itemCount: 0,
    dominantTypeColor: '#6b7280',
    typeIcons: [],
    updatedAt: collection.updatedAt,
  };
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
