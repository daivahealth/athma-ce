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
export class OuraConnector extends BaseDeviceConnector {
  private readonly logger = new Logger(OuraConnector.name);
  readonly deviceType = DeviceType.OURA;
  readonly supportedMetrics: MetricType[] = [
    MetricType.SLEEP,
    MetricType.HEART_RATE,
    MetricType.HRV,
    MetricType.BODY_TEMPERATURE,
    MetricType.RESPIRATORY_RATE,
    MetricType.READINESS,
    MetricType.STEPS,
    MetricType.CALORIES,
    MetricType.ACTIVE_MINUTES,
  ];

  private readonly baseUrl = 'https://api.ouraring.com/v2';
  private readonly authUrl = 'https://cloud.ouraring.com/oauth/authorize';
  private readonly tokenUrl = 'https://api.ouraring.com/oauth/token';

  constructor(private readonly configService: ConfigService) {
    super();
  }

  protected override getConfig(): OAuthConfig {
    return {
      clientId: this.configService.get<string>('OURA_CLIENT_ID') || '',
      clientSecret: this.configService.get<string>('OURA_CLIENT_SECRET') || '',
      authorizationUrl: this.authUrl,
      tokenUrl: this.tokenUrl,
      scopes: ['daily', 'heartrate', 'personal', 'session', 'spo2', 'workout'],
      redirectUri: this.configService.get<string>('OURA_REDIRECT_URI') || '',
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
      this.logger.error('Failed to exchange Oura code', error.response?.data || error.message);
      throw new HttpException('Failed to connect Oura account', HttpStatus.BAD_REQUEST);
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
      this.logger.error('Failed to refresh Oura token', error.response?.data || error.message);
      throw new HttpException('Failed to refresh Oura connection', HttpStatus.UNAUTHORIZED);
    }
  }

  async revokeAccess(tokens: OAuthTokens): Promise<void> {
    // Oura doesn't have a public revoke endpoint
    // Users must revoke access from their Oura account settings
    this.logger.log('Oura access revocation - user must revoke from Oura settings');
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

    const startStr = this.formatDate(startDate);
    const endStr = this.formatDate(endDate);

    // Fetch sleep data
    if (metricsToFetch.includes(MetricType.SLEEP) || metricsToFetch.includes(MetricType.HRV)) {
      try {
        const sleepData = await this.fetchSleepData(tokens.accessToken, startStr, endStr);
        allMetrics.push(...sleepData);
      } catch (error: any) {
        errors.push(`Sleep: ${error.message}`);
      }
    }

    // Fetch daily activity
    if (metricsToFetch.includes(MetricType.STEPS) || metricsToFetch.includes(MetricType.CALORIES)) {
      try {
        const activityData = await this.fetchActivityData(tokens.accessToken, startStr, endStr);
        allMetrics.push(...activityData);
      } catch (error: any) {
        errors.push(`Activity: ${error.message}`);
      }
    }

    // Fetch readiness data
    if (metricsToFetch.includes(MetricType.READINESS)) {
      try {
        const readinessData = await this.fetchReadinessData(tokens.accessToken, startStr, endStr);
        allMetrics.push(...readinessData);
      } catch (error: any) {
        errors.push(`Readiness: ${error.message}`);
      }
    }

    // Fetch heart rate data
    if (metricsToFetch.includes(MetricType.HEART_RATE)) {
      try {
        const heartRateData = await this.fetchHeartRateData(tokens.accessToken, startStr, endStr);
        allMetrics.push(...heartRateData);
      } catch (error: any) {
        errors.push(`Heart rate: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      recordsProcessed: allMetrics.length,
      metrics: allMetrics,
      errors: errors.length > 0 ? errors : [],
    };
  }

  async validateConnection(tokens: OAuthTokens): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/usercollection/personal_info`, {
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
    const response = await axios.get(`${this.baseUrl}/usercollection/personal_info`, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });

    return {
      externalUserId: response.data.id,
      email: response.data.email,
    };
  }

  protected mapToStandardMetric(ouraMetric: string): MetricType | null {
    const mapping: Record<string, MetricType> = {
      sleep: MetricType.SLEEP,
      hrv: MetricType.HRV,
      heart_rate: MetricType.HEART_RATE,
      steps: MetricType.STEPS,
      calories: MetricType.CALORIES,
      readiness: MetricType.READINESS,
      body_temperature: MetricType.BODY_TEMPERATURE,
      respiratory_rate: MetricType.RESPIRATORY_RATE,
    };
    return mapping[ouraMetric] || null;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]!;
  }

  private async fetchSleepData(accessToken: string, startDate: string, endDate: string): Promise<HealthMetricDto[]> {
    const response = await axios.get(
      `${this.baseUrl}/usercollection/daily_sleep?start_date=${startDate}&end_date=${endDate}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const metrics: HealthMetricDto[] = [];

    for (const sleep of response.data.data || []) {
      // Total sleep duration
      if (sleep.contributors?.total_sleep) {
        metrics.push({
          metricType: MetricType.SLEEP,
          value: sleep.contributors.total_sleep,
          unit: 'seconds',
          recordedAt: sleep.day,
          metadata: {
            source: 'oura',
            score: sleep.score,
            efficiency: sleep.contributors?.efficiency,
            latency: sleep.contributors?.latency,
            rem_sleep: sleep.contributors?.rem_sleep,
            deep_sleep: sleep.contributors?.deep_sleep,
          },
        });
      }

      // HRV during sleep
      if (sleep.contributors?.hrv_balance) {
        metrics.push({
          metricType: MetricType.HRV,
          value: sleep.contributors.hrv_balance,
          unit: 'score',
          recordedAt: sleep.day,
          metadata: { source: 'oura', type: 'sleep_hrv' },
        });
      }

      // Body temperature deviation
      if (sleep.contributors?.body_temperature) {
        metrics.push({
          metricType: MetricType.BODY_TEMPERATURE,
          value: sleep.contributors.body_temperature,
          unit: 'deviation',
          recordedAt: sleep.day,
          metadata: { source: 'oura', type: 'sleep_temp_deviation' },
        });
      }
    }

    return metrics;
  }

  private async fetchActivityData(accessToken: string, startDate: string, endDate: string): Promise<HealthMetricDto[]> {
    const response = await axios.get(
      `${this.baseUrl}/usercollection/daily_activity?start_date=${startDate}&end_date=${endDate}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const metrics: HealthMetricDto[] = [];

    for (const activity of response.data.data || []) {
      if (activity.steps) {
        metrics.push({
          metricType: MetricType.STEPS,
          value: activity.steps,
          unit: 'count',
          recordedAt: activity.day,
          metadata: { source: 'oura', score: activity.score },
        });
      }

      if (activity.active_calories) {
        metrics.push({
          metricType: MetricType.CALORIES,
          value: activity.active_calories,
          unit: 'kcal',
          recordedAt: activity.day,
          metadata: {
            source: 'oura',
            total_calories: activity.total_calories,
            equivalent_walking_distance: activity.equivalent_walking_distance,
          },
        });
      }

      if (activity.high_activity_time) {
        metrics.push({
          metricType: MetricType.ACTIVE_MINUTES,
          value: Math.round(activity.high_activity_time / 60), // Convert seconds to minutes
          unit: 'minutes',
          recordedAt: activity.day,
          metadata: {
            source: 'oura',
            high_activity_time: activity.high_activity_time,
            medium_activity_time: activity.medium_activity_time,
            low_activity_time: activity.low_activity_time,
          },
        });
      }
    }

    return metrics;
  }

  private async fetchReadinessData(accessToken: string, startDate: string, endDate: string): Promise<HealthMetricDto[]> {
    const response = await axios.get(
      `${this.baseUrl}/usercollection/daily_readiness?start_date=${startDate}&end_date=${endDate}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const metrics: HealthMetricDto[] = [];

    for (const readiness of response.data.data || []) {
      if (readiness.score) {
        metrics.push({
          metricType: MetricType.READINESS,
          value: readiness.score,
          unit: 'score',
          recordedAt: readiness.day,
          metadata: {
            source: 'oura',
            contributors: readiness.contributors,
            temperature_deviation: readiness.temperature_deviation,
            temperature_trend_deviation: readiness.temperature_trend_deviation,
          },
        });
      }
    }

    return metrics;
  }

  private async fetchHeartRateData(accessToken: string, startDate: string, endDate: string): Promise<HealthMetricDto[]> {
    const response = await axios.get(
      `${this.baseUrl}/usercollection/heartrate?start_datetime=${startDate}T00:00:00Z&end_datetime=${endDate}T23:59:59Z`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const metrics: HealthMetricDto[] = [];

    // Group by day and calculate daily average/resting
    const dailyData: Record<string, number[]> = {};
    for (const hr of response.data.data || []) {
      const day = hr.timestamp.split('T')[0];
      if (!dailyData[day]) dailyData[day] = [];
      dailyData[day].push(hr.bpm);
    }

    for (const [day, values] of Object.entries(dailyData)) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);

      metrics.push({
        metricType: MetricType.HEART_RATE,
        value: Math.round(min), // Resting HR approximation
        unit: 'bpm',
        recordedAt: day,
        metadata: {
          source: 'oura',
          type: 'daily_summary',
          average: Math.round(avg),
          min,
          max: Math.max(...values),
          samples: values.length,
        },
      });
    }

    return metrics;
  }
}
