import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SubscriptionService } from '../services/subscription.service';
import { RecurringBillingService } from '../services/recurring-billing.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  ChangePlanDto,
  CancelSubscriptionDto,
  RenewSubscriptionDto,
  RecordBenefitUsageDto,
  SubscriptionResponseDto,
  SubscriptionSummaryDto,
  BenefitUsageResponseDto,
  SubscriptionInvoiceResponseDto,
  SubscriptionStatus,
  MembershipDashboardDto,
} from '../dto/subscription.dto';
import { JwtAuthGuard, PermissionsGuard } from '@zeal/shared-utils';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@Controller('membership/subscriptions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly billingService: RecurringBillingService,
  ) {}

  // ============================================
  // Subscription CRUD
  // ============================================

  @Post()
  @ApiOperation({ summary: 'Create a new subscription (enroll patient)' })
  @ApiResponse({ status: 201, type: SubscriptionResponseDto })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.subscriptionService.create(tenantId, userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all subscriptions' })
  @ApiQuery({ name: 'status', required: false, enum: SubscriptionStatus })
  @ApiQuery({ name: 'planId', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, type: [SubscriptionSummaryDto] })
  async findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query('status') status?: SubscriptionStatus,
    @Query('planId') planId?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.subscriptionService.findAll(tenantId, {
      status,
      planId,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get subscriptions for a patient' })
  @ApiResponse({ status: 200, type: [SubscriptionSummaryDto] })
  async findByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.subscriptionService.findByPatient(tenantId, patientId);
  }

  @Get('patient/:patientId/active')
  @ApiOperation({ summary: 'Get active subscription for a patient' })
  @ApiResponse({ status: 200, type: SubscriptionResponseDto })
  async findActiveByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.subscriptionService.findActiveByPatient(tenantId, patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a subscription by ID' })
  @ApiResponse({ status: 200, type: SubscriptionResponseDto })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.subscriptionService.findById(tenantId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subscription' })
  @ApiResponse({ status: 200, type: SubscriptionResponseDto })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionService.update(tenantId, id, dto);
  }

  // ============================================
  // Subscription Actions
  // ============================================

  @Post(':id/change-plan')
  @ApiOperation({ summary: 'Change subscription plan (upgrade/downgrade)' })
  @ApiResponse({ status: 200, type: SubscriptionResponseDto })
  async changePlan(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: ChangePlanDto,
  ) {
    return this.subscriptionService.changePlan(tenantId, id, dto);
  }

  @Post(':id/pause')
  @ApiOperation({ summary: 'Pause a subscription' })
  @ApiResponse({ status: 200, type: SubscriptionResponseDto })
  async pause(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.subscriptionService.pause(tenantId, id);
  }

  @Post(':id/resume')
  @ApiOperation({ summary: 'Resume a paused subscription' })
  @ApiResponse({ status: 200, type: SubscriptionResponseDto })
  async resume(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.subscriptionService.resume(tenantId, id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a subscription' })
  @ApiResponse({ status: 200, type: SubscriptionResponseDto })
  async cancel(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: CancelSubscriptionDto,
  ) {
    return this.subscriptionService.cancel(tenantId, id, dto);
  }

  @Post(':id/renew')
  @ApiOperation({ summary: 'Manually renew a subscription' })
  @ApiResponse({ status: 200, type: SubscriptionResponseDto })
  async renew(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: RenewSubscriptionDto,
  ) {
    return this.subscriptionService.renew(tenantId, id, dto);
  }

  // ============================================
  // Benefit Usage
  // ============================================

  @Post('benefits/record')
  @ApiOperation({ summary: 'Record benefit usage' })
  @ApiResponse({ status: 201, type: BenefitUsageResponseDto })
  async recordBenefitUsage(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: RecordBenefitUsageDto,
  ) {
    return this.subscriptionService.recordBenefitUsage(
      tenantId,
      dto.subscriptionId,
      dto.benefitId,
      {
        serviceCode: dto.serviceCode,
        encounterId: dto.encounterId,
        quantity: dto.quantity,
        notes: dto.notes,
      },
    );
  }

  @Get(':id/benefits/usage')
  @ApiOperation({ summary: 'Get benefit usage history' })
  @ApiQuery({ name: 'benefitId', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: [BenefitUsageResponseDto] })
  async getBenefitUsage(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Query('benefitId') benefitId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.subscriptionService.getBenefitUsageHistory(tenantId, id, {
      benefitId,
      limit: limit ? Number(limit) : undefined,
    });
  }

  // ============================================
  // Invoices
  // ============================================

  @Get(':id/invoices')
  @ApiOperation({ summary: 'Get invoices for a subscription' })
  @ApiResponse({ status: 200, type: [SubscriptionInvoiceResponseDto] })
  async getInvoices(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.subscriptionService.getInvoices(tenantId, id);
  }

  @Post('invoices/:invoiceId/mark-paid')
  @ApiOperation({ summary: 'Mark an invoice as paid' })
  @ApiResponse({ status: 200, type: SubscriptionInvoiceResponseDto })
  async markInvoicePaid(
    @Headers('x-tenant-id') tenantId: string,
    @Param('invoiceId') invoiceId: string,
    @Body() body: { paymentMethod: string },
  ) {
    return this.subscriptionService.markInvoicePaid(tenantId, invoiceId, body.paymentMethod);
  }

  // ============================================
  // Dashboard & Reports
  // ============================================

  @Get('dashboard/overview')
  @ApiOperation({ summary: 'Get membership dashboard' })
  @ApiResponse({ status: 200, type: MembershipDashboardDto })
  async getDashboard(
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.billingService.getBillingDashboard(tenantId);
  }

  @Get('dashboard/upcoming-renewals')
  @ApiOperation({ summary: 'Get upcoming renewals' })
  @ApiQuery({ name: 'daysAhead', required: false, type: Number })
  async getUpcomingRenewals(
    @Headers('x-tenant-id') tenantId: string,
    @Query('daysAhead') daysAhead?: number,
  ) {
    return this.billingService.getUpcomingRenewals(
      tenantId,
      daysAhead ? Number(daysAhead) : undefined,
    );
  }
}
