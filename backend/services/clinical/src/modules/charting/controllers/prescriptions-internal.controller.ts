import { Controller, Get, Patch, Param, Query, Headers, Body, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { PrescriptionsService } from '../services/prescriptions.service';
import { InternalApiKeyGuard } from '../../../common/guards/internal-api-key.guard';

/**
 * Internal endpoints for RCM pharmacy queue scheduler.
 * Protected by InternalApiKeyGuard (X-Internal-Api-Key header), NOT by JWT.
 * Kept in a separate controller so the class-level JwtAuthGuard on
 * PrescriptionsController does not interfere.
 */
@ApiExcludeController()
@Controller('prescriptions/internal')
@UseGuards(InternalApiKeyGuard)
export class PrescriptionsInternalController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Get('pending-queue')
  async getPendingQueue(
    @Headers('x-tenant-id') tenantId: string,
    @Query('limit') limit?: string,
  ) {
    return this.prescriptionsService.findPendingQueue(tenantId, limit ? parseInt(limit, 10) : 100);
  }

  @Patch(':id/dispensing-queue-status')
  async updateDispensingQueueStatus(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.prescriptionsService.updateDispensingQueueStatus(tenantId, id, status);
  }
}
