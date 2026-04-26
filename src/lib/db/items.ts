import { prisma } from '@/lib/prisma';
import type { ContentType } from '@/generated/prisma/enums';

export interface ItemWithMeta {
  id: string;
  title: string;
  description: string | null;
  contentType: ContentType;
  content: string | null;
  url: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  isFavorite: boolean;
  isPinned: boolean;
  typeName: string;
  typeIcon: string;
  typeColor: string;
  tags: string[];
  updatedAt: string;
}

export interface ItemDetail extends ItemWithMeta {
  language: string | null;
  collections: Array<{ id: string; name: string }>;
  createdAt: string;
}

function mapItem(item: {
  id: string;
  title: string;
  description: string | null;
  contentType: ContentType;
  content: string | null;
  url: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: Date;
  type: { name: string; icon: string; color: string };
  tags: Array<{ tag: { name: string } }>;
}): ItemWithMeta {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    contentType: item.contentType,
    content: item.content,
    url: item.url,
    fileUrl: item.fileUrl,
    fileName: item.fileName,
    fileSize: item.fileSize,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    typeName: item.type.name,
    typeIcon: item.type.icon,
    typeColor: item.type.color,
    tags: item.tags.map((t) => t.tag.name),
    updatedAt: item.updatedAt.toISOString().split('T')[0],
  };
}

const itemInclude = {
  type: { select: { name: true, icon: true, color: true } },
  tags: { select: { tag: { select: { name: true } } } },
} as const;

const itemDetailInclude = {
  type: { select: { name: true, icon: true, color: true } },
  tags: { select: { tag: { select: { name: true } } } },
  collections: { select: { collection: { select: { id: true, name: true } } } },
} as const;

export async function getPinnedItems(userId: string): Promise<ItemWithMeta[]> {
  const items = await prisma.item.findMany({
    where: { userId, isPinned: true },
    orderBy: { updatedAt: 'desc' },
    include: itemInclude,
  });

  return items.map(mapItem);
}

export async function getRecentItems(userId: string, limit = 8): Promise<ItemWithMeta[]> {
  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    include: itemInclude,
  });

  return items.map(mapItem);
}

export async function getItemById(userId: string, itemId: string): Promise<ItemDetail | null> {
  const item = await prisma.item.findFirst({
    where: { id: itemId, userId },
    include: itemDetailInclude,
  });
  if (!item) return null;

  return {
    ...mapItem(item),
    language: item.language,
    fileUrl: item.fileUrl,
    fileName: item.fileName,
    fileSize: item.fileSize,
    url: item.url,
    collections: item.collections.map((c) => c.collection),
    createdAt: item.createdAt.toISOString().split('T')[0],
  };
}

export interface UpdateItemData {
  title: string;
  description: string | null;
  content: string | null;
  url: string | null;
  language: string | null;
  tags: string[];
  collectionIds: string[];
}

export async function updateItem(
  userId: string,
  itemId: string,
  data: UpdateItemData,
): Promise<ItemDetail | null> {
  const existing = await prisma.item.findFirst({ where: { id: itemId, userId } });
  if (!existing) return null;

  const item = await prisma.item.update({
    where: { id: itemId },
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      url: data.url,
      language: data.language,
      tags: {
        deleteMany: {},
        create: data.tags.map((name) => ({
          tag: { connectOrCreate: { where: { name }, create: { name } } },
        })),
      },
      collections: {
        deleteMany: {},
        create: data.collectionIds.map((collectionId) => ({ collectionId })),
      },
    },
    include: itemDetailInclude,
  });

  return {
    ...mapItem(item),
    language: item.language,
    fileUrl: item.fileUrl,
    fileName: item.fileName,
    fileSize: item.fileSize,
    url: item.url,
    collections: item.collections.map((c) => c.collection),
    createdAt: item.createdAt.toISOString().split('T')[0],
  };
}

export async function deleteItem(
  userId: string,
  itemId: string,
): Promise<{ fileUrl: string | null } | null> {
  const existing = await prisma.item.findFirst({ where: { id: itemId, userId } });
  if (!existing) return null;
  await prisma.item.delete({ where: { id: itemId } });
  return { fileUrl: existing.fileUrl };
}

export interface PaginatedItems {
  items: ItemWithMeta[];
  total: number;
}

export async function getItemsByType(
  userId: string,
  typeName: string,
  page = 1,
  perPage = 21,
): Promise<PaginatedItems> {
  const where = { userId, type: { name: typeName } };
  const [items, total] = await Promise.all([
    prisma.item.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      include: itemInclude,
    }),
    prisma.item.count({ where }),
  ]);

  return { items: items.map(mapItem), total };
}

export async function getFavoriteItems(userId: string): Promise<ItemWithMeta[]> {
  const items = await prisma.item.findMany({
    where: { userId, isFavorite: true },
    orderBy: { updatedAt: 'desc' },
    include: itemInclude,
  });
  return items.map(mapItem);
}

export async function getItemsByCollection(
  userId: string,
  collectionId: string,
  page = 1,
  perPage = 21,
): Promise<PaginatedItems> {
  const where = { userId, collections: { some: { collectionId } } };
  const [items, total] = await Promise.all([
    prisma.item.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      include: itemInclude,
    }),
    prisma.item.count({ where }),
  ]);

  return { items: items.map(mapItem), total };
}

export interface CreateItemData {
  typeName: string;
  title: string;
  description: string | null;
  content: string | null;
  url: string | null;
  language: string | null;
  tags: string[];
  collectionIds: string[];
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
}

const FILE_TYPES = new Set(['file', 'image']);

export async function createItem(userId: string, data: CreateItemData): Promise<ItemDetail | null> {
  const itemType = await prisma.itemType.findFirst({
    where: { name: data.typeName, isSystem: true },
  });
  if (!itemType) return null;

  const contentType: ContentType = data.typeName === 'link'
    ? 'URL'
    : FILE_TYPES.has(data.typeName)
    ? 'FILE'
    : 'TEXT';

  const item = await prisma.item.create({
    data: {
      title: data.title,
      description: data.description,
      contentType,
      content: data.content,
      url: data.url,
      language: data.language,
      fileUrl: data.fileUrl ?? null,
      fileName: data.fileName ?? null,
      fileSize: data.fileSize ?? null,
      userId,
      typeId: itemType.id,
      tags: {
        create: data.tags.map((name) => ({
          tag: { connectOrCreate: { where: { name }, create: { name } } },
        })),
      },
      collections: {
        create: data.collectionIds.map((collectionId) => ({ collectionId })),
      },
    },
    include: itemDetailInclude,
  });

  return {
    ...mapItem(item),
    language: item.language,
    fileUrl: item.fileUrl,
    fileName: item.fileName,
    fileSize: item.fileSize,
    url: item.url,
    collections: item.collections.map((c) => c.collection),
    createdAt: item.createdAt.toISOString().split('T')[0],
  };
}
