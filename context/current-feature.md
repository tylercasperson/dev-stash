# Current Feature

Seed Data — Populate the database with a demo user, system item types, collections, and items.

## Status

In Progress

## Goals

- Demo user: `demo@devstash.io` / `Demo User`, password `12345678` hashed with bcryptjs (12 rounds)
- System item types: snippet, prompt, command, note, file, image, link (idempotent — skip if exists)
- Collections with items:
  - **React Patterns** — 3 TypeScript snippets (custom hooks, component patterns, utility functions)
  - **AI Workflows** — 3 prompts (code review, docs generation, refactoring)
  - **DevOps** — 1 snippet, 1 command, 2 links (real URLs)
  - **Terminal Commands** — 4 commands (git, docker, process mgmt, package manager)
  - **Design Resources** — 4 links (real URLs: CSS/Tailwind, component libs, design systems, icons)
- Overwrite existing `prisma/seed.ts`

## Notes

- Spec: `context/features/seed-spec.md`
- Run with: `npx prisma db seed`
- bcryptjs must be installed; use 12 salt rounds
- Seed must be idempotent — safe to re-run without creating duplicates

## History

- **2026-04-11** — Initial project setup (Next.js, Prisma, Tailwind, ShadCN, NextAuth) committed to master
- **2026-04-11** — AI context files created (`project-overview.md`, `coding-standards.md`, `ai-interaction.md`, `current-feature.md`) and added to CLAUDE.md
- **2026-04-11** — Dashboard UI screenshots added (`context/screenshots/dashboard-ui-main.png`, `dashboard-ui-drawer.png`) as visual reference for future prompts
- **2026-04-11** — Mock data file created (`src/lib/mock-data.ts`) for dashboard development
- **2026-04-11** — Dashboard UI Phase 1 completed; foundation layout, top bar, and route setup committed to master
- **2026-04-11** — Dashboard UI Phase 2 completed; collapsible sidebar with navigation, favorites, recents, and user avatar committed to master
- **2026-04-11** — Dashboard UI Phase 3 completed; main content area with stats, collections, pinned and recent items committed to master
- **2026-04-11** — Database setup completed; Prisma 7 + Neon PostgreSQL, initial migration, system types seeded
- **2026-04-12** — Seed data spec set as current feature
