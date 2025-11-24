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
import { ReceiptService } from '../services/receipt.service';
import {
  CreateReceiptDto,
  UpdateReceiptDto,
  AllocateReceiptDto,
  PaymentMethod,
} from '../dto/receipt.dto';

@ApiTags('Receipts')
@ApiBearerAuth()
@Controller('receipts')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new receipt with optional allocations' })
  @ApiResponse({ status: 201, description: 'Receipt created successfully' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateReceiptDto,
  ) {
    return this.receiptService.create(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all receipts for tenant' })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'invoiceId', required: false, type: String })
  @ApiQuery({ name: 'paymentMethod', required: false, enum: PaymentMethod })
  @ApiQuery({ name: 'dateFrom', required: false, type: Date })
  @ApiQuery({ name: 'dateTo', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Receipts retrieved' })
  async findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query('patientId') patientId?: string,
    @Query('invoiceId') invoiceId?: string,
    @Query('paymentMethod') paymentMethod?: PaymentMethod,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const filters: any = {};
    if (patientId !== undefined) filters.patientId = patientId;
    if (invoiceId !== undefined) filters.invoiceId = invoiceId;
    if (paymentMethod !== undefined) filters.paymentMethod = paymentMethod;
    if (dateFrom !== undefined) filters.dateFrom = new Date(dateFrom);
    if (dateTo !== undefined) filters.dateTo = new Date(dateTo);

    return this.receiptService.findAll(tenantId, filters);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get receipt statistics' })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStatistics(
    @Headers('x-tenant-id') tenantId: string,
    @Query('patientId') patientId?: string,
  ) {
    const filters: any = {};
    if (patientId !== undefined) filters.patientId = patientId;

    return this.receiptService.getStatistics(tenantId, filters);
  }

  @Get('number/:receiptNumber')
  @ApiOperation({ summary: 'Get receipt by receipt number' })
  @ApiResponse({ status: 200, description: 'Receipt found' })
  async findByReceiptNumber(
    @Headers('x-tenant-id') tenantId: string,
    @Param('receiptNumber') receiptNumber: string,
  ) {
    return this.receiptService.findByReceiptNumber(tenantId, receiptNumber);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get receipts by patient' })
  @ApiResponse({ status: 200, description: 'Receipts retrieved' })
  async findByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.receiptService.findByPatient(tenantId, patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get receipt by ID' })
  @ApiResponse({ status: 200, description: 'Receipt found' })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.receiptService.findById(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update receipt' })
  @ApiResponse({ status: 200, description: 'Receipt updated' })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateReceiptDto,
  ) {
    return this.receiptService.update(tenantId, id, dto);
  }

  @Put(':id/allocate')
  @ApiOperation({ summary: 'Allocate receipt to invoices' })
  @ApiResponse({ status: 200, description: 'Receipt allocated to invoices' })
  async allocate(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: AllocateReceiptDto,
  ) {
    return this.receiptService.allocate(tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete receipt' })
  @ApiResponse({ status: 200, description: 'Receipt deleted successfully' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.receiptService.delete(tenantId, id);
  }
}
