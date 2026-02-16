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
import { DeviceType, MetricType, HealthMetricDto } from '../dto/device-sync.dto';

@Injectable()
export class FitbitConnector extends BaseDeviceConnector {
  private readonly logger = new Logger(FitbitConnector.name);
  readonly deviceType = DeviceType.FITBIT;
  readonly supportedMetrics: MetricType[] = [
    MetricType.STEPS,
    MetricType.HEART_RATE,
    MetricType.HRV,
    MetricType.SLEEP,
    MetricType.BLOOD_OXYGEN,
    MetricType.WEIGHT,
    MetricType.BODY_FAT,
    MetricType.CALORIES,
    MetricType.ACTIVE_MINUTES,
    MetricType.DISTANCE,
    MetricType.FLOORS_CLIMBED,
    MetricType.RESPIRATORY_RATE,
  ];

  private readonly baseUrl = 'https://api.fitbit.com';
  private readonly authUrl = 'https://www.fitbit.com/oauth2/authorize';
  private readonly tokenUrl = 'https://api.fitbit.com/oauth2/token';

  constructor(private readonly configService: ConfigService) {
    super();
  }

  protected override getConfig(): OAuthConfig {
    return {
      clientId: this.configService.get<string>('FITBIT_CLIENT_ID') || '',
      clientSecret: this.configService.get<string>('FITBIT_CLIENT_SECRET') || '',
      authorizationUrl: this.authUrl,
      tokenUrl: this.tokenUrl,
      scopes: [
        'activity',
        'heartrate',
        'sleep',
        'weight',
        'oxygen_saturation',
        'respiratory_rate',
        'profile',
      ],
      redirectUri: this.configService.get<string>('FITBIT_REDIRECT_URI') || '',
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
    const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

    try {
      const response = await axios.post(
        this.tokenUrl,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri || config.redirectUri,
        }),
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
        tokenType: response.data.token_type,
        scope: response.data.scope,
      };
    } catch (error: any) {
      this.logger.error('Failed to exchange Fitbit code', error.response?.data || error.message);
      throw new HttpException('Failed to connect Fitbit account', HttpStatus.BAD_REQUEST);
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const config = this.getConfig();
    const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

    try {
      const response = await axios.post(
        this.tokenUrl,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
        tokenType: response.data.token_type,
      };
    } catch (error: any) {
      this.logger.error('Failed to refresh Fitbit token', error.response?.data || error.message);
      throw new HttpException('Failed to refresh Fitbit connection', HttpStatus.UNAUTHORIZED);
    }
  }

  async revokeAccess(tokens: OAuthTokens): Promise<void> {
    const config = this.getConfig();
    const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

    try {
      await axios.post(
        `${this.baseUrl}/oauth2/revoke`,
        new URLSearchParams({ token: tokens.accessToken }),
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
    } catch (error: any) {
      this.logger.warn('Failed to revoke Fitbit access', error.response?.data || error.message);
    }
  }

  async fetchMetrics(
    connection: DeviceConnection,
    startDate: Date,
    endDate: Date,
    metrics?: MetricType[],
  ): Promise<SyncResult> {
    const metricsToFetch = metrics || connection.selectedMetrics || this.supportedMetrics;
    const allMetrics: HealthMetricDto[] = [];
    const errors: string[] = [];

    let tokens = connection.credentials;
    if (this.tokensNeedRefresh(tokens) && tokens.refreshToken) {
      tokens = await this.refreshAccessToken(tokens.refreshToken);
    }

    const dateStr = this.formatDate(startDate);
    const endDateStr = this.formatDate(endDate);

    // Fetch different metric types
    if (metricsToFetch.includes(MetricType.STEPS) || metricsToFetch.includes(MetricType.CALORIES)) {
      try {
        const activityData = await this.fetchActivityData(tokens.accessToken, dateStr, endDateStr);
        allMetrics.push(...activityData);
      } catch (error: any) {
        errors.push(`Activity data: ${error.message}`);
      }
    }

    if (metricsToFetch.includes(MetricType.HEART_RATE)) {
      try {
        const heartRateData = await this.fetchHeartRateData(tokens.accessToken, dateStr, endDateStr);
        allMetrics.push(...heartRateData);
      } catch (error: any) {
        errors.push(`Heart rate: ${error.message}`);
      }
    }

    if (metricsToFetch.includes(MetricType.SLEEP)) {
      try {
        const sleepData = await this.fetchSleepData(tokens.accessToken, dateStr, endDateStr);
        allMetrics.push(...sleepData);
      } catch (error: any) {
        errors.push(`Sleep: ${error.message}`);
      }
    }

    if (metricsToFetch.includes(MetricType.WEIGHT) || metricsToFetch.includes(MetricType.BODY_FAT)) {
      try {
        const bodyData = await this.fetchBodyData(tokens.accessToken, dateStr, endDateStr);
        allMetrics.push(...bodyData);
      } catch (error: any) {
        errors.push(`Body metrics: ${error.message}`);
      }
    }

    if (metricsToFetch.includes(MetricType.BLOOD_OXYGEN)) {
      try {
        const spo2Data = await this.fetchSpO2Data(tokens.accessToken, dateStr, endDateStr);
        allMetrics.push(...spo2Data);
      } catch (error: any) {
        errors.push(`SpO2: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      recordsProcessed: allMetrics.length,
      metrics: allMetrics,
      errors: errors,
    };
  }

  async validateConnection(tokens: OAuthTokens): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/1/user/-/profile.json`, {
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
    const response = await axios.get(`${this.baseUrl}/1/user/-/profile.json`, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });

    return {
      externalUserId: response.data.user.encodedId,
      displayName: response.data.user.displayName,
    };
  }

  protected mapToStandardMetric(fitbitMetric: string): MetricType | null {
    const mapping: Record<string, MetricType> = {
      steps: MetricType.STEPS,
      caloriesOut: MetricType.CALORIES,
      heartRate: MetricType.HEART_RATE,
      sleep: MetricType.SLEEP,
      weight: MetricType.WEIGHT,
      fat: MetricType.BODY_FAT,
      distance: MetricType.DISTANCE,
      floors: MetricType.FLOORS_CLIMBED,
      activeMinutes: MetricType.ACTIVE_MINUTES,
      spo2: MetricType.BLOOD_OXYGEN,
    };
    return mapping[fitbitMetric] || null;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0] || '';
  }

  private async fetchActivityData(accessToken: string, startDate: string, endDate: string): Promise<HealthMetricDto[]> {
    const response = await axios.get(
      `${this.baseUrl}/1/user/-/activities/date/${startDate}.json`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const metrics: HealthMetricDto[] = [];
    const summary = response.data.summary;

    if (summary.steps) {
      metrics.push({
        metricType: MetricType.STEPS,
        value: summary.steps,
        unit: 'count',
        recordedAt: startDate,
        metadata: { source: 'fitbit' },
      });
    }

    if (summary.caloriesOut) {
      metrics.push({
        metricType: MetricType.CALORIES,
        value: summary.caloriesOut,
        unit: 'kcal',
        recordedAt: startDate,
        metadata: { source: 'fitbit' },
      });
    }

    if (summary.floors) {
      metrics.push({
        metricType: MetricType.FLOORS_CLIMBED,
        value: summary.floors,
        unit: 'floors',
        recordedAt: startDate,
        metadata: { source: 'fitbit' },
      });
    }

    if (summary.distances) {
      const totalDistance = summary.distances.find((d: any) => d.activity === 'total');
      if (totalDistance) {
        metrics.push({
          metricType: MetricType.DISTANCE,
          value: totalDistance.distance,
          unit: 'km',
          recordedAt: startDate,
          metadata: { source: 'fitbit' },
        });
      }
    }

    return metrics;
  }

  private async fetchHeartRateData(accessToken: string, startDate: string, endDate: string): Promise<HealthMetricDto[]> {
    const response = await axios.get(
      `${this.baseUrl}/1/user/-/activities/heart/date/${startDate}/1d.json`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const metrics: HealthMetricDto[] = [];
    const heartRateData = response.data['activities-heart']?.[0];

    if (heartRateData?.value?.restingHeartRate) {
      metrics.push({
        metricType: MetricType.HEART_RATE,
        value: heartRateData.value.restingHeartRate,
        unit: 'bpm',
        recordedAt: heartRateData.dateTime,
        metadata: {
          source: 'fitbit',
          type: 'resting',
          zones: heartRateData.value.heartRateZones,
        },
      });
    }

    return metrics;
  }

  private async fetchSleepData(accessToken: string, startDate: string, endDate: string): Promise<HealthMetricDto[]> {
    const response = await axios.get(
      `${this.baseUrl}/1.2/user/-/sleep/date/${startDate}.json`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const metrics: HealthMetricDto[] = [];
    const summary = response.data.summary;

    if (summary?.totalMinutesAsleep) {
      metrics.push({
        metricType: MetricType.SLEEP,
        value: summary.totalMinutesAsleep,
        unit: 'minutes',
        recordedAt: startDate,
        metadata: {
          source: 'fitbit',
          stages: summary.stages,
          efficiency: response.data.sleep?.[0]?.efficiency,
        },
      });
    }

    return metrics;
  }

  private async fetchBodyData(accessToken: string, startDate: string, endDate: string): Promise<HealthMetricDto[]> {
    const response = await axios.get(
      `${this.baseUrl}/1/user/-/body/log/weight/date/${startDate}/${endDate}.json`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const metrics: HealthMetricDto[] = [];

    for (const entry of response.data.weight || []) {
      metrics.push({
        metricType: MetricType.WEIGHT,
        value: entry.weight,
        unit: 'kg',
        recordedAt: `${entry.date}T${entry.time}`,
        metadata: { source: 'fitbit', bmi: entry.bmi },
      });

      if (entry.fat) {
        metrics.push({
          metricType: MetricType.BODY_FAT,
          value: entry.fat,
          unit: '%',
          recordedAt: `${entry.date}T${entry.time}`,
          metadata: { source: 'fitbit' },
        });
      }
    }

    return metrics;
  }

  private async fetchSpO2Data(accessToken: string, startDate: string, endDate: string): Promise<HealthMetricDto[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/1/user/-/spo2/date/${startDate}.json`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      const metrics: HealthMetricDto[] = [];
      const spo2Value = response.data?.value?.avg;

      if (spo2Value) {
        metrics.push({
          metricType: MetricType.BLOOD_OXYGEN,
          value: spo2Value,
          unit: '%',
          recordedAt: response.data.dateTime,
          metadata: {
            source: 'fitbit',
            min: response.data.value?.min,
            max: response.data.value?.max,
          },
        });
      }

      return metrics;
    } catch {
      // SpO2 data may not be available for all users
      return [];
    }
  }
}
