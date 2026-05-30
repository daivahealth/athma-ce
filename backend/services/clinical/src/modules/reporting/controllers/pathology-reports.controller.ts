import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LAB_RESULT_AMEND, LAB_RESULT_ENTER, LAB_RESULT_READ, LAB_RESULT_VERIFY } from '@zeal/contracts';
import { JwtAuthGuard, Permissions, PermissionsGuard } from '@zeal/shared-utils';
import { AmendReportDto, TransitionReportStatusDto } from '../dto/report-status.dto';
import { CreatePathologyReportDto, UpdatePathologyReportDto } from '../dto/pathology-report.dto';
import { PathologyReportsService } from '../services/pathology-reports.service';

@ApiTags('Pathology Reports')
@ApiBearerAuth()
@Controller('pathology-reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PathologyReportsController {
  constructor(private readonly pathologyReportsService: PathologyReportsService) {}

  @Post()
  @Permissions(LAB_RESULT_ENTER)
  @ApiOperation({ summary: 'Create a draft pathology report for a narrative lab order' })
  @ApiResponse({ status: 201, description: 'Pathology report created' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreatePathologyReportDto,
  ) {
    return this.pathologyReportsService.create(tenantId, userId, dto);
  }

  @Get(':id')
  @Permissions(LAB_RESULT_READ)
  @ApiOperation({ summary: 'Get pathology report by ID' })
  @ApiResponse({ status: 200, description: 'Pathology report found' })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.pathologyReportsService.findById(tenantId, id);
  }

  @Get('order/:orderId')
  @Permissions(LAB_RESULT_READ)
  @ApiOperation({ summary: 'Get pathology reports for a lab order' })
  @ApiResponse({ status: 200, description: 'Pathology reports retrieved' })
  async findByOrder(
    @Headers('x-tenant-id') tenantId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.pathologyReportsService.findByOrder(tenantId, orderId);
  }

  @Patch(':id')
  @Permissions(LAB_RESULT_ENTER)
  @ApiOperation({ summary: 'Update a draft/preliminary pathology report' })
  @ApiResponse({ status: 200, description: 'Pathology report updated' })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePathologyReportDto,
  ) {
    return this.pathologyReportsService.update(tenantId, id, userId, dto);
  }

  @Post(':id/status')
  @Permissions(LAB_RESULT_ENTER)
  @ApiOperation({ summary: 'Transition pathology report status' })
  @ApiResponse({ status: 200, description: 'Status transitioned' })
  async transitionStatus(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: TransitionReportStatusDto,
  ) {
    return this.pathologyReportsService.transitionStatus(tenantId, id, userId, dto.status, dto.reason);
  }

  @Post(':id/verify')
  @Permissions(LAB_RESULT_VERIFY)
  @ApiOperation({ summary: 'Verify a pathology report' })
  @ApiResponse({ status: 200, description: 'Report verified' })
  async verify(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
  ) {
    return this.pathologyReportsService.verify(tenantId, id, userId);
  }

  @Post(':id/amend')
  @Permissions(LAB_RESULT_AMEND)
  @ApiOperation({ summary: 'Amend a finalized pathology report (creates new version)' })
  @ApiResponse({ status: 201, description: 'Amendment created' })
  async amend(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: AmendReportDto,
  ) {
    return this.pathologyReportsService.amend(tenantId, id, userId, dto.reason);
  }

  @Get(':id/history')
  @Permissions(LAB_RESULT_READ)
  @ApiOperation({ summary: 'Get status change history for a pathology report' })
  @ApiResponse({ status: 200, description: 'History retrieved' })
  async getHistory(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.pathologyReportsService.getHistory(tenantId, id);
  }
}
