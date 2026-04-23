import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    item: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';
import { getItemById, updateItem } from './items';

const mockFindFirst = vi.mocked(prisma.item.findFirst);
const mockUpdate = vi.mocked(prisma.item.update);

const BASE_ITEM = {
  id: 'item-1',
  title: 'My Snippet',
  description: 'A test snippet',
  contentType: 'TEXT' as const,
  content: 'const x = 1;',
  isFavorite: false,
  isPinned: true,
  language: 'typescript',
  fileUrl: null,
  fileName: null,
  fileSize: null,
  url: null,
  updatedAt: new Date('2026-04-22T10:30:00Z'),
  createdAt: new Date('2026-04-20T08:00:00Z'),
  type: { name: 'snippet', icon: 'Code', color: '#3b82f6' },
  tags: [{ tag: { name: 'react' } }, { tag: { name: 'hooks' } }],
  collections: [{ collection: { id: 'col-1', name: 'React Patterns' } }],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getItemById', () => {
  it('returns mapped ItemDetail when item exists and belongs to user', async () => {
    mockFindFirst.mockResolvedValue(BASE_ITEM as never);
    const result = await getItemById('user-1', 'item-1');

    expect(result).not.toBeNull();
    expect(result!.id).toBe('item-1');
    expect(result!.title).toBe('My Snippet');
    expect(result!.description).toBe('A test snippet');
    expect(result!.contentType).toBe('TEXT');
    expect(result!.content).toBe('const x = 1;');
    expect(result!.isFavorite).toBe(false);
    expect(result!.isPinned).toBe(true);
    expect(result!.typeName).toBe('snippet');
    expect(result!.typeIcon).toBe('Code');
    expect(result!.typeColor).toBe('#3b82f6');
    expect(result!.language).toBe('typescript');
    expect(result!.tags).toEqual(['react', 'hooks']);
    expect(result!.collections).toEqual([{ id: 'col-1', name: 'React Patterns' }]);
    expect(result!.updatedAt).toBe('2026-04-22');
    expect(result!.createdAt).toBe('2026-04-20');
  });

  it('returns null when item does not exist', async () => {
    mockFindFirst.mockResolvedValue(null);
    const result = await getItemById('user-1', 'nonexistent-id');
    expect(result).toBeNull();
  });

  it('returns null when item belongs to a different user', async () => {
    // Prisma returns null when both id AND userId conditions aren't met
    mockFindFirst.mockResolvedValue(null);
    const result = await getItemById('other-user', 'item-1');
    expect(result).toBeNull();
  });

  it('maps empty tags and collections correctly', async () => {
    mockFindFirst.mockResolvedValue({ ...BASE_ITEM, tags: [], collections: [] } as never);
    const result = await getItemById('user-1', 'item-1');

    expect(result!.tags).toEqual([]);
    expect(result!.collections).toEqual([]);
  });

  it('maps multiple collections correctly', async () => {
    const multiCollections = [
      { collection: { id: 'col-1', name: 'React Patterns' } },
      { collection: { id: 'col-2', name: 'Interview Prep' } },
      { collection: { id: 'col-3', name: 'Favorites' } },
    ];
    mockFindFirst.mockResolvedValue({ ...BASE_ITEM, collections: multiCollections } as never);
    const result = await getItemById('user-1', 'item-1');

    expect(result!.collections).toEqual([
      { id: 'col-1', name: 'React Patterns' },
      { id: 'col-2', name: 'Interview Prep' },
      { id: 'col-3', name: 'Favorites' },
    ]);
  });

  it('calls prisma with correct query argument', async () => {
    mockFindFirst.mockResolvedValue(BASE_ITEM as never);
    await getItemById('user-1', 'item-1');

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: 'item-1', userId: 'user-1' },
      include: {
        type: { select: { name: true, icon: true, color: true } },
        tags: { select: { tag: { select: { name: true } } } },
        collections: { select: { collection: { select: { id: true, name: true } } } },
      },
    });
  });
});

describe('updateItem', () => {
  const UPDATE_DATA = {
    title: 'Updated Title',
    description: 'Updated description',
    content: 'const y = 2;',
    url: null,
    language: 'javascript',
    tags: ['react', 'updated'],
  };

  const UPDATED_ITEM = {
    ...BASE_ITEM,
    title: 'Updated Title',
    description: 'Updated description',
    content: 'const y = 2;',
    language: 'javascript',
    tags: [{ tag: { name: 'react' } }, { tag: { name: 'updated' } }],
    updatedAt: new Date('2026-04-22T12:00:00Z'),
  };

  it('returns null when item does not belong to user', async () => {
    mockFindFirst.mockResolvedValue(null);
    const result = await updateItem('other-user', 'item-1', UPDATE_DATA);
    expect(result).toBeNull();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('returns updated ItemDetail on success', async () => {
    mockFindFirst.mockResolvedValue(BASE_ITEM as never);
    mockUpdate.mockResolvedValue(UPDATED_ITEM as never);

    const result = await updateItem('user-1', 'item-1', UPDATE_DATA);

    expect(result).not.toBeNull();
    expect(result!.title).toBe('Updated Title');
    expect(result!.description).toBe('Updated description');
    expect(result!.content).toBe('const y = 2;');
    expect(result!.language).toBe('javascript');
    expect(result!.tags).toEqual(['react', 'updated']);
    expect(result!.updatedAt).toBe('2026-04-22');
  });

  it('calls prisma.item.update with tag deleteMany and create', async () => {
    mockFindFirst.mockResolvedValue(BASE_ITEM as never);
    mockUpdate.mockResolvedValue(UPDATED_ITEM as never);

    await updateItem('user-1', 'item-1', { ...UPDATE_DATA, tags: ['ts', 'vitest'] });

    const updateCall = mockUpdate.mock.calls[0][0] as Record<string, unknown>;
    const data = updateCall.data as Record<string, unknown>;
    expect((data.tags as Record<string, unknown>).deleteMany).toBeDefined();
    const creates = (data.tags as { create: unknown[] }).create;
    expect(creates).toHaveLength(2);
  });

  it('passes null fields through to prisma', async () => {
    mockFindFirst.mockResolvedValue(BASE_ITEM as never);
    mockUpdate.mockResolvedValue({ ...UPDATED_ITEM, language: null, content: null, tags: [] } as never);

    const result = await updateItem('user-1', 'item-1', {
      ...UPDATE_DATA,
      language: null,
      content: null,
      tags: [],
    });

    expect(result!.language).toBeNull();
    expect(result!.content).toBeNull();
    expect(result!.tags).toEqual([]);
  });
});
