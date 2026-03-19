import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

/**
 * Manages table partitioning for clinical_observations.
 *
 * The clinical_observations table is partitioned by tenant_id (LIST) and
 * sub-partitioned by observed_at (RANGE, monthly) for query performance
 * at crore-scale data.
 *
 * This service:
 * 1. Creates tenant partitions when new tenants are detected
 * 2. Pre-creates monthly sub-partitions for upcoming months
 * 3. Runs weekly to ensure partitions exist ahead of time
 *
 * NOTE: Partitioning is applied via raw SQL migration, not Prisma.
 * The Prisma model manages the logical schema; this service manages
 * the physical partition structure.
 */
@Injectable()
export class PartitionManagerService implements OnModuleInit {
  private readonly logger = new Logger(PartitionManagerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // Check if partitioning is active (table might not be partitioned yet)
    try {
      const result = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT COUNT(*) as cnt
        FROM pg_catalog.pg_partitioned_table pt
        JOIN pg_catalog.pg_class c ON c.oid = pt.partrelid
        WHERE c.relname = 'clinical_observations'
      `);
      const isPartitioned = result[0]?.cnt > 0;
      if (isPartitioned) {
        this.logger.log('clinical_observations is partitioned — ensuring partitions exist');
        await this.ensurePartitions();
      } else {
        this.logger.log('clinical_observations is not partitioned — partition manager inactive');
      }
    } catch {
      this.logger.warn('Could not check partition status — skipping');
    }
  }

  /**
   * Pre-create partitions for the next 2 months.
   * Call weekly from an external scheduler or pg_cron.
   */
  async ensurePartitions(): Promise<void> {
    try {
      // Get all distinct tenant IDs that have observations
      const tenants = await this.prisma.$queryRawUnsafe<{ tenant_id: string }[]>(`
        SELECT DISTINCT tenant_id FROM clinical_observations LIMIT 100
      `);

      const now = new Date();
      // Pre-create partitions for current month + next 2 months
      for (let monthOffset = 0; monthOffset <= 2; monthOffset++) {
        const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 1);

        const yearMonth = `${targetDate.getFullYear()}_${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
        const fromDate = this.toPartitionDate(targetDate);
        const toDate = this.toPartitionDate(nextMonth);

        for (const { tenant_id } of tenants) {
          const tenantShort = tenant_id.replace(/-/g, '').substring(0, 12);
          await this.ensureMonthlyPartition(tenantShort, tenant_id, yearMonth, fromDate, toDate);
        }
      }
    } catch (error) {
      this.logger.error('Failed to ensure partitions', error);
    }
  }

  /**
   * Create tenant partition + monthly sub-partition if they don't exist.
   */
  async createTenantPartitions(tenantId: string): Promise<void> {
    // First check if the table is actually partitioned
    const isPartitioned = await this.isTablePartitioned();
    if (!isPartitioned) {
      this.logger.debug('clinical_observations is not partitioned — skipping partition creation');
      return;
    }

    const tenantShort = tenantId.replace(/-/g, '').substring(0, 12);
    const tenantPartitionName = `clinical_observations_t_${tenantShort}`;

    try {
      // Check if tenant partition exists
      const exists = await this.partitionExists(tenantPartitionName);
      if (!exists) {
        await this.prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS ${tenantPartitionName}
          PARTITION OF clinical_observations
          FOR VALUES IN ('${tenantId}')
          PARTITION BY RANGE (observed_at)
        `);
        this.logger.log(`Created tenant partition: ${tenantPartitionName}`);
      }

      // Create monthly partitions for current + next 2 months
      const now = new Date();
      for (let monthOffset = 0; monthOffset <= 2; monthOffset++) {
        const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 1);
        const yearMonth = `${targetDate.getFullYear()}_${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
        const fromDate = this.toPartitionDate(targetDate);
        const toDate = this.toPartitionDate(nextMonth);

        await this.ensureMonthlyPartition(tenantShort, tenantId, yearMonth, fromDate, toDate);
      }
    } catch (error: any) {
      this.logger.error(`Failed to create partitions for tenant ${tenantId}: ${error?.message}`, error?.stack);
    }
  }

  private async isTablePartitioned(): Promise<boolean> {
    try {
      const result = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT COUNT(*)::int as cnt
        FROM pg_catalog.pg_partitioned_table pt
        JOIN pg_catalog.pg_class c ON c.oid = pt.partrelid
        WHERE c.relname = 'clinical_observations'
      `);
      return (result[0]?.cnt ?? 0) > 0;
    } catch {
      return false;
    }
  }

  private async ensureMonthlyPartition(
    tenantShort: string,
    tenantId: string,
    yearMonth: string,
    fromDate: string,
    toDate: string,
  ): Promise<void> {
    const tenantPartitionName = `clinical_observations_t_${tenantShort}`;
    const monthPartitionName = `${tenantPartitionName}_${yearMonth}`;

    try {
      const exists = await this.partitionExists(monthPartitionName);
      if (!exists) {
        // Ensure tenant partition exists first
        const tenantExists = await this.partitionExists(tenantPartitionName);
        if (!tenantExists) {
          await this.prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS ${tenantPartitionName}
            PARTITION OF clinical_observations
            FOR VALUES IN ('${tenantId}')
            PARTITION BY RANGE (observed_at)
          `);
        }

        await this.prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS ${monthPartitionName}
          PARTITION OF ${tenantPartitionName}
          FOR VALUES FROM ('${fromDate}') TO ('${toDate}')
        `);
        this.logger.log(`Created monthly partition: ${monthPartitionName}`);
      }
    } catch {
      // Partition might already exist from concurrent creation — safe to ignore
    }
  }

  private async partitionExists(partitionName: string): Promise<boolean> {
    const result = await this.prisma.$queryRawUnsafe<{ cnt: number }[]>(`
      SELECT COUNT(*)::int as cnt FROM pg_class WHERE relname = '${partitionName}'
    `);
    return (result[0]?.cnt ?? 0) > 0;
  }

  private toPartitionDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
