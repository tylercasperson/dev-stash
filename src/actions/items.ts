'use server';

import { auth } from '@/auth';
import { updateItem as dbUpdateItem, deleteItem as dbDeleteItem, createItem as dbCreateItem } from '@/lib/db/items';
import { deleteFromR2 } from '@/lib/r2';
import { UpdateItemSchema, CreateItemSchema } from '@/actions/item-schemas';
import type { ItemDetail } from '@/lib/db/items';

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
    collectionIds: parsed.data.collectionIds,
  });

  if (!updated) {
    return { success: false, error: 'Item not found' };
  }

  return { success: true, data: updated };
}

export async function createItem(raw: unknown): Promise<ActionResult<ItemDetail>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = CreateItemSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues.map((e) => e.message).join(', ');
    return { success: false, error: message };
  }

  const { typeName, title, description, content, url, language, tags, fileUrl, fileName, fileSize } =
    parsed.data;

  if (typeName === 'link' && !url) {
    return { success: false, error: 'URL is required for links' };
  }

  if ((typeName === 'file' || typeName === 'image') && !fileUrl) {
    return { success: false, error: 'File upload required' };
  }

  const created = await dbCreateItem(session.user.id, {
    typeName,
    title,
    description: description ?? null,
    content: content ?? null,
    url: url ?? null,
    language: language ?? null,
    tags,
    collectionIds: parsed.data.collectionIds,
    fileUrl: fileUrl ?? null,
    fileName: fileName ?? null,
    fileSize: fileSize ?? null,
  });

  if (!created) {
    return { success: false, error: 'Failed to create item' };
  }

  return { success: true, data: created };
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

  if (deleted.fileUrl) {
    await deleteFromR2(deleted.fileUrl).catch(() => null);
  }

  return { success: true, data: null };
}
