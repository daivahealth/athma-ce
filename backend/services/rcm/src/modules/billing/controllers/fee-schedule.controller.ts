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
import { FeeScheduleService } from '../services/fee-schedule.service';
import {
  CreateFeeScheduleDto,
  UpdateFeeScheduleDto,
  CreateFeeScheduleItemDto,
  UpdateFeeScheduleItemDto,
  FeeScheduleType,
  FeeScheduleStatus,
  AuthorityCode,
  FeeScheduleCodeType,
  FeeScheduleQueryDto,
  FeeScheduleItemQueryDto,
  PriceLookupDto,
  BulkCreateFeeScheduleItemsDto,
} from '../dto/fee-schedule.dto';

@ApiTags('Fee Schedules')
@ApiBearerAuth()
@Controller('fee-schedules')
export class FeeScheduleController {
  constructor(private readonly feeScheduleService: FeeScheduleService) {}

  // ==================== FEE SCHEDULE ENDPOINTS ====================

  @Post()
  @ApiOperation({ summary: 'Create a new fee schedule' })
  @ApiResponse({ status: 201, description: 'Fee schedule created successfully' })
  async createFeeSchedule(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateFeeScheduleDto,
  ) {
    return this.feeScheduleService.createFeeSchedule(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all fee schedules' })
  @ApiQuery({ name: 'scheduleType', required: false, enum: FeeScheduleType })
  @ApiQuery({ name: 'status', required: false, enum: FeeScheduleStatus })
  @ApiQuery({ name: 'authorityCode', required: false, enum: AuthorityCode })
  @ApiQuery({ name: 'effectiveDate', required: false, type: Date, description: 'Filter by effective date (ISO 8601 format)' })
  @ApiResponse({ status: 200, description: 'Fee schedules retrieved' })
  async findAllFeeSchedules(
    @Headers('x-tenant-id') tenantId: string,
    @Query('scheduleType') scheduleType?: FeeScheduleType,
    @Query('status') status?: FeeScheduleStatus,
    @Query('authorityCode') authorityCode?: AuthorityCode,
    @Query('effectiveDate') effectiveDate?: string,
  ) {
    const filters: FeeScheduleQueryDto = {};
    if (scheduleType !== undefined) filters.scheduleType = scheduleType;
    if (status !== undefined) filters.status = status;
    if (authorityCode !== undefined) filters.authorityCode = authorityCode;
    if (effectiveDate !== undefined) filters.effectiveDate = new Date(effectiveDate);

    return this.feeScheduleService.findAllFeeSchedules(tenantId, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get fee schedule by ID' })
  @ApiResponse({ status: 200, description: 'Fee schedule found' })
  async findFeeScheduleById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.feeScheduleService.findFeeScheduleById(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update fee schedule' })
  @ApiResponse({ status: 200, description: 'Fee schedule updated' })
  async updateFeeSchedule(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateFeeScheduleDto,
  ) {
    return this.feeScheduleService.updateFeeSchedule(tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete fee schedule' })
  @ApiResponse({ status: 200, description: 'Fee schedule deleted successfully' })
  async deleteFeeSchedule(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.feeScheduleService.deleteFeeSchedule(tenantId, id);
  }

  // ==================== FEE SCHEDULE ITEM ENDPOINTS ====================

  @Post('items')
  @ApiOperation({ summary: 'Create a new fee schedule item' })
  @ApiResponse({ status: 201, description: 'Fee schedule item created successfully' })
  async createFeeScheduleItem(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateFeeScheduleItemDto,
  ) {
    return this.feeScheduleService.createFeeScheduleItem(tenantId, dto);
  }

  @Post('items/bulk')
  @ApiOperation({ summary: 'Bulk create fee schedule items' })
  @ApiResponse({ status: 201, description: 'Fee schedule items created successfully' })
  async bulkCreateFeeScheduleItems(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: BulkCreateFeeScheduleItemsDto,
  ) {
    return this.feeScheduleService.bulkCreateFeeScheduleItems(tenantId, dto);
  }

  @Get(':feeScheduleId/items')
  @ApiOperation({ summary: 'Get all items for a fee schedule' })
  @ApiQuery({ name: 'code', required: false, type: String, description: 'Filter by code' })
  @ApiQuery({ name: 'codeType', required: false, enum: FeeScheduleCodeType, description: 'Filter by code type' })
  @ApiQuery({ name: 'serviceGroup', required: false, type: String, description: 'Filter by service group' })
  @ApiResponse({ status: 200, description: 'Fee schedule items retrieved' })
  async findFeeScheduleItems(
    @Param('feeScheduleId') feeScheduleId: string,
    @Query('code') code?: string,
    @Query('codeType') codeType?: FeeScheduleCodeType,
    @Query('serviceGroup') serviceGroup?: string,
  ) {
    const filters: FeeScheduleItemQueryDto = {};
    if (code !== undefined) filters.code = code;
    if (codeType !== undefined) filters.codeType = codeType;
    if (serviceGroup !== undefined) filters.serviceGroup = serviceGroup;

    return this.feeScheduleService.findFeeScheduleItems(feeScheduleId, filters);
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Get fee schedule item by ID' })
  @ApiResponse({ status: 200, description: 'Fee schedule item found' })
  async findFeeScheduleItemById(@Param('id') id: string) {
    return this.feeScheduleService.findFeeScheduleItemById(id);
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Update fee schedule item' })
  @ApiResponse({ status: 200, description: 'Fee schedule item updated' })
  async updateFeeScheduleItem(
    @Param('id') id: string,
    @Body() dto: UpdateFeeScheduleItemDto,
  ) {
    return this.feeScheduleService.updateFeeScheduleItem(id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete fee schedule item' })
  @ApiResponse({ status: 200, description: 'Fee schedule item deleted successfully' })
  async deleteFeeScheduleItem(@Param('id') id: string) {
    return this.feeScheduleService.deleteFeeScheduleItem(id);
  }

  // ==================== PRICE LOOKUP ENDPOINTS ====================

  @Post('lookup-price')
  @ApiOperation({ summary: 'Lookup price for a billing code with hierarchical resolution' })
  @ApiResponse({ status: 200, description: 'Price found' })
  @ApiResponse({ status: 404, description: 'Price not found' })
  async lookupPrice(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: PriceLookupDto,
  ) {
    const result = await this.feeScheduleService.lookupPrice(tenantId, dto);
    if (!result) {
      return {
        message: `Price not found for code ${dto.code} (${dto.codeType})`,
        code: dto.code,
        codeType: dto.codeType,
      };
    }
    return result;
  }

  @Get('price/:codeType/:code')
  @ApiOperation({ summary: 'Get price for a billing code (simple lookup)' })
  @ApiQuery({ name: 'effectiveDate', required: false, type: Date, description: 'Effective date for price lookup (ISO 8601 format)' })
  @ApiResponse({ status: 200, description: 'Price found' })
  async getPriceForCode(
    @Headers('x-tenant-id') tenantId: string,
    @Param('codeType') codeType: FeeScheduleCodeType,
    @Param('code') code: string,
    @Query('effectiveDate') effectiveDate?: string,
  ) {
    const date = effectiveDate ? new Date(effectiveDate) : undefined;
    const price = await this.feeScheduleService.getPriceForCode(tenantId, code, codeType, date);

    if (price === null) {
      return {
        message: `Price not found for code ${code} (${codeType})`,
        code,
        codeType,
        price: null,
      };
    }

    return {
      code,
      codeType,
      price,
      currency: 'AED',
    };
  }
}
