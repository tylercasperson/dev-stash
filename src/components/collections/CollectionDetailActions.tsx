'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { updateCollection, deleteCollection, toggleCollectionFavorite } from '@/actions/collections';

interface CollectionDetailActionsProps {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
}

export default function CollectionDetailActions({
  id,
  name,
  description,
  isFavorite,
}: CollectionDetailActionsProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editDescription, setEditDescription] = useState(description ?? '');
  const [isSaving, startSave] = useTransition();
  const [isDeleting, startDelete] = useTransition();
  const [favoriteState, setFavoriteState] = useState(isFavorite);
  const [isTogglingFavorite, startToggleFavorite] = useTransition();

  function handleToggleFavorite() {
    startToggleFavorite(async () => {
      const result = await toggleCollectionFavorite(id);
      if (!result.success) { toast.error(result.error); return; }
      setFavoriteState(result.data.isFavorite);
    });
  }

  function openEdit() {
    setEditName(name);
    setEditDescription(description ?? '');
    setEditOpen(true);
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

  function handleDelete() {
    startDelete(async () => {
      const result = await deleteCollection({ id });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success('Collection deleted');
      router.push('/collections');
    });
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={favoriteState ? 'Remove from favorites' : 'Add to favorites'}
          onClick={handleToggleFavorite}
          disabled={isTogglingFavorite}
        >
          <Star className={`h-4 w-4 ${favoriteState ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Edit collection"
          onClick={openEdit}
        >
          <Pencil className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Delete collection"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="detail-edit-name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="detail-edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. React Patterns"
                required
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="detail-edit-desc">Description</Label>
              <textarea
                id="detail-edit-desc"
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
