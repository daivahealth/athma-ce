import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated';

/**
 * Connector-local Prisma client for the zeal_abdm database. The connector's
 * DB holds protocol/routing state only — no PHI, no tenant-scoped Prisma
 * middleware (rows here are tenancy metadata themselves and every query
 * names its scope explicitly).
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
