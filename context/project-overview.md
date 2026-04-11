# DevStash

> **One fast, searchable, AI-enhanced hub for all developer knowledge & resources.**

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Target Users](#target-users)
3. [Features](#features)
4. [Data Architecture](#data-architecture)
5. [Tech Stack](#tech-stack)
6. [Monetization](#monetization)
7. [UI/UX Guidelines](#uiux-guidelines)
8. [Type System Reference](#type-system-reference)

---

## Problem Statement

Developers keep their essentials scattered across multiple tools and locations:

| Resource          | Where It Lives             |
| ----------------- | -------------------------- |
| Code snippets     | VS Code, Notion, Gists     |
| AI prompts        | Chat histories             |
| Context files     | Buried in project folders  |
| Useful links      | Browser bookmarks          |
| Documentation     | Random folders             |
| Commands          | `.txt` files, bash history |
| Project templates | GitHub Gists               |

**The Result:** Context switching, lost knowledge, and inconsistent workflows.

**The Solution:** DevStash — a unified, fast, searchable, AI-enhanced hub for all developer knowledge and resources.

---

## Target Users

### 👨‍💻 Everyday Developer

Needs a fast way to grab snippets, prompts, commands, and links without hunting through multiple apps.

### 🤖 AI-First Developer

Saves prompts, contexts, workflows, and system messages for AI-assisted development.

### 📚 Content Creator / Educator

Stores code blocks, explanations, course notes, and teaching materials.

### 🔧 Full-Stack Builder

Collects patterns, boilerplates, API examples, and reusable components.

---

## Features

### A. Items & Item Types

Items are the core unit of DevStash. Each item has a **type** that determines its behavior and appearance.

#### System Types (Immutable)

| Type    | Content Model | Route             | Pro Only |
| ------- | ------------- | ----------------- | -------- |
| Snippet | Text          | `/items/snippets` | No       |
| Prompt  | Text          | `/items/prompts`  | No       |
| Note    | Text          | `/items/notes`    | No       |
| Command | Text          | `/items/commands` | No       |
| Link    | URL           | `/items/links`    | No       |
| File    | File Upload   | `/items/files`    | Yes      |
| Image   | File Upload   | `/items/images`   | Yes      |

- Items open in a **quick-access drawer** for fast viewing and editing
- Users can create **custom types** (Pro feature, future release)

### B. Collections

Collections are flexible containers for organizing items.

- Items can belong to **multiple collections** (many-to-many relationship)
- Example: A React snippet could be in both "React Patterns" and "Interview Prep"

**Example Collections:**

- React Patterns → snippets, notes
- Context Files → files
- Python Snippets → snippets
- Interview Prep → snippets, notes, links

### C. Search

Powerful full-text search across:

- Content body
- Tags
- Titles
- Item types

### D. Authentication

Powered by **NextAuth v5**:

- Email/password authentication
- GitHub OAuth

### E. Core Features

| Feature          | Description                                   |
| ---------------- | --------------------------------------------- |
| Favorites        | Mark collections and items as favorites       |
| Pin to Top       | Pin important items for quick access          |
| Recently Used    | Track and display recently accessed items     |
| Import from File | Import code directly from uploaded files      |
| Markdown Editor  | Rich editing for text-based types             |
| File Upload      | Direct upload for file/image types (Pro)      |
| Data Export      | Export data as JSON/ZIP (Pro)                 |
| Dark Mode        | Default theme, with light mode option         |
| Multi-Collection | Add/remove items to/from multiple collections |
| Collection View  | See which collections an item belongs to      |

### F. AI Features (Pro Only)

| Feature              | Description                                      |
| -------------------- | ------------------------------------------------ |
| Auto-Tag Suggestions | AI analyzes content and suggests relevant tags   |
| AI Summaries         | Generate concise summaries of notes and snippets |
| Explain This Code    | AI explains selected code with context           |
| Prompt Optimizer     | Improve and refine AI prompts                    |

---

## Data Architecture

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      USER       │       │    ITEM_TYPE    │       │       TAG       │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │       │ id              │
│ email           │       │ name            │       │ name            │
│ isPro           │       │ icon            │       └────────┬────────┘
│ stripeCustomerId│       │ color           │                │
│ stripeSubId     │       │ isSystem        │                │
└────────┬────────┘       │ userId (null=sys)│               │
         │                └────────┬────────┘                │
         │                         │                         │
         │    ┌────────────────────┼─────────────────────────┤
         │    │                    │                         │
         ▼    ▼                    ▼                         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      ITEM       │◄──────│  ITEM_COLLECTION│       │    ITEM_TAG     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id              │       │ itemId          │───────│ itemId          │
│ title           │       │ collectionId    │       │ tagId           │
│ contentType     │       │ addedAt         │       └─────────────────┘
│ content         │       └────────┬────────┘
│ fileUrl         │                │
│ fileName        │                │
│ fileSize        │                ▼
│ url             │       ┌─────────────────┐
│ description     │       │   COLLECTION    │
│ isFavorite      │       ├─────────────────┤
│ isPinned        │       │ id              │
│ language        │       │ name            │
│ userId          │       │ description     │
│ typeId          │       │ isFavorite      │
│ createdAt       │       │ defaultTypeId   │
│ updatedAt       │       │ userId          │
└─────────────────┘       │ createdAt       │
                          │ updatedAt       │
                          └─────────────────┘
```

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USER (extends NextAuth)
// ============================================

model User {
  id                   String       @id @default(cuid())
  name                 String?
  email                String       @unique
  emailVerified        DateTime?
  image                String?
  password             String?      // For email/password auth

  // Subscription
  isPro                Boolean      @default(false)
  stripeCustomerId     String?      @unique
  stripeSubscriptionId String?      @unique

  // Relations
  items                Item[]
  collections          Collection[]
  customTypes          ItemType[]   // Custom types created by user
  accounts             Account[]
  sessions             Session[]

  createdAt            DateTime     @default(now())
  updatedAt            DateTime     @updatedAt

  @@map("users")
}

// NextAuth required models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ============================================
// ITEM TYPE
// ============================================

model ItemType {
  id       String  @id @default(cuid())
  name     String  // "snippet", "prompt", "note", etc.
  icon     String  // Lucide icon name
  color    String  // Hex color code
  isSystem Boolean @default(false)

  // Null for system types, set for custom user types
  userId   String?
  user     User?   @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Relations
  items              Item[]
  defaultCollections Collection[] @relation("DefaultType")

  @@unique([name, userId]) // Unique name per user (or system)
  @@map("item_types")
}

// ============================================
// ITEM
// ============================================

enum ContentType {
  TEXT
  FILE
  URL
}

model Item {
  id          String      @id @default(cuid())
  title       String
  contentType ContentType

  // Text content (for TEXT type)
  content     String?     @db.Text
  language    String?     // Programming language for syntax highlighting

  // File content (for FILE type)
  fileUrl     String?     // Cloudflare R2 URL
  fileName    String?     // Original filename
  fileSize    Int?        // Size in bytes

  // URL content (for URL type - links)
  url         String?

  // Metadata
  description String?     @db.Text
  isFavorite  Boolean     @default(false)
  isPinned    Boolean     @default(false)

  // Relations
  userId      String
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  typeId      String
  type        ItemType    @relation(fields: [typeId], references: [id])

  collections ItemCollection[]
  tags        ItemTag[]

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([userId])
  @@index([typeId])
  @@index([isFavorite])
  @@index([isPinned])
  @@map("items")
}

// ============================================
// COLLECTION
// ============================================

model Collection {
  id            String   @id @default(cuid())
  name          String   // "React Hooks", "Prototype Prompts", etc.
  description   String?  @db.Text
  isFavorite    Boolean  @default(false)

  // Default type for new items in empty collections
  defaultTypeId String?
  defaultType   ItemType? @relation("DefaultType", fields: [defaultTypeId], references: [id])

  // Relations
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  items         ItemCollection[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([userId])
  @@index([isFavorite])
  @@map("collections")
}

// ============================================
// JOIN TABLES
// ============================================

model ItemCollection {
  itemId       String
  item         Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)

  collectionId String
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  addedAt      DateTime   @default(now())

  @@id([itemId, collectionId])
  @@index([collectionId])
  @@map("item_collections")
}

model Tag {
  id    String    @id @default(cuid())
  name  String    @unique
  items ItemTag[]

  @@map("tags")
}

model ItemTag {
  itemId String
  item   Item   @relation(fields: [itemId], references: [id], onDelete: Cascade)

  tagId  String
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([itemId, tagId])
  @@index([tagId])
  @@map("item_tags")
}
```

### Database Migration Strategy

> ⚠️ **IMPORTANT:** Never use `db push` or directly update database structure. Always create migrations that will be run in dev first, then in production.

```bash
# Create a new migration
npx prisma migrate dev --name <migration_name>

# Apply migrations in production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

---

## Tech Stack

### Application Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                              CLIENT                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │    React    │  │  Tailwind   │  │   ShadCN    │  │   Next.js   │  │
│  │      19     │  │    CSS v4   │  │     UI      │  │     SSR     │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS 16                                  │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                        API Routes                                │ │
│  │  /api/items    /api/collections    /api/ai    /api/upload       │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                       NextAuth v5                                │ │
│  │              Email/Password  •  GitHub OAuth                     │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            ▼                       ▼                       ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Neon Postgres │      │  Cloudflare R2  │      │     OpenAI      │
│   + Prisma 7    │      │  File Storage   │      │   gpt-5-nano    │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### Stack Details

| Layer            | Technology                  | Purpose                                   |
| ---------------- | --------------------------- | ----------------------------------------- |
| **Framework**    | Next.js 16 / React 19       | SSR pages, API routes, single codebase    |
| **Language**     | TypeScript                  | Type safety across the stack              |
| **Database**     | Neon PostgreSQL             | Cloud-hosted PostgreSQL                   |
| **ORM**          | Prisma 7                    | Database connection and type-safe queries |
| **Cache**        | Redis (planned)             | Performance caching layer                 |
| **File Storage** | Cloudflare R2               | File and image uploads                    |
| **Auth**         | NextAuth v5                 | Email/password + GitHub OAuth             |
| **AI**           | OpenAI gpt-5-nano           | AI features (tagging, summaries, etc.)    |
| **Styling**      | Tailwind CSS v4 + ShadCN UI | Utility-first CSS with component library  |

### External Documentation

| Resource      | Link                                 |
| ------------- | ------------------------------------ |
| Next.js Docs  | https://nextjs.org/docs              |
| Prisma Docs   | https://www.prisma.io/docs           |
| NextAuth.js   | https://authjs.dev                   |
| Tailwind CSS  | https://tailwindcss.com/docs         |
| ShadCN UI     | https://ui.shadcn.com                |
| Cloudflare R2 | https://developers.cloudflare.com/r2 |
| Neon          | https://neon.tech/docs               |
| OpenAI API    | https://platform.openai.com/docs     |

---

## Monetization

### Pricing Tiers

```
┌─────────────────────────────────────┬─────────────────────────────────────┐
│              FREE                   │          PRO ($8/mo or $72/yr)      │
├─────────────────────────────────────┼─────────────────────────────────────┤
│ 50 items total                      │ Unlimited items                     │
│ 3 collections                       │ Unlimited collections               │
│ System types (no files/images)      │ All types including files/images   │
│ Basic search                        │ Advanced search                     │
│ No file uploads                     │ File & image uploads                │
│ No AI features                      │ AI auto-tagging                     │
│                                     │ AI code explanation                 │
│                                     │ AI prompt optimizer                 │
│                                     │ Export data (JSON/ZIP)              │
│                                     │ Priority support                    │
│                                     │ Custom types (future)               │
└─────────────────────────────────────┴─────────────────────────────────────┘
```

### Implementation Note

> During development, all users will have access to all features. Pro restrictions will be enforced at launch via the `isPro` flag on the User model.

---

## UI/UX Guidelines

### Design Principles

- **Modern & Minimal:** Developer-focused, clean aesthetic
- **Dark Mode Default:** Light mode as secondary option
- **Clean Typography:** Generous whitespace, clear hierarchy
- **Subtle Depth:** Soft borders and shadows

### Design References

- [Notion](https://notion.so) — Clean, flexible workspace
- [Linear](https://linear.app) — Developer-focused, fast UI
- [Raycast](https://raycast.com) — Quick access, keyboard-first

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  DevStash                                          [Search]  [User]     │
├─────────────┬───────────────────────────────────────────────────────────┤
│             │                                                           │
│  SIDEBAR    │  MAIN CONTENT                                             │
│             │                                                           │
│  ┌────────┐ │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│  │Types   │ │  │Collection│ │Collection│ │Collection│ │Collection│      │
│  ├────────┤ │  │  Card   │ │  Card   │ │  Card   │ │  Card   │         │
│  │Snippets│ │  └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
│  │Prompts │ │                                                           │
│  │Commands│ │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│  │Notes   │ │  │  Item   │ │  Item   │ │  Item   │ │  Item   │         │
│  │Links   │ │  │  Card   │ │  Card   │ │  Card   │ │  Card   │         │
│  │Files   │ │  └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
│  │Images  │ │                                                           │
│  ├────────┤ │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│  │Recent  │ │  │  Item   │ │  Item   │ │  Item   │ │  Item   │         │
│  │Collect.│ │  │  Card   │ │  Card   │ │  Card   │ │  Card   │         │
│  └────────┘ │  └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
│             │                                                           │
└─────────────┴───────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  ITEM DRAWER (slides in from right)                              [X]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Title: [Editable Title]                              [★] [📌] [...]   │
│                                                                         │
│  Type: Snippet          Language: TypeScript                            │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  // Content area with syntax highlighting                         │ │
│  │  const example = "Hello World";                                   │ │
│  │                                                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  Tags: [react] [hooks] [+]                                             │
│                                                                         │
│  Collections: React Patterns, Interview Prep                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Responsive Behavior

| Viewport            | Sidebar                 | Notes                               |
| ------------------- | ----------------------- | ----------------------------------- |
| Desktop (≥1024px)   | Persistent, collapsible | Full layout                         |
| Tablet (768-1023px) | Collapsible overlay     | Touch-friendly spacing              |
| Mobile (<768px)     | Drawer (hamburger menu) | Single column, larger touch targets |

### Micro-Interactions

- **Transitions:** Smooth 150-200ms easing
- **Hover States:** Subtle elevation/glow on cards
- **Notifications:** Toast messages for actions
- **Loading:** Skeleton placeholders during data fetch

---

## Type System Reference

### Visual Design Tokens

| Type    | Color   | Hex       | Icon (Lucide) |
| ------- | ------- | --------- | ------------- |
| Snippet | Blue    | `#3b82f6` | `Code`        |
| Prompt  | Purple  | `#8b5cf6` | `Sparkles`    |
| Command | Orange  | `#f97316` | `Terminal`    |
| Note    | Yellow  | `#fde047` | `StickyNote`  |
| File    | Gray    | `#6b7280` | `File`        |
| Image   | Pink    | `#ec4899` | `Image`       |
| Link    | Emerald | `#10b981` | `Link`        |

### Icon Import Reference

```tsx
import {
  Code, // Snippet
  Sparkles, // Prompt
  Terminal, // Command
  StickyNote, // Note
  File, // File
  Image, // Image
  Link, // Link
} from 'lucide-react';
```

### CSS Variables

```css
:root {
  /* Type Colors */
  --color-snippet: #3b82f6;
  --color-prompt: #8b5cf6;
  --color-command: #f97316;
  --color-note: #fde047;
  --color-file: #6b7280;
  --color-image: #ec4899;
  --color-link: #10b981;
}
```

### Collection Card Styling

Collection cards display a **background color** based on the most common item type within them. Item cards display a **border color** matching their type.

---

## Database Seeding

### System Item Types

```ts
// prisma/seed.ts

const systemTypes = [
  { name: 'snippet', icon: 'Code', color: '#3b82f6', isSystem: true },
  { name: 'prompt', icon: 'Sparkles', color: '#8b5cf6', isSystem: true },
  { name: 'command', icon: 'Terminal', color: '#f97316', isSystem: true },
  { name: 'note', icon: 'StickyNote', color: '#fde047', isSystem: true },
  { name: 'file', icon: 'File', color: '#6b7280', isSystem: true },
  { name: 'image', icon: 'Image', color: '#ec4899', isSystem: true },
  { name: 'link', icon: 'Link', color: '#10b981', isSystem: true },
];

async function main() {
  for (const type of systemTypes) {
    await prisma.itemType.upsert({
      where: { name_userId: { name: type.name, userId: null } },
      update: {},
      create: type,
    });
  }
}
```

---

## Next Steps

1. [ ] Initialize Next.js 16 project with TypeScript
2. [ ] Configure Prisma with Neon PostgreSQL
3. [ ] Create initial migration with schema
4. [ ] Seed system item types
5. [ ] Set up NextAuth with GitHub OAuth
6. [ ] Build core UI layout (sidebar, main content)
7. [ ] Implement item CRUD operations
8. [ ] Implement collection CRUD operations
9. [ ] Add search functionality
10. [ ] Integrate Cloudflare R2 for file uploads
11. [ ] Build AI features with OpenAI API
12. [ ] Add Stripe integration for Pro tier
13. [ ] Polish UI with micro-interactions
14. [ ] Testing and deployment

---

_Last updated: April 2026_
