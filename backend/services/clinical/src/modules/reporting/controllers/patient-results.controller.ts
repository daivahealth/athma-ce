import {
  Controller,
  Get,
  Param,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import { LAB_RESULT_READ } from '@zeal/contracts';
import { PatientResultsService } from '../services/patient-results.service';

@ApiTags('Patient Results')
@ApiBearerAuth()
@Controller('patient-results')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PatientResultsController {
  constructor(private readonly patientResultsService: PatientResultsService) {}

  @Get()
  @Permissions(LAB_RESULT_READ)
  @ApiOperation({ summary: 'Get all results for the tenant (lab, imaging, procedure)' })
  @ApiResponse({ status: 200, description: 'All results retrieved' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by report type: lab, imaging, procedure' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by report status' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 20)' })
  async getAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query('type') reportType?: string,
    @Query('status') reportStatus?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.patientResultsService.getAll(tenantId, {
      reportType,
      reportStatus,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('patient/:patientId')
  @Permissions(LAB_RESULT_READ)
  @ApiOperation({ summary: 'Get all results for a patient (lab, imaging, procedure)' })
  @ApiResponse({ status: 200, description: 'Patient results retrieved' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by report type: lab, imaging, procedure' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by report status' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 20)' })
  async getByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('type') reportType?: string,
    @Query('status') reportStatus?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.patientResultsService.getByPatient(tenantId, patientId, {
      reportType,
      reportStatus,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('encounter/:encounterId')
  @Permissions(LAB_RESULT_READ)
  @ApiOperation({ summary: 'Get all results for an encounter' })
  @ApiResponse({ status: 200, description: 'Encounter results retrieved' })
  async getByEncounter(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.patientResultsService.getByEncounter(tenantId, encounterId);
  }

  @Get('reportable-orders/:orderType')
  @Permissions(LAB_RESULT_READ)
  @ApiOperation({ summary: 'Get orders that do not yet have a report for the given type' })
  @ApiResponse({ status: 200, description: 'Reportable orders retrieved' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by order name' })
  @ApiQuery({ name: 'limit', required: false, description: 'Max results (default: 50)' })
  async getReportableOrders(
    @Headers('x-tenant-id') tenantId: string,
    @Param('orderType') orderType: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
  ) {
    return this.patientResultsService.getReportableOrders(tenantId, orderType, {
      ...(search ? { search } : {}),
      ...(limit ? { limit: parseInt(limit, 10) } : {}),
    });
  }
}
