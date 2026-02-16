import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DeviceSyncOrchestratorService } from '../services/device-sync-orchestrator.service';
import {
  InitiateConnectionDto,
  CompleteConnectionDto,
  UpdateConnectionDto,
  TriggerSyncDto,
  BulkMetricsDto,
  DeviceConnectionResponseDto,
  SyncLogResponseDto,
  HealthMetricResponseDto,
  PatientDeviceDashboardDto,
  MetricType,
} from '../dto/device-sync.dto';
import { JwtAuthGuard, PermissionsGuard } from '@zeal/shared-utils';

@ApiTags('Device Sync')
@ApiBearerAuth()
@Controller('device-sync')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DeviceSyncController {
  constructor(private readonly orchestratorService: DeviceSyncOrchestratorService) { }

  // ============================================
  // Connection Endpoints
  // ============================================

  @Get('supported-devices')
  @ApiOperation({ summary: 'Get list of supported devices and their metrics' })
  getSupportedDevices() {
    return this.orchestratorService.getSupportedDevices();
  }

  @Post('connections/initiate')
  @ApiOperation({ summary: 'Initiate device connection (OAuth flow)' })
  @ApiResponse({ status: 201, description: 'Returns authorization URL' })
  async initiateConnection(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: InitiateConnectionDto,
  ) {
    return this.orchestratorService.initiateConnection(tenantId, userId, dto);
  }

  @Post('connections/:id/complete')
  @ApiOperation({ summary: 'Complete device connection after OAuth callback' })
  @ApiResponse({ status: 200, type: DeviceConnectionResponseDto })
  async completeConnection(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: CompleteConnectionDto,
  ) {
    return this.orchestratorService.completeConnection(tenantId, id, dto);
  }

  @Get('connections/:id')
  @ApiOperation({ summary: 'Get a device connection by ID' })
  @ApiResponse({ status: 200, type: DeviceConnectionResponseDto })
  async getConnection(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.orchestratorService.getConnection(tenantId, id);
  }

  @Get('connections/patient/:patientId')
  @ApiOperation({ summary: 'Get all device connections for a patient' })
  @ApiResponse({ status: 200, type: [DeviceConnectionResponseDto] })
  async getPatientConnections(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.orchestratorService.getPatientConnections(tenantId, patientId);
  }

  @Patch('connections/:id')
  @ApiOperation({ summary: 'Update a device connection' })
  @ApiResponse({ status: 200, type: DeviceConnectionResponseDto })
  async updateConnection(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateConnectionDto,
  ) {
    return this.orchestratorService.updateConnection(tenantId, id, dto);
  }

  @Delete('connections/:id')
  @ApiOperation({ summary: 'Disconnect a device' })
  @ApiResponse({ status: 200, type: DeviceConnectionResponseDto })
  async disconnectDevice(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.orchestratorService.disconnectDevice(tenantId, id);
  }

  // ============================================
  // Sync Endpoints
  // ============================================

  @Post('sync')
  @ApiOperation({ summary: 'Trigger a sync for a device connection' })
  async triggerSync(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: TriggerSyncDto,
  ) {
    return this.orchestratorService.triggerSync(tenantId, dto);
  }

  @Get('sync/logs/:connectionId')
  @ApiOperation({ summary: 'Get sync logs for a connection' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: [SyncLogResponseDto] })
  async getSyncLogs(
    @Headers('x-tenant-id') tenantId: string,
    @Param('connectionId') connectionId: string,
    @Query('limit') limit?: number,
  ) {
    const options: { limit?: number } = {};
    if (limit) options.limit = Number(limit);
    return this.orchestratorService.getSyncLogs(tenantId, connectionId, options);
  }

  // ============================================
  // Metrics Endpoints
  // ============================================

  @Post('metrics')
  @ApiOperation({ summary: 'Receive metrics from mobile app (push model)' })
  async receiveMetrics(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: BulkMetricsDto,
  ) {
    return this.orchestratorService.receiveMetrics(tenantId, dto);
  }

  @Get('metrics/patient/:patientId')
  @ApiOperation({ summary: 'Get health metrics for a patient' })
  @ApiQuery({ name: 'metricTypes', required: false, isArray: true, enum: MetricType })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: [HealthMetricResponseDto] })
  async getPatientMetrics(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('metricTypes') metricTypes?: MetricType[],
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: number,
  ) {
    const options: { metricTypes?: MetricType[]; startDate?: Date; endDate?: Date; limit?: number } = {};
    if (metricTypes) options.metricTypes = Array.isArray(metricTypes) ? metricTypes : [metricTypes];
    if (startDate) options.startDate = new Date(startDate);
    if (endDate) options.endDate = new Date(endDate);
    if (limit) options.limit = Number(limit);
    return this.orchestratorService.getPatientMetrics(tenantId, patientId, options);
  }

  @Get('metrics/patient/:patientId/summary')
  @ApiOperation({ summary: 'Get metric summaries for a patient' })
  @ApiQuery({ name: 'daysBack', required: false, type: Number })
  async getMetricSummaries(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('daysBack') daysBack?: number,
  ) {
    return this.orchestratorService.getMetricSummaries(
      tenantId,
      patientId,
      daysBack ? Number(daysBack) : undefined,
    );
  }

  // ============================================
  // Dashboard Endpoints
  // ============================================

  @Get('dashboard/patient/:patientId')
  @ApiOperation({ summary: 'Get device sync dashboard for a patient' })
  @ApiResponse({ status: 200, type: PatientDeviceDashboardDto })
  async getPatientDashboard(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.orchestratorService.getPatientDashboard(tenantId, patientId);
  }
}
