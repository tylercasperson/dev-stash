import { prisma } from '@/lib/prisma';
import type { ContentType } from '@/generated/prisma/enums';

export interface ItemWithMeta {
  id: string;
  title: string;
  description: string | null;
  contentType: ContentType;
  content: string | null;
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
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  url: string | null;
  collections: Array<{ id: string; name: string }>;
  createdAt: string;
}

function mapItem(item: {
  id: string;
  title: string;
  description: string | null;
  contentType: ContentType;
  content: string | null;
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
    include: {
      type: { select: { name: true, icon: true, color: true } },
      tags: { select: { tag: { select: { name: true } } } },
      collections: { select: { collection: { select: { id: true, name: true } } } },
    },
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

export async function getItemsByType(userId: string, typeName: string): Promise<ItemWithMeta[]> {
  const items = await prisma.item.findMany({
    where: { userId, type: { name: typeName } },
    orderBy: { updatedAt: 'desc' },
    include: itemInclude,
  });

  return items.map(mapItem);
}
