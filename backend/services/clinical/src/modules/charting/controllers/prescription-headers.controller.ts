import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PrescriptionHeadersService } from '../services/prescription-headers.service';
import {
  CreatePrescriptionWithItemsDto,
  AmendPrescriptionDto,
  CancelPrescriptionDto,
  PrescriptionHeaderResponseDto,
} from '../dto/prescription-header.dto';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  PRESCRIPTION_READ,
  PRESCRIPTION_CREATE,
  PRESCRIPTION_UPDATE,
} from '@zeal/contracts';

@ApiTags('Prescription Headers')
@ApiBearerAuth()
@Controller('prescription-headers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PrescriptionHeadersController {
  constructor(private readonly service: PrescriptionHeadersService) {}

  // ── Create prescription (header + drug lines) ────────────────────────────

  @Post()
  @Permissions(PRESCRIPTION_CREATE)
  @ApiOperation({ summary: 'Create a prescription with one or more drug lines' })
  @ApiResponse({ status: 201, description: 'Prescription created', type: PrescriptionHeaderResponseDto })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreatePrescriptionWithItemsDto,
  ) {
    return this.service.createWithItems(tenantId, dto);
  }

  // ── List prescriptions (queue feed) ─────────────────────────────────────

  @Get()
  @Permissions(PRESCRIPTION_READ)
  @ApiOperation({ summary: 'List prescription headers (used as pharmacy queue feed)' })
  @ApiQuery({ name: 'status', required: false, description: 'active | completed | cancelled | amended' })
  @ApiQuery({ name: 'facilityId', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Prescription headers returned', type: [PrescriptionHeaderResponseDto] })
  async findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query('status') status?: string,
    @Query('facilityId') facilityId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findAll(tenantId, {
      ...(status && { status }),
      ...(facilityId && { facilityId }),
      limit: limit ? parseInt(limit, 10) : 200,
    });
  }

  // ── Get by encounter ─────────────────────────────────────────────────────

  @Get('encounter/:encounterId')
  @Permissions(PRESCRIPTION_READ)
  @ApiOperation({ summary: 'Get all prescriptions for an encounter' })
  @ApiResponse({ status: 200, description: 'Prescriptions for encounter', type: [PrescriptionHeaderResponseDto] })
  async findByEncounter(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.service.findByEncounter(tenantId, encounterId);
  }

  // ── Get active prescriptions by patient ─────────────────────────────────

  @Get('patient/:patientId')
  @Permissions(PRESCRIPTION_READ)
  @ApiOperation({ summary: 'Get active prescriptions for a patient' })
  @ApiResponse({ status: 200, description: 'Active prescriptions for patient', type: [PrescriptionHeaderResponseDto] })
  async findByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.service.findByPatient(tenantId, patientId);
  }

  // ── Get by ID ────────────────────────────────────────────────────────────

  @Get(':id')
  @Permissions(PRESCRIPTION_READ)
  @ApiOperation({ summary: 'Get prescription header by ID (includes drug lines)' })
  @ApiResponse({ status: 200, description: 'Prescription header found', type: PrescriptionHeaderResponseDto })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.service.findById(tenantId, id);
  }

  // ── Amend (creates new version) ──────────────────────────────────────────

  @Post(':id/amend')
  @Permissions(PRESCRIPTION_UPDATE)
  @ApiOperation({ summary: 'Amend a prescription — creates new version, marks original as amended' })
  @ApiResponse({ status: 201, description: 'New version created', type: PrescriptionHeaderResponseDto })
  async amend(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: AmendPrescriptionDto,
  ) {
    return this.service.amend(tenantId, id, dto);
  }

  // ── Cancel ────────────────────────────────────────────────────────────────

  @Post(':id/cancel')
  @Permissions(PRESCRIPTION_UPDATE)
  @ApiOperation({ summary: 'Cancel a prescription' })
  @ApiResponse({ status: 200, description: 'Prescription cancelled' })
  async cancel(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: CancelPrescriptionDto,
  ) {
    return this.service.cancel(tenantId, id);
  }
}
