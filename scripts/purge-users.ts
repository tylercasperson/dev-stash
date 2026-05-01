import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const PRESERVED_EMAILS = ['demo@devstash.io', 'admin@devstash.io'];
const DEMO_EMAIL = 'demo@devstash.io';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // --- Delete all non-preserved users ---
  const targets = await prisma.user.findMany({
    where: { email: { notIn: PRESERVED_EMAILS } },
    select: { id: true, email: true },
  });

  if (targets.length === 0) {
    console.log('No non-demo users to delete.');
  } else {
    console.log(`Deleting ${targets.length} user(s):`);
    for (const u of targets) console.log(`  · ${u.email}`);

    const ids = targets.map((u) => u.id);

    // Delete in dependency order — join tables first, then owned records, then users
    await prisma.itemTag.deleteMany({ where: { item: { userId: { in: ids } } } });
    await prisma.itemCollection.deleteMany({ where: { item: { userId: { in: ids } } } });
    await prisma.item.deleteMany({ where: { userId: { in: ids } } });
    await prisma.collection.deleteMany({ where: { userId: { in: ids } } });
    await prisma.verificationToken.deleteMany({ where: { identifier: { in: targets.map((u) => u.email) } } });
    await prisma.account.deleteMany({ where: { userId: { in: ids } } });
    await prisma.session.deleteMany({ where: { userId: { in: ids } } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
  }

  // --- Reset demo user's content so seed runs clean ---
  const demo = await prisma.user.findUnique({ where: { email: DEMO_EMAIL }, select: { id: true } });
  if (demo) {
    console.log('\nResetting demo user content...');
    await prisma.itemTag.deleteMany({ where: { item: { userId: demo.id } } });
    await prisma.itemCollection.deleteMany({ where: { item: { userId: demo.id } } });
    await prisma.item.deleteMany({ where: { userId: demo.id } });
    await prisma.collection.deleteMany({ where: { userId: demo.id } });
    console.log('  demo content cleared');
  }

  // Remove orphaned tags
  await prisma.tag.deleteMany({ where: { items: { none: {} } } });

  console.log('Done.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
