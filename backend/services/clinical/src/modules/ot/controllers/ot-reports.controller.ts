import { Body, Controller, Get, Headers, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions, PermissionsGuard, JwtAuthGuard } from '@zeal/shared-utils';
import {
  OT_REPORT_AMEND,
  OT_REPORT_CANCEL,
  OT_REPORT_CREATE,
  OT_REPORT_READ,
  OT_REPORT_SIGN,
  OT_REPORT_UPDATE,
} from '@zeal/contracts';
import { OtReportsService } from '../services/ot-reports.service';
import { AmendOtReportDto, CreateOtReportDto, ListOtReportsDto, TransitionOtReportDto, UpdateOtReportDto } from '../dto/ot-report.dto';

@ApiTags('OT Reports')
@ApiBearerAuth()
@Controller('ot/reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OtReportsController {
  constructor(private readonly reportsService: OtReportsService) {}

  @Post()
  @Permissions(OT_REPORT_CREATE)
  create(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Body() dto: CreateOtReportDto) {
    return this.reportsService.create(tenantId, userId, dto);
  }

  @Get()
  @Permissions(OT_REPORT_READ)
  list(@Headers('x-tenant-id') tenantId: string, @Query() query: ListOtReportsDto) {
    return this.reportsService.list(tenantId, query);
  }

  @Get(':id')
  @Permissions(OT_REPORT_READ)
  findById(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.reportsService.findById(tenantId, id);
  }

  @Patch(':id')
  @Permissions(OT_REPORT_UPDATE)
  update(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: UpdateOtReportDto) {
    return this.reportsService.update(tenantId, id, userId, dto);
  }

  @Post(':id/sign')
  @Permissions(OT_REPORT_SIGN)
  sign(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: TransitionOtReportDto) {
    return this.reportsService.sign(tenantId, id, userId, dto.remarks);
  }

  @Post(':id/amend')
  @Permissions(OT_REPORT_AMEND)
  amend(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: AmendOtReportDto) {
    return this.reportsService.amend(tenantId, id, userId, dto);
  }

  @Post(':id/cancel')
  @Permissions(OT_REPORT_CANCEL)
  cancel(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: TransitionOtReportDto) {
    return this.reportsService.cancel(tenantId, id, userId, dto.remarks ?? dto.reason);
  }

  @Get(':id/versions')
  @Permissions(OT_REPORT_READ)
  versions(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.reportsService.getVersions(tenantId, id);
  }

  @Get(':id/versions/:versionNo')
  @Permissions(OT_REPORT_READ)
  version(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Param('versionNo') versionNo: string) {
    return this.reportsService.getVersion(tenantId, id, Number(versionNo));
  }
}
