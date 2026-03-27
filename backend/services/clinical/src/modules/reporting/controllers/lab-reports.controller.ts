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
  LAB_RESULT_READ,
  LAB_RESULT_ENTER,
  LAB_RESULT_VERIFY,
  LAB_RESULT_AMEND,
} from '@zeal/contracts';
import { LabReportsService } from '../services/lab-reports.service';
import { CreateLabReportDto, UpdateLabReportDto, SaveLabResultItemsDto } from '../dto/lab-report.dto';
import { TransitionReportStatusDto, AmendReportDto } from '../dto/report-status.dto';

@ApiTags('Lab Reports')
@ApiBearerAuth()
@Controller('lab-reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LabReportsController {
  constructor(private readonly labReportsService: LabReportsService) {}

  @Post()
  @Permissions(LAB_RESULT_ENTER)
  @ApiOperation({ summary: 'Create a draft lab report for an order' })
  @ApiResponse({ status: 201, description: 'Lab report created' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateLabReportDto,
  ) {
    return this.labReportsService.create(tenantId, userId, dto);
  }

  @Get(':id')
  @Permissions(LAB_RESULT_READ)
  @ApiOperation({ summary: 'Get lab report by ID with result items' })
  @ApiResponse({ status: 200, description: 'Lab report found' })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.labReportsService.findById(tenantId, id);
  }

  @Get('order/:orderId')
  @Permissions(LAB_RESULT_READ)
  @ApiOperation({ summary: 'Get lab reports for an order' })
  @ApiResponse({ status: 200, description: 'Lab reports retrieved' })
  async findByOrder(
    @Headers('x-tenant-id') tenantId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.labReportsService.findByOrder(tenantId, orderId);
  }

  @Patch(':id')
  @Permissions(LAB_RESULT_ENTER)
  @ApiOperation({ summary: 'Update a draft/preliminary lab report' })
  @ApiResponse({ status: 200, description: 'Lab report updated' })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateLabReportDto,
  ) {
    return this.labReportsService.update(tenantId, id, userId, dto);
  }

  @Post(':id/items')
  @Permissions(LAB_RESULT_ENTER)
  @ApiOperation({ summary: 'Save lab result items (batch replace)' })
  @ApiResponse({ status: 200, description: 'Result items saved' })
  async saveItems(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: SaveLabResultItemsDto,
  ) {
    return this.labReportsService.saveItems(tenantId, id, userId, dto.items);
  }

  @Post(':id/status')
  @Permissions(LAB_RESULT_ENTER)
  @ApiOperation({ summary: 'Transition lab report status' })
  @ApiResponse({ status: 200, description: 'Status transitioned' })
  async transitionStatus(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: TransitionReportStatusDto,
  ) {
    return this.labReportsService.transitionStatus(tenantId, id, userId, dto.status, dto.reason);
  }

  @Post(':id/verify')
  @Permissions(LAB_RESULT_VERIFY)
  @ApiOperation({ summary: 'Verify/sign off on a lab report' })
  @ApiResponse({ status: 200, description: 'Report verified' })
  async verify(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
  ) {
    return this.labReportsService.verify(tenantId, id, userId);
  }

  @Post(':id/amend')
  @Permissions(LAB_RESULT_AMEND)
  @ApiOperation({ summary: 'Amend a finalized lab report (creates new version)' })
  @ApiResponse({ status: 201, description: 'Amendment created' })
  async amend(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: AmendReportDto,
  ) {
    return this.labReportsService.amend(tenantId, id, userId, dto.reason);
  }

  @Get(':id/history')
  @Permissions(LAB_RESULT_READ)
  @ApiOperation({ summary: 'Get status change history for a lab report' })
  @ApiResponse({ status: 200, description: 'History retrieved' })
  async getHistory(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.labReportsService.getHistory(tenantId, id);
  }
}
