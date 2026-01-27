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
  UseGuards,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { SearchPatientsDto } from './dto/search-patients.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  PATIENT_READ,
  PATIENT_CREATE,
  PATIENT_UPDATE,
} from '@zeal/contracts';

@Controller('patients')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  /**
   * POST /patients - Create a new patient
   */
  @Post()
  @Permissions(PATIENT_CREATE)
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
  @Permissions(PATIENT_READ)
  async getRegistrationDefaults(@Context() context: any) {
    return this.patientService.getRegistrationDefaults(context);
  }

  /**
   * GET /patients - Search patients
   */
  @Get()
  @Permissions(PATIENT_READ)
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
  @Permissions(PATIENT_READ)
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
  @Permissions(PATIENT_UPDATE)
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
  @Permissions(PATIENT_READ)
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
  @Permissions(PATIENT_UPDATE)
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
  @Permissions(PATIENT_UPDATE)
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
  @Permissions(PATIENT_READ)
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
  @Permissions(PATIENT_READ)
  async getAuditReport(
    @Param('id') id: string,
    @TenantId() tenantId: string
  ) {
    return this.patientService.getAuditReport(id, tenantId);
  }
}
