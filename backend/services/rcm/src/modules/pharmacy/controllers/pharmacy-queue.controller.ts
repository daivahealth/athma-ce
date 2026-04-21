import { Controller, Get, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PharmacyQueueService } from '../services/pharmacy-queue.service';
import { PharmacyQueueFiltersDto } from '../dto/pharmacy-queue.dto';

@ApiTags('Pharmacy Queue')
@ApiBearerAuth()
@Controller('pharmacy/queue')
export class PharmacyQueueController {
  constructor(private readonly queueService: PharmacyQueueService) {}

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

  @Get(':prescriptionId')
  @ApiOperation({ summary: 'Get queue detail for a specific prescription (header + items + dispensing record)' })
  @ApiResponse({ status: 200, description: 'Queue item returned' })
  async getQueueItem(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-facility-id') facilityId: string,
    @Headers('x-user-id') userId: string,
    @Headers('authorization') authHeader: string,
    @Param('prescriptionId') prescriptionId: string,
  ) {
    return this.queueService.getQueueItem(tenantId, prescriptionId, facilityId, userId, authHeader);
  }
}
