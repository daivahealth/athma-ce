/**
 * Prisma Service
 * Wraps Prisma Client as NestJS injectable service
 */

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
    });

    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      (this.$on as any)('query', (e: any) => {
        this.logger.debug(`Query: ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`);
      });
    }

    // Log errors
    (this.$on as any)('error', (e: any) => {
      this.logger.error('Database error', e);
    });

    // Log warnings
    (this.$on as any)('warn', (e: any) => {
      this.logger.warn('Database warning', e);
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
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
