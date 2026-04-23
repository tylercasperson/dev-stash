import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/auth', () => ({ auth: vi.fn() }));
vi.mock('@/lib/db/items', () => ({ updateItem: vi.fn(), deleteItem: vi.fn() }));

import { auth } from '@/auth';
import { updateItem as dbUpdateItem, deleteItem as dbDeleteItem } from '@/lib/db/items';
import { updateItem, deleteItem } from './items';

const mockAuth = vi.mocked(auth);
const mockDbUpdate = vi.mocked(dbUpdateItem);
const mockDbDelete = vi.mocked(dbDeleteItem);

const VALID_INPUT = {
  title: 'My Snippet',
  description: 'A description',
  content: 'const x = 1;',
  url: null,
  language: 'typescript',
  tags: ['react', 'hooks'],
};

const MOCK_ITEM_DETAIL = {
  id: 'item-1',
  title: 'My Snippet',
  description: 'A description',
  contentType: 'TEXT' as const,
  content: 'const x = 1;',
  isFavorite: false,
  isPinned: false,
  typeName: 'snippet',
  typeIcon: 'Code',
  typeColor: '#3b82f6',
  language: 'typescript',
  fileUrl: null,
  fileName: null,
  fileSize: null,
  url: null,
  tags: ['react', 'hooks'],
  collections: [],
  createdAt: '2026-04-20',
  updatedAt: '2026-04-22',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('updateItem server action', () => {
  it('returns unauthorized when no session', async () => {
    mockAuth.mockResolvedValue(null as never);
    const result = await updateItem('item-1', VALID_INPUT);

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Unauthorized');
    expect(mockDbUpdate).not.toHaveBeenCalled();
  });

  it('returns unauthorized when session has no user id', async () => {
    mockAuth.mockResolvedValue({ user: {} } as never);
    const result = await updateItem('item-1', VALID_INPUT);

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Unauthorized');
  });

  it('returns validation error when title is empty', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    const result = await updateItem('item-1', { ...VALID_INPUT, title: '   ' });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain('Title is required');
  });

  it('returns validation error for invalid URL', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    const result = await updateItem('item-1', { ...VALID_INPUT, url: 'not-a-url' });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain('valid URL');
  });

  it('returns not found when db returns null', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbUpdate.mockResolvedValue(null);
    const result = await updateItem('item-1', VALID_INPUT);

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Item not found');
  });

  it('returns success with updated item on happy path', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbUpdate.mockResolvedValue(MOCK_ITEM_DETAIL);
    const result = await updateItem('item-1', VALID_INPUT);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('My Snippet');
      expect(result.data.tags).toEqual(['react', 'hooks']);
    }
  });

  it('accepts tags as comma-separated string and splits them', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbUpdate.mockResolvedValue(MOCK_ITEM_DETAIL);
    await updateItem('item-1', { ...VALID_INPUT, tags: 'react, hooks, ts' });

    expect(mockDbUpdate).toHaveBeenCalledWith(
      'user-1',
      'item-1',
      expect.objectContaining({ tags: ['react', 'hooks', 'ts'] }),
    );
  });

  it('accepts valid https URL', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbUpdate.mockResolvedValue(MOCK_ITEM_DETAIL);
    const result = await updateItem('item-1', { ...VALID_INPUT, url: 'https://example.com' });

    expect(result.success).toBe(true);
    expect(mockDbUpdate).toHaveBeenCalledWith(
      'user-1',
      'item-1',
      expect.objectContaining({ url: 'https://example.com' }),
    );
  });

  it('trims whitespace from title', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbUpdate.mockResolvedValue(MOCK_ITEM_DETAIL);
    await updateItem('item-1', { ...VALID_INPUT, title: '  My Title  ' });

    expect(mockDbUpdate).toHaveBeenCalledWith(
      'user-1',
      'item-1',
      expect.objectContaining({ title: 'My Title' }),
    );
  });
});

describe('deleteItem server action', () => {
  it('returns unauthorized when no session', async () => {
    mockAuth.mockResolvedValue(null as never);
    const result = await deleteItem('item-1');

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Unauthorized');
    expect(mockDbDelete).not.toHaveBeenCalled();
  });

  it('returns unauthorized when session has no user id', async () => {
    mockAuth.mockResolvedValue({ user: {} } as never);
    const result = await deleteItem('item-1');

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Unauthorized');
  });

  it('returns not found when item does not belong to user', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbDelete.mockResolvedValue(false);
    const result = await deleteItem('item-1');

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Item not found');
  });

  it('returns success on happy path', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbDelete.mockResolvedValue(true);
    const result = await deleteItem('item-1');

    expect(result.success).toBe(true);
    expect(mockDbDelete).toHaveBeenCalledWith('user-1', 'item-1');
  });
});
