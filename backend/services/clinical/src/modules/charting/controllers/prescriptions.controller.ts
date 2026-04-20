import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PrescriptionsService } from '../services/prescriptions.service';
import {
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
  PrescriptionResponseDto,
} from '../dto/prescription.dto';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  PRESCRIPTION_READ,
  PRESCRIPTION_CREATE,
  PRESCRIPTION_UPDATE,
  PRESCRIPTION_DELETE,
} from '@zeal/contracts';

@ApiTags('Prescriptions')
@ApiBearerAuth()
@Controller('prescriptions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Get()
  @Permissions(PRESCRIPTION_READ)
  @ApiOperation({ summary: 'List prescriptions with optional filters' })
  @ApiQuery({ name: 'status', required: false, description: 'active | completed | cancelled | discontinued' })
  @ApiQuery({ name: 'facilityId', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Prescriptions retrieved', type: [PrescriptionResponseDto] })
  async findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query('status') status?: string,
    @Query('facilityId') facilityId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.prescriptionsService.findAll(tenantId, {
      ...(status && { status }),
      ...(facilityId && { facilityId }),
      limit: limit ? parseInt(limit, 10) : 200,
    });
  }

  @Post()
  @Permissions(PRESCRIPTION_CREATE)
  @ApiOperation({ summary: 'Create a new prescription' })
  @ApiResponse({ status: 201, description: 'Prescription created successfully', type: PrescriptionResponseDto })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreatePrescriptionDto,
  ) {
    return this.prescriptionsService.create(tenantId, dto);
  }

  @Get(':id')
  @Permissions(PRESCRIPTION_READ)
  @ApiOperation({ summary: 'Get prescription by ID' })
  @ApiResponse({ status: 200, description: 'Prescription found', type: PrescriptionResponseDto })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.prescriptionsService.findById(tenantId, id);
  }

  @Get('encounter/:encounterId')
  @Permissions(PRESCRIPTION_READ)
  @ApiOperation({ summary: 'Get all prescriptions for an encounter' })
  @ApiResponse({ status: 200, description: 'Prescriptions retrieved', type: [PrescriptionResponseDto] })
  async findByEncounter(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.prescriptionsService.findByEncounter(tenantId, encounterId);
  }

  @Get('patient/:patientId')
  @Permissions(PRESCRIPTION_READ)
  @ApiOperation({ summary: 'Get active medications for a patient' })
  @ApiResponse({ status: 200, description: 'Active medications retrieved', type: [PrescriptionResponseDto] })
  async findActiveByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.prescriptionsService.findByPatient(tenantId, patientId, true);
  }

  @Patch(':id')
  @Permissions(PRESCRIPTION_UPDATE)
  @ApiOperation({ summary: 'Update prescription' })
  @ApiResponse({ status: 200, description: 'Prescription updated', type: PrescriptionResponseDto })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePrescriptionDto,
  ) {
    return this.prescriptionsService.update(tenantId, id, dto);
  }

  @Post(':id/discontinue')
  @Permissions(PRESCRIPTION_UPDATE)
  @ApiOperation({ summary: 'Discontinue a prescription' })
  @ApiResponse({ status: 200, description: 'Prescription discontinued', type: PrescriptionResponseDto })
  async discontinue(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ) {
    return this.prescriptionsService.discontinue(tenantId, id);
  }

  @Delete(':id')
  @Permissions(PRESCRIPTION_DELETE)
  @ApiOperation({ summary: 'Delete a prescription' })
  @ApiResponse({ status: 200, description: 'Prescription deleted successfully' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.prescriptionsService.delete(tenantId, id);
  }

}
