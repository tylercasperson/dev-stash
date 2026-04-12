# Current Feature

Dashboard UI Phase 2 — Collapsible sidebar with navigation, favorites, recents, and user avatar.

## Status

In Progress

## Goals

- Collapsible sidebar with drawer icon to open/close
- Items/types with links to `/items/TYPE` (e.g. `/items/snippets`)
- Favorite collections section in sidebar
- Most recent collections section in sidebar
- User avatar area at the bottom of the sidebar
- Always a drawer on mobile view

## Notes

- Reference screenshot: `context/screenshots/dashboard-ui-main.png`
- Mock data available at `src/lib/mock-data.ts`
- Spec: `context/features/dashboard-phase-2-spec.md`
- Phase 3 spec: `context/features/dashboard-phase-3-spec.md`

## History

- **2026-04-11** — Initial project setup (Next.js, Prisma, Tailwind, ShadCN, NextAuth) committed to master
- **2026-04-11** — AI context files created (`project-overview.md`, `coding-standards.md`, `ai-interaction.md`, `current-feature.md`) and added to CLAUDE.md
- **2026-04-11** — Dashboard UI screenshots added (`context/screenshots/dashboard-ui-main.png`, `dashboard-ui-drawer.png`) as visual reference for future prompts
- **2026-04-11** — Mock data file created (`src/lib/mock-data.ts`) for dashboard development
- **2026-04-11** — Dashboard UI Phase 1 spec added; feature set to In Progress
- **2026-04-11** — Dashboard UI Phase 1 completed; foundation layout, top bar, and route setup committed to master
- **2026-04-11** — Dashboard UI Phase 2 spec set as current feature
