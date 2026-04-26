'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import type { EditorPreferences } from '@/types/editor-preferences';

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

const EditorPreferencesSchema = z.object({
  fontSize: z.number().int().min(10).max(24),
  tabSize: z.number().int().refine((v) => v === 2 || v === 4),
  wordWrap: z.boolean(),
  minimap: z.boolean(),
  theme: z.enum(['vs-dark', 'monokai', 'github-dark']),
});

export async function updateEditorPreferences(
  preferences: EditorPreferences
): Promise<ActionResult<EditorPreferences>> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Not authenticated' };

    const parsed = EditorPreferencesSchema.safeParse(preferences);
    if (!parsed.success) return { success: false, error: 'Invalid preferences' };

    await prisma.user.update({
      where: { id: session.user.id },
      data: { editorPreferences: parsed.data },
    });

    return { success: true, data: parsed.data };
  } catch {
    return { success: false, error: 'Failed to save preferences' };
  }
}
