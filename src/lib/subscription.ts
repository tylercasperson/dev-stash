import { prisma } from '@/lib/prisma';

export const FREE_ITEM_LIMIT = 50;
export const FREE_COLLECTION_LIMIT = 3;

export async function getUserItemCount(userId: string): Promise<number> {
  return prisma.item.count({ where: { userId } });
}

export async function getUserCollectionCount(userId: string): Promise<number> {
  return prisma.collection.count({ where: { userId } });
}
