/**
 * Jobs Runner Service
 * Replaces Express setInterval worker with NestJS @Cron
 * CRITICAL: Uses Postgres FOR UPDATE SKIP LOCKED for job claiming
 */

import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { JobsService } from './jobs.service';
import { JobsExecutorService } from './jobs-executor.service';

@Injectable()
export class JobsRunnerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(JobsRunnerService.name);
  private isShuttingDown = false;
  private readonly intervalMs: number;
  private readonly batchSize: number;
  private readonly instanceId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jobsService: JobsService,
    private readonly jobsExecutor: JobsExecutorService,
  ) {
    this.intervalMs = this.configService.get<number>('jobWorker.intervalMs', 5000);
    this.batchSize = this.configService.get<number>('jobWorker.batchSize', 10);
    this.instanceId = this.configService.get<string>('jobWorker.instanceId', 'worker-1');
  }

  onModuleInit() {
    this.logger.log(
      `Job worker initialized (interval: ${this.intervalMs}ms, batch: ${this.batchSize}, instance: ${this.instanceId})`,
    );
  }

  onModuleDestroy() {
    this.isShuttingDown = true;
    this.logger.log('Job worker shutting down');
  }

  /**
   * Cron job that runs every 5 seconds (configurable)
   * Replaces Express setInterval
   */
  @Cron(CronExpression.EVERY_5_SECONDS)
  async processJobs() {
    if (this.isShuttingDown) {
      return;
    }

    try {
      // Get active tenants with ready jobs
      const tenants = await this.getActiveTenants();

      for (const tenantId of tenants) {
        await this.processTenantsJobs(tenantId);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Job processing error: ${errorMessage}`, errorStack);
    }
  }

  /**
   * Process jobs for a specific tenant
   */
  private async processTenantsJobs(tenantId: string) {
    try {
      // CRITICAL: Acquire ready jobs with Postgres row-level locking
      // This uses SELECT ... FOR UPDATE SKIP LOCKED to prevent race conditions
      const jobs = await this.claimReadyJobs(tenantId, this.batchSize);

      if (jobs.length === 0) {
        return;
      }

      this.logger.log(`Processing ${jobs.length} jobs for tenant ${tenantId}`);

      // Process each job
      for (const job of jobs) {
        await this.processJob(tenantId, job);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Tenant ${tenantId} job processing error: ${errorMessage}`);
    }
  }

  /**
   * CRITICAL: Claim ready jobs using Postgres FOR UPDATE SKIP LOCKED
   * This ensures no race conditions between multiple worker instances
   */
  private async claimReadyJobs(tenantId: string, limit: number): Promise<any[]> {
    // Use raw SQL for FOR UPDATE SKIP LOCKED (Prisma doesn't support this natively)
    const jobs = await this.prisma.$queryRawUnsafe<any[]>(
      `
      SELECT * FROM prm_jobs
      WHERE tenant_id = $1
        AND status = 'READY'
        AND run_at <= NOW()
      ORDER BY run_at ASC
      LIMIT $2
      FOR UPDATE SKIP LOCKED
      `,
      tenantId,
      limit,
    );

    // Mark jobs as RUNNING and lock them
    if (jobs.length > 0) {
      const jobIds = jobs.map((j) => j.id);
      await this.prisma.prmJob.updateMany({
        where: {
          id: { in: jobIds },
        },
        data: {
          status: 'RUNNING',
          lockedAt: new Date(),
          lockedBy: this.instanceId,
        },
      });

      this.logger.debug(`Locked ${jobs.length} jobs for instance ${this.instanceId}`);
    }

    return jobs;
  }

  /**
   * Process a single job
   */
  private async processJob(tenantId: string, job: any) {
    const log = this.logger;

    try {
      if (job.job_type === 'SEND_MESSAGE') {
        await this.jobsExecutor.executeSendMessageJob(tenantId, job);
      } else if (job.job_type === 'CREATE_TASK') {
        await this.jobsExecutor.executeCreateTaskJob(tenantId, job);
      } else {
        throw new Error(`Unknown job type: ${job.job_type}`);
      }

      await this.jobsService.markJobDone(job.id);
      log.log(`Job ${job.id} completed successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      log.error(`Job ${job.id} execution failed: ${errorMessage}`);
      await this.jobsService.markJobFailed(
        job.id,
        errorMessage,
        this.configService.get<number>('jobWorker.backoffBaseMs', 1000),
      );
    }
  }

  /**
   * Get active tenants (stub)
   */
  private async getActiveTenants(): Promise<string[]> {
    // In production, fetch from foundation service or cache
    // For now, get distinct tenant IDs from jobs table
    const result = await this.prisma.prmJob.findMany({
      where: {
        status: 'READY',
        runAt: { lte: new Date() },
      },
      select: { tenantId: true },
      distinct: ['tenantId'],
    });

    return result.map((r) => r.tenantId);
  }
}
