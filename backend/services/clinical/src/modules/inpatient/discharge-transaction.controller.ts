/**
 * Discharge Transaction Controller
 *
 * REST API endpoints for the new discharge transaction workflow
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { DischargeTransactionService } from './discharge-transaction.service';
import { InitiateDischargeDto } from './dto/initiate-discharge.dto';
import { ExecuteDischargeDto } from './dto/execute-discharge.dto';
import { ApproveDischargeDto } from './dto/approve-discharge.dto';
import { CancelDischargeDto } from './dto/cancel-discharge.dto';
import { MarkReadyDto } from './dto/mark-ready.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';

@Controller('inpatient')
export class DischargeTransactionController {
  constructor(
    private readonly dischargeTransactionService: DischargeTransactionService,
  ) {}

  /**
   * POST /v1/inpatient/admissions/:admissionId/discharge/initiate
   * Initiate discharge planning for an admission
   */
  @Post('admissions/:admissionId/discharge/initiate')
  async initiateDischargePlanning(
    @Param('admissionId') admissionId: string,
    @Body() dto: InitiateDischargeDto,
    @Context() context: any,
  ) {
    // Transform DTO for service
    const serviceDto: {
      targetDischargeDate?: Date;
      targetDischargeTime?: string;
      approvalRequired?: boolean;
      internalNotes?: string;
    } = {};

    if (dto.targetDischargeDate) {
      serviceDto.targetDischargeDate = new Date(dto.targetDischargeDate);
    }
    if (dto.targetDischargeTime) {
      serviceDto.targetDischargeTime = dto.targetDischargeTime;
    }
    if (dto.approvalRequired !== undefined) {
      serviceDto.approvalRequired = dto.approvalRequired;
    }
    if (dto.internalNotes) {
      serviceDto.internalNotes = dto.internalNotes;
    }

    return this.dischargeTransactionService.initiateDischargePlanning(
      admissionId,
      serviceDto,
      context,
    );
  }

  /**
   * GET /v1/inpatient/admissions/:admissionId/discharge
   * Get discharge transaction for an admission
   */
  @Get('admissions/:admissionId/discharge')
  async getDischargeByAdmissionId(
    @Param('admissionId') admissionId: string,
    @TenantId() tenantId: string,
  ) {
    return this.dischargeTransactionService.getDischargeByAdmissionId(
      admissionId,
      tenantId,
    );
  }

  /**
   * PATCH /v1/inpatient/discharges/:id/ready
   * Mark discharge as ready (usually called after checklist verification)
   */
  @Patch('discharges/:id/ready')
  async markReady(
    @Param('id') dischargeId: string,
    @Body() dto: MarkReadyDto,
    @Context() context: any,
  ) {
    return this.dischargeTransactionService.markReady(
      dischargeId,
      dto.readyRemarks,
      context,
    );
  }

  /**
   * PATCH /v1/inpatient/discharges/:id/approve
   * Approve discharge (if approval workflow is enabled)
   */
  @Patch('discharges/:id/approve')
  async approveDischarge(
    @Param('id') dischargeId: string,
    @Body() dto: ApproveDischargeDto,
    @Context() context: any,
  ) {
    return this.dischargeTransactionService.approveDischarge(
      dischargeId,
      dto.approvalRemarks,
      context,
    );
  }

  /**
   * PATCH /v1/inpatient/discharges/:id/execute
   * Execute discharge - actually discharge the patient
   */
  @Patch('discharges/:id/execute')
  async executeDischarge(
    @Param('id') dischargeId: string,
    @Body() dto: ExecuteDischargeDto,
    @Context() context: any,
  ) {
    return this.dischargeTransactionService.executeDischarge(
      dischargeId,
      dto,
      context,
    );
  }

  /**
   * PATCH /v1/inpatient/discharges/:id/cancel
   * Cancel discharge planning
   */
  @Patch('discharges/:id/cancel')
  async cancelDischarge(
    @Param('id') dischargeId: string,
    @Body() dto: CancelDischargeDto,
    @Context() context: any,
  ) {
    return this.dischargeTransactionService.cancelDischarge(
      dischargeId,
      dto.cancellationReason,
      context,
    );
  }
}
