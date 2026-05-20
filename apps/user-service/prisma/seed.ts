import { PrismaClient } from '../src/generated/prisma';
import { faker } from '@faker-js/faker';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';

function loadServiceEnv() {
  const envPaths = [
    resolve(process.cwd(), 'apps/user-service/.env'),
    resolve(process.cwd(), '.env'),
  ];

  for (const envPath of envPaths) {
    if (existsSync(envPath)) {
      loadEnv({ path: envPath });
      return;
    }
  }

  loadEnv();
}

loadServiceEnv();

function createPrismaClientOptions() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  return {
    adapter: new PrismaPg({ connectionString }),
  };
}

const prisma = new PrismaClient(createPrismaClientOptions());
const TOTAL = parseInt(process.env.COUNT || '1000000', 10);
const BATCH = parseInt(process.env.BATCH || '10000', 10);

async function main() {
  // Mavjud foydalanuvchilarni hisobga olib, takrorlanishning oldini oladi
  const existing = await prisma.user.count();
  let inserted = 0;
  const startOffset = existing;

  while (inserted < TOTAL) {
    const chunk = Math.min(BATCH, TOTAL - inserted);
    const data: { name: string; email: string }[] = [];

    for (let i = 0; i < chunk; i++) {
      const id = startOffset + inserted + i + 1;
      data.push({
        name: faker.person.fullName(),
        email: `user${id}@example.com`,
      });
    }

    await prisma.user.createMany({ data });
    inserted += chunk;
    console.log(`Inserted ${inserted}/${TOTAL} users`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
