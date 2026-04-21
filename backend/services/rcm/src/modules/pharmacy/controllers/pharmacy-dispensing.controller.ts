import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PharmacyDispensingService } from '../services/pharmacy-dispensing.service';
import {
  CreateDispensingDto,
  VerifyDispensingDto,
  ExecuteDispenseDto,
  DispatchToWardDto,
  CancelDispensingDto,
  ReturnDispensingDto,
  DispensingFiltersDto,
} from '../dto/pharmacy-dispensing.dto';

@ApiTags('Pharmacy Dispensing')
@ApiBearerAuth()
@Controller('pharmacy/dispensings')
export class PharmacyDispensingController {
  constructor(private readonly dispensingService: PharmacyDispensingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a dispensing record (queues a prescription for pharmacist review)' })
  @ApiResponse({ status: 201, description: 'Dispensing record created in queued status' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-facility-id') facilityId: string,
    @Headers('authorization') authHeader: string,
    @Body() dto: CreateDispensingDto,
  ) {
    return this.dispensingService.create(tenantId, dto, userId, facilityId, authHeader);
  }

  @Get()
  @ApiOperation({ summary: 'List dispensing records' })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'encounterId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'dispensingChannel', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiResponse({ status: 200, description: 'Dispensing list returned' })
  async findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query() filters: DispensingFiltersDto,
  ) {
    return this.dispensingService.findAll(tenantId, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dispensing record by ID (includes line items)' })
  @ApiResponse({ status: 200, description: 'Dispensing record returned' })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.dispensingService.findById(tenantId, id);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Pharmacist verifies prescription — moves status queued → verified' })
  @ApiResponse({ status: 200, description: 'Dispensing verified' })
  async verify(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-facility-id') facilityId: string,
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
    @Body() dto: VerifyDispensingDto,
  ) {
    return this.dispensingService.verify(tenantId, id, dto, userId, facilityId, authHeader);
  }

  @Post(':id/dispense')
  @ApiOperation({ summary: 'Execute dispensing — deducts stock, creates items, posts pharmacy charge' })
  @ApiResponse({ status: 200, description: 'Medication dispensed successfully' })
  async dispense(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: ExecuteDispenseDto,
  ) {
    return this.dispensingService.dispense(tenantId, id, dto, userId);
  }

  @Post(':id/dispatch-to-ward')
  @ApiOperation({ summary: 'Inpatient: mark medication as dispatched to ward (sets ward routing)' })
  @ApiResponse({ status: 200, description: 'Medication dispatched to ward' })
  async dispatchToWard(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: DispatchToWardDto,
  ) {
    return this.dispensingService.dispatchToWard(tenantId, id, dto, userId);
  }

  @Post(':id/ward-receive')
  @ApiOperation({ summary: 'Inpatient: ward nurse confirms medication received' })
  @ApiResponse({ status: 200, description: 'Ward receipt confirmed' })
  async wardReceive(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
  ) {
    return this.dispensingService.wardReceive(tenantId, id, userId);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a queued or verified dispensing record' })
  @ApiResponse({ status: 200, description: 'Dispensing cancelled' })
  async cancel(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: CancelDispensingDto,
  ) {
    return this.dispensingService.cancel(tenantId, id, dto, userId);
  }

  @Post(':id/return')
  @ApiOperation({ summary: 'Process medication return — restores stock and updates dispensing' })
  @ApiResponse({ status: 200, description: 'Return processed' })
  async processReturn(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: ReturnDispensingDto,
  ) {
    return this.dispensingService.processReturn(tenantId, id, dto, userId);
  }
}
