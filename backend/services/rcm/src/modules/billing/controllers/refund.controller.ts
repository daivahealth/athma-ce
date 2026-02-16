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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { RefundService } from '../services/refund.service';
import {
  CreateRefundDto,
  UpdateRefundDto,
  ApproveRefundDto,
  RejectRefundDto,
  ProcessRefundDto,
  VoidRefundDto,
  AllocateRefundDto,
  RefundStatus,
  RefundMethod,
} from '../dto/refund.dto';

@ApiTags('Refunds')
@ApiBearerAuth()
@Controller('refunds')
export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new refund request' })
  @ApiResponse({ status: 201, description: 'Refund created successfully' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Headers('authorization') authHeader: string,
    @Body() dto: CreateRefundDto,
  ) {
    return this.refundService.create(tenantId, dto, userId, authHeader);
  }

  @Get()
  @ApiOperation({ summary: 'Get all refunds for tenant' })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'receiptId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: RefundStatus })
  @ApiQuery({ name: 'refundMethod', required: false, enum: RefundMethod })
  @ApiQuery({ name: 'dateFrom', required: false, type: Date })
  @ApiQuery({ name: 'dateTo', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Refunds retrieved' })
  async findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('authorization') authHeader: string,
    @Headers('x-facility-id') facilityId: string,
    @Headers('x-user-id') userId: string,
    @Query('patientId') patientId?: string,
    @Query('receiptId') receiptId?: string,
    @Query('status') status?: RefundStatus,
    @Query('refundMethod') refundMethod?: RefundMethod,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const filters: any = {};
    if (patientId !== undefined) filters.patientId = patientId;
    if (receiptId !== undefined) filters.receiptId = receiptId;
    if (status !== undefined) filters.status = status;
    if (refundMethod !== undefined) filters.refundMethod = refundMethod;
    if (dateFrom !== undefined) filters.dateFrom = new Date(dateFrom);
    if (dateTo !== undefined) filters.dateTo = new Date(dateTo);

    return this.refundService.findAll(tenantId, filters, authHeader, facilityId, userId);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get refund statistics' })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: Date })
  @ApiQuery({ name: 'dateTo', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStatistics(
    @Headers('x-tenant-id') tenantId: string,
    @Query('patientId') patientId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const filters: any = {};
    if (patientId !== undefined) filters.patientId = patientId;
    if (dateFrom !== undefined) filters.dateFrom = new Date(dateFrom);
    if (dateTo !== undefined) filters.dateTo = new Date(dateTo);

    return this.refundService.getStatistics(tenantId, filters);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get refunds by patient' })
  @ApiResponse({ status: 200, description: 'Refunds retrieved' })
  async findByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.refundService.findByPatient(tenantId, patientId);
  }

  @Get('receipt/:receiptId')
  @ApiOperation({ summary: 'Get refunds by receipt' })
  @ApiResponse({ status: 200, description: 'Refunds retrieved' })
  async findByReceipt(
    @Headers('x-tenant-id') tenantId: string,
    @Param('receiptId') receiptId: string,
  ) {
    return this.refundService.findByReceipt(tenantId, receiptId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get refund by ID' })
  @ApiResponse({ status: 200, description: 'Refund found' })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('authorization') authHeader: string,
    @Headers('x-facility-id') facilityId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
  ) {
    return this.refundService.findById(tenantId, id, authHeader, facilityId, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a pending refund' })
  @ApiResponse({ status: 200, description: 'Refund updated' })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateRefundDto,
  ) {
    return this.refundService.update(tenantId, id, dto);
  }

  @Put(':id/allocate')
  @ApiOperation({ summary: 'Allocate refund to invoices' })
  @ApiResponse({ status: 200, description: 'Refund allocated to invoices' })
  async allocate(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: AllocateRefundDto,
  ) {
    return this.refundService.allocate(tenantId, id, dto);
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve a pending refund' })
  @ApiResponse({ status: 200, description: 'Refund approved' })
  async approve(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: ApproveRefundDto,
  ) {
    return this.refundService.approve(tenantId, id, userId, dto);
  }

  @Put(':id/reject')
  @ApiOperation({ summary: 'Reject a pending refund' })
  @ApiResponse({ status: 200, description: 'Refund rejected' })
  async reject(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: RejectRefundDto,
  ) {
    return this.refundService.reject(tenantId, id, userId, dto);
  }

  @Put(':id/process')
  @ApiOperation({ summary: 'Process an approved refund' })
  @ApiResponse({ status: 200, description: 'Refund processed' })
  async process(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: ProcessRefundDto,
  ) {
    return this.refundService.process(tenantId, id, userId, dto);
  }

  @Put(':id/void')
  @ApiOperation({ summary: 'Void a processed refund' })
  @ApiResponse({ status: 200, description: 'Refund voided' })
  async void(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: VoidRefundDto,
  ) {
    return this.refundService.void(tenantId, id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pending refund' })
  @ApiResponse({ status: 200, description: 'Refund deleted successfully' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.refundService.delete(tenantId, id);
  }
}
