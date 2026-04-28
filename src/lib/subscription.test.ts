import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    item: { count: vi.fn() },
    collection: { count: vi.fn() },
  },
}));

import { prisma } from '@/lib/prisma';
import {
  FREE_ITEM_LIMIT,
  FREE_COLLECTION_LIMIT,
  getUserItemCount,
  getUserCollectionCount,
} from './subscription';

const mockItemCount = vi.mocked(prisma.item.count);
const mockCollectionCount = vi.mocked(prisma.collection.count);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('constants', () => {
  it('FREE_ITEM_LIMIT is 50', () => {
    expect(FREE_ITEM_LIMIT).toBe(50);
  });

  it('FREE_COLLECTION_LIMIT is 3', () => {
    expect(FREE_COLLECTION_LIMIT).toBe(3);
  });
});

describe('getUserItemCount', () => {
  it('calls prisma.item.count with the correct userId', async () => {
    mockItemCount.mockResolvedValue(12);
    const result = await getUserItemCount('user-abc');
    expect(mockItemCount).toHaveBeenCalledWith({ where: { userId: 'user-abc' } });
    expect(result).toBe(12);
  });

  it('returns 0 when user has no items', async () => {
    mockItemCount.mockResolvedValue(0);
    const result = await getUserItemCount('user-abc');
    expect(result).toBe(0);
  });
});

describe('getUserCollectionCount', () => {
  it('calls prisma.collection.count with the correct userId', async () => {
    mockCollectionCount.mockResolvedValue(3);
    const result = await getUserCollectionCount('user-xyz');
    expect(mockCollectionCount).toHaveBeenCalledWith({ where: { userId: 'user-xyz' } });
    expect(result).toBe(3);
  });

  it('returns 0 when user has no collections', async () => {
    mockCollectionCount.mockResolvedValue(0);
    const result = await getUserCollectionCount('user-xyz');
    expect(result).toBe(0);
  });
});
