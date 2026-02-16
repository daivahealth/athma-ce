import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger';
import { PatientLedgerService } from '../services/patient-ledger.service';
import {
  LedgerFiltersDto,
  ReverseEntryDto,
  CreateAdjustmentDto,
  CreateOpeningBalanceDto,
  LedgerEntryType,
  LedgerEntryStatus,
} from '../dto/patient-ledger.dto';

@ApiTags('Patient Ledger')
@Controller('patients')
export class PatientLedgerController {
  constructor(private readonly ledgerService: PatientLedgerService) {}

  @Get(':patientId/ledger')
  @ApiOperation({ summary: 'Get patient ledger entries with running balance' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiQuery({ name: 'dateFrom', required: false, description: 'Start date filter' })
  @ApiQuery({ name: 'dateTo', required: false, description: 'End date filter' })
  @ApiQuery({ name: 'entryType', required: false, enum: LedgerEntryType, description: 'Entry type filter' })
  @ApiQuery({ name: 'status', required: false, enum: LedgerEntryStatus, description: 'Status filter' })
  @ApiHeader({ name: 'x-tenant-id', required: true, description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Patient ledger entries with running balance' })
  async getPatientLedger(
    @Param('patientId') patientId: string,
    @Headers('x-tenant-id') tenantId: string,
    @Query() filters: LedgerFiltersDto,
  ) {
    return this.ledgerService.getPatientLedger(tenantId, patientId, filters);
  }

  @Get(':patientId/ledger/summary')
  @ApiOperation({ summary: 'Get patient balance summary' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiQuery({ name: 'currency', required: false, description: 'Currency (auto-detected if not specified)' })
  @ApiHeader({ name: 'x-tenant-id', required: true, description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Patient balance summary' })
  async getPatientBalanceSummary(
    @Param('patientId') patientId: string,
    @Headers('x-tenant-id') tenantId: string,
    @Query('currency') currency?: string,
  ) {
    return this.ledgerService.getPatientBalanceSummary(tenantId, patientId, currency);
  }

  @Get(':patientId/ledger/entries/:entryId')
  @ApiOperation({ summary: 'Get a single ledger entry' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiParam({ name: 'entryId', description: 'Ledger entry ID' })
  @ApiHeader({ name: 'x-tenant-id', required: true, description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Ledger entry details' })
  async getEntry(
    @Param('patientId') patientId: string,
    @Param('entryId') entryId: string,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    const entry = await this.ledgerService.findEntryById(tenantId, entryId);
    // Verify the entry belongs to this patient
    if (entry.patientId !== patientId) {
      throw new Error('Entry does not belong to this patient');
    }
    return entry;
  }

  @Post(':patientId/ledger/adjustments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an adjustment entry' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiHeader({ name: 'x-tenant-id', required: true, description: 'Tenant ID' })
  @ApiHeader({ name: 'x-user-id', required: true, description: 'User ID' })
  @ApiResponse({ status: 201, description: 'Adjustment entry created' })
  async createAdjustment(
    @Param('patientId') patientId: string,
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateAdjustmentDto,
  ) {
    // Ensure patientId matches
    if (dto.patientId !== patientId) {
      dto.patientId = patientId;
    }
    return this.ledgerService.createAdjustment(tenantId, dto, userId);
  }

  @Post(':patientId/ledger/entries/:entryId/post')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Post a draft ledger entry' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiParam({ name: 'entryId', description: 'Ledger entry ID' })
  @ApiHeader({ name: 'x-tenant-id', required: true, description: 'Tenant ID' })
  @ApiHeader({ name: 'x-user-id', required: true, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Entry posted successfully' })
  async postEntry(
    @Param('patientId') patientId: string,
    @Param('entryId') entryId: string,
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.ledgerService.postEntry(tenantId, entryId, userId);
  }

  @Post(':patientId/ledger/entries/:entryId/reverse')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reverse a posted ledger entry' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiParam({ name: 'entryId', description: 'Ledger entry ID' })
  @ApiHeader({ name: 'x-tenant-id', required: true, description: 'Tenant ID' })
  @ApiHeader({ name: 'x-user-id', required: true, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Entry reversed successfully' })
  async reverseEntry(
    @Param('patientId') patientId: string,
    @Param('entryId') entryId: string,
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: ReverseEntryDto,
  ) {
    return this.ledgerService.reverseEntry(tenantId, entryId, userId, dto);
  }

  @Post(':patientId/ledger/opening-balance')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Set opening balance for a patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiHeader({ name: 'x-tenant-id', required: true, description: 'Tenant ID' })
  @ApiHeader({ name: 'x-user-id', required: true, description: 'User ID' })
  @ApiResponse({ status: 201, description: 'Opening balance created' })
  async createOpeningBalance(
    @Param('patientId') patientId: string,
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateOpeningBalanceDto,
  ) {
    // Ensure patientId matches
    if (dto.patientId !== patientId) {
      dto.patientId = patientId;
    }
    return this.ledgerService.createOpeningBalance(tenantId, dto, userId);
  }
}
