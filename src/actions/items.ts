'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { updateItem as dbUpdateItem, deleteItem as dbDeleteItem } from '@/lib/db/items';
import type { ItemDetail } from '@/lib/db/items';

const UpdateItemSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().nullable().optional().transform((v) => v ?? null),
  content: z.string().nullable().optional().transform((v) => v ?? null),
  url: z
    .string()
    .trim()
    .nullable()
    .optional()
    .refine((v) => !v || v === '' || /^https?:\/\/.+/.test(v), { message: 'Must be a valid URL' })
    .transform((v) => v || null),
  language: z.string().trim().nullable().optional().transform((v) => v || null),
  tags: z
    .string()
    .transform((v) =>
      v
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    )
    .or(z.array(z.string().trim()).transform((arr) => arr.filter(Boolean))),
});

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function updateItem(
  itemId: string,
  raw: unknown,
): Promise<ActionResult<ItemDetail>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = UpdateItemSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues.map((e) => e.message).join(', ');
    return { success: false, error: message };
  }

  const updated = await dbUpdateItem(session.user.id, itemId, {
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    content: parsed.data.content ?? null,
    url: parsed.data.url ?? null,
    language: parsed.data.language ?? null,
    tags: parsed.data.tags,
  });

  if (!updated) {
    return { success: false, error: 'Item not found' };
  }

  return { success: true, data: updated };
}

export async function deleteItem(itemId: string): Promise<ActionResult<null>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const deleted = await dbDeleteItem(session.user.id, itemId);
  if (!deleted) {
    return { success: false, error: 'Item not found' };
  }

  return { success: true, data: null };
}
