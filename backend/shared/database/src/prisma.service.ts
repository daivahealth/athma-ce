import { Injectable, type OnModuleInit, type OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { RequestContext } from '@zeal/shared-utils';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async runWithRequestContext<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    const store = RequestContext.getStore();

    const tenantId = store?.tenantId;
    const userId = store?.userId;
    const userAgent = store?.userAgent ?? '';

    if (!tenantId || !userId) {
      throw new Error('Unable to resolve tenant/user context for database transaction');
    }

    return this.$transaction(async (tx) => {
      await tx.$queryRaw`
        SELECT
          set_config('app.current_tenant_id', ${tenantId}, true),
          set_config('app.current_user_id',   ${userId}, true),
          set_config('app.user_agent',        ${userAgent}, true)
      `;

      return fn(tx);
    });
  }
}
