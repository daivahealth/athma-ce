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
  UseGuards,
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
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  ADMISSION_READ,
  ADMISSION_CREATE,
  ADMISSION_UPDATE,
} from '@zeal/contracts';

@Controller('inpatient/admissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
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
  @Permissions(ADMISSION_READ)
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
  @Permissions(ADMISSION_CREATE)
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
  @Permissions(ADMISSION_READ)
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
  @Permissions(ADMISSION_UPDATE)
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
  @Permissions(ADMISSION_UPDATE)
  async transferPatient(
    @Param('id') id: string,
    @Body() dto: TransferPatientDto,
    @Context() context: any
  ) {
    return this.transferService.transferPatient(id, dto, context);
  }

  /**
   * GET /v1/inpatient/admissions/:id/transfer-history - Get transfer history for admission
   * Returns all bed transfers for this admission, ordered by transfer date ascending
   */
  @Get(':id/transfer-history')
  @Permissions(ADMISSION_READ)
  async getTransferHistory(
    @Param('id') id: string,
    @TenantId() tenantId: string
  ) {
    return this.transferService.getTransferHistory(id, tenantId);
  }

  /**
   * GET /v1/inpatient/admissions/:id/current-bed-assignment - Get current bed assignment
   * Returns the active bed assignment (where releasedAt is null)
   */
  @Get(':id/current-bed-assignment')
  @Permissions(ADMISSION_READ)
  async getCurrentBedAssignment(
    @Param('id') id: string,
    @TenantId() tenantId: string
  ) {
    return this.transferService.getCurrentBedAssignment(id, tenantId);
  }

  /**
   * GET /v1/inpatient/admissions/:id/events - Get admission events
   */
  @Get(':id/events')
  @Permissions(ADMISSION_READ)
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
  @Permissions(ADMISSION_UPDATE)
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
  @Permissions(ADMISSION_UPDATE)
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
  @Permissions(ADMISSION_UPDATE)
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
