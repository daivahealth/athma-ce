import { PrismaClient, Prisma } from '../generated';
import { logger } from '@zeal/observability';

/**
 * Extended Prisma Client with custom configuration and middleware
 */
export class ZealPrismaClient extends PrismaClient {
  constructor(options?: Prisma.PrismaClientOptions) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
      errorFormat: 'pretty',
      ...options,
    });

    this.setupMiddleware();
    this.setupLogging();
  }

  private setupMiddleware() {
    // Add middleware for tenant context
    this.$use(async (params, next) => {
      // Add tenant_id to create/update operations if not present
      if ((params.action === 'create' || params.action === 'update') && params.args.data) {
        const tenantId = this.getTenantId();
        if (tenantId && !params.args.data.tenantId) {
          params.args.data.tenantId = tenantId;
        }
      }
      return next(params);
    });

    // Add middleware for soft delete
    this.$use(async (params, next) => {
      if (params.action === 'delete') {
        params.action = 'update';
        params.args.data = { status: 'deleted' };
      }
      if (params.action === 'deleteMany') {
        params.action = 'updateMany';
        params.args.data = { status: 'deleted' };
      }
      return next(params);
    });
  }

  private setupLogging() {
    // @ts-expect-error Prisma event typings for `$on('query')` are not exposed in generated client
    this.$on('query', (e: Prisma.QueryEvent) => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug({
          type: 'query',
          query: e.query,
          params: e.params,
          duration: e.duration,
        }, `SQL Query (${e.duration}ms)`);
      }
    });

    // @ts-expect-error Prisma event typings for `$on('error')` are not exposed in generated client
    this.$on('error', (e: Prisma.LogEvent) => {
      logger.error({ type: 'database', error: e }, 'Database Error');
    });
  }

  private getTenantId(): string | null {
    // This would be set by the application context
    return (global as any).currentTenantId || null;
  }

  /**
   * Set the current tenant context for the client
   */
  public setTenantContext(tenantId: string): void {
    (global as any).currentTenantId = tenantId;
  }

  /**
   * Clear the current tenant context
   */
  public clearTenantContext(): void {
    (global as any).currentTenantId = null;
  }

  /**
   * Get the current tenant context
   */
  public getCurrentTenantId(): string | null {
    return this.getTenantId();
  }
}

// Create and export the singleton instance
export const prisma = new ZealPrismaClient();

// Export the Prisma types
export type { Prisma } from '../generated';
