'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { File, Star, Pin, Copy, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ICON_MAP } from '@/lib/icon-map';
import CodeEditor from '@/components/editor/CodeEditor';
import { updateItem, deleteItem } from '@/actions/items';
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
import type { ItemDetail } from '@/lib/db/items';

interface ItemDetailDrawerProps {
  itemId: string | null;
  onClose: () => void;
}

export default function ItemDetailDrawer({ itemId, onClose }: ItemDetailDrawerProps) {
  const router = useRouter();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (!itemId) {
      setItem(null);
      setEditMode(false);
      return;
    }
    setItem(null);
    setEditMode(false);
    setLoading(true);
    fetch(`/api/items/${itemId}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch item');
        return r.json();
      })
      .then((data: ItemDetail) => setItem(data))
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [itemId]);

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
              <pre className="rounded-md bg-muted p-3 text-xs text-foreground overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                {item.content}
              </pre>
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

      {/* Save / Cancel bar */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-border">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving || !title.trim()}
        >
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
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                rows={8}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-ring"
              />
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

        <Section label="Collections">
          <div className="flex flex-wrap gap-1.5">
            {item.collections.length > 0 ? (
              item.collections.map((col) => (
                <span
                  key={col.id}
                  className="rounded-full px-2.5 py-0.5 text-xs bg-muted text-muted-foreground"
                >
                  {col.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">No collections</span>
            )}
          </div>
        </Section>

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

// ─── Shared sub-components ────────────────────────────────────────────────────

function DrawerSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-6 py-6">
      <Skeleton className="h-5 w-24 rounded-full" />
      <Skeleton className="h-6 w-3/4" />
      <div className="flex gap-2 pt-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-16 rounded-md" />
        ))}
      </div>
      <Skeleton className="h-4 w-1/4 mt-2" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-4 w-1/4 mt-2" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      aria-label={label}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      {children}
    </div>
  );
}

function EditField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
