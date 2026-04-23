import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    collection: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    itemType: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';
import { getCollectionById } from './collections';

const mockFindFirst = vi.mocked(prisma.collection.findFirst);

const BASE_COLLECTION = {
  id: 'col-1',
  name: 'React Patterns',
  description: 'React hooks and patterns',
  isFavorite: true,
  createdAt: new Date('2026-04-20T08:00:00Z'),
  updatedAt: new Date('2026-04-22T10:30:00Z'),
  items: [
    {
      item: {
        id: 'item-1',
        title: 'useEffect hook',
        type: { name: 'snippet', icon: 'Code', color: '#3b82f6' },
      },
    },
    {
      item: {
        id: 'item-2',
        title: 'React Query setup',
        type: { name: 'note', icon: 'StickyNote', color: '#fde047' },
      },
    },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getCollectionById', () => {
  it('returns null when collection not found', async () => {
    mockFindFirst.mockResolvedValue(null);
    const result = await getCollectionById('user-1', 'missing-id');
    expect(result).toBeNull();
  });

  it('returns mapped CollectionDetail when collection exists', async () => {
    mockFindFirst.mockResolvedValue(BASE_COLLECTION as never);
    const result = await getCollectionById('user-1', 'col-1');

    expect(result).not.toBeNull();
    expect(result!.id).toBe('col-1');
    expect(result!.name).toBe('React Patterns');
    expect(result!.description).toBe('React hooks and patterns');
    expect(result!.isFavorite).toBe(true);
  });

  it('maps items with type metadata', async () => {
    mockFindFirst.mockResolvedValue(BASE_COLLECTION as never);
    const result = await getCollectionById('user-1', 'col-1');

    expect(result!.items).toHaveLength(2);
    expect(result!.items[0]).toEqual({
      id: 'item-1',
      title: 'useEffect hook',
      typeName: 'snippet',
      typeIcon: 'Code',
      typeColor: '#3b82f6',
    });
  });

  it('formats dates as YYYY-MM-DD strings', async () => {
    mockFindFirst.mockResolvedValue(BASE_COLLECTION as never);
    const result = await getCollectionById('user-1', 'col-1');

    expect(result!.createdAt).toBe('2026-04-20');
    expect(result!.updatedAt).toBe('2026-04-22');
  });

  it('queries with userId scope to prevent cross-user access', async () => {
    mockFindFirst.mockResolvedValue(null);
    await getCollectionById('user-1', 'col-1');

    expect(mockFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'col-1', userId: 'user-1' } }),
    );
  });

  it('returns empty items array for collection with no items', async () => {
    mockFindFirst.mockResolvedValue({ ...BASE_COLLECTION, items: [] } as never);
    const result = await getCollectionById('user-1', 'col-1');

    expect(result!.items).toEqual([]);
  });

  it('passes through null description', async () => {
    mockFindFirst.mockResolvedValue({ ...BASE_COLLECTION, description: null } as never);
    const result = await getCollectionById('user-1', 'col-1');

    expect(result!.description).toBeNull();
  });
});
