import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/auth', () => ({ auth: vi.fn() }));
vi.mock('@/lib/prisma', () => ({
  prisma: { user: { update: vi.fn() } },
}));

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { updateEditorPreferences } from './settings';
import type { EditorPreferences } from '@/types/editor-preferences';

const mockAuth = vi.mocked(auth);
const mockUpdate = vi.mocked(prisma.user.update);

const VALID_PREFS: EditorPreferences = {
  fontSize: 14,
  tabSize: 2,
  wordWrap: true,
  minimap: false,
  theme: 'vs-dark',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('updateEditorPreferences action', () => {
  it('returns not authenticated when no session', async () => {
    mockAuth.mockResolvedValue(null);
    const result = await updateEditorPreferences(VALID_PREFS);
    expect(result).toEqual({ success: false, error: 'Not authenticated' });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('returns not authenticated when session has no user id', async () => {
    mockAuth.mockResolvedValue({ user: {} } as never);
    const result = await updateEditorPreferences(VALID_PREFS);
    expect(result).toEqual({ success: false, error: 'Not authenticated' });
  });

  it('saves and returns preferences on success', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockUpdate.mockResolvedValue({} as never);
    const result = await updateEditorPreferences(VALID_PREFS);
    expect(result).toEqual({ success: true, data: VALID_PREFS });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { editorPreferences: VALID_PREFS },
    });
  });

  it('saves monokai theme', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockUpdate.mockResolvedValue({} as never);
    const prefs = { ...VALID_PREFS, theme: 'monokai' as const };
    const result = await updateEditorPreferences(prefs);
    expect(result).toEqual({ success: true, data: prefs });
  });

  it('saves github-dark theme', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockUpdate.mockResolvedValue({} as never);
    const prefs = { ...VALID_PREFS, theme: 'github-dark' as const };
    const result = await updateEditorPreferences(prefs);
    expect(result).toEqual({ success: true, data: prefs });
  });

  it('rejects invalid font size', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    const result = await updateEditorPreferences({ ...VALID_PREFS, fontSize: 999 });
    expect(result).toEqual({ success: false, error: 'Invalid preferences' });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('rejects invalid tab size', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    const result = await updateEditorPreferences({ ...VALID_PREFS, tabSize: 3 });
    expect(result).toEqual({ success: false, error: 'Invalid preferences' });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('rejects invalid theme', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    const result = await updateEditorPreferences({ ...VALID_PREFS, theme: 'solarized' as never });
    expect(result).toEqual({ success: false, error: 'Invalid preferences' });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('returns error on db failure', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user-1' } } as never);
    mockUpdate.mockRejectedValue(new Error('DB error'));
    const result = await updateEditorPreferences(VALID_PREFS);
    expect(result).toEqual({ success: false, error: 'Failed to save preferences' });
  });
});
