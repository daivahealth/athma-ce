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
import { CreditNoteService } from '../services/credit-note.service';
import {
  CreateCreditNoteDto,
  UpdateCreditNoteDto,
  VoidCreditNoteDto,
  CreditNoteStatus,
} from '../dto/credit-note.dto';

@ApiTags('Credit Notes')
@ApiBearerAuth()
@Controller('credit-notes')
export class CreditNoteController {
  constructor(private readonly creditNoteService: CreditNoteService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new credit note' })
  @ApiResponse({ status: 201, description: 'Credit note created successfully' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-facility-id') facilityId: string,
    @Headers('authorization') authHeader: string,
    @Body() dto: CreateCreditNoteDto,
  ) {
    return this.creditNoteService.create(tenantId, dto, userId, authHeader, facilityId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all credit notes for tenant' })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'invoiceId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: CreditNoteStatus })
  @ApiResponse({ status: 200, description: 'Credit notes retrieved' })
  async findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-facility-id') facilityId: string,
    @Headers('authorization') authHeader: string,
    @Query('patientId') patientId?: string,
    @Query('invoiceId') invoiceId?: string,
    @Query('status') status?: CreditNoteStatus,
  ) {
    const filters: any = {};
    if (patientId !== undefined) filters.patientId = patientId;
    if (invoiceId !== undefined) filters.invoiceId = invoiceId;
    if (status !== undefined) filters.status = status;
    return this.creditNoteService.findAll(tenantId, filters, authHeader, facilityId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get credit note by ID' })
  @ApiResponse({ status: 200, description: 'Credit note found' })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.creditNoteService.findById(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update credit note' })
  @ApiResponse({ status: 200, description: 'Credit note updated' })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCreditNoteDto,
  ) {
    return this.creditNoteService.update(tenantId, id, dto);
  }

  @Post(':id/post')
  @ApiOperation({ summary: 'Post credit note to ledger' })
  @ApiResponse({ status: 200, description: 'Credit note posted' })
  async post(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
  ) {
    return this.creditNoteService.post(tenantId, id, userId);
  }

  @Post(':id/void')
  @ApiOperation({ summary: 'Void credit note' })
  @ApiResponse({ status: 200, description: 'Credit note voided' })
  async void(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: VoidCreditNoteDto,
  ) {
    return this.creditNoteService.void(tenantId, id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete credit note (draft only)' })
  @ApiResponse({ status: 200, description: 'Credit note deleted' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.creditNoteService.delete(tenantId, id);
  }
}
