import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/auth', () => ({ auth: vi.fn() }));
vi.mock('@/lib/db/collections', () => ({ createCollection: vi.fn(), getCollectionOptions: vi.fn() }));

import { auth } from '@/auth';
import { createCollection as dbCreateCollection, getCollectionOptions } from '@/lib/db/collections';
import { createCollection, getUserCollections } from './collections';

const mockAuth = vi.mocked(auth);
const mockDbCreate = vi.mocked(dbCreateCollection);
const mockGetCollectionOptions = vi.mocked(getCollectionOptions);

const MOCK_COLLECTION = {
  id: 'col-1',
  name: 'React Patterns',
  description: 'React hooks and patterns',
  isFavorite: false,
  itemCount: 0,
  dominantTypeColor: '#6b7280',
  typeIcons: [],
  updatedAt: new Date('2026-04-24T12:00:00Z'),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getUserCollections action', () => {
  it('returns empty array when no session', async () => {
    mockAuth.mockResolvedValue(null);
    const result = await getUserCollections();
    expect(result).toEqual([]);
    expect(mockGetCollectionOptions).not.toHaveBeenCalled();
  });

  it('returns empty array when session has no user id', async () => {
    mockAuth.mockResolvedValue({ user: {} } as never);
    const result = await getUserCollections();
    expect(result).toEqual([]);
  });

  it('returns collection options for authenticated user', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    const options = [{ id: 'col-1', name: 'React Patterns' }, { id: 'col-2', name: 'Snippets' }];
    mockGetCollectionOptions.mockResolvedValue(options);

    const result = await getUserCollections();

    expect(result).toEqual(options);
    expect(mockGetCollectionOptions).toHaveBeenCalledWith('user-1');
  });
});

describe('createCollection action', () => {
  it('returns Unauthorized when no session', async () => {
    mockAuth.mockResolvedValue(null);
    const result = await createCollection({ name: 'Test', description: null });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Unauthorized');
  });

  it('returns validation error when name is empty', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    const result = await createCollection({ name: '', description: null });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain('Name is required');
  });

  it('returns validation error when name is only whitespace', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    const result = await createCollection({ name: '   ', description: null });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain('Name is required');
  });

  it('returns validation error when input is not an object', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    const result = await createCollection(null);

    expect(result.success).toBe(false);
  });

  it('creates collection and returns data on success', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbCreate.mockResolvedValue(MOCK_COLLECTION);

    const result = await createCollection({ name: 'React Patterns', description: 'React hooks and patterns' });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('React Patterns');
      expect(result.data.description).toBe('React hooks and patterns');
    }
  });

  it('passes userId from session, not from input', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbCreate.mockResolvedValue(MOCK_COLLECTION);

    await createCollection({ name: 'Test', description: null });

    expect(mockDbCreate).toHaveBeenCalledWith('user-1', expect.any(Object));
  });

  it('normalises empty description string to null', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbCreate.mockResolvedValue({ ...MOCK_COLLECTION, description: null });

    await createCollection({ name: 'Test', description: '' });

    expect(mockDbCreate).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ description: null }),
    );
  });

  it('trims whitespace from name before saving', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockDbCreate.mockResolvedValue(MOCK_COLLECTION);

    await createCollection({ name: '  React Patterns  ', description: null });

    expect(mockDbCreate).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ name: 'React Patterns' }),
    );
  });
});
