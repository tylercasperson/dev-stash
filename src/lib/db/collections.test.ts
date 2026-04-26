import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    collection: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    itemType: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';
import { getCollectionById, createCollection, updateCollectionById, deleteCollectionById, toggleCollectionFavorite } from './collections';

const mockFindFirst = vi.mocked(prisma.collection.findFirst);
const mockCreate = vi.mocked(prisma.collection.create);
const mockUpdate = vi.mocked(prisma.collection.update);
const mockDelete = vi.mocked(prisma.collection.delete);

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

const MOCK_CREATED_COLLECTION = {
  id: 'col-new',
  name: 'React Patterns',
  description: 'React hooks',
  isFavorite: false,
  createdAt: new Date('2026-04-24T12:00:00Z'),
  updatedAt: new Date('2026-04-24T12:00:00Z'),
  userId: 'user-1',
  defaultTypeId: null,
  items: [],
};

describe('createCollection', () => {
  it('creates and returns a CollectionWithMeta', async () => {
    mockCreate.mockResolvedValue(MOCK_CREATED_COLLECTION as never);
    const result = await createCollection('user-1', { name: 'React Patterns', description: 'React hooks' });

    expect(result.id).toBe('col-new');
    expect(result.name).toBe('React Patterns');
    expect(result.description).toBe('React hooks');
    expect(result.isFavorite).toBe(false);
  });

  it('returns itemCount 0 and default color for new empty collection', async () => {
    mockCreate.mockResolvedValue(MOCK_CREATED_COLLECTION as never);
    const result = await createCollection('user-1', { name: 'Empty', description: null });

    expect(result.itemCount).toBe(0);
    expect(result.dominantTypeColor).toBe('#6b7280');
    expect(result.typeIcons).toEqual([]);
  });

  it('passes null description through', async () => {
    mockCreate.mockResolvedValue({ ...MOCK_CREATED_COLLECTION, description: null } as never);
    const result = await createCollection('user-1', { name: 'No desc', description: null });

    expect(result.description).toBeNull();
  });

  it('scopes the create call to the provided userId', async () => {
    mockCreate.mockResolvedValue(MOCK_CREATED_COLLECTION as never);
    await createCollection('user-1', { name: 'Test', description: null });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ userId: 'user-1' }) }),
    );
  });
});

const MOCK_UPDATED_COLLECTION = {
  id: 'col-1',
  name: 'Updated Name',
  description: 'Updated description',
  isFavorite: false,
  createdAt: new Date('2026-04-20T08:00:00Z'),
  updatedAt: new Date('2026-04-25T10:00:00Z'),
  userId: 'user-1',
  defaultTypeId: null,
  items: [],
};

describe('updateCollectionById', () => {
  it('returns null when collection not found for user', async () => {
    mockFindFirst.mockResolvedValue(null);
    const result = await updateCollectionById('user-1', 'col-1', { name: 'New', description: null });
    expect(result).toBeNull();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('updates and returns CollectionWithMeta on success', async () => {
    mockFindFirst.mockResolvedValue(BASE_COLLECTION as never);
    mockUpdate.mockResolvedValue(MOCK_UPDATED_COLLECTION as never);

    const result = await updateCollectionById('user-1', 'col-1', { name: 'Updated Name', description: 'Updated description' });

    expect(result).not.toBeNull();
    expect(result!.name).toBe('Updated Name');
    expect(result!.description).toBe('Updated description');
  });

  it('queries ownership with userId before updating', async () => {
    mockFindFirst.mockResolvedValue(null);
    await updateCollectionById('user-1', 'col-1', { name: 'X', description: null });

    expect(mockFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'col-1', userId: 'user-1' } }),
    );
  });

  it('passes null description through to update', async () => {
    mockFindFirst.mockResolvedValue(BASE_COLLECTION as never);
    mockUpdate.mockResolvedValue({ ...MOCK_UPDATED_COLLECTION, description: null } as never);

    const result = await updateCollectionById('user-1', 'col-1', { name: 'X', description: null });
    expect(result!.description).toBeNull();
  });

  it('returns itemCount 0 and default color for collection with no items', async () => {
    mockFindFirst.mockResolvedValue(BASE_COLLECTION as never);
    mockUpdate.mockResolvedValue(MOCK_UPDATED_COLLECTION as never);

    const result = await updateCollectionById('user-1', 'col-1', { name: 'X', description: null });
    expect(result!.itemCount).toBe(0);
    expect(result!.dominantTypeColor).toBe('#6b7280');
  });
});

describe('deleteCollectionById', () => {
  it('returns false when collection not found for user', async () => {
    mockFindFirst.mockResolvedValue(null);
    const result = await deleteCollectionById('user-1', 'col-1');
    expect(result).toBe(false);
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('deletes and returns true on success', async () => {
    mockFindFirst.mockResolvedValue(BASE_COLLECTION as never);
    mockDelete.mockResolvedValue(BASE_COLLECTION as never);

    const result = await deleteCollectionById('user-1', 'col-1');
    expect(result).toBe(true);
  });

  it('calls delete with the correct collection id', async () => {
    mockFindFirst.mockResolvedValue(BASE_COLLECTION as never);
    mockDelete.mockResolvedValue(BASE_COLLECTION as never);

    await deleteCollectionById('user-1', 'col-1');

    expect(mockDelete).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'col-1' } }),
    );
  });

  it('queries ownership with userId before deleting', async () => {
    mockFindFirst.mockResolvedValue(null);
    await deleteCollectionById('user-1', 'col-1');

    expect(mockFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'col-1', userId: 'user-1' } }),
    );
  });
});

describe('toggleCollectionFavorite', () => {
  it('returns null when collection not found for user', async () => {
    mockFindFirst.mockResolvedValue(null);
    const result = await toggleCollectionFavorite('user-1', 'col-999');
    expect(result).toBeNull();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('flips isFavorite from false to true and returns true', async () => {
    mockFindFirst.mockResolvedValue({ ...BASE_COLLECTION, isFavorite: false } as never);
    mockUpdate.mockResolvedValue({ isFavorite: true } as never);

    const result = await toggleCollectionFavorite('user-1', 'col-1');

    expect(result).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: { isFavorite: true } }),
    );
  });

  it('flips isFavorite from true to false and returns false', async () => {
    mockFindFirst.mockResolvedValue({ ...BASE_COLLECTION, isFavorite: true } as never);
    mockUpdate.mockResolvedValue({ isFavorite: false } as never);

    const result = await toggleCollectionFavorite('user-1', 'col-1');

    expect(result).toBe(false);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: { isFavorite: false } }),
    );
  });

  it('queries ownership with userId before updating', async () => {
    mockFindFirst.mockResolvedValue(null);
    await toggleCollectionFavorite('user-1', 'col-1');

    expect(mockFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'col-1', userId: 'user-1' } }),
    );
  });
});
