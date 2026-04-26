import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { DEMO_USER_ID } from '@/lib/demo';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { getItemsByType } from '@/lib/db/items';
import ItemsWithDrawer from '@/components/dashboard/ItemsWithDrawer';
import AddItemButton from '@/components/dashboard/AddItemButton';
import PaginationControls from '@/components/ui/PaginationControls';

type CreatableType = 'snippet' | 'prompt' | 'command' | 'note' | 'link';

const SLUG_TO_TYPE: Record<string, string> = {
  snippets: 'snippet',
  prompts: 'prompt',
  commands: 'command',
  notes: 'note',
  files: 'file',
  images: 'image',
  links: 'link',
};

const CREATABLE_TYPES = new Set<string>(['snippet', 'prompt', 'command', 'note', 'link']);

interface Props {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function ItemsTypePage({ params, searchParams }: Props) {
  const { type: slug } = await params;
  const typeName = SLUG_TO_TYPE[slug];
  if (!typeName) notFound();

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  const session = await auth();
  const userId = session?.user?.id ?? DEMO_USER_ID;

  const { items, total } = await getItemsByType(userId, typeName, page, ITEMS_PER_PAGE);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const heading = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">{heading}</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{total} item{total !== 1 ? 's' : ''}</span>
          {CREATABLE_TYPES.has(typeName) && (
            <AddItemButton typeName={typeName as CreatableType} label={heading.replace(/s$/, '')} />
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No {slug} yet.</p>
      ) : typeName === 'file' ? (
        <ItemsWithDrawer
          items={items}
          layout="list"
          gridClassName="flex flex-col gap-1"
        />
      ) : (
        <ItemsWithDrawer
          items={items}
          gridClassName="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"
        />
      )}

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        buildHref={(p) => `/items/${slug}?page=${p}`}
      />
    </div>
  );
}
