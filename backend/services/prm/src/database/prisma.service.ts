/**
 * Prisma Service
 * Wraps Prisma Client as NestJS injectable service
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@zeal/database-prm';
import { logger } from '@zeal/observability';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  constructor() {
    super({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
    });

    // Structured query logging via observability logger
    if (process.env.NODE_ENV === 'development') {
      // @ts-expect-error Prisma event typings for `$on('query')` are not exposed
      this.$on('query', (e: any) => {
        logger.debug({
          type: 'query',
          query: e.query,
          params: e.params,
          duration: e.duration,
        }, `SQL Query (${e.duration}ms)`);
      });
    }

    // @ts-expect-error Prisma event typings for `$on('error')` are not exposed
    this.$on('error', (e: any) => {
      logger.error({ type: 'database', error: e }, 'Database Error');
    });

    // @ts-expect-error Prisma event typings for `$on('warn')` are not exposed
    this.$on('warn', (e: any) => {
      logger.warn({ type: 'database', warning: e }, 'Database Warning');
    });
  }

  async onModuleInit() {
    await this.$connect();
    logger.info('PRM database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    logger.info('PRM database disconnected');
  }

  /**
   * Returns a tenant-scoped Prisma client extension that auto-injects
   * tenantId into queries against TENANT_ISOLATED_MODELS. Prisma removed
   * the `$use` middleware API this used to rely on (v6) in favor of
   * `$extends`; this is the migrated equivalent. Services currently
   * enforce tenant scoping explicitly via `@TenantId()` + manual `where`
   * clauses (see e.g. tasks.service.ts) — call `forTenant()` for an
   * additional, ORM-level safety net where a shared/service-level client
   * is preferred over per-call filtering.
   */
  forTenant(tenantId: string) {
    const TENANT_ISOLATED_MODELS = [
      'PatientEngagementEvent',
      'EngagementRule',
      'CommunicationTemplate',
      'PatientPreference',
      'PatientMessage',
      'PatientTask',
      'EngagementRuleRun',
      'PrmJob',
      'ProviderCallback',
    ];

    return this.$extends({
      name: `tenant-scope`,
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            if (!model || !TENANT_ISOLATED_MODELS.includes(model)) {
              return query(args);
            }

            const a = args as any;

            switch (operation) {
              case 'findUnique':
              case 'findUniqueOrThrow':
              case 'findFirst':
              case 'findFirstOrThrow':
              case 'findMany':
              case 'update':
              case 'updateMany':
              case 'delete':
              case 'deleteMany':
              case 'count':
              case 'aggregate':
                a.where = { ...a.where, tenantId };
                break;
              case 'create':
                a.data = { ...a.data, tenantId };
                break;
              case 'createMany':
                if (Array.isArray(a.data)) {
                  a.data = a.data.map((item: any) => ({ ...item, tenantId }));
                }
                break;
              case 'upsert':
                a.where = { ...a.where, tenantId };
                a.create = { ...a.create, tenantId };
                break;
            }

            return query(a);
          },
        },
      },
    });
  }
}
