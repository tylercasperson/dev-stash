'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { FREE_COLLECTION_LIMIT, getUserCollectionCount } from '@/lib/subscription';
import {
  createCollection as dbCreateCollection,
  getCollectionOptions,
  updateCollectionById,
  deleteCollectionById,
  toggleCollectionFavorite as dbToggleCollectionFavorite,
} from '@/lib/db/collections';
import type { CollectionWithMeta, CollectionOption } from '@/lib/db/collections';

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

const UpdateCollectionSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, 'Name is required'),
  description: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((v) => v || null),
});

const DeleteCollectionSchema = z.object({
  id: z.string().min(1),
});

export async function updateCollection(
  raw: unknown,
): Promise<ActionResult<CollectionWithMeta>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = UpdateCollectionSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues.map((e) => e.message).join(', ');
    return { success: false, error: message };
  }

  const updated = await updateCollectionById(session.user.id, parsed.data.id, {
    name: parsed.data.name,
    description: parsed.data.description ?? null,
  });

  if (!updated) return { success: false, error: 'Collection not found' };
  return { success: true, data: updated };
}

export async function deleteCollection(
  raw: unknown,
): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = DeleteCollectionSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues.map((e) => e.message).join(', ');
    return { success: false, error: message };
  }

  const ok = await deleteCollectionById(session.user.id, parsed.data.id);
  if (!ok) return { success: false, error: 'Collection not found' };
  return { success: true, data: { id: parsed.data.id } };
}

export async function toggleCollectionFavorite(
  collectionId: string,
): Promise<ActionResult<{ isFavorite: boolean }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const newValue = await dbToggleCollectionFavorite(session.user.id, collectionId);
  if (newValue === null) return { success: false, error: 'Collection not found' };
  return { success: true, data: { isFavorite: newValue } };
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

  if (!session.user.isPro) {
    const count = await getUserCollectionCount(session.user.id);
    if (count >= FREE_COLLECTION_LIMIT) {
      return { success: false, error: `Free plan is limited to ${FREE_COLLECTION_LIMIT} collections. Upgrade to Pro for unlimited collections.` };
    }
  }

  const created = await dbCreateCollection(session.user.id, {
    name: parsed.data.name,
    description: parsed.data.description ?? null,
  });

  return { success: true, data: created };
}
