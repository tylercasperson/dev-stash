'use client';

import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateCollectionDialog from '@/components/dashboard/CreateCollectionDialog';

export default function AddCollectionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => setOpen(true)}>
        <FolderPlus className="h-4 w-4" />
        New Collection
      </Button>
      <CreateCollectionDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
