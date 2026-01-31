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
   * Apply tenant middleware to scope all queries by tenantId
   * Called by TenantModule per request
   */
  applyTenantMiddleware(tenantId: string) {
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

    this.$use(async (params, next) => {
      // Skip if not a tenant-isolated model
      if (!params.model || !TENANT_ISOLATED_MODELS.includes(params.model)) {
        return next(params);
      }

      // Inject tenantId into where clause for all operations
      if (params.action === 'findUnique' || params.action === 'findFirst') {
        params.args.where = { ...params.args.where, tenantId };
      }

      if (params.action === 'findMany') {
        if (!params.args) {
          params.args = {};
        }
        params.args.where = { ...params.args.where, tenantId };
      }

      if (params.action === 'create' || params.action === 'createMany') {
        if (params.action === 'create') {
          params.args.data = { ...params.args.data, tenantId };
        } else {
          // createMany
          if (Array.isArray(params.args.data)) {
            params.args.data = params.args.data.map((item: any) => ({ ...item, tenantId }));
          }
        }
      }

      if (params.action === 'update' || params.action === 'updateMany') {
        params.args.where = { ...params.args.where, tenantId };
      }

      if (params.action === 'delete' || params.action === 'deleteMany') {
        params.args.where = { ...params.args.where, tenantId };
      }

      if (params.action === 'upsert') {
        params.args.where = { ...params.args.where, tenantId };
        params.args.create = { ...params.args.create, tenantId };
      }

      if (params.action === 'count' || params.action === 'aggregate') {
        params.args.where = { ...params.args.where, tenantId };
      }

      return next(params);
    });
  }
}
