import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PharmacyStockService } from '../services/pharmacy-stock.service';
import {
  CreatePharmacyStockDto,
  UpdatePharmacyStockDto,
  AdjustPharmacyStockDto,
  PharmacyStockFiltersDto,
} from '../dto/pharmacy-stock.dto';

@ApiTags('Pharmacy Stock')
@ApiBearerAuth()
@Controller('pharmacy/stock')
export class PharmacyStockController {
  constructor(private readonly stockService: PharmacyStockService) {}

  @Get()
  @ApiOperation({ summary: 'List pharmacy stock batches' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by drug name or code (contains)' })
  @ApiQuery({ name: 'drugCode', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'facilityId', required: false })
  @ApiQuery({ name: 'expiringBefore', required: false, description: 'ISO date' })
  @ApiQuery({ name: 'lowStock', required: false, description: 'true to return only low-stock items' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (1-based, default 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default 20, max 100)' })
  @ApiResponse({ status: 200, description: 'Paginated stock list: { data, total, page, limit }' })
  async findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query() filters: PharmacyStockFiltersDto,
  ) {
    return this.stockService.findAll(tenantId, filters);
  }

  @Get('resolve-medication/:medicationId')
  @ApiOperation({ summary: 'Resolve the linked billing item for a medication catalog entry' })
  @ApiQuery({ name: 'facilityId', required: false })
  @ApiResponse({ status: 200, description: 'Returns billingItemId, billingCode, listPrice for the medication' })
  async resolveMedication(
    @Headers('x-tenant-id') tenantId: string,
    @Param('medicationId') medicationId: string,
    @Query('facilityId') facilityId?: string,
  ) {
    return this.stockService.resolveMedication(tenantId, medicationId, facilityId);
  }

  @Get('alerts/low-stock')
  @ApiOperation({ summary: 'Get all stock batches at or below reorder level' })
  @ApiResponse({ status: 200, description: 'Low stock alerts returned' })
  async getLowStockAlerts(@Headers('x-tenant-id') tenantId: string) {
    return this.stockService.getLowStockAlerts(tenantId);
  }

  @Get('alerts/expiring')
  @ApiOperation({ summary: 'Get stock batches expiring within a specified number of days' })
  @ApiQuery({ name: 'days', required: false, description: 'Days until expiry (default: 30)' })
  @ApiResponse({ status: 200, description: 'Expiring stock returned' })
  async getExpiringAlerts(
    @Headers('x-tenant-id') tenantId: string,
    @Query('days') days?: string,
  ) {
    return this.stockService.getExpiringAlerts(tenantId, parseInt(days ?? '30', 10));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get stock batch by ID (includes recent movements)' })
  @ApiResponse({ status: 200, description: 'Stock batch returned' })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.stockService.findById(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Receive new stock batch into pharmacy inventory' })
  @ApiResponse({ status: 201, description: 'Stock received and movement record created' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreatePharmacyStockDto,
  ) {
    return this.stockService.create(tenantId, dto, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update stock batch metadata (storage location, reorder levels, etc.)' })
  @ApiResponse({ status: 200, description: 'Stock batch updated' })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePharmacyStockDto,
  ) {
    return this.stockService.update(tenantId, id, dto, userId);
  }

  @Post(':id/adjust')
  @ApiOperation({ summary: 'Manual stock adjustment (cycle count, write-off, etc.)' })
  @ApiResponse({ status: 200, description: 'Stock adjusted and movement record created' })
  async adjust(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: AdjustPharmacyStockDto,
  ) {
    return this.stockService.adjust(tenantId, id, dto, userId);
  }

  @Post(':id/quarantine')
  @ApiOperation({ summary: 'Mark stock batch as quarantined (recalled or under investigation)' })
  @ApiResponse({ status: 200, description: 'Stock quarantined' })
  async quarantine(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
  ) {
    return this.stockService.quarantine(tenantId, id, userId);
  }
}
