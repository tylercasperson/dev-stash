import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TopBar() {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-4">
      <span className="text-lg font-semibold tracking-tight text-foreground">
        DevStash
      </span>

      <div className="relative flex-1 max-w-md">
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
        <Button variant="outline" size="sm" className="h-8 gap-1.5">
          New Collection
        </Button>
        <Button size="sm" className="h-8 gap-1.5">
          <Plus className="h-4 w-4" />
          New Item
        </Button>
      </div>
    </header>
  );
}
