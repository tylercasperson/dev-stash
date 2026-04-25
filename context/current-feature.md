# Current Feature: Collection Create

## Status

In Progress

## Goals

- "New Collection" button in the TopBar opens a create dialog
- Dialog has **name** (required) and **description** (optional) fields
- `createCollection` server action with Zod validation following the `{ success, data, error }` pattern
- New collection is user-scoped — `userId` always sourced from the session
- On success: toast, close dialog, `router.refresh()` to update collections list and sidebar
- On failure: toast with error message, dialog stays open
- `createCollection` DB function lives in `src/lib/db/collections.ts`

## Notes

- Follow the same patterns as items:
  - DB query in `src/lib/db/collections.ts`
  - Server action in `src/actions/collections.ts` (create if it doesn't exist)
  - Modal component similar to `CreateItemDialog`
- TopBar already has a "New Item" button — add "New Collection" button alongside it
- Collections are user-scoped; never accept userId from the client
- Use `router.refresh()` after create so the dashboard and sidebar reflect the new collection

## History

- **2026-04-11** — Initial project setup (Next.js, Prisma, Tailwind, ShadCN, NextAuth) committed to master
- **2026-04-11** — AI context files created (`project-overview.md`, `coding-standards.md`, `ai-interaction.md`, `current-feature.md`) and added to CLAUDE.md
- **2026-04-11** — Dashboard UI screenshots added (`context/screenshots/dashboard-ui-main.png`, `dashboard-ui-drawer.png`) as visual reference for future prompts
- **2026-04-11** — Mock data file created (`src/lib/mock-data.ts`) for dashboard development
- **2026-04-11** — Dashboard UI Phase 1 completed; foundation layout, top bar, and route setup committed to master
- **2026-04-11** — Dashboard UI Phase 2 completed; collapsible sidebar with navigation, favorites, recents, and user avatar committed to master
- **2026-04-11** — Dashboard UI Phase 3 completed; main content area with stats, collections, pinned and recent items committed to master
- **2026-04-11** — Database setup completed; Prisma 7 + Neon PostgreSQL, initial migration, system types seeded
- **2026-04-12** — Seed data completed; demo user, system item types, collections, and items populated in Neon database
- **2026-04-12** — Dashboard collections spec set as current feature
- **2026-04-12** — Dashboard collections completed; real collection data from Neon database via Prisma
- **2026-04-12** — Dashboard items completed; real item data from Neon database via Prisma, pinned items hidden when empty
- **2026-04-12** — Stats & sidebar spec set as current feature
- **2026-04-15** — PRO badge added to Files and Images in sidebar; merged to master
- **2026-04-15** — Code quality quick wins (round 1) completed; extracted shared ICON_MAP and DEMO_USER_ID constants, fixed sidebar favorites dominant color bug, replaced unsafe ContentType cast with Prisma enum, deduplicated sidebar Types render, removed unused imports and `'use client'` directive
- **2026-04-15** — Code quality quick wins (round 2) completed; fixed File icon fallback import, scoped Prisma includes in getCollectionsForUser and collectionItemsInclude, renamed "All Collections" to "Other Collections", split ItemCard into ItemCardRow/ItemCardGrid/dispatcher, added PLURAL_ROUTES map in Sidebar, added aria-label to TopBar search, added stopPropagation scaffold to CollectionCard star, replaced DATABASE_URL ! assertion with explicit guard in prisma.ts
- **2026-04-15** — Code quality quick wins (round 3) completed; replaced plain anchor with Next.js Link in dashboard page, narrowed itemInclude to select only name/icon/color/tag.name, replaced item-ID-array count with Prisma _count aggregate, added 'use client' intent comment to CollectionCard, added scale TODO comment for dominant color computation, replaced DATABASE_URL! assertion with explicit guard in seed.ts
- **2026-04-18** — Auth Phase 1 completed; NextAuth v5 (next-auth@beta) with GitHub OAuth, split auth config pattern for edge compatibility, Prisma adapter with JWT strategy, proxy-based `/dashboard/*` route protection redirecting unauthenticated users to sign-in
- **2026-04-18** — Auth Phase 2 completed; Credentials provider added with bcrypt validation, `POST /api/auth/register` route for new user registration, GitHub OAuth unaffected
- **2026-04-18** — Auth Phase 3 completed; custom `/sign-in` and `/register` pages replacing NextAuth defaults, reusable `UserAvatar` component with GitHub image or initials fallback, sidebar user section with real session data and sign-out dropdown, sonner toast on registration success, dashboard layout and page use authenticated user ID
- **2026-04-18** — Email verification completed; Resend sends verification email on credentials registration, `GET /api/auth/verify-email` validates token and sets `emailVerified`, unverified users blocked at sign-in with inbox prompt, GitHub OAuth unaffected; `scripts/purge-users.ts` added to clean test users
- **2026-04-18** — Email verification flag completed; `EMAIL_VERIFICATION_ENABLED` env var in `src/lib/flags.ts` toggles full verification flow; disabled path auto-verifies user on register and redirects to sign-in with toast; `.env` defaults false, `.env.production` defaults true
- **2026-04-19** — Forgot password completed; "Forgot password?" link on sign-in, `/forgot-password` email form sends reset link via Resend, `/reset-password?token=...` validates 1hr token, rejects same-as-current password, updates hashed password and invalidates token; GitHub OAuth users unaffected
- **2026-04-19** — Profile page completed; `/profile` route with user info (avatar, name, email, join date), per-type item count stats, change password form (email users only), and delete account with AlertDialog confirmation; `POST /api/auth/change-password` and `DELETE /api/auth/delete-account` API routes added
- **2026-04-20** — Auth security fixes; added password max length (128) to register, reset-password, and change-password routes; added `passwordChangedAt` field to User model to invalidate JWT sessions after password change or reset
- **2026-04-20** — GitHub OAuth redirect fix completed; replaced client-side `signIn` (next-auth/react) with `signInWithGitHub` server action using `signIn` from `@/auth`, eliminating the two-click sign-in issue and ensuring reliable redirect to `/dashboard`
- **2026-04-21** — Items list view completed; dynamic `/items/[type]` route with sidebar shell layout, `getItemsByType` Prisma query, responsive two-column `ItemCardGrid` with type-colored left borders, empty state, and `notFound()` for unknown slugs
- **2026-04-21** — Vitest unit testing setup completed; scoped to server actions and utilities, v8 coverage, `utils.test.ts` smoke test, test scripts added to package.json, coding-standards and ai-interaction docs updated
- **2026-04-21** — Item list view updated to three-column layout on large screens (`lg:grid-cols-3`); remains 2-column on medium and 1-column on mobile
- **2026-04-22** — Item drawer completed; right-side shadcn `Sheet` opens on `ItemCard` click across dashboard and items list pages, `ItemsWithDrawer` client wrapper keeps pages as server components, `GET /api/items/[id]` route with auth check fetching `getItemById` full detail, skeleton loading state, action bar with Favorite/Pin/Copy/Edit/Delete (buttons inert — wire-up deferred to later feature)
- **2026-04-22** — Collection drawer completed; dashboard `CollectionCard` converted from `<Link>` to clickable div with `onSelect`, new `CollectionsWithDrawer` client wrapper + `CollectionDetailDrawer` showing name, description, item list with type icons, and timestamps, `GET /api/collections/[id]` route with auth check fetching `getCollectionById` full detail; unified click-to-drawer behavior across all dashboard cards
- **2026-04-22** — Item drawer edit mode completed; Edit button toggles inline edit mode in the same drawer, Save/Cancel replace action bar, controlled inputs for title/description/tags plus type-specific fields (content for TEXT, language for snippet/command, URL for link), `updateItem` server action with Zod validation and `{ success, data, error }` pattern, tag update uses deleteMany + connectOrCreate, `router.refresh()` after save; 13 new unit tests across `src/lib/db/items.test.ts` and `src/actions/items.test.ts`
- **2026-04-22** — Delete item completed; Delete button in item drawer opens ShadCN `AlertDialog` confirmation, `deleteItem` server action validates ownership before deleting, success closes drawer + Sonner toast + `router.refresh()`, error shows toast without closing; 4 new unit tests in `src/actions/items.test.ts`
- **2026-04-22** — Item create completed; "New Item" button in TopBar opens shadcn Dialog with type selector (snippet, prompt, command, note, link) and dynamic fields per type, `createItem` server action with Zod validation and `{ success, data, error }` pattern, `createItem` DB query sets contentType (TEXT/URL) from type name, toast on success + close + `router.refresh()`; 12 new unit tests across `src/actions/items.test.ts` and `src/lib/db/items.test.ts`
- **2026-04-22** — Code editor completed; `CodeEditor` component (Monaco, vs-dark theme) with macOS window dots, language label, and copy button in header; fluid height up to 400px with slim scrollbar; replaces Textarea for snippet/command types in both view (readonly) and edit modes in ItemDetailDrawer and CreateItemDialog; `AddItemButton` client component adds a type-specific "New {Type}" button on each `/items/[type]` page with the type pre-selected in the dialog; `CreateItemDialog` accepts a `defaultType` prop
- **2026-04-22** — Markdown editor completed; `MarkdownEditor` component with Write/Preview tabs, dark theme (`bg-[#1e1e1e]`/`bg-[#2d2d2d]` header), copy button, and fluid height up to 400px; uses `react-markdown` + `remark-gfm` for GFM rendering; readonly mode shows Preview tab only; replaces Textarea for note and prompt types in `CreateItemDialog` and `ItemDetailDrawer` (view + edit modes); `.markdown-preview` CSS class added to `globals.css` for headings, lists, code blocks, blockquotes, links, and tables
- **2026-04-23** — File and image upload with Cloudflare R2 completed; R2 client (`src/lib/r2.ts`) with upload/delete helpers, `POST /api/upload` with MIME type and size validation (5MB images, 10MB files), `GET /api/download` proxy to avoid CORS, `FileUpload` component with drag-and-drop and progress indicator, `CreateItemDialog` updated for file/image types with preview, `ItemDetailDrawer` shows image preview and download button, `deleteItem` cleans up R2 on delete; new unit tests in `src/lib/files.test.ts`
- **2026-04-24** — Image gallery view completed; new `ImageThumbnailCard` component with 16:9 `aspect-video` thumbnails, `object-cover` cropping, 5% hover zoom (300ms transition), and favorite/pin icon overlays; `ItemCard` dispatcher routes `typeName === 'image'` to the thumbnail card; `fileUrl` added to `ItemWithMeta` and `mapItem` to make image URLs available in list queries; all other item type pages unaffected
- **2026-04-24** — File list view completed; `/items/files` now renders a single-column Drive-style list via new `FileListRow` component; each row shows extension-based icon, title + `.EXT` label, tags, file size, smart date (Today/Yesterday/Apr 23, 2026), and download button; `fileName`/`fileSize` added to `ItemWithMeta` and `mapItem`; `ItemCard` dispatcher routes `layout='list'` to `FileListRow`; items page uses list layout + `flex flex-col` container for the file type
- **2026-04-24** — Quick copy button added to item cards; `url` added to `ItemWithMeta` and `mapItem` so link URLs are available in list queries; copy button always visible in bottom-right corner of `ItemCardGrid` and `ItemCardRow` (absolute-positioned); copies `content` for TEXT types, `url` for link types; 1.5s green check feedback state; `FILE`/`IMAGE` cards unaffected; fixed expanding image cards on dashboard by moving the `typeName === 'image'` check in `ItemCard` dispatcher below layout checks so image items render as `ItemCardRow` in dashboard Pinned/Recent sections
- **2026-04-24** — Code refactor completed; extracted 9 new files — `drawer-primitives.tsx` (shared Section/DetailRow/EditField/ActionButton/DrawerSkeleton), `useDrawerFetch<T>`, `useClickOutside`, `useXhrUpload` hooks, `item-schemas.ts` (shared Zod schemas), `AuthFormLayout`/`AuthFormInput`/`EmailSentConfirmation` auth components, `TypeSelector` component; updated 12 existing files to consume them; build passes and 66 tests pass
