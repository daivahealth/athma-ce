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
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BedBoardService } from './bed-board.service';
import { BedBrowserService } from './bed-browser.service';
import { AdmissionService } from './admission.service';
import { BedBoardQueryDto } from './dto/bed-board-query.dto';
import { BedBrowserQueryDto } from './dto/bed-browser-query.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';

@Controller('inpatient/wards')
export class WardController {
  constructor(
    private readonly bedBoardService: BedBoardService,
    private readonly bedBrowserService: BedBrowserService,
    private readonly admissionService: AdmissionService
  ) {}

  /**
   * GET /v1/inpatient/wards/bed-browser - Central Bed Management Browser
   * Returns all beds with status (Available, Occupied, Cleaning, Maintenance)
   */
  @Get('bed-browser')
  async getBedBrowser(
    @Query() query: BedBrowserQueryDto,
    @Context() context: any
  ) {
    return this.bedBrowserService.getBedBrowser(query, context);
  }

  /**
   * POST /v1/inpatient/wards/beds/:bedId/cleaning/complete - Mark bed cleaning as complete
   */
  @Post('beds/:bedId/cleaning/complete')
  @HttpCode(HttpStatus.OK)
  async markCleaningComplete(
    @Param('bedId') bedId: string,
    @Context() context: any
  ) {
    return this.bedBrowserService.markCleaningComplete(bedId, context);
  }

  /**
   * POST /v1/inpatient/wards/beds/:bedId/cleaning/required - Mark bed cleaning as required
   */
  @Post('beds/:bedId/cleaning/required')
  @HttpCode(HttpStatus.OK)
  async markCleaningRequired(
    @Param('bedId') bedId: string,
    @Body() _body: { notes?: string },
    @Context() context: any
  ) {
    return this.bedBrowserService.markCleaningRequired(bedId, context);
  }

  /**
   * POST /v1/inpatient/wards/beds/:bedId/maintenance/start - Start bed maintenance
   */
  @Post('beds/:bedId/maintenance/start')
  @HttpCode(HttpStatus.OK)
  async startMaintenance(
    @Param('bedId') bedId: string,
    @Body() body: { notes?: string },
    @Context() context: any
  ) {
    return this.bedBrowserService.startMaintenance(bedId, body.notes, context);
  }

  /**
   * POST /v1/inpatient/wards/beds/:bedId/maintenance/complete - Complete bed maintenance
   */
  @Post('beds/:bedId/maintenance/complete')
  @HttpCode(HttpStatus.OK)
  async completeMaintenance(
    @Param('bedId') bedId: string,
    @Context() context: any
  ) {
    return this.bedBrowserService.completeMaintenance(bedId, context);
  }

  /**
   * GET /v1/inpatient/wards/:wardId/bed-board - Get ward board for ward
   * Updated to use new status model and WardBoardResponse DTO
   */
  @Get(':wardId/bed-board')
  async getBedBoard(
    @Param('wardId') wardId: string,
    @Query() query: BedBoardQueryDto,
    @TenantId() tenantId: string,
    @Context() context: any
  ) {
    const { facilityId } = context;

    return this.bedBoardService.getWardBedBoard(
      facilityId,
      wardId,
      tenantId,
      {
        includeDischargedToday: query.includeDischargedToday,
        statusFilter: query.statusFilter,
        acuityFilter: query.acuityFilter,
      }
    );
  }

  /**
   * GET /v1/inpatient/wards/:wardId/dashboard - Get ward dashboard
   * Updated to use new status model
   */
  @Get(':wardId/dashboard')
  async getWardDashboard(
    @Param('wardId') wardId: string,
    @TenantId() tenantId: string,
    @Context() context: any
  ) {
    const { facilityId } = context;
    return this.bedBoardService.getWardDashboard(wardId, facilityId, tenantId);
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
