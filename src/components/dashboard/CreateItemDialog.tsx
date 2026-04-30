'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CodeEditor from '@/components/editor/CodeEditor';
import MarkdownEditor from '@/components/editor/MarkdownEditor';
import FileUpload, { type UploadResult } from '@/components/dashboard/FileUpload';
import TypeSelector, { type ItemTypeName } from '@/components/dashboard/TypeSelector';
import CollectionSelector from '@/components/dashboard/CollectionSelector';
import SuggestTagsButton from '@/components/dashboard/SuggestTagsButton';
import GenerateDescriptionButton from '@/components/dashboard/GenerateDescriptionButton';
import { createItem } from '@/actions/items';
import { useCollectionOptions } from '@/hooks/use-collection-options';

interface CreateItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: ItemTypeName;
  isPro?: boolean;
}

const EMPTY_FORM = {
  title: '',
  description: '',
  content: '',
  url: '',
  language: '',
  tags: '',
};

export default function CreateItemDialog({ open, onOpenChange, defaultType = 'snippet', isPro = false }: CreateItemDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [typeName, setTypeName] = useState<ItemTypeName>(defaultType);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const collections = useCollectionOptions(open);
  const [collectionIds, setCollectionIds] = useState<string[]>([]);

  function handleClose() {
    onOpenChange(false);
    setForm(EMPTY_FORM);
    setTypeName(defaultType);
    setUploadResult(null);
    setCollectionIds([]);
  }

  function handleTypeChange(value: ItemTypeName) {
    setTypeName(value);
    setForm((f) => ({ ...f, url: '', content: '', language: '' }));
    setUploadResult(null);
  }

  function set(field: keyof typeof EMPTY_FORM) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await createItem({
        typeName,
        title: form.title,
        description: form.description || null,
        content: form.content || null,
        url: form.url || null,
        language: form.language || null,
        tags: form.tags,
        collectionIds,
        fileUrl: uploadResult?.url ?? null,
        fileName: uploadResult?.fileName ?? null,
        fileSize: uploadResult?.fileSize ?? null,
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success('Item created');
      handleClose();
      router.refresh();
    });
  }

  const isFileType = typeName === 'file' || typeName === 'image';
  const showContent = !isFileType && typeName !== 'link';
  const showLanguage = typeName === 'snippet' || typeName === 'command';
  const showUrl = typeName === 'link';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TypeSelector value={typeName} onChange={handleTypeChange} />

          <div className="space-y-1.5">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={set('title')}
              placeholder="Item title"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              <GenerateDescriptionButton
                title={form.title}
                typeName={typeName}
                content={form.content || null}
                url={form.url || null}
                fileName={uploadResult?.fileName ?? null}
                onGenerate={(val) => setForm((f) => ({ ...f, description: val }))}
                isPro={isPro}
              />
            </div>
            <Input
              id="description"
              value={form.description}
              onChange={set('description')}
              placeholder="Optional description"
            />
          </div>

          {showUrl && (
            <div className="space-y-1.5">
              <Label htmlFor="url">
                URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="url"
                type="url"
                value={form.url}
                onChange={set('url')}
                placeholder="https://example.com"
                required
              />
            </div>
          )}

          {isFileType && (
            <div className="space-y-1.5">
              <Label>
                {typeName === 'image' ? 'Image' : 'File'}{' '}
                <span className="text-destructive">*</span>
              </Label>
              <FileUpload
                itemType={typeName as 'file' | 'image'}
                value={uploadResult}
                onChange={setUploadResult}
              />
            </div>
          )}

          {showContent && (
            <div className="space-y-1.5">
              <Label htmlFor="content">Content</Label>
              {showLanguage ? (
                <CodeEditor
                  value={form.content}
                  onChange={(val) => setForm((f) => ({ ...f, content: val }))}
                  language={form.language || 'plaintext'}
                  onLanguageChange={(lang) => setForm((f) => ({ ...f, language: lang }))}
                />
              ) : (
                <MarkdownEditor
                  value={form.content}
                  onChange={(val) => setForm((f) => ({ ...f, content: val }))}
                />
              )}
            </div>
          )}


          <div className="space-y-1.5">
            <Label>Collections</Label>
            <CollectionSelector
              collections={collections}
              value={collectionIds}
              onChange={setCollectionIds}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="tags">Tags</Label>
              <SuggestTagsButton
                title={form.title}
                content={form.content || null}
                existingTags={form.tags.split(',').map((t) => t.trim()).filter(Boolean)}
                onAccept={(newTags) => {
                  setForm((f) => {
                    const existing = f.tags.split(',').map((t) => t.trim()).filter(Boolean);
                    const merged = [...new Set([...existing, ...newTags])];
                    return { ...f, tags: merged.join(', ') };
                  });
                }}
                isPro={isPro}
              />
            </div>
            <Input
              id="tags"
              value={form.tags}
              onChange={set('tags')}
              placeholder="react, hooks, typescript (comma separated)"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || (isFileType && !uploadResult)}>
              {isPending ? 'Creating...' : 'Create Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
