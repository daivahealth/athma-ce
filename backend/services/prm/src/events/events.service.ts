/**
 * Events Service
 * Business logic for event ingestion (UNCHANGED from Express version)
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RulesEngineService } from '../rules/rules-engine.service';
import { JobsService } from '../jobs/jobs.service';
import { IngestEventDto } from './dto/ingest-event.dto';
import { v4 as uuidv4 } from 'uuid';

export interface EvaluationContext {
  event: {
    event_type: string;
    event_subtype?: string;
    payload: Record<string, any>;
    occurred_at: Date;
    severity: number;
  };
  patient: {
    patient_id: string;
    age_years_at_event?: number;
    gender?: string;
    ref?: string;
  };
  preferences?: {
    quiet_hours_start?: string;
    quiet_hours_end?: string;
    dnd_enabled?: boolean;
    channel_order?: string[];
  };
}

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly rulesEngine: RulesEngineService,
    private readonly jobsService: JobsService,
  ) {}

  /**
   * Ingest an engagement event (idempotent)
   * LOGIC UNCHANGED from Express version
   */
  async ingestEvent(tenantId: string, userId: string, dto: IngestEventDto) {
    // 1. Check for duplicate
    const existing = await this.prisma.patientEngagementEvent.findFirst({
      where: {
        tenantId,
        dedupeKey: dto.dedupe_key,
      },
    });

    if (existing) {
      this.logger.log(`Event already processed (duplicate): ${existing.id}`);
      return {
        event: existing,
        duplicate: true,
        rulesEvaluated: 0,
        jobsCreated: 0,
      };
    }

    // 2. Persist event
    const event = await this.prisma.patientEngagementEvent.create({
      data: {
        id: uuidv4(),
        tenantId,
        patientId: dto.patient_id,
        patientDisplayName: dto.patient_display_name,
        patientGender: dto.patient_gender,
        patientDob: dto.patient_dob ? new Date(dto.patient_dob) : null,
        patientAgeYearsAtEvent: dto.patient_age_years_at_event,
        patientRef: dto.patient_mrn,
        patientMobileMasked: dto.patient_mobile_masked,
        sourceSystem: dto.source_system,
        sourceModule: dto.source_module,
        eventType: dto.event_type,
        eventSubtype: dto.event_subtype,
        severity: dto.severity ?? 0,
        occurredAt: new Date(dto.occurred_at),
        entityType: dto.entity_type,
        entityId: dto.entity_id,
        payload: dto.payload as any,
        correlationId: dto.correlation_id,
        dedupeKey: dto.dedupe_key,
        createdBy: userId,
      },
    });

    this.logger.log(`Event persisted: ${event.id} (${event.eventType})`);

    // 3. Evaluate rules
    const result = await this.evaluateRules(tenantId, event);

    return {
      event,
      duplicate: false,
      rulesEvaluated: result.rulesEvaluated,
      jobsCreated: result.jobsCreated,
    };
  }

  async listEvents(
    tenantId: string,
    filters: {
      patientId?: string;
      eventType?: string;
      entityType?: string;
      limit: number;
      offset: number;
    },
  ) {
    const where = {
      tenantId,
      ...(filters.patientId ? { patientId: filters.patientId } : {}),
      ...(filters.eventType ? { eventType: filters.eventType } : {}),
      ...(filters.entityType ? { entityType: filters.entityType } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.patientEngagementEvent.findMany({
        where,
        orderBy: { occurredAt: 'desc' },
        take: filters.limit,
        skip: filters.offset,
      }),
      this.prisma.patientEngagementEvent.count({ where }),
    ]);

    return { data, total };
  }

  /**
   * Evaluate all active rules for an event
   * LOGIC UNCHANGED from Express version
   */
  private async evaluateRules(tenantId: string, event: any) {
    // Fetch active rules matching this event type
    const rules = await this.prisma.engagementRule.findMany({
      where: {
        tenantId,
        isActive: true,
        triggerEventType: event.eventType,
        deletedAt: null,
        OR: [{ effectiveFrom: { lte: new Date() } }, { effectiveFrom: null }],
        AND: [{ OR: [{ effectiveTo: { gte: new Date() } }, { effectiveTo: null }] }],
      },
      orderBy: { priority: 'desc' },
    });

    this.logger.log(`Evaluating ${rules.length} rules for event ${event.id}`);

    let jobsCreated = 0;

    for (const rule of rules) {
      try {
        // Build evaluation context
        const context: EvaluationContext = {
          event: {
            event_type: event.eventType,
            event_subtype: event.eventSubtype,
            payload: event.payload as Record<string, any>,
            occurred_at: event.occurredAt,
            severity: event.severity,
          },
          patient: {
            patient_id: event.patientId,
            age_years_at_event: event.patientAgeYearsAtEvent,
            gender: event.patientGender,
            ref: event.patientRef,
          },
        };

        // Fetch patient preferences
        const preferences = await this.prisma.patientPreference.findFirst({
          where: { tenantId, patientId: event.patientId },
        });

        if (preferences) {
          context.preferences = {
            quiet_hours_start: preferences.quietHoursStart ?? undefined,
            quiet_hours_end: preferences.quietHoursEnd ?? undefined,
            dnd_enabled: preferences.dndEnabled,
            channel_order: preferences.channelOrder as string[],
          };
        }

        // Evaluate condition
        const decision = this.rulesEngine.evaluateCondition(rule.conditionExpr as any, context);

        if (!decision) {
          await this.logRuleRun(tenantId, rule.id, event.id, 'skip', 'Condition not met');
          continue;
        }

        // Execute action
        const actionResult = await this.executeAction(tenantId, event, rule, context);

        await this.logRuleRun(tenantId, rule.id, event.id, 'execute', null, actionResult);

        if (actionResult.jobsCreated) {
          jobsCreated += actionResult.jobsCreated;
        }

        this.logger.log(`Rule ${rule.code} executed for event ${event.id}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger.error(`Rule ${rule.id} evaluation failed: ${errorMessage}`);
        await this.logRuleRun(tenantId, rule.id, event.id, 'skip', `Error: ${errorMessage}`);
      }
    }

    return { rulesEvaluated: rules.length, jobsCreated };
  }

  /**
   * Execute rule action (create job)
   * LOGIC UNCHANGED from Express version
   */
  private async executeAction(tenantId: string, event: any, rule: any, _context: EvaluationContext) {
    const actionPayload = rule.actionPayload as any;
    const actionType = rule.actionType;

    if (actionType === 'SEND_MESSAGE') {
      const delaySeconds = rule.scheduleMode === 'DELAYED' ? rule.delaySeconds || 0 : 0;
      const runAt = new Date(Date.now() + delaySeconds * 1000);

      const job = await this.jobsService.createJob(tenantId, {
        patient_id: event.patientId,
        job_type: 'SEND_MESSAGE',
        run_at: runAt,
        payload: {
          event_id: event.id,
          rule_id: rule.id,
          channel: actionPayload.channel,
          template_code: actionPayload.template_code,
          purpose: actionPayload.purpose,
          variables: actionPayload.variables || {},
        },
        idempotency_key: `rule-${rule.id}-event-${event.id}-${Date.now()}`,
      });

      return { jobsCreated: 1, jobIds: [job.id] };
    }

    if (actionType === 'CREATE_TASK') {
      const delaySeconds = rule.scheduleMode === 'DELAYED' ? rule.delaySeconds || 0 : 0;
      const runAt = new Date(Date.now() + delaySeconds * 1000);

      const job = await this.jobsService.createJob(tenantId, {
        patient_id: event.patientId,
        job_type: 'CREATE_TASK',
        run_at: runAt,
        payload: {
          event_id: event.id,
          rule_id: rule.id,
          task_type: actionPayload.task_type,
          title: actionPayload.title,
          description: actionPayload.description,
          priority: actionPayload.priority || 2,
          assigned_to_role: actionPayload.assign_role,
          due_at: actionPayload.due_at,
        },
        idempotency_key: `rule-${rule.id}-event-${event.id}-${Date.now()}`,
      });

      return { jobsCreated: 1, jobIds: [job.id] };
    }

    throw new Error(`Unknown action type: ${actionType}`);
  }

  /**
   * Log rule run for audit trail
   */
  private async logRuleRun(
    tenantId: string,
    ruleId: string,
    eventId: string,
    decision: string,
    skipReason: string | null,
    actionResult?: any,
  ) {
    await this.prisma.engagementRuleRun.create({
      data: {
        id: uuidv4(),
        tenantId,
        ruleId,
        eventId,
        decision,
        skipReason,
        actionResult: actionResult as any,
      },
    });
  }

  /**
   * Get patient timeline
   */
  async getPatientTimeline(
    tenantId: string,
    patientId: string,
    filters: { from?: Date; to?: Date; eventType?: string; limit?: number },
  ) {
    const where: any = {
      tenantId,
      patientId,
    };

    if (filters.from || filters.to) {
      where.occurredAt = {};
      if (filters.from) where.occurredAt.gte = filters.from;
      if (filters.to) where.occurredAt.lte = filters.to;
    }

    if (filters.eventType) {
      where.eventType = filters.eventType;
    }

    return this.prisma.patientEngagementEvent.findMany({
      where,
      orderBy: { occurredAt: 'desc' },
      take: filters.limit || 50,
    });
  }
}
