import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import { Decimal } from '@prisma/client/runtime/library';
import {
  CreateChargePostingRuleDto,
  UpdateChargePostingRuleDto,
  ProcessEventDto,
  EventType,
  EventSource,
  BillingItemType,
} from '../dto/charge-posting-rule.dto';
import { ChargeService } from './charge.service';
import { ChargeSourceType } from '../dto/charge.dto';

/**
 * ChargePostingService
 *
 * Core business logic for automated charge posting based on clinical events.
 * This service processes events from the Clinical service and creates charges
 * automatically based on configured rules.
 *
 * Key responsibilities:
 * - Manage charge posting rules (CRUD operations)
 * - Process clinical events and match against rules
 * - Evaluate JSONB conditions with MongoDB-style operators
 * - Calculate charges based on rule configuration
 * - Create audit trail for compliance and debugging
 */
@Injectable()
export class ChargePostingService {
  private readonly logger = new Logger(ChargePostingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly chargeService: ChargeService,
  ) {}

  // ========================================
  // RULE MANAGEMENT METHODS
  // ========================================

  async createRule(tenantId: string, dto: CreateChargePostingRuleDto, userId?: string) {
    this.logger.log(`Creating charge posting rule: ${dto.ruleName} for tenant ${tenantId}`);

    const rule = await this.prisma.chargePostingRule.create({
      data: {
        tenantId,
        ruleName: dto.ruleName,
        description: dto.description ?? null,
        eventType: dto.eventType,
        eventSource: dto.eventSource,
        billingItemType: dto.billingItemType,
        billingItemId: dto.billingItemId ?? null,
        conditions: dto.conditions ?? null,
        chargeCalculationMethod: dto.chargeCalculationMethod ?? 'catalog_price',
        basePrice: dto.basePrice ? new Decimal(dto.basePrice) : null,
        priceSource: dto.priceSource ?? 'catalog',
        quantitySource: dto.quantitySource ?? 'event',
        discountPercentage: dto.discountPercentage ? new Decimal(dto.discountPercentage) : null,
        taxPercentage: dto.taxPercentage ? new Decimal(dto.taxPercentage) : null,
        isActive: dto.isActive ?? true,
        priority: dto.priority ?? 10,
        autoApprove: dto.autoApprove ?? true,
        configuration: dto.configuration ?? null,
        createdBy: userId ?? null,
        updatedBy: userId ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Created charge posting rule ${rule.id}: ${rule.ruleName}`);
    return rule;
  }

  async findAllRules(
    tenantId: string,
    filters?: {
      eventType?: EventType;
      eventSource?: EventSource;
      billingItemType?: BillingItemType;
      isActive?: boolean;
    },
  ) {
    const where: any = { tenantId };

    if (filters?.eventType !== undefined) {
      where.eventType = filters.eventType;
    }
    if (filters?.eventSource !== undefined) {
      where.eventSource = filters.eventSource;
    }
    if (filters?.billingItemType !== undefined) {
      where.billingItemType = filters.billingItemType;
    }
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return this.prisma.chargePostingRule.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findRuleById(tenantId: string, id: string) {
    const rule = await this.prisma.chargePostingRule.findFirst({
      where: { id, tenantId },
    });

    if (!rule) {
      throw new NotFoundException(`Charge posting rule with ID ${id} not found`);
    }

    return rule;
  }

  async updateRule(
    tenantId: string,
    id: string,
    dto: UpdateChargePostingRuleDto,
    userId?: string,
  ) {
    await this.findRuleById(tenantId, id);

    const updateData: any = {
      updatedBy: userId ?? null,
      updatedAt: new Date(),
    };

    if (dto.ruleName !== undefined) updateData.ruleName = dto.ruleName;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.eventType !== undefined) updateData.eventType = dto.eventType;
    if (dto.eventSource !== undefined) updateData.eventSource = dto.eventSource;
    if (dto.billingItemType !== undefined) updateData.billingItemType = dto.billingItemType;
    if (dto.billingItemId !== undefined) updateData.billingItemId = dto.billingItemId;
    if (dto.conditions !== undefined) updateData.conditions = dto.conditions;
    if (dto.chargeCalculationMethod !== undefined)
      updateData.chargeCalculationMethod = dto.chargeCalculationMethod;
    if (dto.basePrice !== undefined)
      updateData.basePrice = dto.basePrice ? new Decimal(dto.basePrice) : null;
    if (dto.priceSource !== undefined) updateData.priceSource = dto.priceSource;
    if (dto.quantitySource !== undefined) updateData.quantitySource = dto.quantitySource;
    if (dto.discountPercentage !== undefined)
      updateData.discountPercentage = dto.discountPercentage
        ? new Decimal(dto.discountPercentage)
        : null;
    if (dto.taxPercentage !== undefined)
      updateData.taxPercentage = dto.taxPercentage ? new Decimal(dto.taxPercentage) : null;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.priority !== undefined) updateData.priority = dto.priority;
    if (dto.autoApprove !== undefined) updateData.autoApprove = dto.autoApprove;
    if (dto.configuration !== undefined) updateData.configuration = dto.configuration;

    const updated = await this.prisma.chargePostingRule.update({
      where: { id },
      data: updateData,
    });

    this.logger.log(`Updated charge posting rule ${id}: ${updated.ruleName}`);
    return updated;
  }

  async deleteRule(tenantId: string, id: string) {
    await this.findRuleById(tenantId, id);

    await this.prisma.chargePostingRule.delete({
      where: { id },
    });

    this.logger.log(`Deleted charge posting rule ${id}`);
    return { success: true, message: 'Rule deleted successfully' };
  }

  async setRuleActive(tenantId: string, id: string, isActive: boolean, userId?: string) {
    await this.findRuleById(tenantId, id);

    const updated = await this.prisma.chargePostingRule.update({
      where: { id },
      data: {
        isActive,
        updatedBy: userId ?? null,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`${isActive ? 'Activated' : 'Deactivated'} charge posting rule ${id}`);
    return updated;
  }

  // ========================================
  // EVENT PROCESSING METHODS (CORE LOGIC)
  // ========================================

  /**
   * Process a clinical event and create charges based on matching rules
   *
   * This is the core method that:
   * 1. Stores the event in the database
   * 2. Finds all matching rules based on event type and conditions
   * 3. For each matching rule, calculates and creates a charge
   * 4. Creates audit trail records
   *
   * @param tenantId - Tenant UUID
   * @param dto - Event details from Clinical service
   * @returns Summary of processing (rules matched, charges created)
   */
  async processEvent(tenantId: string, dto: ProcessEventDto) {
    this.logger.log(
      `Processing event: ${dto.eventType} for patient ${dto.patientId} (Event ID: ${dto.eventId})`,
    );

    // 1. Store the event in database for tracking
    const event = await this.prisma.chargePostingEvent.create({
      data: {
        tenantId,
        eventType: dto.eventType,
        eventSource: dto.eventSource,
        eventId: dto.eventId,
        eventData: dto.eventData,
        patientId: dto.patientId,
        encounterId: dto.encounterId ?? null,
        occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : new Date(),
        processed: false,
        createdAt: new Date(),
      },
    });

    try {
      // 2. Find all active rules for this event type
      const matchingRules = await this.findMatchingRules(tenantId, dto);

      if (matchingRules.length === 0) {
        this.logger.warn(
          `No matching rules found for event ${dto.eventType}. Event stored but no charges created.`,
        );

        await this.prisma.chargePostingEvent.update({
          where: { id: event.id },
          data: { processed: true, processedAt: new Date(), rulesMatched: 0, chargesCreated: 0 },
        });

        return {
          success: true,
          eventId: event.id,
          rulesMatched: 0,
          chargesCreated: 0,
          charges: [],
        };
      }

      this.logger.log(`Found ${matchingRules.length} matching rules`);

      // 3. Create charges for each matching rule
      const charges = [];
      for (const rule of matchingRules) {
        try {
          const charge = await this.createChargeFromRule(tenantId, rule, dto, event.id);
          charges.push(charge);

          // Create audit record
          await this.createAuditRecord(tenantId, rule, charge, event.id, dto);
        } catch (error) {
          this.logger.error(
            `Failed to create charge for rule ${rule.id} (${rule.ruleName}): ${error.message}`,
          );
          // Continue processing other rules even if one fails
        }
      }

      // 4. Update event status
      await this.prisma.chargePostingEvent.update({
        where: { id: event.id },
        data: {
          processed: true,
          processedAt: new Date(),
          rulesMatched: matchingRules.length,
          chargesCreated: charges.length,
        },
      });

      this.logger.log(
        `Successfully processed event ${dto.eventId}: ${charges.length} charges created from ${matchingRules.length} rules`,
      );

      return {
        success: true,
        eventId: event.id,
        rulesMatched: matchingRules.length,
        chargesCreated: charges.length,
        charges: charges.map((c) => ({
          chargeId: c.id,
          billingItemId: c.billingItemId,
          quantity: c.quantity,
          unitPrice: c.unitPrice,
          grossAmount: c.grossAmount,
          ruleId: c.sourceId,
          ruleName: matchingRules.find((r) => r.id === c.sourceId)?.ruleName,
        })),
      };
    } catch (error) {
      this.logger.error(`Error processing event ${dto.eventId}: ${error.message}`, error.stack);

      // Mark event as processed with error
      await this.prisma.chargePostingEvent.update({
        where: { id: event.id },
        data: {
          processed: true,
          processedAt: new Date(),
          processingError: error.message,
        },
      });

      throw error;
    }
  }

  /**
   * Find all rules that match the event type and conditions
   */
  private async findMatchingRules(tenantId: string, dto: ProcessEventDto) {
    // Get all active rules for this event type, ordered by priority
    const candidateRules = await this.prisma.chargePostingRule.findMany({
      where: {
        tenantId,
        eventType: dto.eventType,
        isActive: true,
      },
      orderBy: { priority: 'desc' },
    });

    // Filter rules by evaluating conditions
    const matchingRules = [];
    for (const rule of candidateRules) {
      if (this.evaluateConditions(rule.conditions, dto.eventData)) {
        matchingRules.push(rule);
      }
    }

    return matchingRules;
  }

  /**
   * Evaluate JSONB conditions against event data
   * Supports MongoDB-style operators: $eq, $ne, $gt, $gte, $lt, $lte, $in
   *
   * Example condition:
   * {
   *   "eventData.testCode": { "$eq": "CBC001" },
   *   "eventData.urgent": { "$eq": true }
   * }
   */
  private evaluateConditions(conditions: any, eventData: Record<string, any>): boolean {
    if (!conditions || Object.keys(conditions).length === 0) {
      return true; // No conditions = always match
    }

    for (const [path, condition] of Object.entries(conditions)) {
      const value = this.getNestedValue(eventData, path);

      if (!this.evaluateCondition(value, condition)) {
        return false; // Any condition fails = rule doesn't match
      }
    }

    return true; // All conditions passed
  }

  /**
   * Get nested value from object using dot notation
   * Example: getNestedValue({ eventData: { testCode: "CBC001" } }, "eventData.testCode") => "CBC001"
   */
  private getNestedValue(obj: any, path: string): any {
    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[part];
    }

    return current;
  }

  /**
   * Evaluate a single condition with operator
   */
  private evaluateCondition(value: any, condition: any): boolean {
    if (typeof condition !== 'object' || condition === null) {
      // Simple equality check
      return value === condition;
    }

    // MongoDB-style operators
    for (const [operator, expectedValue] of Object.entries(condition)) {
      switch (operator) {
        case '$eq':
          if (value !== expectedValue) return false;
          break;
        case '$ne':
          if (value === expectedValue) return false;
          break;
        case '$gt':
          if (value <= expectedValue) return false;
          break;
        case '$gte':
          if (value < expectedValue) return false;
          break;
        case '$lt':
          if (value >= expectedValue) return false;
          break;
        case '$lte':
          if (value > expectedValue) return false;
          break;
        case '$in':
          if (!Array.isArray(expectedValue) || !expectedValue.includes(value)) return false;
          break;
        default:
          this.logger.warn(`Unknown operator: ${operator}`);
          return false;
      }
    }

    return true;
  }

  /**
   * Create a charge based on a rule and event data
   */
  private async createChargeFromRule(
    tenantId: string,
    rule: any,
    dto: ProcessEventDto,
    eventId: string,
  ) {
    // 1. Resolve billing item
    const billingItemId = await this.resolveBillingItem(tenantId, rule, dto);

    if (!billingItemId) {
      throw new BadRequestException(
        `Could not resolve billing item for rule ${rule.ruleName}. Check billingItemType and eventData.`,
      );
    }

    // 2. Get billing item details for pricing
    const billingItem = await this.prisma.billingItem.findUnique({
      where: { id: billingItemId },
    });

    if (!billingItem) {
      throw new NotFoundException(`Billing item ${billingItemId} not found`);
    }

    // 3. Calculate price
    const unitPrice = this.calculatePrice(rule, billingItem, dto.eventData);

    // 4. Calculate quantity
    const quantity = this.calculateQuantity(rule, dto.eventData);

    // 5. Calculate gross amount
    let grossAmount = new Decimal(unitPrice).mul(quantity);

    // 6. Apply discount
    if (rule.discountPercentage) {
      const discount = grossAmount.mul(rule.discountPercentage).div(100);
      grossAmount = grossAmount.sub(discount);
    }

    // 7. Apply tax
    if (rule.taxPercentage) {
      const tax = grossAmount.mul(rule.taxPercentage).div(100);
      grossAmount = grossAmount.add(tax);
    }

    // 8. Create the charge
    const charge = await this.chargeService.create(tenantId, {
      patientId: dto.patientId,
      encounterId: dto.encounterId ?? null,
      billingItemId,
      chargeDate: dto.occurredAt ? new Date(dto.occurredAt) : new Date(),
      quantity,
      unitPrice: unitPrice.toNumber(),
      grossAmount: grossAmount.toNumber(),
      discountPercentage: rule.discountPercentage?.toNumber() ?? null,
      discountAmount: rule.discountPercentage
        ? new Decimal(unitPrice).mul(quantity).mul(rule.discountPercentage).div(100).toNumber()
        : null,
      taxPercentage: rule.taxPercentage?.toNumber() ?? null,
      taxAmount: rule.taxPercentage ? grossAmount.mul(rule.taxPercentage).div(100).toNumber() : null,
      status: rule.autoApprove ? 'unbilled' : 'pending_approval',
      sourceType: 'automated' as ChargeSourceType,
      sourceId: rule.id, // Store rule ID for audit trail
      notes: `Auto-posted via rule: ${rule.ruleName}`,
    });

    this.logger.log(
      `Created charge ${charge.id} for ${billingItem.itemName} (${quantity} x ${unitPrice} = ${grossAmount})`,
    );

    return charge;
  }

  /**
   * Resolve billing item ID from rule and event data
   */
  private async resolveBillingItem(
    tenantId: string,
    rule: any,
    dto: ProcessEventDto,
  ): Promise<string | null> {
    // If rule has explicit billing item ID, use it
    if (rule.billingItemId) {
      return rule.billingItemId;
    }

    // Otherwise, look up billing item based on type and event data
    const itemType = rule.billingItemType;
    let code: string | undefined;

    // Extract code from event data based on item type
    switch (itemType) {
      case 'lab_test':
        code = dto.eventData.testCode;
        break;
      case 'medication':
        code = dto.eventData.medicationCode;
        break;
      case 'procedure':
        code = dto.eventData.procedureCode;
        break;
      case 'imaging_study':
        code = dto.eventData.studyCode;
        break;
      case 'consultation':
        code = dto.eventData.consultationType;
        break;
      default:
        this.logger.warn(`Unknown billing item type: ${itemType}`);
        return null;
    }

    if (!code) {
      this.logger.warn(`Could not extract code from event data for item type ${itemType}`);
      return null;
    }

    // Look up billing item by code
    const billingItem = await this.prisma.billingItem.findFirst({
      where: {
        tenantId,
        itemType,
        itemCode: code,
      },
    });

    return billingItem?.id ?? null;
  }

  /**
   * Calculate price based on rule configuration
   */
  private calculatePrice(rule: any, billingItem: any, eventData: Record<string, any>): Decimal {
    switch (rule.priceSource) {
      case 'catalog':
        return new Decimal(billingItem.unitPrice ?? 0);

      case 'custom':
        return rule.basePrice ?? new Decimal(0);

      case 'event':
        // Get price from event data
        const eventPrice = eventData.unitPrice ?? eventData.price;
        return eventPrice ? new Decimal(eventPrice) : new Decimal(billingItem.unitPrice ?? 0);

      default:
        return new Decimal(billingItem.unitPrice ?? 0);
    }
  }

  /**
   * Calculate quantity based on rule configuration
   */
  private calculateQuantity(rule: any, eventData: Record<string, any>): number {
    switch (rule.quantitySource) {
      case 'event':
        return eventData.quantity ?? 1;

      case 'fixed':
        return rule.configuration?.fixedQuantity ?? 1;

      default:
        return eventData.quantity ?? 1;
    }
  }

  /**
   * Create audit record for compliance and debugging
   */
  private async createAuditRecord(
    tenantId: string,
    rule: any,
    charge: any,
    eventId: string,
    dto: ProcessEventDto,
  ) {
    await this.prisma.chargePostingAudit.create({
      data: {
        tenantId,
        chargeId: charge.id,
        eventId,
        ruleId: rule.id,
        conditionsMet: rule.conditions,
        calculationDetails: {
          priceSource: rule.priceSource,
          quantitySource: rule.quantitySource,
          unitPrice: charge.unitPrice,
          quantity: charge.quantity,
          discountPercentage: rule.discountPercentage?.toNumber(),
          taxPercentage: rule.taxPercentage?.toNumber(),
          grossAmount: charge.grossAmount,
        },
        createdAt: new Date(),
      },
    });
  }

  /**
   * Reprocess an existing event (useful for fixing errors or testing)
   */
  async reprocessEvent(tenantId: string, eventId: string) {
    const event = await this.prisma.chargePostingEvent.findFirst({
      where: { id: eventId, tenantId },
    });

    if (!event) {
      throw new NotFoundException(`Event ${eventId} not found`);
    }

    const dto: ProcessEventDto = {
      eventType: event.eventType as EventType,
      eventSource: event.eventSource as EventSource,
      eventId: event.eventId,
      eventData: event.eventData as Record<string, any>,
      patientId: event.patientId,
      encounterId: event.encounterId ?? undefined,
      occurredAt: event.occurredAt,
    };

    return this.processEvent(tenantId, dto);
  }

  // ========================================
  // EVENT QUERY METHODS
  // ========================================

  async findAllEvents(
    tenantId: string,
    filters?: {
      eventType?: EventType;
      processed?: boolean;
      patientId?: string;
      encounterId?: string;
      dateFrom?: Date;
      dateTo?: Date;
    },
  ) {
    const where: any = { tenantId };

    if (filters?.eventType !== undefined) where.eventType = filters.eventType;
    if (filters?.processed !== undefined) where.processed = filters.processed;
    if (filters?.patientId !== undefined) where.patientId = filters.patientId;
    if (filters?.encounterId !== undefined) where.encounterId = filters.encounterId;

    if (filters?.dateFrom || filters?.dateTo) {
      where.occurredAt = {};
      if (filters.dateFrom) where.occurredAt.gte = filters.dateFrom;
      if (filters.dateTo) where.occurredAt.lte = filters.dateTo;
    }

    return this.prisma.chargePostingEvent.findMany({
      where,
      orderBy: { occurredAt: 'desc' },
      take: 100, // Limit to recent events
    });
  }

  async findEventById(tenantId: string, id: string) {
    const event = await this.prisma.chargePostingEvent.findFirst({
      where: { id, tenantId },
      include: {
        auditRecords: {
          include: {
            rule: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }

    return event;
  }

  async findEventsByPatient(tenantId: string, patientId: string) {
    return this.prisma.chargePostingEvent.findMany({
      where: { tenantId, patientId },
      orderBy: { occurredAt: 'desc' },
    });
  }

  async findEventsByEncounter(tenantId: string, encounterId: string) {
    return this.prisma.chargePostingEvent.findMany({
      where: { tenantId, encounterId },
      orderBy: { occurredAt: 'desc' },
    });
  }

  // ========================================
  // AUDIT QUERY METHODS
  // ========================================

  async findAllAuditRecords(
    tenantId: string,
    filters?: {
      ruleId?: string;
      chargeId?: string;
      eventId?: string;
      dateFrom?: Date;
      dateTo?: Date;
    },
  ) {
    const where: any = { tenantId };

    if (filters?.ruleId !== undefined) where.ruleId = filters.ruleId;
    if (filters?.chargeId !== undefined) where.chargeId = filters.chargeId;
    if (filters?.eventId !== undefined) where.eventId = filters.eventId;

    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }

    return this.prisma.chargePostingAudit.findMany({
      where,
      include: {
        rule: true,
        event: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async findAuditByRule(tenantId: string, ruleId: string) {
    return this.prisma.chargePostingAudit.findMany({
      where: { tenantId, ruleId },
      include: {
        event: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async findAuditByCharge(tenantId: string, chargeId: string) {
    return this.prisma.chargePostingAudit.findMany({
      where: { tenantId, chargeId },
      include: {
        rule: true,
        event: true,
      },
    });
  }

  // ========================================
  // STATISTICS METHODS
  // ========================================

  async getRuleStatistics(
    tenantId: string,
    filters?: {
      dateFrom?: Date;
      dateTo?: Date;
    },
  ) {
    const where: any = { tenantId };

    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }

    const auditRecords = await this.prisma.chargePostingAudit.findMany({
      where,
      include: {
        rule: true,
      },
    });

    // Group by rule
    const ruleStats = new Map();

    for (const record of auditRecords) {
      const ruleId = record.ruleId;
      if (!ruleStats.has(ruleId)) {
        ruleStats.set(ruleId, {
          ruleId: record.rule.id,
          ruleName: record.rule.ruleName,
          timesExecuted: 0,
          chargesCreated: 0,
          totalAmount: 0,
        });
      }

      const stats = ruleStats.get(ruleId);
      stats.timesExecuted++;
      stats.chargesCreated++;
      if (record.calculationDetails && record.calculationDetails['grossAmount']) {
        stats.totalAmount += Number(record.calculationDetails['grossAmount']);
      }
    }

    return Array.from(ruleStats.values());
  }

  async getEventStatistics(
    tenantId: string,
    filters?: {
      dateFrom?: Date;
      dateTo?: Date;
    },
  ) {
    const where: any = { tenantId };

    if (filters?.dateFrom || filters?.dateTo) {
      where.occurredAt = {};
      if (filters.dateFrom) where.occurredAt.gte = filters.dateFrom;
      if (filters.dateTo) where.occurredAt.lte = filters.dateTo;
    }

    const events = await this.prisma.chargePostingEvent.findMany({
      where,
    });

    const totalEvents = events.length;
    const processedEvents = events.filter((e) => e.processed).length;
    const totalRulesMatched = events.reduce((sum, e) => sum + e.rulesMatched, 0);
    const totalChargesCreated = events.reduce((sum, e) => sum + e.chargesCreated, 0);

    // Group by event type
    const eventTypeStats = new Map();
    for (const event of events) {
      if (!eventTypeStats.has(event.eventType)) {
        eventTypeStats.set(event.eventType, {
          eventType: event.eventType,
          count: 0,
          chargesCreated: 0,
        });
      }

      const stats = eventTypeStats.get(event.eventType);
      stats.count++;
      stats.chargesCreated += event.chargesCreated;
    }

    return {
      totalEvents,
      processedEvents,
      totalRulesMatched,
      totalChargesCreated,
      averageRulesPerEvent: totalEvents > 0 ? totalRulesMatched / totalEvents : 0,
      averageChargesPerEvent: totalEvents > 0 ? totalChargesCreated / totalEvents : 0,
      byEventType: Array.from(eventTypeStats.values()),
    };
  }
}
