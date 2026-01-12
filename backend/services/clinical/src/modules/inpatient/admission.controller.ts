/**
 * Admission Controller
 *
 * REST API endpoints for inpatient admission management
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AdmissionService } from './admission.service';
import { TransferService } from './transfer.service';
import { EventService } from './event.service';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { UpdateAdmissionDto } from './dto/update-admission.dto';
import { SearchAdmissionsDto } from './dto/search-admissions.dto';
import { TransferPatientDto } from './dto/transfer-patient.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';

@Controller('v1/inpatient/admissions')
export class AdmissionController {
  constructor(
    private readonly admissionService: AdmissionService,
    private readonly transferService: TransferService,
    private readonly eventService: EventService
  ) {}

  /**
   * GET /v1/inpatient/admissions - Search admissions with filters
   */
  @Get()
  async searchAdmissions(
    @Query() query: SearchAdmissionsDto,
    @TenantId() tenantId: string
  ) {
    return this.admissionService.searchAdmissions(query, tenantId);
  }

  /**
   * POST /v1/inpatient/admissions - Create a new admission
   */
  @Post()
  async createAdmission(
    @Body() dto: CreateAdmissionDto,
    @Context() context: any
  ) {
    return this.admissionService.createAdmission(dto, context);
  }

  /**
   * GET /v1/inpatient/admissions/:id - Get admission by ID
   */
  @Get(':id')
  async getAdmission(
    @Param('id') id: string,
    @TenantId() tenantId: string
  ) {
    return this.admissionService.getAdmissionById(id, tenantId);
  }

  /**
   * PATCH /v1/inpatient/admissions/:id - Update admission
   */
  @Patch(':id')
  async updateAdmission(
    @Param('id') id: string,
    @Body() dto: UpdateAdmissionDto,
    @Context() context: any
  ) {
    return this.admissionService.updateAdmission(id, dto, context);
  }

  /**
   * POST /v1/inpatient/admissions/:id/transfer - Transfer patient to new bed
   */
  @Post(':id/transfer')
  async transferPatient(
    @Param('id') id: string,
    @Body() dto: TransferPatientDto,
    @Context() context: any
  ) {
    return this.transferService.transferPatient(id, dto, context);
  }

  /**
   * GET /v1/inpatient/admissions/:id/events - Get admission events
   */
  @Get(':id/events')
  async getAdmissionEvents(
    @Param('id') id: string,
    @TenantId() tenantId: string
  ) {
    return this.eventService.getAdmissionEvents(id, tenantId);
  }

  /**
   * POST /v1/inpatient/admissions/:id/events - Create event
   */
  @Post(':id/events')
  async createEvent(
    @Param('id') id: string,
    @Body() dto: CreateEventDto,
    @Context() context: any
  ) {
    const { tenantId } = context;
    return this.eventService.createEvent(dto, tenantId);
  }

  /**
   * PATCH /v1/inpatient/admissions/:id/status - Update admission status
   */
  @Patch(':id/status')
  async updateAdmissionStatus(
    @Param('id') id: string,
    @Body() body: { status: string; reason?: string },
    @Context() context: any
  ) {
    const { tenantId, userId } = context;
    return this.admissionService.updateAdmissionStatus(
      id,
      body.status as any, // Cast to enum
      userId,
      tenantId,
      body.reason
    );
  }

  /**
   * PATCH /v1/inpatient/admissions/:id/acuity - Update patient acuity level
   */
  @Patch(':id/acuity')
  async updateAcuity(
    @Param('id') id: string,
    @Body() body: { acuity: string; reason?: string },
    @Context() context: any
  ) {
    const { tenantId, userId } = context;
    return this.admissionService.updateAcuity(
      id,
      body.acuity as any, // Cast to enum
      userId,
      tenantId,
      body.reason
    );
  }
}
