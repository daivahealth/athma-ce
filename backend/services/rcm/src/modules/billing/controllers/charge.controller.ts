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
import { ChargeService } from '../services/charge.service';
import {
  CreateChargeDto,
  UpdateChargeDto,
  ChargeResponseDto,
  ChargeStatus,
  ChargeSourceType,
} from '../dto/charge.dto';
import { Type } from 'class-transformer';

@ApiTags('Charges')
@ApiBearerAuth()
@Controller('charges')
export class ChargeController {
  constructor(private readonly chargeService: ChargeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new charge' })
  @ApiResponse({ status: 201, description: 'Charge created successfully' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateChargeDto,
  ) {
    return this.chargeService.create(tenantId, dto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple charges' })
  @ApiResponse({ status: 201, description: 'Charges created successfully' })
  async createBulk(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dtos: CreateChargeDto[],
  ) {
    return this.chargeService.createBulk(tenantId, dtos);
  }

  @Get()
  @ApiOperation({ summary: 'Get all charges for tenant' })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'encounterId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ChargeStatus })
  @ApiQuery({ name: 'sourceType', required: false, enum: ChargeSourceType })
  @ApiQuery({ name: 'dateFrom', required: false, type: Date })
  @ApiQuery({ name: 'dateTo', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Charges retrieved' })
  async findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query('patientId') patientId?: string,
    @Query('encounterId') encounterId?: string,
    @Query('status') status?: ChargeStatus,
    @Query('sourceType') sourceType?: ChargeSourceType,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const filters: any = {};
    if (patientId !== undefined) filters.patientId = patientId;
    if (encounterId !== undefined) filters.encounterId = encounterId;
    if (status !== undefined) filters.status = status;
    if (sourceType !== undefined) filters.sourceType = sourceType;
    if (dateFrom !== undefined) filters.dateFrom = new Date(dateFrom);
    if (dateTo !== undefined) filters.dateTo = new Date(dateTo);

    return this.chargeService.findAll(tenantId, filters);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get charge statistics' })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'encounterId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStatistics(
    @Headers('x-tenant-id') tenantId: string,
    @Query('patientId') patientId?: string,
    @Query('encounterId') encounterId?: string,
  ) {
    const filters: any = {};
    if (patientId !== undefined) filters.patientId = patientId;
    if (encounterId !== undefined) filters.encounterId = encounterId;

    return this.chargeService.getStatistics(tenantId, filters);
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get charges by encounter' })
  @ApiResponse({ status: 200, description: 'Charges retrieved' })
  async findByEncounter(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.chargeService.findByEncounter(tenantId, encounterId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get charges by patient' })
  @ApiResponse({ status: 200, description: 'Charges retrieved' })
  async findByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.chargeService.findByPatient(tenantId, patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get charge by ID' })
  @ApiResponse({ status: 200, description: 'Charge found' })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.chargeService.findById(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update charge' })
  @ApiResponse({ status: 200, description: 'Charge updated' })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateChargeDto,
  ) {
    return this.chargeService.update(tenantId, id, dto);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel charge' })
  @ApiResponse({ status: 200, description: 'Charge cancelled' })
  async cancel(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.chargeService.cancel(tenantId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete charge' })
  @ApiResponse({ status: 200, description: 'Charge deleted successfully' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.chargeService.delete(tenantId, id);
  }
}
