import { prisma } from '@/lib/prisma';

export interface ItemWithMeta {
  id: string;
  title: string;
  description: string | null;
  contentType: 'TEXT' | 'FILE' | 'URL';
  content: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  typeName: string;
  typeIcon: string;
  typeColor: string;
  tags: string[];
  updatedAt: string;
}

function mapItem(item: {
  id: string;
  title: string;
  description: string | null;
  contentType: string;
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
    contentType: item.contentType as 'TEXT' | 'FILE' | 'URL',
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
  type: true,
  tags: { include: { tag: true } },
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
