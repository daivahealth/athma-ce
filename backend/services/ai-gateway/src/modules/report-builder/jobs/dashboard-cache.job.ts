/**
 * Dashboard Cache Job
 * Scheduled job to warm dashboard metrics cache for all active tenants
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService as FoundationPrismaService } from '@zeal/database-foundation';
import { DashboardCacheService } from '../services/dashboard-cache.service';
import { DASHBOARD_CACHE_CONFIG } from '../types/dashboard-cache.types';
import { logger } from '../../../common/logger/logger.config';

interface TenantRecord {
  id: string;
  settings: { defaultCurrency?: string } | null;
}

@Injectable()
export class DashboardCacheJob implements OnModuleInit, OnModuleDestroy {
  private jobInterval: NodeJS.Timeout | null = null;
  private isRunning = false;
  private isEnabled = true;

  constructor(
    private dashboardCacheService: DashboardCacheService,
    private foundationPrisma: FoundationPrismaService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    // Check if cache warming is enabled
    const enabled = this.configService.get<string>('DASHBOARD_CACHE_WARMING_ENABLED', 'true');
    this.isEnabled = enabled.toLowerCase() !== 'false';

    if (!this.isEnabled) {
      logger.info('Dashboard cache warming is disabled');
      return;
    }

    // Start the job scheduler
    await this.scheduleNextRun();
    logger.info('Dashboard cache warming job initialized');
  }

  onModuleDestroy() {
    if (this.jobInterval) {
      clearTimeout(this.jobInterval);
      this.jobInterval = null;
    }
    logger.info('Dashboard cache warming job stopped');
  }

  /**
   * Schedule the next cache warming run
   */
  private async scheduleNextRun(): Promise<void> {
    if (!this.isEnabled) {
      return;
    }

    const ttlMs = await this.getCacheIntervalMs();

    // Clear any existing timeout
    if (this.jobInterval) {
      clearTimeout(this.jobInterval);
    }

    this.jobInterval = setTimeout(async () => {
      await this.runCacheWarming();
      // Reschedule after completion (allows for dynamic interval changes)
      await this.scheduleNextRun();
    }, ttlMs);

    logger.debug({ intervalMs: ttlMs, intervalMinutes: ttlMs / 60000 }, 'Next cache warming scheduled');
  }

  /**
   * Get the cache interval in milliseconds
   */
  private async getCacheIntervalMs(): Promise<number> {
    const ttlSeconds = await this.dashboardCacheService.getCacheTTLSeconds();
    return ttlSeconds * 1000;
  }

  /**
   * Run cache warming for all active tenants
   */
  async runCacheWarming(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Cache warming already in progress, skipping');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();
    let tenantsProcessed = 0;
    let errors = 0;

    try {
      logger.info('Starting dashboard cache warming for all tenants');

      // Get all active tenants
      const tenants = await this.getActiveTenants();

      if (tenants.length === 0) {
        logger.info('No active tenants found for cache warming');
        return;
      }

      logger.info({ tenantCount: tenants.length }, 'Found active tenants for cache warming');

      // Process tenants in batches to avoid overwhelming the database
      const batchSize = 5;
      for (let i = 0; i < tenants.length; i += batchSize) {
        const batch = tenants.slice(i, i + batchSize);

        await Promise.allSettled(
          batch.map(async (tenant) => {
            try {
              const currency = tenant.settings?.defaultCurrency || DASHBOARD_CACHE_CONFIG.DEFAULT_CURRENCY;
              await this.dashboardCacheService.warmCacheForTenant(tenant.id, currency);
              tenantsProcessed++;
            } catch (error) {
              errors++;
              logger.error(
                { error, tenantId: tenant.id },
                'Failed to warm cache for tenant',
              );
            }
          }),
        );

        // Small delay between batches to reduce database load
        if (i + batchSize < tenants.length) {
          await this.delay(100);
        }
      }

      const duration = Date.now() - startTime;
      logger.info(
        {
          tenantsProcessed,
          errors,
          durationMs: duration,
        },
        'Dashboard cache warming completed',
      );
    } catch (error) {
      logger.error({ error }, 'Dashboard cache warming failed');
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Get all active tenants from Foundation database
   */
  private async getActiveTenants(): Promise<TenantRecord[]> {
    try {
      const tenants = await this.foundationPrisma.tenant.findMany({
        where: {
          status: 'active',
        },
        select: {
          id: true,
          settings: true,
        },
      });

      return tenants.map((t) => ({
        id: t.id,
        settings: t.settings as { defaultCurrency?: string } | null,
      }));
    } catch (error) {
      logger.error({ error }, 'Failed to fetch active tenants');
      return [];
    }
  }

  /**
   * Helper to delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Manually trigger cache warming (for testing or admin API)
   */
  async triggerManualWarming(): Promise<{ success: boolean; message: string }> {
    if (this.isRunning) {
      return {
        success: false,
        message: 'Cache warming already in progress',
      };
    }

    // Run warming in background
    this.runCacheWarming().catch((error) => {
      logger.error({ error }, 'Manual cache warming failed');
    });

    return {
      success: true,
      message: 'Cache warming started',
    };
  }
}
