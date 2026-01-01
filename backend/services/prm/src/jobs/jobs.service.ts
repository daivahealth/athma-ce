/**
 * Jobs Service
 * Manages job queue (UNCHANGED logic from Express version)
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { v4 as uuidv4 } from 'uuid';

export interface CreateJobDto {
  patient_id: string;
  job_type: 'SEND_MESSAGE' | 'CREATE_TASK';
  run_at: Date;
  payload: Record<string, any>;
  idempotency_key: string;
  max_attempts?: number;
}

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a job (idempotent)
   */
  async createJob(tenantId: string, dto: CreateJobDto) {
    // Check for duplicate by idempotency key
    const existing = await this.prisma.prmJob.findFirst({
      where: {
        tenantId,
        idempotencyKey: dto.idempotency_key,
      },
    });

    if (existing) {
      this.logger.log(`Job already exists: ${existing.id}`);
      return existing;
    }

    // Create job
    const job = await this.prisma.prmJob.create({
      data: {
        id: uuidv4(),
        tenantId,
        patientId: dto.patient_id,
        jobType: dto.job_type,
        runAt: dto.run_at,
        payload: dto.payload as any,
        idempotencyKey: dto.idempotency_key,
        maxAttempts: dto.max_attempts ?? 3,
        status: 'READY',
      },
    });

    this.logger.log(`Job created: ${job.id} (${job.jobType}, run at: ${job.runAt})`);

    return job;
  }

  /**
   * Mark job as done
   */
  async markJobDone(jobId: string) {
    await this.prisma.prmJob.update({
      where: { id: jobId },
      data: {
        status: 'DONE',
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Mark job as failed with retry
   */
  async markJobFailed(jobId: string, error: string, backoffBaseMs: number) {
    const job = await this.prisma.prmJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      this.logger.error(`Job not found for failure update: ${jobId}`);
      return;
    }

    const newAttempts = job.attempts + 1;

    // Check if max attempts reached
    if (newAttempts >= job.maxAttempts) {
      await this.prisma.prmJob.update({
        where: { id: jobId },
        data: {
          status: 'DEAD',
          attempts: newAttempts,
          lastError: error,
          updatedAt: new Date(),
        },
      });

      this.logger.warn(`Job marked as DEAD (max attempts): ${jobId}`);
      return;
    }

    // Calculate exponential backoff: base_ms * 2^attempts
    const backoffMs = backoffBaseMs * Math.pow(2, newAttempts);
    const nextRunAt = new Date(Date.now() + backoffMs);

    await this.prisma.prmJob.update({
      where: { id: jobId },
      data: {
        status: 'READY',
        attempts: newAttempts,
        lastError: error,
        runAt: nextRunAt,
        lockedAt: null,
        lockedBy: null,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Job scheduled for retry: ${jobId} (attempt ${newAttempts}, next run: ${nextRunAt})`);
  }

  /**
   * Mark job as skipped (e.g., consent denied, quiet hours)
   */
  async markJobSkipped(jobId: string, reason: string) {
    await this.prisma.prmJob.update({
      where: { id: jobId },
      data: {
        status: 'SKIPPED',
        lastError: reason,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Job skipped: ${jobId} (${reason})`);
  }
}
