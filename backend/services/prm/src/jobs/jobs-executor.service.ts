/**
 * Jobs Executor Service
 * Executes job logic (send message, create task)
 * UNCHANGED logic from Express worker
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { JobsService } from './jobs.service';
import { ConsentService } from '../clients/consent/consent.service';
import { v4 as uuidv4 } from 'uuid';
import Mustache from 'mustache';

@Injectable()
export class JobsExecutorService {
  private readonly logger = new Logger(JobsExecutorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jobsService: JobsService,
    private readonly consentService: ConsentService,
  ) {}

  /**
   * Execute SEND_MESSAGE job
   */
  async executeSendMessageJob(tenantId: string, job: any) {
    const payload = job.payload;
    const patientId = job.patient_id;

    // 1. Fetch patient preferences
    const preferences = await this.prisma.patientPreference.findFirst({
      where: { tenantId, patientId },
    });

    // 2. Check DND
    if (preferences?.dndEnabled) {
      if (preferences.dndUntil && preferences.dndUntil > new Date()) {
        await this.jobsService.markJobSkipped(job.id, 'Patient has Do Not Disturb enabled');
        return;
      }
    }

    // 3. Check quiet hours (simplified)
    if (preferences?.quietHoursStart && preferences?.quietHoursEnd) {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      if (currentTime >= preferences.quietHoursStart && currentTime <= preferences.quietHoursEnd) {
        await this.jobsService.markJobSkipped(job.id, 'Within quiet hours');
        return;
      }
    }

    // 4. Check consent
    const channel = payload.channel;
    const purpose = payload.purpose || 'care';

    const consentAllowed = await this.consentService.isAllowed(tenantId, patientId, channel, purpose);

    if (!consentAllowed) {
      await this.jobsService.markJobSkipped(job.id, 'Consent not granted');
      return;
    }

    // 5. Fetch template
    const template = await this.prisma.communicationTemplate.findFirst({
      where: {
        tenantId,
        code: payload.template_code,
        channel,
        language: preferences?.preferredLanguage || 'en',
        approvalStatus: 'approved',
        isActive: true,
      },
      orderBy: { version: 'desc' },
    });

    if (!template) {
      throw new Error(`Template not found: ${payload.template_code} for channel ${channel}`);
    }

    // 6. Render template with variables
    const variables = payload.variables || {};
    const renderedBody = Mustache.render(template.body, variables);
    const renderedSubject = template.subject ? Mustache.render(template.subject, variables) : null;

    // 7. Get patient contact info (stub)
    const toAddress = this.getPatientContactAddress(patientId, channel);

    // 8. Create message record
    const message = await this.prisma.patientMessage.create({
      data: {
        id: uuidv4(),
        tenantId,
        patientId,
        direction: 'outbound',
        channel,
        toAddress,
        templateId: template.id,
        templateVersion: template.version,
        subject: renderedSubject,
        bodyRendered: renderedBody,
        variablesUsed: variables as any,
        purpose,
        relatedEventId: payload.event_id,
        status: 'pending',
        idempotencyKey: job.idempotency_key,
      },
    });

    // 9. Send via channel provider (stub)
    const providerMessageId = `stub-${channel}-${uuidv4()}`;

    // 10. Update message with provider response
    await this.prisma.patientMessage.update({
      where: { id: message.id },
      data: {
        providerMessageId,
        status: 'sent',
        sentAt: new Date(),
      },
    });

    this.logger.log(`Message sent: ${message.id} (provider: ${providerMessageId})`);
  }

  /**
   * Execute CREATE_TASK job
   */
  async executeCreateTaskJob(tenantId: string, job: any) {
    const payload = job.payload;
    const patientId = job.patient_id;

    // Fetch event for patient snapshot
    const event = payload.event_id
      ? await this.prisma.patientEngagementEvent.findUnique({
          where: { id: payload.event_id },
        })
      : null;

    // Create task
    const task = await this.prisma.patientTask.create({
      data: {
        id: uuidv4(),
        tenantId,
        patientId,
        patientDisplayName: event?.patientDisplayName,
        patientGender: event?.patientGender,
        patientAgeYearsAtEvent: event?.patientAgeYearsAtEvent,
        patientRef: event?.patientRef,
        taskType: payload.task_type,
        title: payload.title,
        description: payload.description,
        priority: payload.priority || 2,
        assignedToRole: payload.assigned_to_role,
        dueAt: payload.due_at ? new Date(payload.due_at) : null,
        relatedEventId: payload.event_id,
        status: 'pending',
      },
    });

    this.logger.log(`Task created: ${task.id}`);
  }

  /**
   * Get patient contact address (stub)
   */
  private getPatientContactAddress(patientId: string, channel: string): string {
    // In production, fetch from clinical service
    if (channel === 'sms' || channel === 'whatsapp') {
      return `+1***${patientId.substr(-4)}`;
    }
    if (channel === 'email') {
      return `patient-${patientId.substr(-6)}@masked.example.com`;
    }
    return patientId;
  }
}
