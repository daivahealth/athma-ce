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
  UseGuards,
} from '@nestjs/common';
import { PatientHistoryService } from './patient-history.service';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import { PATIENT_READ } from '@zeal/contracts';

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
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PatientHistoryController {
  constructor(
    private readonly historyService: PatientHistoryService
  ) {}

  /**
   * GET /patients/:patientId/history - Get patient history
   */
  @Get()
  @Permissions(PATIENT_READ)
  async getHistory(
    @Param('patientId') patientId: string,
    @Query() query: HistoryQueryDto,
    @Req() req: any
  ) {
    // Context is set by TenantContextMiddleware in req.context
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    return this.historyService.getPatientHistory(tenantId, patientId, query);
  }

  /**
   * GET /patients/:patientId/history/field/:fieldName - Get field history
   */
  @Get('field/:fieldName')
  @Permissions(PATIENT_READ)
  async getFieldHistory(
    @Param('patientId') patientId: string,
    @Param('fieldName') fieldName: string,
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    return this.historyService.getFieldHistory(tenantId, patientId, fieldName);
  }

  /**
   * GET /patients/:patientId/history/pending-approvals - Get pending approvals
   */
  @Get('pending-approvals')
  @Permissions(PATIENT_READ)
  async getPendingApprovals(@Req() req: any) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    return this.historyService.getPendingApprovals(tenantId);
  }

  /**
   * GET /patients/:patientId/history/stats - Get change statistics
   */
  @Get('stats')
  @Permissions(PATIENT_READ)
  async getStats(@Req() req: any) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    return this.historyService.getChangeStats(tenantId);
  }
}
