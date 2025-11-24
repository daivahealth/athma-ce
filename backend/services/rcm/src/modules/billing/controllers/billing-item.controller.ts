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
import { BillingItemService } from '../services/billing-item.service';
import {
  CreateBillingItemDto,
  UpdateBillingItemDto,
  BillingItemResponseDto,
  ItemType,
  ChargeType,
  BillingCodeType,
} from '../dto/billing-item.dto';

@ApiTags('Billing Items')
@ApiBearerAuth()
@Controller('billing-items')
export class BillingItemController {
  constructor(private readonly billingItemService: BillingItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new billing item' })
  @ApiResponse({ status: 201, description: 'Billing item created successfully' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateBillingItemDto,
  ) {
    return this.billingItemService.create(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all billing items for tenant' })
  @ApiQuery({ name: 'itemType', required: false, enum: ItemType })
  @ApiQuery({ name: 'chargeType', required: false, enum: ChargeType })
  @ApiQuery({ name: 'billingCodeType', required: false, enum: BillingCodeType })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'includeGlobal', required: false, type: Boolean, description: 'Include global items (tenantId = null)' })
  @ApiResponse({ status: 200, description: 'Billing items retrieved' })
  async findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query('itemType') itemType?: ItemType,
    @Query('chargeType') chargeType?: ChargeType,
    @Query('billingCodeType') billingCodeType?: BillingCodeType,
    @Query('isActive') isActive?: boolean,
    @Query('includeGlobal') includeGlobal?: boolean,
  ) {
    const filters: {
      itemType?: ItemType;
      chargeType?: ChargeType;
      billingCodeType?: BillingCodeType;
      isActive?: boolean;
      includeGlobal?: boolean;
    } = {};

    if (itemType !== undefined) filters.itemType = itemType;
    if (chargeType !== undefined) filters.chargeType = chargeType;
    if (billingCodeType !== undefined) filters.billingCodeType = billingCodeType;
    if (isActive !== undefined) filters.isActive = isActive;
    if (includeGlobal !== undefined) filters.includeGlobal = includeGlobal;

    return this.billingItemService.findAll(tenantId, filters);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get billing item statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStatistics(
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.billingItemService.getStatistics(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get billing item by ID' })
  @ApiResponse({ status: 200, description: 'Billing item found' })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.billingItemService.findById(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update billing item' })
  @ApiResponse({ status: 200, description: 'Billing item updated' })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBillingItemDto,
  ) {
    return this.billingItemService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete (soft delete) billing item' })
  @ApiResponse({ status: 200, description: 'Billing item soft deleted successfully' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.billingItemService.delete(tenantId, id);
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Permanently delete billing item' })
  @ApiResponse({ status: 200, description: 'Billing item permanently deleted' })
  async hardDelete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.billingItemService.hardDelete(tenantId, id);
  }
}
