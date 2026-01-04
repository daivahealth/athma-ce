/**
 * Rules Service
 * CRUD operations for engagement rules
 */

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';

@Injectable()
export class RulesService {

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new engagement rule
   */
  async create(tenantId: string, userId: string, dto: CreateRuleDto) {
    // Check for duplicate code
    const existing = await this.prisma.engagementRule.findUnique({
      where: {
        idx_rules_tenant_code: {
          tenantId,
          code: dto.code,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Rule with code '${dto.code}' already exists`);
    }

    return this.prisma.engagementRule.create({
      data: {
        tenantId,
        code: dto.code,
        name: dto.name,
        description: dto.description,
        category: dto.category,
        triggerEventType: dto.trigger_event_type,
        triggerEventSubtype: dto.trigger_event_subtype,
        conditionExpr: dto.condition_expr,
        scheduleMode: dto.schedule_mode,
        delaySeconds: dto.delay_seconds ?? 0,
        actionType: dto.action_type,
        actionPayload: dto.action_payload,
        priority: dto.priority ?? 100,
        cooldownSeconds: dto.cooldown_seconds,
        idempotencyWindow: dto.idempotency_window,
        maxExecutionsPerDay: dto.max_executions_per_day,
        effectiveFrom: dto.effective_from ? new Date(dto.effective_from) : undefined,
        effectiveTo: dto.effective_to ? new Date(dto.effective_to) : undefined,
        isActive: dto.is_active ?? true,
        createdBy: userId,
      },
    });
  }

  /**
   * Get all rules (with optional filters)
   */
  async findAll(tenantId: string, filters?: { isActive?: boolean; category?: string }) {
    const where: any = { tenantId, deletedAt: null };

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    return this.prisma.engagementRule.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Get rule by ID
   */
  async findOne(tenantId: string, ruleId: string) {
    const rule = await this.prisma.engagementRule.findFirst({
      where: { id: ruleId, tenantId, deletedAt: null },
    });

    if (!rule) {
      throw new NotFoundException(`Rule ${ruleId} not found`);
    }

    return rule;
  }

  /**
   * Update rule
   */
  async update(tenantId: string, userId: string, ruleId: string, dto: UpdateRuleDto) {
    // Check rule exists
    await this.findOne(tenantId, ruleId);

    // If updating code, check for duplicates
    if (dto.code) {
      const existing = await this.prisma.engagementRule.findFirst({
        where: {
          tenantId,
          code: dto.code,
          id: { not: ruleId },
          deletedAt: null,
        },
      });

      if (existing) {
        throw new ConflictException(`Rule with code '${dto.code}' already exists`);
      }
    }

    return this.prisma.engagementRule.update({
      where: { id: ruleId },
      data: {
        ...(dto.code && { code: dto.code }),
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.category && { category: dto.category }),
        ...(dto.trigger_event_type && { triggerEventType: dto.trigger_event_type }),
        ...(dto.trigger_event_subtype !== undefined && { triggerEventSubtype: dto.trigger_event_subtype }),
        ...(dto.condition_expr && { conditionExpr: dto.condition_expr }),
        ...(dto.schedule_mode && { scheduleMode: dto.schedule_mode }),
        ...(dto.delay_seconds !== undefined && { delaySeconds: dto.delay_seconds }),
        ...(dto.action_type && { actionType: dto.action_type }),
        ...(dto.action_payload && { actionPayload: dto.action_payload }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.cooldown_seconds !== undefined && { cooldownSeconds: dto.cooldown_seconds }),
        ...(dto.idempotency_window !== undefined && { idempotencyWindow: dto.idempotency_window }),
        ...(dto.max_executions_per_day !== undefined && { maxExecutionsPerDay: dto.max_executions_per_day }),
        ...(dto.effective_from !== undefined && { effectiveFrom: dto.effective_from ? new Date(dto.effective_from) : null }),
        ...(dto.effective_to !== undefined && { effectiveTo: dto.effective_to ? new Date(dto.effective_to) : null }),
        ...(dto.is_active !== undefined && { isActive: dto.is_active }),
        updatedBy: userId,
      },
    });
  }

  /**
   * Soft delete rule
   */
  async remove(tenantId: string, userId: string, ruleId: string) {
    // Check rule exists
    await this.findOne(tenantId, ruleId);

    await this.prisma.engagementRule.update({
      where: { id: ruleId },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });

    return { message: 'Rule deleted successfully' };
  }
}
