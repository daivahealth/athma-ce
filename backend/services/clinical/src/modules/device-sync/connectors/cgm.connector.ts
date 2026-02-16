import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  BaseDeviceConnector,
  OAuthTokens,
  DeviceConnection,
  SyncResult,
  OAuthConfig,
} from './base.connector';
import { DeviceType, MetricType, HealthMetricDto, CGMReadingDto, CGMSummaryDto } from '../dto/device-sync.dto';

/**
 * Dexcom CGM Connector
 *
 * Supports Dexcom G6, G7, and ONE devices via Dexcom API
 */
@Injectable()
export class DexcomConnector extends BaseDeviceConnector {
  private readonly logger = new Logger(DexcomConnector.name);
  readonly deviceType = DeviceType.DEXCOM;
  readonly supportedMetrics: MetricType[] = [MetricType.BLOOD_GLUCOSE];

  // Use sandbox URL for development, production URL for prod
  private readonly baseUrl: string;
  private readonly authUrl = 'https://api.dexcom.com/v2/oauth2/login';
  private readonly tokenUrl = 'https://api.dexcom.com/v2/oauth2/token';

  constructor(private readonly configService: ConfigService) {
    super();
    this.baseUrl = this.configService.get<string>('DEXCOM_USE_SANDBOX') === 'true'
      ? 'https://sandbox-api.dexcom.com/v3'
      : 'https://api.dexcom.com/v3';
  }

  protected override getConfig(): OAuthConfig {
    return {
      clientId: this.configService.get<string>('DEXCOM_CLIENT_ID') || '',
      clientSecret: this.configService.get<string>('DEXCOM_CLIENT_SECRET') || '',
      authorizationUrl: this.authUrl,
      tokenUrl: this.tokenUrl,
      scopes: ['offline_access'],
      redirectUri: this.configService.get<string>('DEXCOM_REDIRECT_URI') || '',
    };
  }

  getAuthorizationUrl(state: string, redirectUri?: string): string {
    const config = this.getConfig();
    const params = new URLSearchParams({
      client_id: config.clientId,
      response_type: 'code',
      scope: config.scopes.join(' '),
      redirect_uri: redirectUri || config.redirectUri,
      state,
    });
    return `${this.authUrl}?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string, redirectUri?: string): Promise<OAuthTokens> {
    const config = this.getConfig();

    try {
      const response = await axios.post(
        this.tokenUrl,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uri: redirectUri || config.redirectUri,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
        tokenType: response.data.token_type,
      };
    } catch (error: any) {
      this.logger.error('Failed to exchange Dexcom code', error.response?.data || error.message);
      throw new HttpException('Failed to connect Dexcom account', HttpStatus.BAD_REQUEST);
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const config = this.getConfig();

    try {
      const response = await axios.post(
        this.tokenUrl,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: config.clientId,
          client_secret: config.clientSecret,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
        tokenType: response.data.token_type,
      };
    } catch (error: any) {
      this.logger.error('Failed to refresh Dexcom token', error.response?.data || error.message);
      throw new HttpException('Failed to refresh Dexcom connection', HttpStatus.UNAUTHORIZED);
    }
  }

  async revokeAccess(tokens: OAuthTokens): Promise<void> {
    // Dexcom users must revoke access from their Dexcom account
    this.logger.log('Dexcom access revocation - user must revoke from Dexcom settings');
  }

  async fetchMetrics(
    connection: DeviceConnection,
    startDate: Date,
    endDate: Date,
    metrics?: MetricType[],
  ): Promise<SyncResult> {
    let tokens = connection.credentials;
    if (this.tokensNeedRefresh(tokens) && tokens.refreshToken) {
      tokens = await this.refreshAccessToken(tokens.refreshToken);
    }

    try {
      const glucoseReadings = await this.fetchGlucoseData(
        tokens.accessToken,
        startDate,
        endDate,
      );

      return {
        success: true,
        recordsProcessed: glucoseReadings.length,
        metrics: glucoseReadings,
      };
    } catch (error: any) {
      this.logger.error('Failed to fetch Dexcom data', error.response?.data || error.message);
      return {
        success: false,
        recordsProcessed: 0,
        metrics: [],
        errors: [error.message],
      };
    }
  }

  async validateConnection(tokens: OAuthTokens): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/users/self/dataRange`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });
      return true;
    } catch {
      return false;
    }
  }

  async getUserProfile(tokens: OAuthTokens): Promise<{
    externalUserId: string;
    displayName?: string;
    email?: string;
  }> {
    // Dexcom doesn't expose user profile info via API
    // Return a placeholder
    return {
      externalUserId: 'dexcom-user',
      displayName: 'Dexcom CGM User',
    };
  }

  protected mapToStandardMetric(dexcomMetric: string): MetricType | null {
    if (dexcomMetric === 'egv' || dexcomMetric === 'glucose') {
      return MetricType.BLOOD_GLUCOSE;
    }
    return null;
  }

  private async fetchGlucoseData(
    accessToken: string,
    startDate: Date,
    endDate: Date,
  ): Promise<HealthMetricDto[]> {
    const response = await axios.get(
      `${this.baseUrl}/users/self/egvs`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      },
    );

    const metrics: HealthMetricDto[] = [];

    for (const egv of response.data.records || []) {
      metrics.push({
        metricType: MetricType.BLOOD_GLUCOSE,
        value: egv.value,
        unit: 'mg/dL',
        recordedAt: egv.systemTime,
        metadata: {
          source: 'dexcom',
          trend: this.mapDexcomTrend(egv.trend),
          trendRate: egv.trendRate,
          transmitterGeneration: egv.transmitterGeneration,
          displayDevice: egv.displayDevice,
        },
      });
    }

    return metrics;
  }

  private mapDexcomTrend(dexcomTrend: string): string {
    const trendMap: Record<string, string> = {
      doubleUp: 'rising_rapidly',
      singleUp: 'rising',
      fortyFiveUp: 'rising',
      flat: 'stable',
      fortyFiveDown: 'falling',
      singleDown: 'falling',
      doubleDown: 'falling_rapidly',
    };
    return trendMap[dexcomTrend] || 'unknown';
  }

  /**
   * Calculate CGM summary statistics
   */
  calculateCGMSummary(readings: HealthMetricDto[], lowThreshold = 70, highThreshold = 180): CGMSummaryDto {
    if (readings.length === 0) {
      return {
        averageGlucose: 0,
        timeInRange: 0,
        timeAboveRange: 0,
        timeBelowRange: 0,
        glucoseVariability: 0,
        estimatedA1C: 0,
        periodStart: new Date(),
        periodEnd: new Date(),
        readingCount: 0,
      };
    }

    const values = readings.map((r) => r.value);
    const average = values.reduce((a, b) => a + b, 0) / values.length;

    // Time in range calculation
    const inRange = values.filter((v) => v >= lowThreshold && v <= highThreshold).length;
    const aboveRange = values.filter((v) => v > highThreshold).length;
    const belowRange = values.filter((v) => v < lowThreshold).length;

    // Glucose variability (coefficient of variation)
    const stdDev = Math.sqrt(
      values.reduce((sum, v) => sum + Math.pow(v - average, 2), 0) / values.length,
    );
    const cv = (stdDev / average) * 100;

    // Estimated A1C using eAG formula: A1C = (eAG + 46.7) / 28.7
    const estimatedA1C = (average + 46.7) / 28.7;

    const sortedReadings = [...readings].sort(
      (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
    );

    return {
      averageGlucose: Math.round(average),
      timeInRange: Math.round((inRange / values.length) * 100),
      timeAboveRange: Math.round((aboveRange / values.length) * 100),
      timeBelowRange: Math.round((belowRange / values.length) * 100),
      glucoseVariability: Math.round(cv * 10) / 10,
      estimatedA1C: Math.round(estimatedA1C * 10) / 10,
      periodStart: new Date(sortedReadings[0]!.recordedAt),
      periodEnd: new Date(sortedReadings[sortedReadings.length - 1]!.recordedAt),
      readingCount: values.length,
    };
  }
}

/**
 * Abbott Libre CGM Connector
 *
 * Supports FreeStyle Libre devices via LibreView API
 */
@Injectable()
export class LibreConnector extends BaseDeviceConnector {
  private readonly logger = new Logger(LibreConnector.name);
  readonly deviceType = DeviceType.LIBRE;
  readonly supportedMetrics: MetricType[] = [MetricType.BLOOD_GLUCOSE];

  private readonly baseUrl = 'https://api.libreview.io';

  constructor(private readonly configService: ConfigService) {
    super();
  }

  protected override getConfig(): OAuthConfig {
    return {
      clientId: this.configService.get<string>('LIBRE_CLIENT_ID') || '',
      clientSecret: this.configService.get<string>('LIBRE_CLIENT_SECRET') || '',
      authorizationUrl: `${this.baseUrl}/auth`,
      tokenUrl: `${this.baseUrl}/auth/token`,
      scopes: ['glucose'],
      redirectUri: this.configService.get<string>('LIBRE_REDIRECT_URI') || '',
    };
  }

  getAuthorizationUrl(state: string, redirectUri?: string): string {
    // LibreView uses username/password auth, not OAuth
    // Users link their account through a special flow
    return `zeal://health-connect?state=${state}&provider=libre`;
  }

  async exchangeCodeForTokens(code: string, redirectUri?: string): Promise<OAuthTokens> {
    // LibreView authentication is different - uses session tokens
    // The mobile app handles the connection and provides the auth token
    return {
      accessToken: code,
      tokenType: 'session',
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const config = this.getConfig();

    try {
      const response = await axios.post(
        `${this.baseUrl}/auth/token`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
            'product': 'llu.android',
            'version': '4.7.0',
          },
        },
      );

      return {
        accessToken: response.data.data.authTicket.token,
        refreshToken: response.data.data.authTicket.token,
        expiresAt: new Date(response.data.data.authTicket.expires * 1000),
      };
    } catch (error: any) {
      this.logger.error('Failed to refresh Libre token', error.response?.data || error.message);
      throw new HttpException('Failed to refresh Libre connection', HttpStatus.UNAUTHORIZED);
    }
  }

  async revokeAccess(tokens: OAuthTokens): Promise<void> {
    // Users must revoke access from their LibreView account
    this.logger.log('Libre access revocation - user must revoke from LibreView settings');
  }

  async fetchMetrics(
    connection: DeviceConnection,
    startDate: Date,
    endDate: Date,
    metrics?: MetricType[],
  ): Promise<SyncResult> {
    try {
      const glucoseReadings = await this.fetchGlucoseData(
        connection.credentials.accessToken,
        startDate,
        endDate,
      );

      return {
        success: true,
        recordsProcessed: glucoseReadings.length,
        metrics: glucoseReadings,
      };
    } catch (error: any) {
      this.logger.error('Failed to fetch Libre data', error.response?.data || error.message);
      return {
        success: false,
        recordsProcessed: 0,
        metrics: [],
        errors: [error.message],
      };
    }
  }

  async validateConnection(tokens: OAuthTokens): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/user`, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          'product': 'llu.android',
          'version': '4.7.0',
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  async getUserProfile(tokens: OAuthTokens): Promise<{
    externalUserId: string;
    displayName?: string;
    email?: string;
  }> {
    const response = await axios.get(`${this.baseUrl}/user`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        'product': 'llu.android',
        'version': '4.7.0',
      },
    });

    return {
      externalUserId: response.data.data.user.id,
      displayName: `${response.data.data.user.firstName} ${response.data.data.user.lastName}`,
      email: response.data.data.user.email,
    };
  }

  protected mapToStandardMetric(libreMetric: string): MetricType | null {
    if (libreMetric === 'glucose' || libreMetric === 'sgv') {
      return MetricType.BLOOD_GLUCOSE;
    }
    return null;
  }

  private async fetchGlucoseData(
    accessToken: string,
    startDate: Date,
    endDate: Date,
  ): Promise<HealthMetricDto[]> {
    // Libre uses a connections-based model where you fetch data for "patients"
    // First get the connections (linked patients)
    const connectionsResponse = await axios.get(`${this.baseUrl}/llu/connections`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'product': 'llu.android',
        'version': '4.7.0',
      },
    });

    const metrics: HealthMetricDto[] = [];

    for (const connection of connectionsResponse.data.data || []) {
      // Get glucose data for each connection
      const glucoseResponse = await axios.get(
        `${this.baseUrl}/llu/connections/${connection.patientId}/graph`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'product': 'llu.android',
            'version': '4.7.0',
          },
        },
      );

      for (const reading of glucoseResponse.data.data.graphData || []) {
        const readingDate = new Date(reading.Timestamp);
        if (readingDate >= startDate && readingDate <= endDate) {
          metrics.push({
            metricType: MetricType.BLOOD_GLUCOSE,
            value: reading.Value,
            unit: 'mg/dL',
            recordedAt: reading.Timestamp,
            metadata: {
              source: 'libre',
              isHigh: reading.isHigh,
              isLow: reading.isLow,
              measurementColor: reading.MeasurementColor,
            },
          });
        }
      }
    }

    return metrics;
  }

  /**
   * Calculate CGM summary statistics (same as Dexcom)
   */
  calculateCGMSummary(readings: HealthMetricDto[], lowThreshold = 70, highThreshold = 180): CGMSummaryDto {
    if (readings.length === 0) {
      return {
        averageGlucose: 0,
        timeInRange: 0,
        timeAboveRange: 0,
        timeBelowRange: 0,
        glucoseVariability: 0,
        estimatedA1C: 0,
        periodStart: new Date(),
        periodEnd: new Date(),
        readingCount: 0,
      };
    }

    const values = readings.map((r) => r.value);
    const average = values.reduce((a, b) => a + b, 0) / values.length;

    const inRange = values.filter((v) => v >= lowThreshold && v <= highThreshold).length;
    const aboveRange = values.filter((v) => v > highThreshold).length;
    const belowRange = values.filter((v) => v < lowThreshold).length;

    const stdDev = Math.sqrt(
      values.reduce((sum, v) => sum + Math.pow(v - average, 2), 0) / values.length,
    );
    const cv = (stdDev / average) * 100;
    const estimatedA1C = (average + 46.7) / 28.7;

    const sortedReadings = [...readings].sort(
      (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
    );

    return {
      averageGlucose: Math.round(average),
      timeInRange: Math.round((inRange / values.length) * 100),
      timeAboveRange: Math.round((aboveRange / values.length) * 100),
      timeBelowRange: Math.round((belowRange / values.length) * 100),
      glucoseVariability: Math.round(cv * 10) / 10,
      estimatedA1C: Math.round(estimatedA1C * 10) / 10,
      periodStart: new Date(sortedReadings[0]!.recordedAt),
      periodEnd: new Date(sortedReadings[sortedReadings.length - 1]!.recordedAt),
      readingCount: values.length,
    };
  }
}
