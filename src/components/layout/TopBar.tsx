'use client';

import { useState } from 'react';
import { Search, Plus, FolderPlus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CreateItemDialog from '@/components/dashboard/CreateItemDialog';
import CreateCollectionDialog from '@/components/dashboard/CreateCollectionDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

        <span className="text-lg font-semibold tracking-tight text-foreground shrink-0 hidden lg:block">
          DevStash
        </span>

        <div className="relative flex-1 max-w-md mx-auto">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="Search items"
            placeholder="Search..."
            className="cursor-pointer pl-9 h-8 bg-muted/50 border-border text-sm"
            readOnly
            onClick={onOpenSearch}
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden lg:flex items-center text-[11px] text-muted-foreground select-none">
            ⌘K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Desktop: two separate labeled buttons */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 hidden lg:flex"
            onClick={() => setCollectionDialogOpen(true)}
          >
            <FolderPlus className="h-4 w-4" />
            <span>New Collection</span>
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 hidden lg:flex"
            onClick={() => setItemDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>New Item</span>
          </Button>

          {/* Mobile/tablet: single + dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  size="sm"
                  className="h-8 w-8 p-0 lg:hidden shrink-0"
                  aria-label="Create new"
                />
              }
            >
              <Plus className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setItemDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                New Item
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCollectionDialogOpen(true)}>
                <FolderPlus className="h-4 w-4" />
                New Collection
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <CreateItemDialog open={itemDialogOpen} onOpenChange={setItemDialogOpen} />
      <CreateCollectionDialog open={collectionDialogOpen} onOpenChange={setCollectionDialogOpen} />
    </>
  );
}
