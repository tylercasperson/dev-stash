import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/auth', () => ({ auth: vi.fn() }));
vi.mock('@/lib/db/items', () => ({ updateItem: vi.fn(), deleteItem: vi.fn(), createItem: vi.fn(), toggleItemFavorite: vi.fn(), toggleItemPinById: vi.fn() }));
vi.mock('@/lib/r2', () => ({ deleteFromR2: vi.fn() }));

import { auth } from '@/auth';
import { updateItem as dbUpdateItem, deleteItem as dbDeleteItem, createItem as dbCreateItem, toggleItemFavorite as dbToggleItemFavorite, toggleItemPinById as dbToggleItemPin } from '@/lib/db/items';
import { deleteFromR2 } from '@/lib/r2';
import { updateItem, deleteItem, createItem, toggleItemFavorite, toggleItemPin } from './items';

const mockAuth = vi.mocked(auth);
const mockDbUpdate = vi.mocked(dbUpdateItem);
const mockDbDelete = vi.mocked(dbDeleteItem);
const mockDeleteFromR2 = vi.mocked(deleteFromR2);
const mockDbCreate = vi.mocked(dbCreateItem);
const mockDbToggleFavorite = vi.mocked(dbToggleItemFavorite);
const mockDbTogglePin = vi.mocked(dbToggleItemPin);

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

  it('passes collectionIds through to db', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbUpdate.mockResolvedValue(MOCK_ITEM_DETAIL);
    await updateItem('item-1', { ...VALID_INPUT, collectionIds: ['col-1', 'col-2'] });

    expect(mockDbUpdate).toHaveBeenCalledWith(
      'user-1',
      'item-1',
      expect.objectContaining({ collectionIds: ['col-1', 'col-2'] }),
    );
  });

  it('defaults collectionIds to empty array when not provided', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbUpdate.mockResolvedValue(MOCK_ITEM_DETAIL);
    await updateItem('item-1', VALID_INPUT);

    expect(mockDbUpdate).toHaveBeenCalledWith(
      'user-1',
      'item-1',
      expect.objectContaining({ collectionIds: [] }),
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
    mockDbDelete.mockResolvedValue(null);
    const result = await deleteItem('item-1');

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Item not found');
  });

  it('returns success on happy path (no file)', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbDelete.mockResolvedValue({ fileUrl: null });
    const result = await deleteItem('item-1');

    expect(result.success).toBe(true);
    expect(mockDbDelete).toHaveBeenCalledWith('user-1', 'item-1');
    expect(mockDeleteFromR2).not.toHaveBeenCalled();
  });

  it('calls deleteFromR2 when item has a fileUrl', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbDelete.mockResolvedValue({ fileUrl: 'https://pub.r2.dev/user-1/abc.png' });
    mockDeleteFromR2.mockResolvedValue(undefined);
    const result = await deleteItem('item-1');

    expect(result.success).toBe(true);
    expect(mockDeleteFromR2).toHaveBeenCalledWith('https://pub.r2.dev/user-1/abc.png');
  });
});

const MOCK_CREATED_ITEM = {
  id: 'item-2',
  title: 'New Snippet',
  description: null,
  contentType: 'TEXT' as const,
  content: 'const y = 2;',
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
  tags: [],
  collections: [],
  createdAt: '2026-04-22',
  updatedAt: '2026-04-22',
};

describe('createItem server action', () => {
  const VALID_SNIPPET = {
    typeName: 'snippet',
    title: 'New Snippet',
    description: null,
    content: 'const y = 2;',
    url: null,
    language: 'typescript',
    tags: [] as string[],
  };

  it('returns unauthorized when no session', async () => {
    mockAuth.mockResolvedValue(null as never);
    const result = await createItem(VALID_SNIPPET);

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Unauthorized');
    expect(mockDbCreate).not.toHaveBeenCalled();
  });

  it('returns unauthorized when session has no user id', async () => {
    mockAuth.mockResolvedValue({ user: {} } as never);
    const result = await createItem(VALID_SNIPPET);

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Unauthorized');
  });

  it('returns validation error when title is empty', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    const result = await createItem({ ...VALID_SNIPPET, title: '   ' });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain('Title is required');
  });

  it('returns validation error for unknown type', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    const result = await createItem({ ...VALID_SNIPPET, typeName: 'custom-unknown' });

    expect(result.success).toBe(false);
  });

  it('returns error when file type has no fileUrl', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    const result = await createItem({ ...VALID_SNIPPET, typeName: 'file', fileUrl: null });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('File upload required');
  });

  it('returns error when image type has no fileUrl', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    const result = await createItem({ ...VALID_SNIPPET, typeName: 'image', fileUrl: null });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('File upload required');
  });

  it('returns success for file type with fileUrl', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    const fileItem = { ...MOCK_CREATED_ITEM, typeName: 'file', contentType: 'FILE' as const, fileUrl: 'https://pub.r2.dev/user-1/abc.pdf', fileName: 'doc.pdf', fileSize: 102400 };
    mockDbCreate.mockResolvedValue(fileItem);
    const result = await createItem({ ...VALID_SNIPPET, typeName: 'file', content: null, fileUrl: 'https://pub.r2.dev/user-1/abc.pdf', fileName: 'doc.pdf', fileSize: 102400 });

    expect(result.success).toBe(true);
    expect(mockDbCreate).toHaveBeenCalledWith('user-1', expect.objectContaining({
      typeName: 'file',
      fileUrl: 'https://pub.r2.dev/user-1/abc.pdf',
      fileName: 'doc.pdf',
      fileSize: 102400,
    }));
  });

  it('returns error when link has no URL', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    const result = await createItem({ ...VALID_SNIPPET, typeName: 'link', url: null });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('URL is required for links');
  });

  it('returns error when db returns null', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbCreate.mockResolvedValue(null);
    const result = await createItem(VALID_SNIPPET);

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Failed to create item');
  });

  it('returns success with created item on happy path (snippet)', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbCreate.mockResolvedValue(MOCK_CREATED_ITEM);
    const result = await createItem(VALID_SNIPPET);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('New Snippet');
      expect(result.data.typeName).toBe('snippet');
    }
    expect(mockDbCreate).toHaveBeenCalledWith('user-1', expect.objectContaining({
      typeName: 'snippet',
      title: 'New Snippet',
    }));
  });

  it('returns success for link with valid URL', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbCreate.mockResolvedValue({ ...MOCK_CREATED_ITEM, typeName: 'link', contentType: 'URL' as const, url: 'https://example.com' });
    const result = await createItem({ ...VALID_SNIPPET, typeName: 'link', url: 'https://example.com', content: null, language: null });

    expect(result.success).toBe(true);
    expect(mockDbCreate).toHaveBeenCalledWith('user-1', expect.objectContaining({
      typeName: 'link',
      url: 'https://example.com',
    }));
  });

  it('accepts tags as comma-separated string', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbCreate.mockResolvedValue(MOCK_CREATED_ITEM);
    await createItem({ ...VALID_SNIPPET, tags: 'react, hooks' });

    expect(mockDbCreate).toHaveBeenCalledWith('user-1', expect.objectContaining({
      tags: ['react', 'hooks'],
    }));
  });

  it('passes collectionIds through to db', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbCreate.mockResolvedValue(MOCK_CREATED_ITEM);
    await createItem({ ...VALID_SNIPPET, collectionIds: ['col-1', 'col-3'] });

    expect(mockDbCreate).toHaveBeenCalledWith('user-1', expect.objectContaining({
      collectionIds: ['col-1', 'col-3'],
    }));
  });

  it('defaults collectionIds to empty array when not provided', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbCreate.mockResolvedValue(MOCK_CREATED_ITEM);
    await createItem(VALID_SNIPPET);

    expect(mockDbCreate).toHaveBeenCalledWith('user-1', expect.objectContaining({
      collectionIds: [],
    }));
  });
});

describe('toggleItemFavorite server action', () => {
  it('returns unauthorized when no session', async () => {
    mockAuth.mockResolvedValue(null as never);
    const result = await toggleItemFavorite('item-1');

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Unauthorized');
    expect(mockDbToggleFavorite).not.toHaveBeenCalled();
  });

  it('returns unauthorized when session has no user id', async () => {
    mockAuth.mockResolvedValue({ user: {} } as never);
    const result = await toggleItemFavorite('item-1');

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Unauthorized');
  });

  it('returns error when item not found', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbToggleFavorite.mockResolvedValue(null);
    const result = await toggleItemFavorite('item-999');

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Item not found');
  });

  it('returns updated item with isFavorite toggled to true', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbToggleFavorite.mockResolvedValue({ ...MOCK_ITEM_DETAIL, isFavorite: true });
    const result = await toggleItemFavorite('item-1');

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.isFavorite).toBe(true);
    expect(mockDbToggleFavorite).toHaveBeenCalledWith('user-1', 'item-1');
  });

  it('returns updated item with isFavorite toggled to false', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbToggleFavorite.mockResolvedValue({ ...MOCK_ITEM_DETAIL, isFavorite: false });
    const result = await toggleItemFavorite('item-1');

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.isFavorite).toBe(false);
  });
});

describe('toggleItemPin server action', () => {
  it('returns unauthorized when no session', async () => {
    mockAuth.mockResolvedValue(null as never);
    const result = await toggleItemPin('item-1');

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Unauthorized');
    expect(mockDbTogglePin).not.toHaveBeenCalled();
  });

  it('returns unauthorized when session has no user id', async () => {
    mockAuth.mockResolvedValue({ user: {} } as never);
    const result = await toggleItemPin('item-1');

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Unauthorized');
  });

  it('returns error when item not found', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbTogglePin.mockResolvedValue(null);
    const result = await toggleItemPin('item-999');

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Item not found');
  });

  it('returns updated item with isPinned toggled to true', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbTogglePin.mockResolvedValue({ ...MOCK_ITEM_DETAIL, isPinned: true });
    const result = await toggleItemPin('item-1');

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.isPinned).toBe(true);
    expect(mockDbTogglePin).toHaveBeenCalledWith('user-1', 'item-1');
  });

  it('returns updated item with isPinned toggled to false', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbTogglePin.mockResolvedValue({ ...MOCK_ITEM_DETAIL, isPinned: false });
    const result = await toggleItemPin('item-1');

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.isPinned).toBe(false);
  });
});
