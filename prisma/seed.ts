import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ============================================
// SYSTEM ITEM TYPES
// ============================================

const systemTypes = [
  { name: 'snippet', icon: 'Code',       color: '#3b82f6' },
  { name: 'prompt',  icon: 'Sparkles',   color: '#8b5cf6' },
  { name: 'command', icon: 'Terminal',   color: '#f97316' },
  { name: 'note',    icon: 'StickyNote', color: '#fde047' },
  { name: 'file',    icon: 'File',       color: '#6b7280' },
  { name: 'image',   icon: 'Image',      color: '#ec4899' },
  { name: 'link',    icon: 'Link',       color: '#10b981' },
];

// ============================================
// COLLECTIONS + ITEMS
// ============================================

const collections = [
  {
    name: 'React Patterns',
    description: 'Reusable React patterns and hooks',
    typeName: 'snippet',
    items: [
      {
        title: 'useDebounce & useLocalStorage',
        typeName: 'snippet',
        language: 'typescript',
        contentType: 'TEXT' as const,
        description: 'Utility hooks for debouncing values and syncing state with localStorage',
        isFavorite: true,
        isPinned: true,
        tags: ['react', 'hooks', 'typescript'],
        content: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initial;
    } catch {
      return initial;
    }
  });

  const set = (next: T) => {
    setValue(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  return [value, set] as const;
}`,
      },
      {
        title: 'Context Provider Pattern',
        typeName: 'snippet',
        language: 'typescript',
        contentType: 'TEXT' as const,
        description: 'Compound component pattern with a typed context provider',
        isFavorite: false,
        isPinned: false,
        tags: ['react', 'context', 'compound-components'],
        content: `import { createContext, useContext, useState, type ReactNode } from 'react';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}`,
      },
      {
        title: 'React Utility Functions',
        typeName: 'snippet',
        language: 'typescript',
        contentType: 'TEXT' as const,
        description: 'Common utility functions for React apps: cn, formatDate, truncate',
        isFavorite: false,
        isPinned: false,
        tags: ['react', 'utils', 'typescript'],
        content: `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date string or Date object */
export function formatDate(date: string | Date, locale = 'en-US') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

/** Truncate a string to a max length */
export function truncate(str: string, max = 80) {
  return str.length > max ? str.slice(0, max).trimEnd() + '…' : str;
}`,
      },
    ],
  },
  {
    name: 'AI Workflows',
    description: 'AI prompts and workflow automations',
    typeName: 'prompt',
    items: [
      {
        title: 'Code Review Prompt',
        typeName: 'prompt',
        language: null,
        contentType: 'TEXT' as const,
        description: 'Thorough code review covering correctness, security, and style',
        isFavorite: true,
        isPinned: true,
        tags: ['ai', 'code-review', 'prompt'],
        content: `Review the following code and provide feedback on:

1. **Correctness** — logic errors, edge cases, off-by-one errors
2. **Security** — injection risks, unvalidated input, exposed secrets
3. **Performance** — unnecessary re-renders, N+1 queries, memory leaks
4. **Readability** — naming, structure, comments where needed
5. **Patterns** — does it follow the conventions of the codebase?

Be concise. Group feedback by severity: 🔴 Critical, 🟡 Suggestion, 🟢 Positive.

\`\`\`
{{code}}
\`\`\``,
      },
      {
        title: 'Documentation Generator',
        typeName: 'prompt',
        language: null,
        contentType: 'TEXT' as const,
        description: 'Generate clear JSDoc or markdown docs for a function or module',
        isFavorite: false,
        isPinned: false,
        tags: ['ai', 'docs', 'prompt'],
        content: `Generate documentation for the following code.

Include:
- A one-line summary
- Parameter descriptions with types
- Return value description
- One usage example
- Any important caveats or edge cases

Format as JSDoc if it's a function, or markdown if it's a module.

\`\`\`
{{code}}
\`\`\``,
      },
      {
        title: 'Refactoring Assistant',
        typeName: 'prompt',
        language: null,
        contentType: 'TEXT' as const,
        description: 'Suggest targeted refactors to improve clarity and reduce complexity',
        isFavorite: false,
        isPinned: false,
        tags: ['ai', 'refactor', 'prompt'],
        content: `Refactor the following code to improve clarity and reduce complexity.

Rules:
- Do NOT change external behavior or public API
- Do NOT add features not already present
- Prefer small, focused functions
- Remove duplication without over-abstracting
- Keep changes minimal — only refactor what needs it

Show the refactored version and briefly explain each change.

\`\`\`
{{code}}
\`\`\``,
      },
    ],
  },
  {
    name: 'DevOps',
    description: 'Infrastructure and deployment resources',
    typeName: 'snippet',
    items: [
      {
        title: 'Next.js Dockerfile (Multi-stage)',
        typeName: 'snippet',
        language: 'dockerfile',
        contentType: 'TEXT' as const,
        description: 'Production-ready multi-stage Dockerfile for Next.js with standalone output',
        isFavorite: false,
        isPinned: false,
        tags: ['docker', 'nextjs', 'devops'],
        content: `FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        title: 'Docker Compose — Dev Stack',
        typeName: 'command',
        language: 'bash',
        contentType: 'TEXT' as const,
        description: 'Rebuild and restart all services, then tail logs',
        isFavorite: false,
        isPinned: false,
        tags: ['docker', 'compose', 'devops'],
        content: `docker compose up -d --build && docker compose logs -f`,
      },
      {
        title: 'Docker Documentation',
        typeName: 'link',
        language: null,
        contentType: 'URL' as const,
        description: 'Official Docker documentation — references, guides, and CLI',
        isFavorite: false,
        isPinned: false,
        tags: ['docker', 'docs'],
        url: 'https://docs.docker.com',
      },
      {
        title: 'GitHub Actions Docs',
        typeName: 'link',
        language: null,
        contentType: 'URL' as const,
        description: 'GitHub Actions documentation for CI/CD workflow automation',
        isFavorite: false,
        isPinned: false,
        tags: ['github', 'ci-cd', 'devops'],
        url: 'https://docs.github.com/en/actions',
      },
    ],
  },
  {
    name: 'Terminal Commands',
    description: 'Useful shell commands for everyday development',
    typeName: 'command',
    items: [
      {
        title: 'Git Pretty Log',
        typeName: 'command',
        language: 'bash',
        contentType: 'TEXT' as const,
        description: 'Compact, decorated git log with branch graph',
        isFavorite: true,
        isPinned: false,
        tags: ['git', 'log'],
        content: `git log --oneline --graph --decorate --all`,
      },
      {
        title: 'Docker Full Prune',
        typeName: 'command',
        language: 'bash',
        contentType: 'TEXT' as const,
        description: 'Remove all stopped containers, unused images, networks, and volumes',
        isFavorite: false,
        isPinned: false,
        tags: ['docker', 'cleanup'],
        content: `docker system prune -af --volumes`,
      },
      {
        title: 'Kill Process on Port',
        typeName: 'command',
        language: 'bash',
        contentType: 'TEXT' as const,
        description: 'Find and kill whatever is running on a given port (default 3000)',
        isFavorite: false,
        isPinned: false,
        tags: ['process', 'port', 'kill'],
        content: `lsof -ti:3000 | xargs kill -9`,
      },
      {
        title: 'Check for Outdated Packages',
        typeName: 'command',
        language: 'bash',
        contentType: 'TEXT' as const,
        description: 'Interactively update package.json to latest versions with ncu',
        isFavorite: false,
        isPinned: false,
        tags: ['npm', 'packages', 'upgrade'],
        content: `npx npm-check-updates -u && npm install`,
      },
    ],
  },
  {
    name: 'Design Resources',
    description: 'UI/UX resources and references',
    typeName: 'link',
    items: [
      {
        title: 'Tailwind CSS Docs',
        typeName: 'link',
        language: null,
        contentType: 'URL' as const,
        description: 'Official Tailwind CSS documentation and utility reference',
        isFavorite: true,
        isPinned: false,
        tags: ['tailwind', 'css', 'docs'],
        url: 'https://tailwindcss.com/docs',
      },
      {
        title: 'shadcn/ui',
        typeName: 'link',
        language: null,
        contentType: 'URL' as const,
        description: 'Accessible, customizable component library built on Radix UI and Tailwind',
        isFavorite: true,
        isPinned: false,
        tags: ['components', 'ui', 'shadcn'],
        url: 'https://ui.shadcn.com',
      },
      {
        title: 'Material Design 3',
        typeName: 'link',
        language: null,
        contentType: 'URL' as const,
        description: "Google's open-source design system with tokens, components, and guidelines",
        isFavorite: false,
        isPinned: false,
        tags: ['design-system', 'google', 'material'],
        url: 'https://m3.material.io',
      },
      {
        title: 'Lucide Icons',
        typeName: 'link',
        language: null,
        contentType: 'URL' as const,
        description: 'Beautiful, consistent open-source icon library used throughout DevStash',
        isFavorite: false,
        isPinned: false,
        tags: ['icons', 'lucide', 'svg'],
        url: 'https://lucide.dev',
      },
    ],
  },
];

// ============================================
// HELPERS
// ============================================

async function upsertTag(name: string) {
  return prisma.tag.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('Seeding database...\n');

  // 1. System item types
  console.log('System item types:');
  const typeMap: Record<string, string> = {};
  for (const t of systemTypes) {
    const existing = await prisma.itemType.findFirst({
      where: { name: t.name, isSystem: true },
    });
    const record = existing ?? (await prisma.itemType.create({
      data: { ...t, isSystem: true, userId: null },
    }));
    typeMap[t.name] = record.id;
    console.log(`  ${existing ? 'exists' : 'created'}: ${t.name}`);
  }

  // 2. Demo user
  console.log('\nDemo user:');
  const passwordHash = await bcrypt.hash('12345678', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@devstash.io' },
    update: {},
    create: {
      email: 'demo@devstash.io',
      name: 'Demo User',
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  });
  console.log(`  ${user.email} (id: ${user.id})`);

  // 3. Collections + items
  console.log('\nCollections and items:');
  for (const col of collections) {
    const defaultTypeId = typeMap[col.typeName];

    let collection = await prisma.collection.findFirst({
      where: { name: col.name, userId: user.id },
    });

    if (!collection) {
      collection = await prisma.collection.create({
        data: {
          name: col.name,
          description: col.description,
          userId: user.id,
          defaultTypeId,
        },
      });
    }

    console.log(`  [${collection.name}]`);

    for (const itemData of col.items) {
      const existing = await prisma.item.findFirst({
        where: { title: itemData.title, userId: user.id },
      });

      if (existing) {
        console.log(`    exists: ${itemData.title}`);
        continue;
      }

      const { typeName, tags, ...fields } = itemData;
      const typeId = typeMap[typeName];

      const item = await prisma.item.create({
        data: {
          title: fields.title,
          contentType: fields.contentType,
          content: 'content' in fields ? (fields.content as string | null) ?? null : null,
          language: fields.language ?? null,
          url: 'url' in fields ? (fields.url as string) ?? null : null,
          description: fields.description ?? null,
          isFavorite: fields.isFavorite,
          isPinned: fields.isPinned,
          userId: user.id,
          typeId,
          collections: {
            create: { collectionId: collection.id },
          },
        },
      });

      // Tags
      for (const tagName of tags) {
        const tag = await upsertTag(tagName);
        await prisma.itemTag.upsert({
          where: { itemId_tagId: { itemId: item.id, tagId: tag.id } },
          update: {},
          create: { itemId: item.id, tagId: tag.id },
        });
      }

      console.log(`    created: ${itemData.title}`);
    }
  }

  console.log('\nDone.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
