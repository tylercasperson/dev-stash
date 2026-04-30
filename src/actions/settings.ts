'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/action-utils';
import type { ActionResult } from '@/types/actions';
import type { EditorPreferences } from '@/types/editor-preferences';

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
    const s = await requireSession();
    if (!s.success) return s;

    const parsed = EditorPreferencesSchema.safeParse(preferences);
    if (!parsed.success) return { success: false, error: 'Invalid preferences' };

    await prisma.user.update({
      where: { id: s.data.id },
      data: { editorPreferences: parsed.data },
    });

    return { success: true, data: parsed.data };
  } catch {
    return { success: false, error: 'Failed to save preferences' };
  }
}
