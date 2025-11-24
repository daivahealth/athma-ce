import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ChargePostingService } from '../services/charge-posting.service';
import {
  CreateChargePostingRuleDto,
  UpdateChargePostingRuleDto,
  ProcessEventDto,
  EventType,
  EventSource,
  BillingItemType,
} from '../dto/charge-posting-rule.dto';

@ApiTags('Charge Posting Rules')
@ApiBearerAuth()
@Controller('charge-posting-rules')
export class ChargePostingRuleController {
  constructor(private readonly chargePostingService: ChargePostingService) {}

  // ========================================
  // RULE MANAGEMENT ENDPOINTS
  // ========================================

  @Post()
  @ApiOperation({ summary: 'Create a new charge posting rule' })
  @ApiResponse({ status: 201, description: 'Rule created successfully' })
  async createRule(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateChargePostingRuleDto,
  ) {
    return this.chargePostingService.createRule(tenantId, dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all charge posting rules for tenant' })
  @ApiQuery({ name: 'eventType', required: false, enum: EventType })
  @ApiQuery({ name: 'eventSource', required: false, enum: EventSource })
  @ApiQuery({ name: 'billingItemType', required: false, enum: BillingItemType })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Rules retrieved' })
  async findAllRules(
    @Headers('x-tenant-id') tenantId: string,
    @Query('eventType') eventType?: EventType,
    @Query('eventSource') eventSource?: EventSource,
    @Query('billingItemType') billingItemType?: BillingItemType,
    @Query('isActive') isActive?: string,
  ) {
    const filters: any = {};
    if (eventType !== undefined) filters.eventType = eventType;
    if (eventSource !== undefined) filters.eventSource = eventSource;
    if (billingItemType !== undefined) filters.billingItemType = billingItemType;
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    return this.chargePostingService.findAllRules(tenantId, filters);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active charge posting rules' })
  @ApiQuery({ name: 'eventType', required: false, enum: EventType })
  @ApiResponse({ status: 200, description: 'Active rules retrieved' })
  async findActiveRules(
    @Headers('x-tenant-id') tenantId: string,
    @Query('eventType') eventType?: EventType,
  ) {
    const filters: any = { isActive: true };
    if (eventType !== undefined) filters.eventType = eventType;

    return this.chargePostingService.findAllRules(tenantId, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get charge posting rule by ID' })
  @ApiResponse({ status: 200, description: 'Rule found' })
  async findRuleById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.chargePostingService.findRuleById(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update charge posting rule' })
  @ApiResponse({ status: 200, description: 'Rule updated' })
  async updateRule(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateChargePostingRuleDto,
  ) {
    return this.chargePostingService.updateRule(tenantId, id, dto, userId);
  }

  @Put(':id/activate')
  @ApiOperation({ summary: 'Activate charge posting rule' })
  @ApiResponse({ status: 200, description: 'Rule activated' })
  async activateRule(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
  ) {
    return this.chargePostingService.setRuleActive(tenantId, id, true, userId);
  }

  @Put(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate charge posting rule' })
  @ApiResponse({ status: 200, description: 'Rule deactivated' })
  async deactivateRule(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
  ) {
    return this.chargePostingService.setRuleActive(tenantId, id, false, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete charge posting rule' })
  @ApiResponse({ status: 200, description: 'Rule deleted successfully' })
  async deleteRule(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.chargePostingService.deleteRule(tenantId, id);
  }

  // ========================================
  // EVENT PROCESSING ENDPOINTS
  // ========================================

  @Post('process-event')
  @ApiOperation({ summary: 'Process a clinical event and create charges based on rules' })
  @ApiResponse({ status: 201, description: 'Event processed successfully' })
  async processEvent(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: ProcessEventDto,
  ) {
    return this.chargePostingService.processEvent(tenantId, dto);
  }

  @Post('events/:eventId/reprocess')
  @ApiOperation({ summary: 'Reprocess an existing event' })
  @ApiResponse({ status: 200, description: 'Event reprocessed successfully' })
  async reprocessEvent(
    @Headers('x-tenant-id') tenantId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.chargePostingService.reprocessEvent(tenantId, eventId);
  }

  // ========================================
  // EVENT QUERY ENDPOINTS
  // ========================================

  @Get('events/all')
  @ApiOperation({ summary: 'Get all charge posting events' })
  @ApiQuery({ name: 'eventType', required: false, enum: EventType })
  @ApiQuery({ name: 'processed', required: false, type: Boolean })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'encounterId', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: Date })
  @ApiQuery({ name: 'dateTo', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Events retrieved' })
  async findAllEvents(
    @Headers('x-tenant-id') tenantId: string,
    @Query('eventType') eventType?: EventType,
    @Query('processed') processed?: string,
    @Query('patientId') patientId?: string,
    @Query('encounterId') encounterId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const filters: any = {};
    if (eventType !== undefined) filters.eventType = eventType;
    if (processed !== undefined) filters.processed = processed === 'true';
    if (patientId !== undefined) filters.patientId = patientId;
    if (encounterId !== undefined) filters.encounterId = encounterId;
    if (dateFrom !== undefined) filters.dateFrom = new Date(dateFrom);
    if (dateTo !== undefined) filters.dateTo = new Date(dateTo);

    return this.chargePostingService.findAllEvents(tenantId, filters);
  }

  @Get('events/:id')
  @ApiOperation({ summary: 'Get charge posting event by ID' })
  @ApiResponse({ status: 200, description: 'Event found' })
  async findEventById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.chargePostingService.findEventById(tenantId, id);
  }

  @Get('events/patient/:patientId')
  @ApiOperation({ summary: 'Get events by patient' })
  @ApiResponse({ status: 200, description: 'Events retrieved' })
  async findEventsByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.chargePostingService.findEventsByPatient(tenantId, patientId);
  }

  @Get('events/encounter/:encounterId')
  @ApiOperation({ summary: 'Get events by encounter' })
  @ApiResponse({ status: 200, description: 'Events retrieved' })
  async findEventsByEncounter(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.chargePostingService.findEventsByEncounter(tenantId, encounterId);
  }

  // ========================================
  // AUDIT QUERY ENDPOINTS
  // ========================================

  @Get('audit/all')
  @ApiOperation({ summary: 'Get all charge posting audit records' })
  @ApiQuery({ name: 'ruleId', required: false, type: String })
  @ApiQuery({ name: 'chargeId', required: false, type: String })
  @ApiQuery({ name: 'eventId', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: Date })
  @ApiQuery({ name: 'dateTo', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Audit records retrieved' })
  async findAllAuditRecords(
    @Headers('x-tenant-id') tenantId: string,
    @Query('ruleId') ruleId?: string,
    @Query('chargeId') chargeId?: string,
    @Query('eventId') eventId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const filters: any = {};
    if (ruleId !== undefined) filters.ruleId = ruleId;
    if (chargeId !== undefined) filters.chargeId = chargeId;
    if (eventId !== undefined) filters.eventId = eventId;
    if (dateFrom !== undefined) filters.dateFrom = new Date(dateFrom);
    if (dateTo !== undefined) filters.dateTo = new Date(dateTo);

    return this.chargePostingService.findAllAuditRecords(tenantId, filters);
  }

  @Get('audit/rule/:ruleId')
  @ApiOperation({ summary: 'Get audit records for a specific rule' })
  @ApiResponse({ status: 200, description: 'Audit records retrieved' })
  async findAuditByRule(
    @Headers('x-tenant-id') tenantId: string,
    @Param('ruleId') ruleId: string,
  ) {
    return this.chargePostingService.findAuditByRule(tenantId, ruleId);
  }

  @Get('audit/charge/:chargeId')
  @ApiOperation({ summary: 'Get audit records for a specific charge' })
  @ApiResponse({ status: 200, description: 'Audit records retrieved' })
  async findAuditByCharge(
    @Headers('x-tenant-id') tenantId: string,
    @Param('chargeId') chargeId: string,
  ) {
    return this.chargePostingService.findAuditByCharge(tenantId, chargeId);
  }

  // ========================================
  // STATISTICS ENDPOINTS
  // ========================================

  @Get('statistics/rules')
  @ApiOperation({ summary: 'Get rule execution statistics' })
  @ApiQuery({ name: 'dateFrom', required: false, type: Date })
  @ApiQuery({ name: 'dateTo', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getRuleStatistics(
    @Headers('x-tenant-id') tenantId: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const filters: any = {};
    if (dateFrom !== undefined) filters.dateFrom = new Date(dateFrom);
    if (dateTo !== undefined) filters.dateTo = new Date(dateTo);

    return this.chargePostingService.getRuleStatistics(tenantId, filters);
  }

  @Get('statistics/events')
  @ApiOperation({ summary: 'Get event processing statistics' })
  @ApiQuery({ name: 'dateFrom', required: false, type: Date })
  @ApiQuery({ name: 'dateTo', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getEventStatistics(
    @Headers('x-tenant-id') tenantId: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const filters: any = {};
    if (dateFrom !== undefined) filters.dateFrom = new Date(dateFrom);
    if (dateTo !== undefined) filters.dateTo = new Date(dateTo);

    return this.chargePostingService.getEventStatistics(tenantId, filters);
  }
}
