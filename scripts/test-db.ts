import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Testing database connection...\n');

  // Item types
  const itemTypes = await prisma.itemType.findMany({ orderBy: { name: 'asc' } });
  console.log(`Item types (${itemTypes.length}):`);
  for (const t of itemTypes) {
    console.log(`  ${t.icon.padEnd(12)} ${t.name.padEnd(10)} ${t.color}`);
  }

  // Counts
  const [userCount, collectionCount, itemCount, tagCount] = await Promise.all([
    prisma.user.count(),
    prisma.collection.count(),
    prisma.item.count(),
    prisma.tag.count(),
  ]);

  console.log('\nTable counts:');
  console.log(`  users:       ${userCount}`);
  console.log(`  collections: ${collectionCount}`);
  console.log(`  items:       ${itemCount}`);
  console.log(`  tags:        ${tagCount}`);

  console.log('\nConnection OK.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
