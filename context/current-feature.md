# Current Feature: Email Verification on Register

## Status

In Progress

## Goals

- Send a verification email via Resend when a user registers with email/password credentials
- Email contains a unique, time-limited verification link
- Clicking the link marks the user's `emailVerified` field in the database
- Unverified users who try to sign in are blocked and shown a prompt to check their email
- GitHub OAuth users bypass verification (they are auto-verified)
- Resend SDK used with `onboarding@resend.dev` as the from address

## Notes

- `RESEND_API_KEY` is already present in `.env`
- From email: `onboarding@resend.dev`
- The `VerificationToken` model already exists in the Prisma schema — use it to store tokens
- The `emailVerified` field already exists on the `User` model via NextAuth
- Only credentials-based registrations require verification; GitHub OAuth is unaffected
- Verification token should expire (e.g., 24 hours)
- After clicking the link, redirect to `/sign-in` with a success message
- Registration API route: `POST /api/auth/register` (already exists from Auth Phase 2)

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
