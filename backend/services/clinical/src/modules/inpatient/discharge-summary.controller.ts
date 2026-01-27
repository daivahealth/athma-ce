/**
 * Discharge Summary Controller
 * REST API endpoints for discharge summary documents and versions
 */

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DischargeSummaryService } from './discharge-summary.service';
import { CreateDischargeSummaryVersionDto } from './dto/create-discharge-summary-version.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  DISCHARGE_SUMMARY_READ,
  DISCHARGE_SUMMARY_CREATE,
} from '@zeal/contracts';

@Controller('inpatient')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DischargeSummaryController {
  constructor(private readonly dischargeSummaryService: DischargeSummaryService) {}

  /**
   * GET /v1/inpatient/admissions/:admissionId/discharge-summary
   * Get discharge summary for an admission
   */
  @Get('admissions/:admissionId/discharge-summary')
  @Permissions(DISCHARGE_SUMMARY_READ)
  async getByAdmission(
    @Param('admissionId') admissionId: string,
    @TenantId() tenantId: string,
  ) {
    return this.dischargeSummaryService.getByAdmission(admissionId, tenantId);
  }

  /**
   * GET /v1/inpatient/discharge-summaries/:summaryId
   * Get discharge summary by ID
   */
  @Get('discharge-summaries/:summaryId')
  @Permissions(DISCHARGE_SUMMARY_READ)
  async getById(
    @Param('summaryId') summaryId: string,
    @TenantId() tenantId: string,
  ) {
    return this.dischargeSummaryService.getById(summaryId, tenantId);
  }

  /**
   * GET /v1/inpatient/discharge-summaries/:summaryId/versions
   * List versions for a discharge summary
   */
  @Get('discharge-summaries/:summaryId/versions')
  @Permissions(DISCHARGE_SUMMARY_READ)
  async listVersions(
    @Param('summaryId') summaryId: string,
    @TenantId() tenantId: string,
  ) {
    return this.dischargeSummaryService.listVersions(summaryId, tenantId);
  }

  /**
   * POST /v1/inpatient/discharge-summaries/:summaryId/versions
   * Create a new discharge summary version
   */
  @Post('discharge-summaries/:summaryId/versions')
  @Permissions(DISCHARGE_SUMMARY_CREATE)
  async createVersion(
    @Param('summaryId') summaryId: string,
    @Body() dto: CreateDischargeSummaryVersionDto,
    @Context() context: any,
  ) {
    return this.dischargeSummaryService.createVersion(
      summaryId,
      dto.data,
      dto.changeReason,
      context,
    );
  }
}
