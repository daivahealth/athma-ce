import { Controller, Get, Post, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PharmacyQueueService } from '../services/pharmacy-queue.service';
import { PharmacyQueueFiltersDto } from '../dto/pharmacy-queue.dto';
import { PharmacyQueueSyncJob } from '../jobs/pharmacy-queue-sync.job';

@ApiTags('Pharmacy Queue')
@ApiBearerAuth()
@Controller('pharmacy/queue')
export class PharmacyQueueController {
  constructor(
    private readonly queueService: PharmacyQueueService,
    private readonly syncJob: PharmacyQueueSyncJob,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get pharmacy dispensing queue (active prescriptions not yet dispensed)' })
  @ApiQuery({ name: 'encounterType', required: false, description: 'outpatient | inpatient' })
  @ApiQuery({ name: 'wardId', required: false, description: 'Filter by ward UUID (inpatient only)' })
  @ApiQuery({ name: 'facilityId', required: false })
  @ApiQuery({ name: 'search', required: false, description: 'Search by patient name or MRN' })
  @ApiResponse({ status: 200, description: 'Pharmacy queue returned' })
  async getQueue(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-facility-id') facilityId: string,
    @Headers('x-user-id') userId: string,
    @Headers('authorization') authHeader: string,
    @Query() filters: PharmacyQueueFiltersDto,
  ) {
    return this.queueService.getQueue(tenantId, facilityId, userId, authHeader, filters);
  }

  @Get(':prescriptionOrderId')
  @ApiOperation({ summary: 'Get queue detail for a specific prescription order' })
  @ApiResponse({ status: 200, description: 'Queue item returned' })
  async getQueueItem(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-facility-id') facilityId: string,
    @Headers('x-user-id') userId: string,
    @Headers('authorization') authHeader: string,
    @Param('prescriptionOrderId') prescriptionOrderId: string,
  ) {
    return this.queueService.getQueueItem(tenantId, prescriptionOrderId, facilityId, userId, authHeader);
  }

  @Post('sync-now')
  @ApiOperation({
    summary: 'Manually trigger prescription → dispensing queue sync',
    description:
      'Immediately runs the background sync job that pulls new prescriptions from Clinical ' +
      'and creates queued dispensing records. Useful for testing and operational runbooks.',
  })
  @ApiResponse({ status: 201, description: 'Sync triggered' })
  async triggerSync() {
    return this.syncJob.triggerNow();
  }
}
