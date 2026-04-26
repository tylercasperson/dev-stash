'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, FolderPlus, Menu, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CreateItemDialog from '@/components/dashboard/CreateItemDialog';
import CreateCollectionDialog from '@/components/dashboard/CreateCollectionDialog';

interface TopBarProps {
  onMobileMenuClick?: () => void;
  onOpenSearch?: () => void;
}

export default function TopBar({ onMobileMenuClick, onOpenSearch }: TopBarProps) {
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);

  return (
    <>
      <header className="flex h-14 items-center gap-2 border-b border-border bg-background px-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0"
          onClick={onMobileMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <span className="text-lg font-semibold tracking-tight text-foreground shrink-0">
          DevStash
        </span>

        <div className="relative flex-1 max-w-md mx-auto">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="Search items"
            placeholder="Search... ⌘K"
            className="cursor-pointer pl-9 h-8 bg-muted/50 border-border text-sm"
            readOnly
            onClick={onOpenSearch}
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/favorites"
            aria-label="Favorites"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Star className="h-4 w-4" />
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 hidden sm:flex"
            onClick={() => setCollectionDialogOpen(true)}
          >
            <FolderPlus className="h-4 w-4" />
            <span>New Collection</span>
          </Button>
          <Button size="sm" className="h-8 gap-1.5" onClick={() => setItemDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Item</span>
          </Button>
        </div>
      </header>

      <CreateItemDialog open={itemDialogOpen} onOpenChange={setItemDialogOpen} />
      <CreateCollectionDialog open={collectionDialogOpen} onOpenChange={setCollectionDialogOpen} />
    </>
  );
}
