import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { PrismaClient } from '../generated/prisma';

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

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super(createPrismaClientOptions());
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
