import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { AppleHealthConnector } from '../connectors/apple-health.connector';
import { FitbitConnector } from '../connectors/fitbit.connector';
import { OuraConnector } from '../connectors/oura.connector';
import { DexcomConnector, LibreConnector } from '../connectors/cgm.connector';
import { BaseDeviceConnector, OAuthTokens, SyncResult } from '../connectors/base.connector';
import {
  DeviceType,
  MetricType,
  ConnectionStatus,
  SyncStatus,
  InitiateConnectionDto,
  CompleteConnectionDto,
  UpdateConnectionDto,
  TriggerSyncDto,
  HealthMetricDto,
  BulkMetricsDto,
  MetricSummaryDto,
} from '../dto/device-sync.dto';

@Injectable()
export class DeviceSyncOrchestratorService {
  private readonly logger = new Logger(DeviceSyncOrchestratorService.name);
  private readonly connectors: Map<string, BaseDeviceConnector>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly appleHealthConnector: AppleHealthConnector,
    private readonly fitbitConnector: FitbitConnector,
    private readonly ouraConnector: OuraConnector,
    private readonly dexcomConnector: DexcomConnector,
    private readonly libreConnector: LibreConnector,
  ) {
    this.connectors = new Map<string, BaseDeviceConnector>([
      [DeviceType.APPLE_HEALTH, appleHealthConnector],
      [DeviceType.FITBIT, fitbitConnector],
      [DeviceType.OURA, ouraConnector],
      [DeviceType.DEXCOM, dexcomConnector],
      [DeviceType.LIBRE, libreConnector],
    ]);
  }

  // ============================================
  // Connection Management
  // ============================================

  async initiateConnection(tenantId: string, userId: string, dto: InitiateConnectionDto) {
    const connector = this.getConnector(dto.deviceType);
    const state = crypto.randomUUID();

    // Create pending connection record
    const connection = await this.prisma.patientDeviceConnection.create({
      data: {
        tenantId,
        patientId: dto.patientId,
        platform: dto.deviceType,
        status: 'PENDING',
        syncEnabled: true,
        permissionsGranted: { state },
      },
    });

    const authorizationUrl = connector.getAuthorizationUrl(state, dto.redirectUri);

    return {
      connectionId: connection.id,
      authorizationUrl,
      state,
    };
  }

  async completeConnection(tenantId: string, connectionId: string, dto: CompleteConnectionDto) {
    const connection = await this.prisma.patientDeviceConnection.findFirst({
      where: { id: connectionId, tenantId },
    });

    if (!connection) {
      throw new NotFoundException(`Connection ${connectionId} not found`);
    }

    const connector = this.getConnector(connection.platform as DeviceType);

    // Validate state if provided
    const storedCredentials = connection.permissionsGranted as any;
    if (dto.state && storedCredentials?.state !== dto.state) {
      throw new BadRequestException('Invalid state parameter');
    }

    // Exchange code for tokens
    const tokens = await connector.exchangeCodeForTokens(dto.authorizationCode);

    // Get user profile from device
    const profile = await connector.getUserProfile(tokens);

    // Update connection with tokens
    const updatedConnection = await this.prisma.patientDeviceConnection.update({
      where: { id: connectionId },
      data: {
        status: 'CONNECTED',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || null,
        tokenExpiresAt: tokens.expiresAt || null,
        platformUserId: profile.externalUserId,
        permissionsGranted: connector.supportedMetrics,
      },
    });

    // Trigger initial sync
    this.triggerSync(tenantId, {
      connectionId,
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
      endDate: new Date().toISOString(),
    }).catch((err) => this.logger.error('Initial sync failed', err));

    return updatedConnection;
  }

  async updateConnection(tenantId: string, connectionId: string, dto: UpdateConnectionDto) {
    const connection = await this.prisma.patientDeviceConnection.findFirst({
      where: { id: connectionId, tenantId },
    });

    if (!connection) {
      throw new NotFoundException(`Connection ${connectionId} not found`);
    }

    const updateData: any = {};
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.syncEnabled !== undefined) updateData.syncEnabled = dto.syncEnabled;
    if (dto.selectedMetrics !== undefined) updateData.permissionsGranted = dto.selectedMetrics;

    return this.prisma.patientDeviceConnection.update({
      where: { id: connectionId },
      data: updateData,
    });
  }

  async disconnectDevice(tenantId: string, connectionId: string) {
    const connection = await this.prisma.patientDeviceConnection.findFirst({
      where: { id: connectionId, tenantId },
    });

    if (!connection) {
      throw new NotFoundException(`Connection ${connectionId} not found`);
    }

    const connector = this.getConnector(connection.platform as DeviceType);

    // Try to revoke access
    if (connection.accessToken) {
      try {
        await connector.revokeAccess({
          accessToken: connection.accessToken,
          refreshToken: connection.refreshToken ?? undefined,
        } as OAuthTokens);
      } catch (error) {
        this.logger.warn('Failed to revoke device access', error);
      }
    }

    // Update connection status
    return this.prisma.patientDeviceConnection.update({
      where: { id: connectionId },
      data: {
        status: 'REVOKED',
        syncEnabled: false,
        accessToken: null, // Clear credentials
        refreshToken: null,
        tokenExpiresAt: null,
      },
    });
  }

  async getPatientConnections(tenantId: string, patientId: string) {
    return this.prisma.patientDeviceConnection.findMany({
      where: { tenantId, patientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getConnection(tenantId: string, connectionId: string) {
    const connection = await this.prisma.patientDeviceConnection.findFirst({
      where: { id: connectionId, tenantId },
    });

    if (!connection) {
      throw new NotFoundException(`Connection ${connectionId} not found`);
    }

    return connection;
  }

  // ============================================
  // Sync Operations
  // ============================================

  async triggerSync(tenantId: string, dto: TriggerSyncDto) {
    const connection = await this.prisma.patientDeviceConnection.findFirst({
      where: { id: dto.connectionId, tenantId },
    });

    if (!connection) {
      throw new NotFoundException(`Connection ${dto.connectionId} not found`);
    }

    if (connection.status !== 'CONNECTED') {
      throw new BadRequestException('Connection is not active');
    }

    const connector = this.getConnector(connection.platform as DeviceType);
    const credentials = { accessToken: connection.accessToken, refreshToken: connection.refreshToken, expiresAt: connection.tokenExpiresAt };

    // Create sync log
    const syncLog = await this.prisma.deviceSyncLog.create({
      data: {
        tenantId,
        connectionId: connection.id,
        patientId: connection.patientId,
        syncType: 'manual',
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        dataStartDate: dto.startDate ? new Date(dto.startDate) : null,
        dataEndDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });

    try {
      // Refresh token if needed
      let tokens = {
        accessToken: credentials.accessToken || '',
        refreshToken: credentials.refreshToken ?? undefined,
        expiresAt: credentials.expiresAt ? new Date(credentials.expiresAt) : undefined,
      } as OAuthTokens;

      // Fetch metrics
      const startDate = dto.startDate ? new Date(dto.startDate) : new Date(Date.now() - 24 * 60 * 60 * 1000);
      const endDate = dto.endDate ? new Date(dto.endDate) : new Date();

      const result = await connector.fetchMetrics(
        {
          id: connection.id,
          tenantId,
          patientId: connection.patientId,
          deviceType: connection.platform as DeviceType,
          status: connection.status as ConnectionStatus,
          credentials: tokens,
          selectedMetrics: (connection.permissionsGranted as MetricType[]) || undefined,
        },
        startDate,
        endDate,
        dto.metrics,
      );

      // Save metrics to database
      if (result.metrics.length > 0) {
        await this.saveMetrics(tenantId, connection.id, connection.patientId, result.metrics);
      }

      // Update sync log
      await this.prisma.deviceSyncLog.update({
        where: { id: syncLog.id },
        data: {
          status: result.success ? 'COMPLETED' : 'PARTIAL',
          completedAt: new Date(),
          recordsProcessed: result.recordsProcessed,
          errorMessage: result.errors?.join('; ') ?? null,
        },
      });

      // Update connection last sync time
      await this.prisma.patientDeviceConnection.update({
        where: { id: connection.id },
        data: { lastSyncAt: new Date() },
      });

      return {
        syncLogId: syncLog.id,
        ...result,
      };
    } catch (error: any) {
      // Update sync log with error
      await this.prisma.deviceSyncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'FAILED',
          completedAt: new Date(),
          errorMessage: error.message,
        },
      });

      throw error;
    }
  }

  async getSyncLogs(tenantId: string, connectionId: string, options?: { limit?: number }) {
    return this.prisma.deviceSyncLog.findMany({
      where: { tenantId, connectionId },
      orderBy: { startedAt: 'desc' },
      take: options?.limit || 10,
    });
  }

  // ============================================
  // Metric Management
  // ============================================

  async saveMetrics(tenantId: string, connectionId: string, patientId: string, metrics: HealthMetricDto[]) {
    const data = metrics.map((m) => ({
      tenantId,
      connectionId,
      patientId,
      metricType: m.metricType,
      value: m.value,
      unit: m.unit || '',
      recordedAt: new Date(m.recordedAt),
      source: (m.metadata?.source as string) || 'device',
      metadata: m.metadata || {},
    }));

    return this.prisma.deviceHealthMetric.createMany({ data });
  }

  async receiveMetrics(tenantId: string, dto: BulkMetricsDto) {
    const connection = await this.prisma.patientDeviceConnection.findFirst({
      where: { id: dto.connectionId, tenantId },
    });

    if (!connection) {
      throw new NotFoundException(`Connection ${dto.connectionId} not found`);
    }

    await this.saveMetrics(tenantId, connection.id, connection.patientId, dto.metrics);

    // Update last sync time
    await this.prisma.patientDeviceConnection.update({
      where: { id: connection.id },
      data: { lastSyncAt: new Date() },
    });

    return { saved: dto.metrics.length };
  }

  async getPatientMetrics(
    tenantId: string,
    patientId: string,
    options?: {
      metricTypes?: MetricType[];
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    },
  ) {
    const where: any = { tenantId, patientId };

    if (options?.metricTypes?.length) {
      where.metricType = { in: options.metricTypes };
    }

    if (options?.startDate || options?.endDate) {
      where.recordedAt = {};
      if (options?.startDate) where.recordedAt.gte = options.startDate;
      if (options?.endDate) where.recordedAt.lte = options.endDate;
    }

    return this.prisma.deviceHealthMetric.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: options?.limit || 100,
    });
  }

  async getMetricSummaries(tenantId: string, patientId: string, daysBack = 30): Promise<MetricSummaryDto[]> {
    const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

    const metrics = await this.prisma.deviceHealthMetric.findMany({
      where: {
        tenantId,
        patientId,
        recordedAt: { gte: startDate },
      },
      orderBy: { recordedAt: 'desc' },
    });

    // Group by metric type
    const grouped: Record<string, typeof metrics> = {};
    for (const metric of metrics) {
      if (!grouped[metric.metricType]) grouped[metric.metricType] = [];
      grouped[metric.metricType]!.push(metric);
    }

    const summaries: MetricSummaryDto[] = [];

    for (const [metricType, records] of Object.entries(grouped)) {
      const values = records.map((r) => Number(r.value));
      const latest = records[0]!;

      summaries.push({
        metricType: metricType as MetricType,
        latestValue: Number(latest.value),
        averageValue: values.reduce((a, b) => a + b, 0) / values.length,
        minValue: Math.min(...values),
        maxValue: Math.max(...values),
        recordCount: records.length,
        lastRecordedAt: latest.recordedAt,
      });
    }

    return summaries;
  }

  async getPatientDashboard(tenantId: string, patientId: string) {
    const [connections, metricSummaries, recentSyncs] = await Promise.all([
      this.getPatientConnections(tenantId, patientId),
      this.getMetricSummaries(tenantId, patientId),
      this.prisma.deviceSyncLog.findMany({
        where: {
          tenantId,
          connection: { patientId },
        },
        orderBy: { startedAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      patientId,
      connections,
      metricSummaries,
      recentSyncs,
    };
  }

  // ============================================
  // Helper Methods
  // ============================================

  private getConnector(deviceType: DeviceType): BaseDeviceConnector {
    const connector = this.connectors.get(deviceType);
    if (!connector) {
      throw new BadRequestException(`Unsupported device type: ${deviceType}`);
    }
    return connector;
  }

  getSupportedDevices() {
    return Array.from(this.connectors.entries()).map(([type, connector]) => ({
      deviceType: type,
      supportedMetrics: connector.supportedMetrics,
    }));
  }
}
