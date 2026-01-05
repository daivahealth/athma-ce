/**
 * Ward Controller
 *
 * REST API endpoints for ward bed board and dashboard
 */

import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { BedBoardService } from './bed-board.service';
import { AdmissionService } from './admission.service';
import { BedBoardQueryDto } from './dto/bed-board-query.dto';
import { TenantId } from '../../common/decorators/tenant-context.decorator';

@Controller('v1/inpatient/wards')
export class WardController {
  constructor(
    private readonly bedBoardService: BedBoardService,
    private readonly admissionService: AdmissionService
  ) {}

  /**
   * GET /v1/inpatient/wards/:wardId/bed-board - Get bed board for ward
   */
  @Get(':wardId/bed-board')
  async getBedBoard(
    @Param('wardId') wardId: string,
    @Query() query: BedBoardQueryDto,
    @TenantId() tenantId: string
  ) {
    return this.bedBoardService.getWardBedBoard(
      wardId,
      tenantId,
      query.includeDischargedToday
    );
  }

  /**
   * GET /v1/inpatient/wards/:wardId/dashboard - Get ward dashboard
   */
  @Get(':wardId/dashboard')
  async getWardDashboard(
    @Param('wardId') wardId: string,
    @TenantId() tenantId: string
  ) {
    return this.bedBoardService.getWardDashboard(wardId, tenantId);
  }

  /**
   * GET /v1/inpatient/wards/:wardId/patients - Get ward patients
   */
  @Get(':wardId/patients')
  async getWardPatients(
    @Param('wardId') wardId: string,
    @TenantId() tenantId: string
  ) {
    return this.admissionService.getWardPatients(wardId, tenantId);
  }
}
