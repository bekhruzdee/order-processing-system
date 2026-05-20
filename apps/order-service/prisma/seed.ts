import { PrismaClient } from '../src/generated/prisma';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';

function loadServiceEnv() {
  const envPaths = [
    resolve(process.cwd(), 'apps/order-service/.env'),
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
const STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'CANCELLED'];

async function main() {
  const USER_COUNT = parseInt(process.env.USER_COUNT || '1000000', 10);
  let inserted = 0;

  while (inserted < TOTAL) {
    const chunk = Math.min(BATCH, TOTAL - inserted);
    const data: { userId: number; total: string; status: string }[] = [];

    for (let i = 0; i < chunk; i++) {
      const userId = Math.floor(Math.random() * USER_COUNT) + 1;
      const total = (Math.random() * 999 + 1).toFixed(2);
      const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
      data.push({ userId, total, status });
    }

    await prisma.order.createMany({ data });
    inserted += chunk;
    console.log(`Inserted ${inserted}/${TOTAL} orders`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
