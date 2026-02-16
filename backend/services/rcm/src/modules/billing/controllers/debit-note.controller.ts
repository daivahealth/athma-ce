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
import { DebitNoteService } from '../services/debit-note.service';
import {
  CreateDebitNoteDto,
  UpdateDebitNoteDto,
  VoidDebitNoteDto,
  DebitNoteStatus,
} from '../dto/debit-note.dto';

@ApiTags('Debit Notes')
@ApiBearerAuth()
@Controller('debit-notes')
export class DebitNoteController {
  constructor(private readonly debitNoteService: DebitNoteService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new debit note' })
  @ApiResponse({ status: 201, description: 'Debit note created successfully' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-facility-id') facilityId: string,
    @Headers('authorization') authHeader: string,
    @Body() dto: CreateDebitNoteDto,
  ) {
    return this.debitNoteService.create(tenantId, dto, userId, authHeader, facilityId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all debit notes for tenant' })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'invoiceId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: DebitNoteStatus })
  @ApiResponse({ status: 200, description: 'Debit notes retrieved' })
  async findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-facility-id') facilityId: string,
    @Headers('authorization') authHeader: string,
    @Query('patientId') patientId?: string,
    @Query('invoiceId') invoiceId?: string,
    @Query('status') status?: DebitNoteStatus,
  ) {
    const filters: any = {};
    if (patientId !== undefined) filters.patientId = patientId;
    if (invoiceId !== undefined) filters.invoiceId = invoiceId;
    if (status !== undefined) filters.status = status;
    return this.debitNoteService.findAll(tenantId, filters, authHeader, facilityId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get debit note by ID' })
  @ApiResponse({ status: 200, description: 'Debit note found' })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.debitNoteService.findById(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update debit note' })
  @ApiResponse({ status: 200, description: 'Debit note updated' })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateDebitNoteDto,
  ) {
    return this.debitNoteService.update(tenantId, id, dto);
  }

  @Post(':id/post')
  @ApiOperation({ summary: 'Post debit note to ledger' })
  @ApiResponse({ status: 200, description: 'Debit note posted' })
  async post(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
  ) {
    return this.debitNoteService.post(tenantId, id, userId);
  }

  @Post(':id/void')
  @ApiOperation({ summary: 'Void debit note' })
  @ApiResponse({ status: 200, description: 'Debit note voided' })
  async void(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: VoidDebitNoteDto,
  ) {
    return this.debitNoteService.void(tenantId, id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete debit note (draft only)' })
  @ApiResponse({ status: 200, description: 'Debit note deleted' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.debitNoteService.delete(tenantId, id);
  }
}
