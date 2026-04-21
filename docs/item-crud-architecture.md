# Item CRUD Architecture

A unified system for creating, reading, updating, and deleting all 7 item types with minimal duplication.

---

## File Structure

```
src/
├── actions/
│   └── items.ts                  # All item mutations (create, update, delete, toggles)
│
├── lib/db/
│   └── items.ts                  # All item queries (extend existing file)
│
├── app/items/
│   └── [type]/
│       └── page.tsx              # Dynamic route — one page for all 7 types
│
└── components/items/
    ├── ItemList.tsx              # List + empty state
    ├── ItemDrawer.tsx            # Slide-in panel (view + edit)
    ├── ItemForm.tsx              # Unified create/edit form shell
    └── fields/
        ├── TextFields.tsx        # content + language (snippet, prompt, command, note)
        ├── UrlField.tsx          # url (link)
        └── FileField.tsx         # file upload (file, image) — Pro only
```

---

## Dynamic Route: `/items/[type]`

The `[type]` segment is the `ItemType.name` slug (`snippet`, `prompt`, `command`, `note`, `link`, `file`, `image`).

**`src/app/items/[type]/page.tsx`**

```tsx
// Server component — no 'use client'
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { getItemsByType } from '@/lib/db/items';
import ItemList from '@/components/items/ItemList';

const VALID_TYPES = ['snippet', 'prompt', 'command', 'note', 'link', 'file', 'image'] as const;
type TypeSlug = typeof VALID_TYPES[number];

interface Props {
  params: Promise<{ type: string }>;
}

export default async function ItemTypePage({ params }: Props) {
  const { type } = await params;

  if (!VALID_TYPES.includes(type as TypeSlug)) notFound();

  const session = await auth();
  const userId = session?.user?.id ?? DEMO_USER_ID;

  const items = await getItemsByType(userId, type as TypeSlug);

  return <ItemList items={items} type={type as TypeSlug} />;
}

export function generateStaticParams() {
  return VALID_TYPES.map((type) => ({ type }));
}
```

---

## Queries — `src/lib/db/items.ts`

Extend the existing file with two new functions:

```ts
// Fetch all items of a specific type for a user
export async function getItemsByType(
  userId: string,
  typeName: string,
): Promise<ItemWithMeta[]>

// Fetch a single item by ID (used by the drawer)
export async function getItemById(
  userId: string,
  itemId: string,
): Promise<ItemWithMeta | null>
```

Both reuse the existing `itemInclude` and `mapItem` helpers already in the file.
Add `url`, `fileUrl`, `fileName`, `fileSize`, `language` to `ItemWithMeta` and `mapItem` to support all content types.

---

## Mutations — `src/actions/items.ts`

One file with `'use server'` at the top. All actions validate the session and that the item belongs to the current user.

```ts
'use server';

// Create a new item. Accepts a FormData or typed input.
// Returns { success: true, id: string } | { error: string }
export async function createItem(input: CreateItemInput)

// Update title, description, content/url, tags, language.
// Returns { success: true } | { error: string }
export async function updateItem(itemId: string, input: UpdateItemInput)

// Hard-delete an item (cascades collections/tags via Prisma).
// Returns { success: true } | { error: string }
export async function deleteItem(itemId: string)

// Toggle isFavorite — returns new value.
export async function toggleFavorite(itemId: string): Promise<boolean>

// Toggle isPinned — returns new value.
export async function togglePinned(itemId: string): Promise<boolean>
```

### Input types

```ts
interface CreateItemInput {
  title: string;
  typeId: string;           // resolved from typeName at the call site
  contentType: ContentType; // TEXT | URL | FILE
  content?: string;         // TEXT
  language?: string;        // TEXT, optional
  url?: string;             // URL
  fileUrl?: string;         // FILE — upload handled separately before action call
  fileName?: string;
  fileSize?: number;
  description?: string;
  tags?: string[];
  collectionIds?: string[];
}

type UpdateItemInput = Partial<Omit<CreateItemInput, 'typeId' | 'contentType'>>;
```

### Pattern

```ts
export async function createItem(input: CreateItemInput) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  // validate with Zod
  // write to DB
  // revalidatePath('/items/' + typeName)
  return { success: true, id: item.id };
}
```

Always call `revalidatePath` after mutations so the server component re-fetches.

---

## Components

### `ItemList.tsx` — `'use client'`

Receives the pre-fetched item array from the server component. Owns the drawer open/close state.

```
Responsibilities:
- Render grid or list of ItemCard components
- Show empty state when items.length === 0
- Open ItemDrawer when a card is clicked, passing the selected item
- Render a "New item" button that opens ItemDrawer in create mode
```

### `ItemDrawer.tsx` — `'use client'`

Slides in from the right. Contains `ItemForm`.

```
Props:
- item: ItemWithMeta | null   (null = create mode)
- type: TypeSlug              (always set — the current type page context)
- open: boolean
- onClose: () => void

Responsibilities:
- Display item title in the header
- Render favorite/pin toggle buttons (call toggleFavorite / togglePinned)
- Render delete button with confirmation
- Render ItemForm for editing or creating
```

### `ItemForm.tsx` — `'use client'`

```
Props:
- item: ItemWithMeta | null   (null = create mode)
- type: TypeSlug
- onSuccess: () => void

Responsibilities:
- Shared fields: title, description, tags, collection selector
- Delegate content fields to the correct Fields component based on contentType
- Call createItem or updateItem on submit
- Show toast on success/error
```

### `fields/TextFields.tsx`

Used by: snippet, prompt, command, note.

```
Fields: content (textarea or code editor), language (optional select)
Language is only shown for snippet and command; hidden for prompt and note.
```

### `fields/UrlField.tsx`

Used by: link.

```
Fields: url (input with URL validation)
```

### `fields/FileField.tsx`

Used by: file, image (Pro only).

```
Fields: file input — uploads to Cloudflare R2 via /api/upload before the action runs.
Shows current file name + size if editing.
Gated by session.user.isPro check; shows upgrade prompt if not Pro.
```

### Type → Fields mapping (lives inside `ItemForm`)

```ts
const CONTENT_TYPE_MAP: Record<TypeSlug, ContentType> = {
  snippet: 'TEXT',
  prompt:  'TEXT',
  command: 'TEXT',
  note:    'TEXT',
  link:    'URL',
  file:    'FILE',
  image:   'FILE',
};

const SHOW_LANGUAGE: Set<TypeSlug> = new Set(['snippet', 'command']);
```

This mapping is the only place type-specific logic appears in the form. The actions and queries remain type-agnostic.

---

## Where Type-Specific Logic Lives

| Concern                    | Location                          |
|----------------------------|-----------------------------------|
| Content field rendering    | `fields/TextFields`, `UrlField`, `FileField` |
| Language selector show/hide| `ItemForm` — `SHOW_LANGUAGE` set  |
| ContentType resolution     | `ItemForm` — `CONTENT_TYPE_MAP`   |
| Card content preview       | `ItemCardRow` / `ItemCardGrid` (existing) |
| Icon + color display       | `ICON_MAP` in `src/lib/icon-map.ts` (existing) |
| Pro gate                   | `FileField` + API route           |

Actions (`items.ts`) and queries (`lib/db/items.ts`) are fully type-agnostic — they operate on the `ContentType` enum, not the human-readable type name.

---

## Data Flow Summary

```
URL /items/snippet
  → page.tsx (server)
      → getItemsByType(userId, 'snippet')        [lib/db/items.ts]
      → <ItemList items={...} type="snippet" />

User clicks item card
  → ItemList opens ItemDrawer with selected item

User edits and submits
  → ItemForm calls updateItem(itemId, input)     [actions/items.ts]
      → revalidatePath('/items/snippet')
      → page.tsx re-renders with fresh data
      → ItemDrawer receives updated item via props

User clicks "New item"
  → ItemDrawer opens in create mode (item = null)
  → ItemForm calls createItem(input)             [actions/items.ts]
      → revalidatePath('/items/snippet')
```
