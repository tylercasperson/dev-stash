# Current Feature: Code Quality Quick Wins

## Status

In Progress

## Goals

Address all low-risk findings from the code scanner audit. No behavior changes — only correctness, safety, and maintainability improvements.

### Security

- [ ] **`.env.example` credential** — Replace real Neon DB password with a placeholder string in `.env.example`

### Type Safety

- [ ] **Unsafe `ContentType` enum cast** — Replace `contentType: string` + `as 'TEXT' | 'FILE' | 'URL'` cast in `src/lib/db/items.ts` with the Prisma-generated `ContentType` enum

### Refactoring

- [ ] **Extract shared `ICON_MAP`** — Remove the triplicated `ICON_MAP` in `Sidebar.tsx`, `CollectionCard.tsx`, and `ItemCard.tsx`; extract to `src/lib/icon-map.ts` and import from there
- [ ] **Extract shared `DEMO_USER_ID`** — Remove duplicate constant from `src/app/dashboard/page.tsx` and `src/app/dashboard/layout.tsx`; extract to `src/lib/demo.ts`
- [ ] **Deduplicate sidebar collapsed/expanded render** — Merge the two `.map()` blocks in `Sidebar.tsx` (lines 119–172) into one, passing `isCollapsed` as a prop

### Bug Fix

- [ ] **Sidebar favorites always gray** — `getSidebarData` in `src/lib/db/collections.ts` hardcodes `dominantTypeColor: '#6b7280'` for favorite collections; apply the same dominant-type computation used for recent collections

### Dead Code Removal

- [ ] **Remove unused `import Image`** — Delete unused `next/image` import from `src/app/page.tsx` line 1
- [ ] **Remove unnecessary `'use client'`** — `TopBar.tsx` has no state, effects, or browser APIs; remove the directive
- [ ] **Delete `src/lib/mock-data.ts`** — File has zero importers; live Prisma layer replaced it entirely

## Notes

- Source: code-scanner audit run on 2026-04-15
- All items are isolated changes with no cross-cutting impact unless noted
- The `ICON_MAP` extraction is a prerequisite for keeping future type-aware components maintainable
- After `.env.example` is fixed, rotate the Neon DB password via the Neon console

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
- **2026-04-15** — Code quality quick wins spec set as current feature
