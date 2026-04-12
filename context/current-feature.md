# Current Feature

Database Setup — Prisma ORM with Neon PostgreSQL, full schema, and initial migration.

## Status

In Progress

## Goals

- Install and configure Prisma 7 with Neon PostgreSQL (serverless)
- Create full schema from `context/project-overview.md` data models (User, Item, ItemType, Collection, Tag, join tables)
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes
- Create initial migration (never use `db push`)
- Use development branch for DATABASE_URL, separate production branch

## Notes

- Spec: `context/features/database-spec.md`
- Data models reference: `context/project-overview.md`
- Database standards: `context/coding-standards.md`
- Prisma 7 has breaking changes — read upgrade guide before implementing
- Always use `prisma migrate dev` for schema changes, never `db push`

## History

- **2026-04-11** — Initial project setup (Next.js, Prisma, Tailwind, ShadCN, NextAuth) committed to master
- **2026-04-11** — AI context files created (`project-overview.md`, `coding-standards.md`, `ai-interaction.md`, `current-feature.md`) and added to CLAUDE.md
- **2026-04-11** — Dashboard UI screenshots added (`context/screenshots/dashboard-ui-main.png`, `dashboard-ui-drawer.png`) as visual reference for future prompts
- **2026-04-11** — Mock data file created (`src/lib/mock-data.ts`) for dashboard development
- **2026-04-11** — Dashboard UI Phase 1 spec added; feature set to In Progress
- **2026-04-11** — Dashboard UI Phase 1 completed; foundation layout, top bar, and route setup committed to master
- **2026-04-11** — Dashboard UI Phase 2 completed; collapsible sidebar with navigation, favorites, recents, and user avatar committed to master
- **2026-04-11** — Dashboard UI Phase 3 completed; main content area with stats, collections, pinned and recent items committed to master
- **2026-04-11** — Database setup spec set as current feature
