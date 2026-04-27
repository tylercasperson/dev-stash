'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { File, MoreHorizontal, Pencil, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { ICON_MAP } from '@/lib/icon-map';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { updateCollection, deleteCollection, toggleCollectionFavorite } from '@/actions/collections';

interface TypeIcon {
  icon: string;
  color: string;
  name: string;
}

interface CollectionCardProps {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  accentColor: string;
  typeIcons?: TypeIcon[];
  href?: string;
}

export default function CollectionCard({
  id,
  name,
  description,
  isFavorite,
  itemCount,
  accentColor,
  typeIcons = [],
  href,
}: CollectionCardProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editDescription, setEditDescription] = useState(description ?? '');
  const [isSaving, startSave] = useTransition();
  const [isDeleting, startDelete] = useTransition();
  const [favoriteState, setFavoriteState] = useState(isFavorite);
  const [isTogglingFavorite, startToggleFavorite] = useTransition();

  function openEdit() {
    setEditName(name);
    setEditDescription(description ?? '');
    setEditOpen(true);
  }

  function openDelete() {
    setDeleteOpen(true);
  }

  function handleSave(e: { preventDefault(): void }) {
    e.preventDefault();
    startSave(async () => {
      const result = await updateCollection({ id, name: editName, description: editDescription || null });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success('Collection updated');
      setEditOpen(false);
      router.refresh();
    });
  }

  function handleToggleFavorite() {
    startToggleFavorite(async () => {
      const result = await toggleCollectionFavorite(id);
      if (!result.success) { toast.error(result.error); return; }
      setFavoriteState(result.data.isFavorite);
    });
  }

  function handleDelete() {
    startDelete(async () => {
      const result = await deleteCollection({ id });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success('Collection deleted');
      setDeleteOpen(false);
      router.refresh();
    });
  }

  const cardClass =
    'group relative flex flex-col gap-2 rounded-lg border border-border bg-card p-4 cursor-pointer transition-colors hover:border-border/80 hover:bg-card/80';
  const cardStyle = { borderLeftColor: accentColor, borderLeftWidth: '3px' };

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0 pr-6">
          <span className="font-medium text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </span>
          {favoriteState && <Star className="h-3 w-3 shrink-0 fill-yellow-500 text-yellow-500" />}
        </div>
        <div
          className="absolute top-3 right-3"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label="Collection actions"
                  className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity hover:bg-accent hover:text-accent-foreground focus-visible:opacity-100 focus-visible:outline-none"
                />
              }
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={openEdit}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleFavorite} disabled={isTogglingFavorite}>
                <Star className={`h-3.5 w-3.5 ${favoriteState ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                {favoriteState ? 'Unfavorite' : 'Favorite'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={openDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {description && (
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
        {typeIcons.length > 0 && (
          <div className="flex items-center gap-1">
            {typeIcons.map((t) => {
              const Icon = ICON_MAP[t.icon] ?? File;
              return (
                <Icon
                  key={t.name}
                  className="h-3 w-3"
                  style={{ color: t.color }}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {href ? (
        <Link href={href} className={cardClass} style={cardStyle}>
          {inner}
        </Link>
      ) : (
        <div className={cardClass} style={cardStyle}>
          {inner}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor={`edit-name-${id}`}>
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`edit-name-${id}`}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. React Patterns"
                required
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`edit-desc-${id}`}>Description</Label>
              <textarea
                id={`edit-desc-${id}`}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Optional description"
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving || !editName.trim()}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete AlertDialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete collection?</AlertDialogTitle>
            <AlertDialogDescription>
              "{name}" will be permanently deleted. Items in this collection will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
