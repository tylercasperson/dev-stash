'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateItemDialog from '@/components/dashboard/CreateItemDialog';

type TypeName = 'snippet' | 'prompt' | 'command' | 'note' | 'link';

interface AddItemButtonProps {
  typeName: TypeName;
  label: string;
}

export default function AddItemButton({ typeName, label }: AddItemButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" className="h-8 gap-1.5" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        New {label}
      </Button>
      <CreateItemDialog open={open} onOpenChange={setOpen} defaultType={typeName} />
    </>
  );
}
