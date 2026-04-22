import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { DEMO_USER_ID } from '@/lib/demo';
import { getItemsByType } from '@/lib/db/items';
import ItemsWithDrawer from '@/components/dashboard/ItemsWithDrawer';

const SLUG_TO_TYPE: Record<string, string> = {
  snippets: 'snippet',
  prompts: 'prompt',
  commands: 'command',
  notes: 'note',
  files: 'file',
  images: 'image',
  links: 'link',
};

interface Props {
  params: Promise<{ type: string }>;
}

export default async function ItemsTypePage({ params }: Props) {
  const { type: slug } = await params;
  const typeName = SLUG_TO_TYPE[slug];
  if (!typeName) notFound();

  const session = await auth();
  const userId = session?.user?.id ?? DEMO_USER_ID;

  const items = await getItemsByType(userId, typeName);

  const heading = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">{heading}</h1>
        <span className="text-sm text-muted-foreground">{items.length} item{items.length !== 1 ? 's' : ''}</span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No {slug} yet.</p>
      ) : (
        <ItemsWithDrawer
          items={items}
          gridClassName="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"
        />
      )}
    </div>
  );
}
