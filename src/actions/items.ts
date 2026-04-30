'use server';

import { updateItem as dbUpdateItem, deleteItem as dbDeleteItem, createItem as dbCreateItem, toggleItemFavorite as dbToggleItemFavorite, toggleItemPinById as dbToggleItemPin } from '@/lib/db/items';
import { deleteFromR2 } from '@/lib/r2';
import { UpdateItemSchema, CreateItemSchema } from '@/actions/item-schemas';
import { FREE_ITEM_LIMIT, getUserItemCount } from '@/lib/subscription';
import { requireSession, zodError } from '@/lib/action-utils';
import type { ActionResult } from '@/types/actions';
import type { ItemDetail } from '@/lib/db/items';

export async function updateItem(
  itemId: string,
  raw: unknown,
): Promise<ActionResult<ItemDetail>> {
  const s = await requireSession();
  if (!s.success) return s;

  const parsed = UpdateItemSchema.safeParse(raw);
  if (!parsed.success) return zodError(parsed.error);

  const updated = await dbUpdateItem(s.data.id, itemId, {
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
  const s = await requireSession();
  if (!s.success) return s;

  const parsed = CreateItemSchema.safeParse(raw);
  if (!parsed.success) return zodError(parsed.error);

  const { typeName, title, description, content, url, language, tags, fileUrl, fileName, fileSize } =
    parsed.data;

  if (!s.data.isPro) {
    if (typeName === 'file' || typeName === 'image') {
      return { success: false, error: 'File and image uploads require DevStash Pro.' };
    }
    const count = await getUserItemCount(s.data.id);
    if (count >= FREE_ITEM_LIMIT) {
      return { success: false, error: `Free plan is limited to ${FREE_ITEM_LIMIT} items. Upgrade to Pro for unlimited items.` };
    }
  }

  if (typeName === 'link' && !url) {
    return { success: false, error: 'URL is required for links' };
  }

  if ((typeName === 'file' || typeName === 'image') && !fileUrl) {
    return { success: false, error: 'File upload required' };
  }

  const created = await dbCreateItem(s.data.id, {
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

export async function toggleItemFavorite(itemId: string): Promise<ActionResult<ItemDetail>> {
  const s = await requireSession();
  if (!s.success) return s;

  const updated = await dbToggleItemFavorite(s.data.id, itemId);
  if (!updated) return { success: false, error: 'Item not found' };
  return { success: true, data: updated };
}

export async function toggleItemPin(itemId: string): Promise<ActionResult<ItemDetail>> {
  const s = await requireSession();
  if (!s.success) return s;

  const updated = await dbToggleItemPin(s.data.id, itemId);
  if (!updated) return { success: false, error: 'Item not found' };
  return { success: true, data: updated };
}

export async function deleteItem(itemId: string): Promise<ActionResult<null>> {
  const s = await requireSession();
  if (!s.success) return s;

  const deleted = await dbDeleteItem(s.data.id, itemId);
  if (!deleted) {
    return { success: false, error: 'Item not found' };
  }

  if (deleted.fileUrl) {
    await deleteFromR2(deleted.fileUrl).catch(() => null);
  }

  return { success: true, data: null };
}
