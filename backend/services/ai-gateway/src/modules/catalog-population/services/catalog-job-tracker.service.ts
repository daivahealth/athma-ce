/**
 * Catalog Job Tracker Service
 * Manages job state in both Redis (live progress) and the database (persistence/audit).
 */

import { Injectable } from '@nestjs/common';
import { PrismaService as ClinicalPrismaService } from '@zeal/database-clinical';
import { RedisService } from '../../../shared/redis/redis.service';
import {
  CatalogType,
  JobStatus,
  DataSource,
  CatalogProgressDetail,
  CatalogPopulationStatusDto,
} from '../dto/catalog-population.dto';
import { logger } from '../../../common/logger/logger.config';

interface JobProgress {
  jobId: string;
  status: JobStatus;
  countryIso: string;
  completed: number;
  total: number;
  currentCatalog?: string;
  totalInserted: number;
  details: CatalogProgressDetail[];
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
}

const REDIS_KEY_PREFIX = 'catalog-population:job:';
const REDIS_TTL_SECONDS = 3600; // 1 hour

@Injectable()
export class CatalogJobTrackerService {
  constructor(
    private clinicalPrisma: ClinicalPrismaService,
    private redis: RedisService,
  ) {}

  /**
   * Create a new job record in both DB and Redis
   */
  async createJob(
    tenantId: string,
    userId: string,
    countryIso: string,
    catalogTypes: CatalogType[],
  ): Promise<string> {
    // Create DB record
    const job = await this.clinicalPrisma.catalogPopulationJob.create({
      data: {
        tenantId,
        countryIso,
        status: JobStatus.PENDING,
        catalogTypes: catalogTypes as string[],
        totalInserted: 0,
        initiatedBy: userId,
        progress: {},
      },
    });

    // Initialize Redis progress
    const details: CatalogProgressDetail[] = catalogTypes.map((ct) => ({
      catalogType: ct,
      status: 'pending',
      dataSource: DataSource.TEMPLATE,
      itemsInserted: 0,
    }));

    const progress: JobProgress = {
      jobId: job.id,
      status: JobStatus.PENDING,
      countryIso,
      completed: 0,
      total: catalogTypes.length,
      totalInserted: 0,
      details,
    };

    await this.redis.set(REDIS_KEY_PREFIX + job.id, progress, REDIS_TTL_SECONDS);

    logger.info({ jobId: job.id, tenantId, countryIso, catalogTypes }, 'Catalog population job created');
    return job.id;
  }

  /**
   * Mark job as running
   */
  async markRunning(jobId: string): Promise<void> {
    const now = new Date();

    await this.clinicalPrisma.catalogPopulationJob.update({
      where: { id: jobId },
      data: { status: JobStatus.RUNNING, startedAt: now },
    });

    const progress = await this.getProgress(jobId);
    if (progress) {
      progress.status = JobStatus.RUNNING;
      progress.startedAt = now.toISOString();
      await this.redis.set(REDIS_KEY_PREFIX + jobId, progress, REDIS_TTL_SECONDS);
    }
  }

  /**
   * Update progress for a specific catalog type
   */
  async updateCatalogProgress(
    jobId: string,
    catalogType: CatalogType,
    status: 'in_progress' | 'completed' | 'failed' | 'skipped',
    dataSource: DataSource,
    itemsInserted: number,
    errorMessage?: string,
  ): Promise<void> {
    const progress = await this.getProgress(jobId);
    if (!progress) return;

    const detail = progress.details.find((d) => d.catalogType === catalogType);
    if (detail) {
      detail.status = status;
      detail.dataSource = dataSource;
      detail.itemsInserted = itemsInserted;
      if (errorMessage) detail.errorMessage = errorMessage;
    }

    if (status === 'in_progress') {
      progress.currentCatalog = catalogType;
    }

    if (status === 'completed' || status === 'skipped') {
      progress.completed = progress.details.filter(
        (d) => d.status === 'completed' || d.status === 'skipped',
      ).length;
    }

    progress.totalInserted = progress.details.reduce((sum, d) => sum + d.itemsInserted, 0);

    await this.redis.set(REDIS_KEY_PREFIX + jobId, progress, REDIS_TTL_SECONDS);

    // Periodic DB sync (every catalog completion)
    if (status === 'completed' || status === 'failed' || status === 'skipped') {
      await this.clinicalPrisma.catalogPopulationJob.update({
        where: { id: jobId },
        data: {
          totalInserted: progress.totalInserted,
          progress: progress.details as any,
        },
      });
    }
  }

  /**
   * Mark job as completed
   */
  async markCompleted(jobId: string): Promise<void> {
    const now = new Date();
    const progress = await this.getProgress(jobId);

    await this.clinicalPrisma.catalogPopulationJob.update({
      where: { id: jobId },
      data: {
        status: JobStatus.COMPLETED,
        completedAt: now,
        totalInserted: progress?.totalInserted ?? 0,
        progress: progress?.details as any,
      },
    });

    if (progress) {
      progress.status = JobStatus.COMPLETED;
      progress.completedAt = now.toISOString();
      progress.currentCatalog = undefined;
      await this.redis.set(REDIS_KEY_PREFIX + jobId, progress, REDIS_TTL_SECONDS);
    }

    logger.info({ jobId, totalInserted: progress?.totalInserted }, 'Catalog population job completed');
  }

  /**
   * Mark job as failed
   */
  async markFailed(jobId: string, errorMessage: string): Promise<void> {
    const now = new Date();

    await this.clinicalPrisma.catalogPopulationJob.update({
      where: { id: jobId },
      data: {
        status: JobStatus.FAILED,
        completedAt: now,
        errorMessage,
        progress: (await this.getProgress(jobId))?.details as any,
      },
    });

    const progress = await this.getProgress(jobId);
    if (progress) {
      progress.status = JobStatus.FAILED;
      progress.completedAt = now.toISOString();
      progress.errorMessage = errorMessage;
      await this.redis.set(REDIS_KEY_PREFIX + jobId, progress, REDIS_TTL_SECONDS);
    }

    logger.error({ jobId, errorMessage }, 'Catalog population job failed');
  }

  /**
   * Mark job as cancelled
   */
  async markCancelled(jobId: string): Promise<void> {
    const now = new Date();

    await this.clinicalPrisma.catalogPopulationJob.update({
      where: { id: jobId },
      data: { status: JobStatus.CANCELLED, completedAt: now },
    });

    const progress = await this.getProgress(jobId);
    if (progress) {
      progress.status = JobStatus.CANCELLED;
      progress.completedAt = now.toISOString();
      await this.redis.set(REDIS_KEY_PREFIX + jobId, progress, REDIS_TTL_SECONDS);
    }

    logger.info({ jobId }, 'Catalog population job cancelled');
  }

  /**
   * Get current progress from Redis (fast) or fall back to DB
   */
  async getProgress(jobId: string): Promise<JobProgress | null> {
    // Try Redis first
    const cached = await this.redis.get<JobProgress>(REDIS_KEY_PREFIX + jobId);
    if (cached) return cached;

    // Fall back to DB
    const job = await this.clinicalPrisma.catalogPopulationJob.findUnique({
      where: { id: jobId },
    });

    if (!job) return null;

    const details = (job.progress as CatalogProgressDetail[] | null) || [];

    return {
      jobId: job.id,
      status: job.status as JobStatus,
      countryIso: job.countryIso,
      completed: details.filter((d) => d.status === 'completed' || d.status === 'skipped').length,
      total: job.catalogTypes.length,
      totalInserted: job.totalInserted,
      details,
      errorMessage: job.errorMessage ?? undefined,
      startedAt: job.startedAt?.toISOString(),
      completedAt: job.completedAt?.toISOString(),
    };
  }

  /**
   * Get status as a DTO (for API response)
   */
  async getStatus(jobId: string): Promise<CatalogPopulationStatusDto | null> {
    const progress = await this.getProgress(jobId);
    if (!progress) return null;
    return progress;
  }

  /**
   * Get job history for a tenant
   */
  async getHistory(tenantId: string): Promise<CatalogPopulationStatusDto[]> {
    const jobs = await this.clinicalPrisma.catalogPopulationJob.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return jobs.map((job) => ({
      jobId: job.id,
      status: job.status as JobStatus,
      countryIso: job.countryIso,
      completed: job.catalogTypes.length,
      total: job.catalogTypes.length,
      totalInserted: job.totalInserted,
      details: (job.progress as CatalogProgressDetail[] | null) || [],
      errorMessage: job.errorMessage ?? undefined,
      startedAt: job.startedAt?.toISOString(),
      completedAt: job.completedAt?.toISOString(),
    }));
  }

  /**
   * Check if a job is still running for this tenant
   */
  async hasRunningJob(tenantId: string): Promise<boolean> {
    const count = await this.clinicalPrisma.catalogPopulationJob.count({
      where: {
        tenantId,
        status: { in: [JobStatus.PENDING, JobStatus.RUNNING] },
      },
    });
    return count > 0;
  }
}
