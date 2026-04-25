'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { createCollection as dbCreateCollection, getCollectionOptions } from '@/lib/db/collections';
import type { CollectionWithMeta, CollectionOption } from '@/lib/db/collections';

export type { CollectionOption };

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

const CreateCollectionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((v) => v || null),
});

export async function getUserCollections(): Promise<CollectionOption[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  return getCollectionOptions(session.user.id);
}

export async function createCollection(
  raw: unknown,
): Promise<ActionResult<CollectionWithMeta>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = CreateCollectionSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues.map((e) => e.message).join(', ');
    return { success: false, error: message };
  }

  const created = await dbCreateCollection(session.user.id, {
    name: parsed.data.name,
    description: parsed.data.description ?? null,
  });

  return { success: true, data: created };
}
