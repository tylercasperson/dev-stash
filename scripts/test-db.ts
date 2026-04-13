import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function hr(label?: string) {
  const line = '─'.repeat(60);
  console.log(label ? `\n${label}\n${line}` : line);
}

async function main() {
  hr('DATABASE CONNECTION TEST');

  // ── Item Types ───────────────────────────────────────────────
  hr('Item Types');
  const itemTypes = await prisma.itemType.findMany({ orderBy: { name: 'asc' } });
  for (const t of itemTypes) {
    console.log(`  ${t.name.padEnd(10)} ${t.icon.padEnd(12)} ${t.color}`);
  }

  // ── Demo User ────────────────────────────────────────────────
  hr('Demo User');
  const user = await prisma.user.findUnique({
    where: { email: 'demo@devstash.io' },
  });
  if (!user) {
    console.log('  ❌ Demo user not found');
    return;
  }
  console.log(`  name:          ${user.name}`);
  console.log(`  email:         ${user.email}`);
  console.log(`  isPro:         ${user.isPro}`);
  console.log(`  emailVerified: ${user.emailVerified?.toISOString() ?? 'null'}`);
  console.log(`  password hash: ${user.password ? '✓ set' : '✗ missing'}`);

  // ── Collections ──────────────────────────────────────────────
  hr('Collections');
  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    include: { items: { include: { item: { include: { type: true } } } } },
    orderBy: { name: 'asc' },
  });

  for (const col of collections) {
    console.log(`\n  📁 ${col.name}  (${col.items.length} items)`);
    if (col.description) console.log(`     ${col.description}`);
    for (const { item } of col.items) {
      const pin  = item.isPinned    ? ' 📌' : '';
      const star = item.isFavorite  ? ' ⭐' : '';
      console.log(`     · [${item.type.name.padEnd(8)}] ${item.title}${pin}${star}`);
    }
  }

  // ── Items summary ────────────────────────────────────────────
  hr('Items by Type');
  const byType = await prisma.itemType.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: { name: 'asc' },
  });
  for (const t of byType) {
    if (t._count.items > 0) {
      console.log(`  ${t.name.padEnd(10)} ${t._count.items} items`);
    }
  }

  // ── Tags ─────────────────────────────────────────────────────
  hr('Tags');
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: { name: 'asc' },
  });
  const tagLine = tags.map(t => `${t.name}(${t._count.items})`).join('  ');
  console.log(`  ${tagLine}`);

  // ── Totals ───────────────────────────────────────────────────
  hr('Totals');
  const [users, colCount, items, tagCount] = await Promise.all([
    prisma.user.count(),
    prisma.collection.count(),
    prisma.item.count(),
    prisma.tag.count(),
  ]);
  console.log(`  users:       ${users}`);
  console.log(`  collections: ${colCount}`);
  console.log(`  items:       ${items}`);
  console.log(`  tags:        ${tagCount}`);

  hr();
  console.log('✓ All checks passed\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
