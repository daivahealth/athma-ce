/**
 * Patient History Controller
 *
 * REST API endpoints for patient history tracking
 */

import {
  Controller,
  Get,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { PatientHistoryService } from './patient-history.service';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';

class HistoryQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}

@Controller('patients/:patientId/history')
export class PatientHistoryController {
  constructor(
    private readonly historyService: PatientHistoryService
  ) {}

  /**
   * GET /patients/:patientId/history - Get patient history
   */
  @Get()
  async getHistory(
    @Param('patientId') patientId: string,
    @Query() query: HistoryQueryDto,
    @Req() req: any
  ) {
    const tenantId = req.tenant?.id || 'default-tenant';
    return this.historyService.getPatientHistory(tenantId, patientId, query);
  }

  /**
   * GET /patients/:patientId/history/field/:fieldName - Get field history
   */
  @Get('field/:fieldName')
  async getFieldHistory(
    @Param('patientId') patientId: string,
    @Param('fieldName') fieldName: string,
    @Req() req: any
  ) {
    const tenantId = req.tenant?.id || 'default-tenant';
    return this.historyService.getFieldHistory(tenantId, patientId, fieldName);
  }

  /**
   * GET /patients/:patientId/history/pending-approvals - Get pending approvals
   */
  @Get('pending-approvals')
  async getPendingApprovals(@Req() req: any) {
    const tenantId = req.tenant?.id || 'default-tenant';
    return this.historyService.getPendingApprovals(tenantId);
  }

  /**
   * GET /patients/:patientId/history/stats - Get change statistics
   */
  @Get('stats')
  async getStats(@Req() req: any) {
    const tenantId = req.tenant?.id || 'default-tenant';
    return this.historyService.getChangeStats(tenantId);
  }
}
