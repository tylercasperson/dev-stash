'use client';

import { Search, Plus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TopBarProps {
  onMobileMenuClick?: () => void;
}

export default function TopBar({ onMobileMenuClick }: TopBarProps) {
  return (
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

      <div className="relative flex-1 max-w-md mx-2">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          className="pl-9 h-8 bg-muted/50 border-border text-sm"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-8 gap-1.5 hidden sm:flex">
          New Collection
        </Button>
        <Button size="sm" className="h-8 gap-1.5">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Item</span>
        </Button>
      </div>
    </header>
  );
}
