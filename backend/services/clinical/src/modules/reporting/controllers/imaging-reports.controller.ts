import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  IMAGING_RESULT_READ,
  IMAGING_RESULT_ENTER,
  IMAGING_RESULT_VERIFY,
  IMAGING_RESULT_AMEND,
} from '@zeal/contracts';
import { ImagingReportsService } from '../services/imaging-reports.service';
import { CreateImagingReportDto, UpdateImagingReportDto, CriticalFindingDto } from '../dto/imaging-report.dto';
import { TransitionReportStatusDto, AmendReportDto } from '../dto/report-status.dto';

@ApiTags('Imaging Reports')
@ApiBearerAuth()
@Controller('imaging-reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ImagingReportsController {
  constructor(private readonly imagingReportsService: ImagingReportsService) {}

  @Post()
  @Permissions(IMAGING_RESULT_ENTER)
  @ApiOperation({ summary: 'Create a draft imaging report for an order' })
  @ApiResponse({ status: 201, description: 'Imaging report created' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateImagingReportDto,
  ) {
    return this.imagingReportsService.create(tenantId, userId, dto);
  }

  @Get(':id')
  @Permissions(IMAGING_RESULT_READ)
  @ApiOperation({ summary: 'Get imaging report by ID' })
  @ApiResponse({ status: 200, description: 'Imaging report found' })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.imagingReportsService.findById(tenantId, id);
  }

  @Get('order/:orderId')
  @Permissions(IMAGING_RESULT_READ)
  @ApiOperation({ summary: 'Get imaging reports for an order' })
  @ApiResponse({ status: 200, description: 'Imaging reports retrieved' })
  async findByOrder(
    @Headers('x-tenant-id') tenantId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.imagingReportsService.findByOrder(tenantId, orderId);
  }

  @Patch(':id')
  @Permissions(IMAGING_RESULT_ENTER)
  @ApiOperation({ summary: 'Update a draft/preliminary imaging report' })
  @ApiResponse({ status: 200, description: 'Imaging report updated' })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateImagingReportDto,
  ) {
    return this.imagingReportsService.update(tenantId, id, userId, dto);
  }

  @Post(':id/status')
  @Permissions(IMAGING_RESULT_ENTER)
  @ApiOperation({ summary: 'Transition imaging report status' })
  @ApiResponse({ status: 200, description: 'Status transitioned' })
  async transitionStatus(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: TransitionReportStatusDto,
  ) {
    return this.imagingReportsService.transitionStatus(tenantId, id, userId, dto.status, dto.reason);
  }

  @Post(':id/verify')
  @Permissions(IMAGING_RESULT_VERIFY)
  @ApiOperation({ summary: 'Verify/review an imaging report' })
  @ApiResponse({ status: 200, description: 'Report verified' })
  async verify(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
  ) {
    return this.imagingReportsService.verify(tenantId, id, userId);
  }

  @Post(':id/critical-finding')
  @Permissions(IMAGING_RESULT_ENTER)
  @ApiOperation({ summary: 'Record critical finding notification' })
  @ApiResponse({ status: 200, description: 'Critical finding notification recorded' })
  async recordCriticalFinding(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: CriticalFindingDto,
  ) {
    return this.imagingReportsService.recordCriticalFinding(tenantId, id, userId, dto.notifiedTo);
  }

  @Post(':id/critical-finding/acknowledge')
  @Permissions(IMAGING_RESULT_READ)
  @ApiOperation({ summary: 'Acknowledge critical finding notification' })
  @ApiResponse({ status: 200, description: 'Critical finding acknowledged' })
  async acknowledgeCriticalFinding(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.imagingReportsService.acknowledgeCriticalFinding(tenantId, id);
  }

  @Post(':id/amend')
  @Permissions(IMAGING_RESULT_AMEND)
  @ApiOperation({ summary: 'Amend a finalized imaging report (creates new version)' })
  @ApiResponse({ status: 201, description: 'Amendment created' })
  async amend(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: AmendReportDto,
  ) {
    return this.imagingReportsService.amend(tenantId, id, userId, dto.reason);
  }

  @Get(':id/history')
  @Permissions(IMAGING_RESULT_READ)
  @ApiOperation({ summary: 'Get status change history for an imaging report' })
  @ApiResponse({ status: 200, description: 'History retrieved' })
  async getHistory(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.imagingReportsService.getHistory(tenantId, id);
  }
}
