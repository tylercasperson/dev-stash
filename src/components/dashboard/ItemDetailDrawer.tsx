'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { File, FileText, Star, Pin, Copy, Pencil, Trash2, Download } from 'lucide-react';
import { formatFileSize } from '@/lib/files';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ICON_MAP } from '@/lib/icon-map';
import CodeEditor from '@/components/editor/CodeEditor';
import MarkdownEditor from '@/components/editor/MarkdownEditor';
import { updateItem, deleteItem } from '@/actions/items';
import { getUserCollections } from '@/actions/collections';
import type { CollectionOption } from '@/lib/db/collections';
import CollectionSelector from '@/components/dashboard/CollectionSelector';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Section,
  EditField,
  DetailRow,
  ActionButton,
  DrawerSkeleton,
} from '@/components/ui/drawer-primitives';
import { useDrawerFetch } from '@/hooks/use-drawer-fetch';
import type { ItemDetail } from '@/lib/db/items';

interface ItemDetailDrawerProps {
  itemId: string | null;
  onClose: () => void;
}

export default function ItemDetailDrawer({ itemId, onClose }: ItemDetailDrawerProps) {
  const router = useRouter();
  const endpoint = useCallback((id: string) => `/api/items/${id}`, []);
  const { data: item, loading, setData: setItem } = useDrawerFetch<ItemDetail>(itemId, endpoint);
  const [editMode, setEditMode] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!item) return;
    setDeleting(true);
    const result = await deleteItem(item.id);
    setDeleting(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Item deleted');
    router.refresh();
    onClose();
  }

  function handleClose() {
    setEditMode(false);
    onClose();
  }

  return (
    <Sheet open={!!itemId} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto flex flex-col gap-0 p-0">
        {loading || !item ? (
          <DrawerSkeleton />
        ) : editMode ? (
          <EditContent
            item={item}
            onCancel={() => setEditMode(false)}
            onSave={(updated) => {
              setItem(updated);
              setEditMode(false);
            }}
          />
        ) : (
          <ViewContent item={item} onEdit={() => setEditMode(true)} onDelete={handleDelete} deleting={deleting} />
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── View Mode ───────────────────────────────────────────────────────────────

function ViewContent({
  item,
  onEdit,
  onDelete,
  deleting,
}: {
  item: ItemDetail;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const Icon = ICON_MAP[item.typeIcon] ?? File;

  return (
    <>
      <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${item.typeColor}22`, color: item.typeColor }}
          >
            <Icon className="h-3 w-3" />
            {item.typeName.charAt(0).toUpperCase() + item.typeName.slice(1)}
          </span>
          {item.language && (
            <span className="rounded-full px-2.5 py-0.5 text-xs bg-muted text-muted-foreground">
              {item.language}
            </span>
          )}
        </div>
        <SheetTitle className="text-base font-semibold text-foreground text-left">
          {item.title}
        </SheetTitle>
      </SheetHeader>

      <div className="flex items-center gap-1 px-6 py-3 border-b border-border">
        <ActionButton
          icon={<Star className={`h-4 w-4 ${item.isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />}
          label="Favorite"
        />
        <ActionButton icon={<Pin className="h-4 w-4" />} label="Pin" />
        <ActionButton icon={<Copy className="h-4 w-4" />} label="Copy" />
        <ActionButton icon={<Pencil className="h-4 w-4" />} label="Edit" onClick={onEdit} />
        <div className="ml-auto">
          <AlertDialog>
            <AlertDialogTrigger
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-destructive hover:bg-muted hover:text-destructive transition-colors disabled:opacity-50"
              aria-label="Delete"
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete item?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete &ldquo;{item.title}&rdquo;. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-6 py-5">
        {item.description && (
          <Section label="Description">
            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          </Section>
        )}

        {item.contentType === 'TEXT' && item.content && (
          <Section label="Content">
            {['snippet', 'command'].includes(item.typeName) ? (
              <CodeEditor value={item.content} language={item.language ?? 'plaintext'} readOnly />
            ) : (
              <MarkdownEditor value={item.content} readOnly />
            )}
          </Section>
        )}

        {item.contentType === 'URL' && item.url && (
          <Section label="URL">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline break-all"
            >
              {item.url}
            </a>
          </Section>
        )}

        {item.contentType === 'FILE' && item.fileUrl && (
          <Section label={item.typeName === 'image' ? 'Preview' : 'File'}>
            {item.typeName === 'image' ? (
              <div className="space-y-2">
                <img
                  src={item.fileUrl}
                  alt={item.fileName ?? 'Image'}
                  className="rounded-md max-h-64 w-full object-contain bg-muted"
                />
                <a href={`/api/download?itemId=${item.id}`} download>
                  <Button size="sm" variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-1.5" />
                    Download
                  </Button>
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/30 border border-border">
                <FileText className="h-8 w-8 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{item.fileName}</p>
                  {item.fileSize && (
                    <p className="text-xs text-muted-foreground">{formatFileSize(item.fileSize)}</p>
                  )}
                </div>
                <a href={`/api/download?itemId=${item.id}`} download>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1.5" />
                    Download
                  </Button>
                </a>
              </div>
            )}
          </Section>
        )}

        {item.tags.length > 0 && (
          <Section label="Tags">
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-2.5 py-0.5 text-xs bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Section>
        )}

        {item.collections.length > 0 && (
          <Section label="Collections">
            <div className="flex flex-wrap gap-1.5">
              {item.collections.map((col) => (
                <span
                  key={col.id}
                  className="rounded-full px-2.5 py-0.5 text-xs bg-muted text-muted-foreground"
                >
                  {col.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        <Section label="Details">
          <div className="flex flex-col gap-1.5 text-sm">
            <DetailRow label="Created" value={item.createdAt} />
            <DetailRow label="Updated" value={item.updatedAt} />
            {item.fileName && <DetailRow label="File" value={item.fileName} />}
            {item.fileSize && (
              <DetailRow label="Size" value={`${Math.round(item.fileSize / 1024)} KB`} />
            )}
          </div>
        </Section>
      </div>
    </>
  );
}

// ─── Edit Mode ────────────────────────────────────────────────────────────────

interface EditContentProps {
  item: ItemDetail;
  onCancel: () => void;
  onSave: (updated: ItemDetail) => void;
}

function EditContent({ item, onCancel, onSave }: EditContentProps) {
  const router = useRouter();
  const Icon = ICON_MAP[item.typeIcon] ?? File;

  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description ?? '');
  const [content, setContent] = useState(item.content ?? '');
  const [url, setUrl] = useState(item.url ?? '');
  const [language, setLanguage] = useState(item.language ?? '');
  const [tags, setTags] = useState(item.tags.join(', '));
  const [saving, setSaving] = useState(false);
  const [allCollections, setAllCollections] = useState<CollectionOption[]>([]);
  const [collectionIds, setCollectionIds] = useState<string[]>(
    item.collections.map((c) => c.id),
  );

  useEffect(() => {
    getUserCollections().then(setAllCollections);
  }, []);

  const showContent = item.contentType === 'TEXT';
  const showLanguage = ['snippet', 'command'].includes(item.typeName);
  const showUrl = item.typeName === 'link';

  async function handleSave() {
    setSaving(true);
    const result = await updateItem(item.id, {
      title,
      description: description || null,
      content: showContent ? content || null : null,
      url: showUrl ? url || null : null,
      language: showLanguage ? language || null : null,
      tags,
      collectionIds,
    });
    setSaving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success('Item saved');
    router.refresh();
    onSave(result.data);
  }

  return (
    <>
      <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${item.typeColor}22`, color: item.typeColor }}
          >
            <Icon className="h-3 w-3" />
            {item.typeName.charAt(0).toUpperCase() + item.typeName.slice(1)}
          </span>
        </div>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="text-base font-semibold"
        />
      </SheetHeader>

      <div className="flex items-center gap-2 px-6 py-3 border-b border-border">
        <Button size="sm" onClick={handleSave} disabled={saving || !title.trim()}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>

      <div className="flex flex-col gap-5 px-6 py-5">
        <EditField label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </EditField>

        {showContent && (
          <EditField label="Content">
            {showLanguage ? (
              <CodeEditor value={content} onChange={setContent} language={language || 'plaintext'} />
            ) : (
              <MarkdownEditor value={content} onChange={setContent} />
            )}
          </EditField>
        )}

        {showLanguage && (
          <EditField label="Language">
            <Input
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. typescript"
            />
          </EditField>
        )}

        {showUrl && (
          <EditField label="URL">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              type="url"
            />
          </EditField>
        )}

        <EditField label="Tags">
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="react, hooks, typescript"
          />
          <p className="text-xs text-muted-foreground">Comma-separated</p>
        </EditField>

        <EditField label="Collections">
          <CollectionSelector
            collections={allCollections}
            value={collectionIds}
            onChange={setCollectionIds}
          />
        </EditField>

        <Section label="Details">
          <div className="flex flex-col gap-1.5 text-sm">
            <DetailRow label="Created" value={item.createdAt} />
            <DetailRow label="Updated" value={item.updatedAt} />
          </div>
        </Section>
      </div>
    </>
  );
}
