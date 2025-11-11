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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PrescriptionsService } from '../services/prescriptions.service';
import {
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
  PrescriptionResponseDto,
} from '../dto/prescription.dto';

@ApiTags('Prescriptions')
@ApiBearerAuth()
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new prescription' })
  @ApiResponse({ status: 201, description: 'Prescription created successfully', type: PrescriptionResponseDto })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreatePrescriptionDto,
  ) {
    return this.prescriptionsService.create(tenantId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get prescription by ID' })
  @ApiResponse({ status: 200, description: 'Prescription found', type: PrescriptionResponseDto })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.prescriptionsService.findById(tenantId, id);
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get all prescriptions for an encounter' })
  @ApiResponse({ status: 200, description: 'Prescriptions retrieved', type: [PrescriptionResponseDto] })
  async findByEncounter(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.prescriptionsService.findByEncounter(tenantId, encounterId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get active medications for a patient' })
  @ApiResponse({ status: 200, description: 'Active medications retrieved', type: [PrescriptionResponseDto] })
  async findActiveByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.prescriptionsService.findByPatient(tenantId, patientId, true);
  }

  @Patch(':id')
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
  @ApiOperation({ summary: 'Delete a prescription' })
  @ApiResponse({ status: 200, description: 'Prescription deleted successfully' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.prescriptionsService.delete(tenantId, id);
  }
}
