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
import { PayerContractService } from '../services/payer-contract.service';
import {
  CreatePayerContractDto,
  UpdatePayerContractDto,
  CreatePayerContractAdjustmentDto,
  UpdatePayerContractAdjustmentDto,
  BulkCreatePayerContractAdjustmentsDto,
  PayerContractQueryDto,
  PayerContractAdjustmentQueryDto,
  CalculateContractPriceDto,
  ContractStatus,
  ContractType,
  AuthorityCode,
} from '../dto/payer-contract.dto';

@ApiTags('Payer Contracts')
@ApiBearerAuth()
@Controller('payer-contracts')
export class PayerContractController {
  constructor(private readonly payerContractService: PayerContractService) {}

  // ==================== PAYER CONTRACT ENDPOINTS ====================

  @Post()
  @ApiOperation({ summary: 'Create a new payer contract' })
  @ApiResponse({ status: 201, description: 'Contract created successfully' })
  async createContract(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreatePayerContractDto,
  ) {
    return this.payerContractService.createContract(tenantId, dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payer contracts' })
  @ApiQuery({ name: 'payerId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ContractStatus })
  @ApiQuery({ name: 'contractType', required: false, enum: ContractType })
  @ApiQuery({ name: 'authorityCode', required: false, enum: AuthorityCode })
  @ApiQuery({ name: 'planCode', required: false, type: String })
  @ApiQuery({ name: 'networkType', required: false, type: String })
  @ApiQuery({ name: 'effectiveDate', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Contracts retrieved' })
  async findAllContracts(
    @Headers('x-tenant-id') tenantId: string,
    @Query('payerId') payerId?: string,
    @Query('status') status?: ContractStatus,
    @Query('contractType') contractType?: ContractType,
    @Query('authorityCode') authorityCode?: AuthorityCode,
    @Query('planCode') planCode?: string,
    @Query('networkType') networkType?: string,
    @Query('effectiveDate') effectiveDate?: string,
  ) {
    const filters: PayerContractQueryDto = {};
    if (payerId) filters.payerId = payerId;
    if (status) filters.status = status;
    if (contractType) filters.contractType = contractType;
    if (authorityCode) filters.authorityCode = authorityCode;
    if (planCode) filters.planCode = planCode;
    if (networkType) filters.networkType = networkType;
    if (effectiveDate) filters.effectiveDate = effectiveDate;

    return this.payerContractService.findAllContracts(tenantId, filters);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get contract statistics' })
  @ApiQuery({ name: 'payerId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStatistics(
    @Headers('x-tenant-id') tenantId: string,
    @Query('payerId') payerId?: string,
  ) {
    return this.payerContractService.getContractStatistics(tenantId, payerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contract by ID' })
  @ApiResponse({ status: 200, description: 'Contract found' })
  async findContractById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.payerContractService.findContractById(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update contract' })
  @ApiResponse({ status: 200, description: 'Contract updated' })
  async updateContract(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePayerContractDto,
  ) {
    return this.payerContractService.updateContract(tenantId, id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete (deactivate) contract' })
  @ApiResponse({ status: 200, description: 'Contract deactivated successfully' })
  async deleteContract(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.payerContractService.deleteContract(tenantId, id);
  }

  // ==================== PAYER CONTRACT ADJUSTMENT ENDPOINTS ====================

  @Post('adjustments')
  @ApiOperation({ summary: 'Create a new contract adjustment' })
  @ApiResponse({ status: 201, description: 'Adjustment created successfully' })
  async createAdjustment(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreatePayerContractAdjustmentDto,
  ) {
    return this.payerContractService.createAdjustment(tenantId, dto, userId);
  }

  @Post('adjustments/bulk')
  @ApiOperation({ summary: 'Bulk create contract adjustments' })
  @ApiResponse({ status: 201, description: 'Adjustments created successfully' })
  async bulkCreateAdjustments(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: BulkCreatePayerContractAdjustmentsDto,
  ) {
    return this.payerContractService.bulkCreateAdjustments(tenantId, dto, userId);
  }

  @Get(':contractId/adjustments')
  @ApiOperation({ summary: 'Get all adjustments for a contract' })
  @ApiQuery({ name: 'serviceGroup', required: false, type: String })
  @ApiQuery({ name: 'billingItemId', required: false, type: String })
  @ApiQuery({ name: 'feeScheduleItemId', required: false, type: String })
  @ApiQuery({ name: 'effectiveDate', required: false, type: Date })
  @ApiQuery({ name: 'includeExclusions', required: false, type: Boolean, description: 'Include exclusion rules' })
  @ApiResponse({ status: 200, description: 'Adjustments retrieved' })
  async findAdjustments(
    @Param('contractId') contractId: string,
    @Query('serviceGroup') serviceGroup?: string,
    @Query('billingItemId') billingItemId?: string,
    @Query('feeScheduleItemId') feeScheduleItemId?: string,
    @Query('effectiveDate') effectiveDate?: string,
    @Query('includeExclusions') includeExclusions?: boolean,
  ) {
    const filters: PayerContractAdjustmentQueryDto = {};
    if (serviceGroup) filters.serviceGroup = serviceGroup;
    if (billingItemId) filters.billingItemId = billingItemId;
    if (feeScheduleItemId) filters.feeScheduleItemId = feeScheduleItemId;
    if (effectiveDate) filters.effectiveDate = effectiveDate;
    if (includeExclusions !== undefined) filters.includeExclusions = includeExclusions;

    return this.payerContractService.findAdjustments(contractId, filters);
  }

  @Get('adjustments/:id')
  @ApiOperation({ summary: 'Get adjustment by ID' })
  @ApiResponse({ status: 200, description: 'Adjustment found' })
  async findAdjustmentById(@Param('id') id: string) {
    return this.payerContractService.findAdjustmentById(id);
  }

  @Put('adjustments/:id')
  @ApiOperation({ summary: 'Update adjustment' })
  @ApiResponse({ status: 200, description: 'Adjustment updated' })
  async updateAdjustment(
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePayerContractAdjustmentDto,
  ) {
    return this.payerContractService.updateAdjustment(id, dto, userId);
  }

  @Delete('adjustments/:id')
  @ApiOperation({ summary: 'Delete adjustment' })
  @ApiResponse({ status: 200, description: 'Adjustment deleted successfully' })
  async deleteAdjustment(@Param('id') id: string) {
    return this.payerContractService.deleteAdjustment(id);
  }

  // ==================== PRICE CALCULATION ENDPOINTS ====================

  @Post('calculate-price')
  @ApiOperation({
    summary: 'Calculate contract price for a billing code',
    description: 'Calculates the final price based on contract terms and adjustments',
  })
  @ApiResponse({ status: 200, description: 'Price calculated successfully' })
  async calculatePrice(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CalculateContractPriceDto,
  ) {
    return this.payerContractService.calculateContractPrice(tenantId, dto);
  }
}
