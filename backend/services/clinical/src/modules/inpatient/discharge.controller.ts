/**
 * Discharge Controller
 *
 * REST API endpoints for discharge workflow
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DischargeService } from './discharge.service';
import { DischargePatientDto } from './dto/discharge-patient.dto';
import { UpdateDischargeChecklistDto } from './dto/update-discharge-checklist.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  DISCHARGE_CREATE,
  DISCHARGE_UPDATE,
  ADMISSION_READ,
} from '@zeal/contracts';

@Controller('inpatient/admissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DischargeController {
  constructor(private readonly dischargeService: DischargeService) {}

  /**
   * GET /v1/inpatient/admissions/:id/discharge-checklist - Get discharge checklist
   */
  @Get(':id/discharge-checklist')
  @Permissions(ADMISSION_READ)
  async getDischargeChecklist(
    @Param('id') id: string,
    @TenantId() tenantId: string
  ) {
    return this.dischargeService.getDischargeChecklist(id, tenantId);
  }

  /**
   * PATCH /v1/inpatient/admissions/:id/discharge-checklist - Update discharge checklist
   */
  @Patch(':id/discharge-checklist')
  @Permissions(DISCHARGE_UPDATE)
  async updateDischargeChecklist(
    @Param('id') id: string,
    @Body() dto: UpdateDischargeChecklistDto,
    @Context() context: any
  ) {
    return this.dischargeService.updateDischargeChecklist(id, dto, context);
  }

  /**
   * POST /v1/inpatient/admissions/:id/discharge - Discharge patient
   */
  @Post(':id/discharge')
  @Permissions(DISCHARGE_CREATE)
  async dischargePatient(
    @Param('id') id: string,
    @Body() dto: DischargePatientDto,
    @Context() context: any
  ) {
    return this.dischargeService.dischargePatient(id, dto, context);
  }
}
