/**
 * Patient Controller
 *
 * REST API endpoints for patient management
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { SearchPatientsDto } from './dto/search-patients.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  /**
   * POST /patients - Create a new patient
   */
  @Post()
  async createPatient(
    @Body() dto: CreatePatientDto,
    @Context() context: any
  ) {
    // Convert dateOfBirth string to Date
    const patientData = {
      ...dto,
      dateOfBirth: new Date(dto.dateOfBirth),
    };

    return this.patientService.registerPatient(patientData, context);
  }

  /**
   * GET /patients/registration/defaults - Default values for registration form
   * IMPORTANT: Must come before :id route to avoid "registration" being treated as an ID
   */
  @Get('registration/defaults')
  async getRegistrationDefaults(@Context() context: any) {
    return this.patientService.getRegistrationDefaults(context);
  }

  /**
   * GET /patients - Search patients
   */
  @Get()
  async searchPatients(
    @Query() query: SearchPatientsDto,
    @TenantId() tenantId: string
  ) {
    return this.patientService.searchPatients(tenantId, query);
  }

  /**
   * GET /patients/:id - Get patient by ID
   */
  @Get(':id')
  async getPatient(
    @Param('id') id: string,
    @TenantId() tenantId: string
  ) {
    return this.patientService.getPatientById(id, tenantId);
  }

  /**
   * PUT /patients/:id - Update patient
   */
  @Put(':id')
  async updatePatient(
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
    @Context() context: any
  ) {
    // Convert dateOfBirth if provided
    const updateData = dto.dateOfBirth
      ? { ...dto, dateOfBirth: new Date(dto.dateOfBirth) }
      : dto;

    return this.patientService.updatePatient(id, updateData as any, context);
  }

  /**
   * GET /patients/:id/history - Get patient with history
   */
  @Get(':id/history')
  async getPatientWithHistory(
    @Param('id') id: string,
    @TenantId() tenantId: string
  ) {
    return this.patientService.getPatientWithHistory(id, tenantId);
  }

  /**
   * POST /patients/:id/change-request - Create change request
   */
  @Post(':id/change-request')
  async createChangeRequest(
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
    @Context() context: any
  ) {
    return this.patientService.createChangeRequest(id, dto as any, {
      ...context,
      requestedBy: 'patient' as const,
    });
  }

  /**
   * POST /patients/:id/approve/:historyId - Approve change request
   */
  @Post(':id/approve/:historyId')
  async approveChangeRequest(
    @Param('historyId') historyId: string,
    @Context() context: any
  ) {
    return this.patientService.approveChangeRequest(historyId, context);
  }

  /**
   * GET /patients/:id/field/:fieldName/timeline - Get field timeline
   */
  @Get(':id/field/:fieldName/timeline')
  async getFieldTimeline(
    @Param('id') id: string,
    @Param('fieldName') fieldName: string,
    @TenantId() tenantId: string
  ) {
    return this.patientService.getFieldTimeline(id, tenantId, fieldName);
  }

  /**
   * GET /patients/:id/audit - Get audit report
   */
  @Get(':id/audit')
  async getAuditReport(
    @Param('id') id: string,
    @TenantId() tenantId: string
  ) {
    return this.patientService.getAuditReport(id, tenantId);
  }
}
