import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: { user: { findUnique: vi.fn() } },
}));

import { prisma } from '@/lib/prisma';
import { getEditorPreferences } from './profile';
import { DEFAULT_EDITOR_PREFERENCES } from '@/types/editor-preferences';

const mockFindUnique = vi.mocked(prisma.user.findUnique);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getEditorPreferences', () => {
  it('returns defaults when user is not found', async () => {
    mockFindUnique.mockResolvedValue(null);
    const result = await getEditorPreferences('user-1');
    expect(result).toEqual(DEFAULT_EDITOR_PREFERENCES);
  });

  it('returns defaults when editorPreferences is null', async () => {
    mockFindUnique.mockResolvedValue({ editorPreferences: null } as never);
    const result = await getEditorPreferences('user-1');
    expect(result).toEqual(DEFAULT_EDITOR_PREFERENCES);
  });

  it('returns stored preferences merged over defaults', async () => {
    mockFindUnique.mockResolvedValue({
      editorPreferences: { fontSize: 16, theme: 'monokai' },
    } as never);
    const result = await getEditorPreferences('user-1');
    expect(result).toEqual({
      ...DEFAULT_EDITOR_PREFERENCES,
      fontSize: 16,
      theme: 'monokai',
    });
  });

  it('returns fully stored preferences when all fields are present', async () => {
    const stored = { fontSize: 18, tabSize: 4, wordWrap: false, minimap: true, theme: 'github-dark' as const };
    mockFindUnique.mockResolvedValue({ editorPreferences: stored } as never);
    const result = await getEditorPreferences('user-1');
    expect(result).toEqual(stored);
  });

  it('queries with correct userId and select', async () => {
    mockFindUnique.mockResolvedValue(null);
    await getEditorPreferences('user-abc');
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: 'user-abc' },
      select: { editorPreferences: true },
    });
  });
});
