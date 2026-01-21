/**
 * Discharge Summary Controller
 * REST API endpoints for discharge summary documents and versions
 */

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DischargeSummaryService } from './discharge-summary.service';
import { CreateDischargeSummaryVersionDto } from './dto/create-discharge-summary-version.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';

@Controller('inpatient')
export class DischargeSummaryController {
  constructor(private readonly dischargeSummaryService: DischargeSummaryService) {}

  /**
   * GET /v1/inpatient/admissions/:admissionId/discharge-summary
   * Get discharge summary for an admission
   */
  @Get('admissions/:admissionId/discharge-summary')
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
