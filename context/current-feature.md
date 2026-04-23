# Current Feature

## Status

Not Started

## Goals

## Notes

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
