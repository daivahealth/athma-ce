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
import { InvoiceService } from '../services/invoice.service';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceStatus,
  RecordPaymentDto,
  UpdateInvoiceStatusDto,
} from '../dto/invoice.dto';

@ApiTags('Invoices')
@ApiBearerAuth()
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice with lines' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateInvoiceDto,
  ) {
    return this.invoiceService.create(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices for tenant' })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'encounterId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: InvoiceStatus })
  @ApiQuery({ name: 'dateFrom', required: false, type: Date })
  @ApiQuery({ name: 'dateTo', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Invoices retrieved' })
  async findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query('patientId') patientId?: string,
    @Query('encounterId') encounterId?: string,
    @Query('status') status?: InvoiceStatus,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const filters: any = {};
    if (patientId !== undefined) filters.patientId = patientId;
    if (encounterId !== undefined) filters.encounterId = encounterId;
    if (status !== undefined) filters.status = status;
    if (dateFrom !== undefined) filters.dateFrom = new Date(dateFrom);
    if (dateTo !== undefined) filters.dateTo = new Date(dateTo);

    return this.invoiceService.findAll(tenantId, filters);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get invoice statistics' })
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

    return this.invoiceService.getStatistics(tenantId, filters);
  }

  @Get('number/:invoiceNumber')
  @ApiOperation({ summary: 'Get invoice by invoice number' })
  @ApiResponse({ status: 200, description: 'Invoice found' })
  async findByInvoiceNumber(
    @Headers('x-tenant-id') tenantId: string,
    @Param('invoiceNumber') invoiceNumber: string,
  ) {
    return this.invoiceService.findByInvoiceNumber(tenantId, invoiceNumber);
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get invoices by encounter' })
  @ApiResponse({ status: 200, description: 'Invoices retrieved' })
  async findByEncounter(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.invoiceService.findByEncounter(tenantId, encounterId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get invoices by patient' })
  @ApiResponse({ status: 200, description: 'Invoices retrieved' })
  async findByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.invoiceService.findByPatient(tenantId, patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiResponse({ status: 200, description: 'Invoice found' })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.invoiceService.findById(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update invoice' })
  @ApiResponse({ status: 200, description: 'Invoice updated' })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
  ) {
    return this.invoiceService.update(tenantId, id, dto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update invoice status' })
  @ApiResponse({ status: 200, description: 'Invoice status updated' })
  async updateStatus(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceStatusDto,
  ) {
    return this.invoiceService.updateStatus(tenantId, id, dto);
  }

  @Put(':id/payment')
  @ApiOperation({ summary: 'Record payment for invoice' })
  @ApiResponse({ status: 200, description: 'Payment recorded' })
  async recordPayment(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: RecordPaymentDto,
  ) {
    return this.invoiceService.recordPayment(tenantId, id, dto);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel invoice' })
  @ApiResponse({ status: 200, description: 'Invoice cancelled' })
  async cancel(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.invoiceService.cancel(tenantId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete invoice' })
  @ApiResponse({ status: 200, description: 'Invoice deleted successfully' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.invoiceService.delete(tenantId, id);
  }
}
