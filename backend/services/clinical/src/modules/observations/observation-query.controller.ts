import { Controller, Get, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ObservationQueryService } from './observation-query.service';
import { QueryObservationsDto, TrendsQueryDto } from './dto/query-observations.dto';

@ApiTags('Observations')
@ApiBearerAuth()
@Controller('observations')
export class ObservationQueryController {
  constructor(private readonly queryService: ObservationQueryService) {}

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get observations for a patient (paginated, filterable)' })
  async findByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query() query: QueryObservationsDto,
  ) {
    return this.queryService.findByPatient(tenantId, patientId, query);
  }

  @Get('patient/:patientId/latest')
  @ApiOperation({ summary: 'Get latest observation value per code for a patient' })
  async findLatestPerCode(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('category') category?: string,
    @Query('codes') codes?: string,
  ) {
    const codeList = codes ? codes.split(',').map((c) => c.trim()) : undefined;
    return this.queryService.findLatestPerCode(tenantId, patientId, category, codeList);
  }

  @Get('patient/:patientId/code/:code')
  @ApiOperation({ summary: 'Get time-series for a single LOINC code for a patient' })
  async findByCode(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Param('code') code: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.queryService.findByCode(tenantId, patientId, code, fromDate, toDate);
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get all observations for an encounter' })
  async findByEncounter(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.queryService.findByEncounter(tenantId, encounterId);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get aggregate trends (avg/min/max/count) by time bucket for a LOINC code' })
  async getTrends(
    @Headers('x-tenant-id') tenantId: string,
    @Query() query: TrendsQueryDto,
  ) {
    return this.queryService.getTrends(tenantId, query);
  }
}
