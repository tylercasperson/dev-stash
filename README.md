# DevStash

> **A developer knowledge hub for snippets, commands, prompts, notes, files, images, and links — built as a learning project following a tutorial by [Brad Traversy](https://traversymedia.com).**

Explore the features of Dev Stash on this live site: https://tylercasperson.github.io/devstash-showcase/.

---

## Tutorial Credit

This project was built while following the **"Coding with AI"** course by [Brad Traversy](https://traversymedia.com):

**Course:** [https://www.traversymedia.com/coding-with-ai](https://www.traversymedia.com/coding-with-ai)

Brad Traversy is the creator of this tutorial and the original concept behind DevStash. This implementation diverges from the tutorial's codebase in significant ways — additional features were added, architectural decisions were made differently, and the project was extended beyond the original scope as a learning exercise in building production-quality software with AI assistance.

> **Note:** This codebase will not match Brad's codebase from the tutorial. It was used as a foundation and learning guide, not copied directly.

---

## Important: Site Is Not Publicly Deployed

**This site is functional but not publicly accessible.** The application relies on several paid third-party services that would generate costs if exposed to public traffic:

- **OpenAI API** — AI features (auto-tagging, code explanation, prompt optimization)
- **Cloudflare R2** — File and image storage
- **Stripe** — Subscription payments and billing
- **Neon PostgreSQL** — Hosted database
- **Upstash Redis** — Rate limiting
- **Resend** — Transactional email (verification, password reset)

To run the project locally, you need accounts with each of these services and valid credentials in `.env`. All features work correctly in a local environment.

---

## What Is DevStash?

DevStash solves a problem every developer faces: knowledge scattered across too many places. Code snippets live in VS Code, prompts are buried in chat histories, useful links are forgotten in browser bookmarks, and notes are lost across multiple apps.

DevStash is a single, fast, searchable hub where developers can store and retrieve everything they need — organized by type, grouped into collections, and enhanced with AI.

---

## Features

### Core Item Types

| Type    | Content               | Color             | Pro Only |
| ------- | --------------------- | ----------------- | -------- |
| Snippet | Code (Monaco editor)  | Blue `#3b82f6`    | No       |
| Prompt  | Markdown (AI prompts) | Purple `#8b5cf6`  | No       |
| Command | Code (Monaco editor)  | Orange `#f97316`  | No       |
| Note    | Markdown              | Yellow `#fde047`  | No       |
| Link    | URL                   | Emerald `#10b981` | No       |
| File    | File upload (R2)      | Gray `#6b7280`    | Yes      |
| Image   | Image upload (R2)     | Pink `#ec4899`    | Yes      |

### Organization

- **Collections** — Flexible containers; items can belong to multiple collections simultaneously
- **Favorites** — Star items and collections for quick access via the Favorites page
- **Pinned items** — Pin important items so they float to the top of listings
- **Tags** — Tag items for cross-type filtering and search

### Search & Navigation

- **Global command palette** — `⌘K` / `Ctrl+K` searches all items and collections instantly
- **Item type pages** — Dedicated pages for each type (`/items/snippets`, `/items/prompts`, etc.)
- **Collections pages** — Browse and manage all collections at `/collections`
- **Pagination** — All listing pages paginate at 21 items per page

### Editors

- **Monaco Code Editor** — Full VS Code-quality syntax highlighting for snippets and commands; supports 50+ languages
- **Markdown Editor** — Write/Preview tabs with GitHub Flavored Markdown rendering for notes and prompts
- **Editor Preferences** — Per-user settings for font size, tab size, theme (vs-dark, Monokai, GitHub Dark), word wrap, and minimap

### AI Features (Pro Only)

- **Auto-Tag Suggestions** — AI analyzes content and suggests relevant tags with accept/reject per tag
- **AI Description Generator** — One-click description generation from title and content
- **Explain This Code** — AI explains selected code snippets with a Code/Explain tab toggle in the editor
- **Prompt Optimizer** — Rewrites AI prompts to be clearer and more effective; shows Original/Optimized tabs with "Use this" action
- Rate-limited to 20 requests/hour per user via Upstash Redis

### Authentication

- **Email/password** — Registration with optional email verification flow (configurable via `EMAIL_VERIFICATION_ENABLED`)
- **GitHub OAuth** — One-click sign-in via GitHub
- **Password management** — Forgot password, reset password, change password flows via Resend email
- **Session security** — JWT strategy; `passwordChangedAt` invalidates sessions after password change
- **Email verification** — Resend-powered verification email on credentials registration

### File & Image Uploads (Pro)

- Drag-and-drop upload with progress indicator
- Images: up to 5 MB, all common MIME types
- Files: up to 10 MB
- Stored in Cloudflare R2; served via public CDN URL
- Deleted from R2 automatically when item is deleted
- Drive-style file list view with extension icons, file size, and download

### Subscription & Billing

- **Free tier** — 50 items, 3 collections, no files/images, no AI
- **Pro tier** — Unlimited items and collections, file/image uploads, all AI features, data export
- **Stripe Checkout** — Monthly (`$8/mo`) and yearly (`$72/yr`) billing intervals
- **Stripe Customer Portal** — Self-service subscription management
- **Webhook sync** — `checkout.session.completed`, `subscription.updated`, `subscription.deleted` keep `isPro` flag in sync without requiring sign-out

### Profile & Settings

- **Profile page** — Avatar (GitHub image or initials), join date, per-type item count stats
- **Settings page** — Change password, delete account, subscription management, editor preferences
- **Delete account** — Cascades to all owned items, collections, and R2 files

### Public Homepage

- Animated canvas hero with floating developer tool icons and mouse-repel physics
- Features grid, AI section, pricing toggle (monthly/yearly), and CTA
- "Preview Inside" carousel showing interactive JSX mockups of the dashboard, item drawer, collections, and AI features
- Authenticated users are redirected to `/dashboard` on visit

---

## Build Log

The following features were implemented incrementally across the project lifetime. Each entry reflects a completed, tested, and committed feature:

| Date       | Feature                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-11 | Initial project setup — Next.js 16, Prisma 7, Tailwind CSS v4, ShadCN UI, NextAuth v5                                           |
| 2026-04-11 | AI context files for AI-assisted development workflow                                                                           |
| 2026-04-11 | Dashboard UI Phase 1 — foundation layout, top bar, routing                                                                      |
| 2026-04-11 | Dashboard UI Phase 2 — collapsible sidebar with navigation, favorites, user avatar                                              |
| 2026-04-11 | Dashboard UI Phase 3 — main content area with stats, collections, pinned and recent items                                       |
| 2026-04-11 | Database setup — Prisma 7 + Neon PostgreSQL, initial migration, system types seeded                                             |
| 2026-04-12 | Seed data — demo user, system types, collections, and items in Neon                                                             |
| 2026-04-15 | Code quality round 1 — shared ICON_MAP, DEMO_USER_ID, Prisma enum cast fix, sidebar dedup                                       |
| 2026-04-15 | Code quality round 2 — scoped includes, renamed sections, ItemCard split, aria labels                                           |
| 2026-04-15 | Code quality round 3 — Next.js Link, narrowed Prisma selects, Prisma `_count` aggregate                                         |
| 2026-04-18 | Auth Phase 1 — NextAuth v5 GitHub OAuth, split config, Prisma adapter, route protection                                         |
| 2026-04-18 | Auth Phase 2 — Credentials provider, bcrypt validation, registration API route                                                  |
| 2026-04-18 | Auth Phase 3 — Custom sign-in/register pages, UserAvatar, session data in sidebar                                               |
| 2026-04-18 | Email verification — Resend, token validation, unverified sign-in block                                                         |
| 2026-04-18 | Email verification flag — `EMAIL_VERIFICATION_ENABLED` env toggle                                                               |
| 2026-04-19 | Forgot/reset password — 1hr token, same-password rejection, Resend email                                                        |
| 2026-04-19 | Profile page — avatar, stats, change password form, delete account                                                              |
| 2026-04-20 | Auth security — password max length (128), `passwordChangedAt` JWT invalidation                                                 |
| 2026-04-20 | GitHub OAuth redirect fix — server action replaces client-side `signIn`                                                         |
| 2026-04-21 | Items list view — `/items/[type]` route, Prisma query, responsive grid, empty state                                             |
| 2026-04-21 | Vitest unit testing — scoped to server actions and utilities, v8 coverage                                                       |
| 2026-04-21 | Items list — 3-column layout on large screens                                                                                   |
| 2026-04-22 | Item drawer — right-side Sheet, `GET /api/items/[id]`, skeleton, action bar                                                     |
| 2026-04-22 | Collection drawer — `GET /api/collections/[id]`, collection detail view                                                         |
| 2026-04-22 | Item drawer edit mode — inline edit, `updateItem` server action, tag sync                                                       |
| 2026-04-22 | Delete item — AlertDialog confirmation, `deleteItem` server action                                                              |
| 2026-04-22 | Item create — New Item dialog, type selector, `createItem` server action                                                        |
| 2026-04-22 | Monaco code editor — vs-dark theme, macOS dots, language label, copy button                                                     |
| 2026-04-22 | Markdown editor — Write/Preview tabs, GFM rendering, copy button                                                                |
| 2026-04-23 | File/image upload — Cloudflare R2, drag-and-drop, progress, download proxy                                                      |
| 2026-04-24 | Image gallery view — `ImageThumbnailCard`, 16:9 thumbnails, hover zoom                                                          |
| 2026-04-24 | File list view — Drive-style single-column, extension icons, file size, download                                                |
| 2026-04-24 | Quick copy button — copies content or URL from item cards                                                                       |
| 2026-04-24 | Code refactor — shared drawer primitives, hooks, Zod schemas, auth components                                                   |
| 2026-04-25 | Collection create — New Collection dialog, `createCollection` server action                                                     |
| 2026-04-25 | Add item to collections — CollectionSelector in create/edit flows                                                               |
| 2026-04-25 | Collections pages — `/collections` grid, `/collections/[id]` detail                                                             |
| 2026-04-25 | Collection management — edit/favorite/delete via 3-dot dropdown                                                                 |
| 2026-04-25 | Global search — `⌘K` command palette, items and collections grouped                                                             |
| 2026-04-25 | Pagination — numbered pages, ellipsis, `?page=` search param                                                                    |
| 2026-04-25 | Settings page — subscription, editor preferences, password, delete account                                                      |
| 2026-04-26 | Favorites page — compact list of starred items and collections with sorting                                                     |
| 2026-04-26 | Editor preferences — font size, tab size, theme, word wrap, minimap; debounced auto-save                                        |
| 2026-04-26 | Favorite toggle — star button in drawer, collection cards, and collection detail                                                |
| 2026-04-26 | Favorites sorting — Name / Date / Type with asc/desc toggle                                                                     |
| 2026-04-26 | Pinned items — pin toggle in drawer, pinned items float to top of listings                                                      |
| 2026-04-27 | Homepage prototype — canvas animation, features grid, pricing, CTA                                                              |
| 2026-04-27 | Homepage — full public-facing page, all sections, auth-aware CTA                                                                |
| 2026-04-27 | TopBar mobile — brand hidden on mobile, collapsed create menu, `⌘K` kbd hint                                                    |
| 2026-04-27 | Navbar on auth pages, hex logo, `/preview` route with carousel                                                                  |
| 2026-04-27 | UI polish — touch targets, keyboard nav, hover states, accessibility                                                            |
| 2026-04-27 | Stripe Phase 1 — singleton client, subscription helpers, `isPro` in JWT                                                         |
| 2026-04-27 | Stripe Phase 2 — Checkout, Customer Portal, webhooks, free-tier gating                                                          |
| 2026-04-28 | Demo seed — reduced to free-tier limits; purge → seed produces clean reset                                                      |
| 2026-04-28 | Stripe webhook moved to `/api/webhooks/stripe`                                                                                  |
| 2026-04-28 | ProGate — upgrade prompt for free users on `/items/files` and `/items/images`                                                   |
| 2026-04-28 | Upgrade page — pricing cards, billing toggle, Stripe checkout flow                                                              |
| 2026-04-29 | AI auto-tagging — OpenAI, Pro-gated, 20 req/hr rate limit, per-tag accept/reject                                                |
| 2026-04-29 | AI description generator — one-click description from title + content                                                           |
| 2026-04-29 | AI code explanation — Explain tab in Monaco editor, markdown rendered output                                                    |
| 2026-04-29 | AI prompt optimizer — Original/Optimized tabs, "Use this" applies to edit mode                                                  |
| 2026-04-30 | Refactor — shared ActionResult, handleAIError, requireSession, zodError utilities                                               |
| 2026-04-30 | Refactor — HexLogo, EditorTabButton, TagList, mapItemDetail, useCopyToClipboard, useCollectionOptions, api-utils, stripe-client |
| 2026-04-30 | UI polish — dashboard home link, keyboard nav, GitHub OAuth on register, viewport overflow fix                                  |

---

## Tech Stack

| Layer         | Technology                        | Purpose                                     |
| ------------- | --------------------------------- | ------------------------------------------- |
| Framework     | Next.js 16 / React 19             | SSR, App Router, Server Actions             |
| Language      | TypeScript                        | Full-stack type safety                      |
| Database      | Neon PostgreSQL                   | Cloud-hosted Postgres                       |
| ORM           | Prisma 7                          | Type-safe DB queries and migrations         |
| Auth          | NextAuth v5 (next-auth@beta)      | GitHub OAuth + Credentials provider         |
| Styling       | Tailwind CSS v4 + ShadCN UI       | Utility-first CSS with component library    |
| Code Editor   | Monaco Editor                     | VS Code-quality syntax highlighting         |
| Markdown      | react-markdown + remark-gfm       | GitHub Flavored Markdown rendering          |
| AI            | OpenAI gpt-5-nano (Responses API) | Auto-tagging, explanation, optimization     |
| File Storage  | Cloudflare R2                     | File and image uploads                      |
| Email         | Resend                            | Verification and password reset emails      |
| Payments      | Stripe                            | Checkout, Customer Portal, webhooks         |
| Rate Limiting | Upstash Redis                     | 20 AI requests/hour per user                |
| Testing       | Vitest + v8                       | Unit tests for server actions and utilities |
| Validation    | Zod                               | Schema validation across all server actions |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── (auth)/            # Sign-in, register, forgot/reset password
│   ├── api/               # API routes (auth, items, collections, upload, stripe, webhooks)
│   ├── collections/       # /collections and /collections/[id]
│   ├── dashboard/         # Main dashboard
│   ├── favorites/         # Favorites page
│   ├── items/[type]/      # Per-type item listings
│   ├── preview/           # Public preview carousel page
│   ├── profile/           # User profile and stats
│   ├── settings/          # Settings (subscription, editor prefs, account)
│   └── upgrade/           # Pro upgrade page
├── actions/               # Server Actions (items, collections, ai, settings, auth)
├── components/
│   ├── dashboard/         # Core app components (cards, drawer, dialogs, sidebar)
│   ├── editor/            # Monaco and Markdown editors
│   ├── homepage/          # Public homepage sections
│   ├── layout/            # TopBar, Sidebar, DashboardShell
│   ├── settings/          # Settings-specific components
│   ├── ui/                # ShadCN primitives + shared components
│   └── upgrade/           # Upgrade page component
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities, DB helpers, external clients
│   ├── db/                # Prisma query functions (items, collections, profile)
│   └── ...                # stripe, r2, api-utils, constants, flags, etc.
└── types/                 # Shared TypeScript types
```

---

## Local Setup

### Prerequisites

You need active accounts and API credentials for:

| Service                                 | Sign Up             | Purpose               |
| --------------------------------------- | ------------------- | --------------------- |
| [Neon](https://neon.tech)               | Free tier available | PostgreSQL database   |
| [GitHub](https://github.com)            | Free                | OAuth provider        |
| [Resend](https://resend.com)            | Free tier available | Transactional email   |
| [Upstash](https://upstash.com)          | Free tier available | Redis rate limiting   |
| [Cloudflare R2](https://cloudflare.com) | Free tier available | File storage          |
| [Stripe](https://stripe.com)            | Free (test mode)    | Payments              |
| [OpenAI](https://platform.openai.com)   | Pay-as-you-go       | AI features           |
| [Vercel](https://vercel.com)            | Free tier available | Deployment (optional) |

### Environment Variables

Create a `.env` file in the project root:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="generate with: openssl rand -hex 32"

# GitHub OAuth (create at github.com/settings/developers)
AUTH_GITHUB_ID="your_github_client_id"
AUTH_GITHUB_SECRET="your_github_client_secret"

# Resend (email)
RESEND_API_KEY="re_..."

# Email verification (false = skip in development)
EMAIL_VERIFICATION_ENABLED="false"

# Upstash Redis
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Cloudflare R2
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="your-bucket-name"
R2_PUBLIC_URL="https://pub-xxx.r2.dev"

# Stripe (use test keys locally)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID_MONTHLY="price_..."
STRIPE_PRICE_ID_YEARLY="price_..."

# OpenAI
OPENAI_API_KEY="sk-proj-..."
```

### Installation

```bash
# Install dependencies
npm install

# Apply database migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Seed system item types and demo data
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other Commands

```bash
npm run build          # Production build
npm run start          # Start production server
npm run lint           # ESLint
npm run test           # Vitest unit tests
npm run test:coverage  # Coverage report
```

---

## Database Migrations

This project uses Prisma migrations — never `db push`.

```bash
# Create a new migration after schema changes
npx prisma migrate dev --name describe_the_change

# Apply migrations in production
npx prisma migrate deploy

# Check migration status
npx prisma migrate status
```

---

## Testing

Unit tests cover server actions and utility functions only (no component tests). Test files are co-located with source:

```
src/actions/items.test.ts
src/actions/collections.test.ts
src/actions/ai.test.ts
src/actions/settings.test.ts
src/lib/db/items.test.ts
src/lib/db/collections.test.ts
src/lib/db/profile.test.ts
src/lib/utils.test.ts
src/lib/subscription.test.ts
src/lib/files.test.ts
```

```bash
npm run test              # Run all tests
npm run test:coverage     # Coverage with v8
```

---

## Free vs Pro

| Feature                  | Free     | Pro         |
| ------------------------ | -------- | ----------- |
| Items                    | Up to 50 | Unlimited   |
| Collections              | Up to 3  | Unlimited   |
| File uploads             | —        | Up to 10 MB |
| Image uploads            | —        | Up to 5 MB  |
| AI auto-tagging          | —        | ✓           |
| AI code explanation      | —        | ✓           |
| AI prompt optimizer      | —        | ✓           |
| AI description generator | —        | ✓           |
| Data export (JSON/ZIP)   | —        | Planned     |
| Custom item types        | —        | Planned     |

Pro is managed through Stripe. In development, use a test Stripe account and test card numbers. Webhook events from Stripe update the `isPro` flag on the user without requiring sign-out.

---

## Deployment

The application is designed for deployment on [Vercel](https://vercel.com). Add all environment variables to your Vercel project settings.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Stripe webhooks in production:** Register `https://yourdomain.com/api/webhooks/stripe` as a webhook endpoint in the Stripe dashboard, handling `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`.

---

## Acknowledgements

- **[Brad Traversy](https://traversymedia.com)** — Course creator and original DevStash concept ([Coding with AI](https://www.traversymedia.com/coding-with-ai))
- **[Vercel](https://vercel.com)** — Next.js framework and deployment platform
- **[ShadCN UI](https://ui.shadcn.com)** — Component library built on Radix UI and Tailwind
- **[Prisma](https://prisma.io)** — ORM and database toolkit
- **[Neon](https://neon.tech)** — Serverless PostgreSQL
- **[Anthropic Claude](https://claude.ai/claude-code)** — AI coding assistant used throughout development
