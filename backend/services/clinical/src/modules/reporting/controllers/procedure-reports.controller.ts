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
  PROCEDURE_RESULT_READ,
  PROCEDURE_RESULT_ENTER,
  PROCEDURE_RESULT_VERIFY,
  PROCEDURE_RESULT_AMEND,
} from '@zeal/contracts';
import { ProcedureReportsService } from '../services/procedure-reports.service';
import { CreateProcedureReportDto, UpdateProcedureReportDto } from '../dto/procedure-report.dto';
import { TransitionReportStatusDto, AmendReportDto } from '../dto/report-status.dto';

@ApiTags('Procedure Reports')
@ApiBearerAuth()
@Controller('procedure-reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProcedureReportsController {
  constructor(private readonly procedureReportsService: ProcedureReportsService) {}

  @Post()
  @Permissions(PROCEDURE_RESULT_ENTER)
  @ApiOperation({ summary: 'Create a draft procedure report for an order' })
  @ApiResponse({ status: 201, description: 'Procedure report created' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateProcedureReportDto,
  ) {
    return this.procedureReportsService.create(tenantId, userId, dto);
  }

  @Get(':id')
  @Permissions(PROCEDURE_RESULT_READ)
  @ApiOperation({ summary: 'Get procedure report by ID' })
  @ApiResponse({ status: 200, description: 'Procedure report found' })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.procedureReportsService.findById(tenantId, id);
  }

  @Get('order/:orderId')
  @Permissions(PROCEDURE_RESULT_READ)
  @ApiOperation({ summary: 'Get procedure reports for an order' })
  @ApiResponse({ status: 200, description: 'Procedure reports retrieved' })
  async findByOrder(
    @Headers('x-tenant-id') tenantId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.procedureReportsService.findByOrder(tenantId, orderId);
  }

  @Patch(':id')
  @Permissions(PROCEDURE_RESULT_ENTER)
  @ApiOperation({ summary: 'Update a draft/preliminary procedure report' })
  @ApiResponse({ status: 200, description: 'Procedure report updated' })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProcedureReportDto,
  ) {
    return this.procedureReportsService.update(tenantId, id, userId, dto);
  }

  @Post(':id/status')
  @Permissions(PROCEDURE_RESULT_ENTER)
  @ApiOperation({ summary: 'Transition procedure report status' })
  @ApiResponse({ status: 200, description: 'Status transitioned' })
  async transitionStatus(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: TransitionReportStatusDto,
  ) {
    return this.procedureReportsService.transitionStatus(tenantId, id, userId, dto.status, dto.reason);
  }

  @Post(':id/verify')
  @Permissions(PROCEDURE_RESULT_VERIFY)
  @ApiOperation({ summary: 'Verify a procedure report' })
  @ApiResponse({ status: 200, description: 'Report verified' })
  async verify(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
  ) {
    return this.procedureReportsService.verify(tenantId, id, userId);
  }

  @Post(':id/amend')
  @Permissions(PROCEDURE_RESULT_AMEND)
  @ApiOperation({ summary: 'Amend a finalized procedure report (creates new version)' })
  @ApiResponse({ status: 201, description: 'Amendment created' })
  async amend(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: AmendReportDto,
  ) {
    return this.procedureReportsService.amend(tenantId, id, userId, dto.reason);
  }

  @Get(':id/history')
  @Permissions(PROCEDURE_RESULT_READ)
  @ApiOperation({ summary: 'Get status change history for a procedure report' })
  @ApiResponse({ status: 200, description: 'History retrieved' })
  async getHistory(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.procedureReportsService.getHistory(tenantId, id);
  }
}
