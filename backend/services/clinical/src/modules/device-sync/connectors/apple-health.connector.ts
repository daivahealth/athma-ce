import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BaseDeviceConnector,
  OAuthTokens,
  DeviceConnection,
  SyncResult,
  OAuthConfig,
} from './base.connector';
import { DeviceType, MetricType, HealthMetricDto } from '../dto/device-sync.dto';

/**
 * Apple Health connector
 *
 * Note: Apple Health does not have a direct REST API. Data is typically
 * synced via a mobile app using HealthKit. This connector handles the
 * server-side component that receives data pushed from a mobile app.
 *
 * In production, the mobile app would:
 * 1. Request HealthKit permissions
 * 2. Read data from HealthKit
 * 3. POST data to this backend endpoint
 */
@Injectable()
export class AppleHealthConnector extends BaseDeviceConnector {
  private readonly logger = new Logger(AppleHealthConnector.name);
  readonly deviceType = DeviceType.APPLE_HEALTH;
  readonly supportedMetrics: MetricType[] = [
    MetricType.STEPS,
    MetricType.HEART_RATE,
    MetricType.HRV,
    MetricType.SLEEP,
    MetricType.BLOOD_OXYGEN,
    MetricType.BLOOD_PRESSURE,
    MetricType.BODY_TEMPERATURE,
    MetricType.WEIGHT,
    MetricType.BODY_FAT,
    MetricType.CALORIES,
    MetricType.ACTIVE_MINUTES,
    MetricType.DISTANCE,
    MetricType.FLOORS_CLIMBED,
    MetricType.RESPIRATORY_RATE,
  ];

  constructor(private readonly configService: ConfigService) {
    super();
  }

  /**
   * Apple Health uses device-based authentication via HealthKit
   * This returns a placeholder URL - actual auth happens in mobile app
   */
  getAuthorizationUrl(state: string, redirectUri?: string): string {
    // For Apple Health, authorization happens on-device via HealthKit
    // The mobile app handles this and registers the connection with the server
    return `zeal://health-connect?state=${state}&provider=apple_health`;
  }

  /**
   * Apple Health doesn't use OAuth code exchange
   * Instead, mobile app registers connection directly
   */
  async exchangeCodeForTokens(code: string, redirectUri?: string): Promise<OAuthTokens> {
    // For Apple Health, the "code" is a device registration token from the mobile app
    return {
      accessToken: code, // Device token acts as identifier
      tokenType: 'device',
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    // Apple Health connections don't expire in the same way
    // The mobile app maintains the HealthKit authorization
    return {
      accessToken: refreshToken,
      tokenType: 'device',
    };
  }

  async revokeAccess(tokens: OAuthTokens): Promise<void> {
    // Revocation happens on-device via HealthKit settings
    this.logger.log('Apple Health access revocation requested - must be done on device');
  }

  /**
   * Apple Health data is pushed from mobile app, not pulled
   * This method is called when receiving data from the mobile app
   */
  async fetchMetrics(
    connection: DeviceConnection,
    startDate: Date,
    endDate: Date,
    metrics?: MetricType[],
  ): Promise<SyncResult> {
    // In a real implementation, this would:
    // 1. Send a push notification to the mobile app requesting sync
    // 2. Mobile app reads from HealthKit
    // 3. Mobile app POSTs data back to server

    // For now, return empty result - data comes via push
    return {
      success: true,
      recordsProcessed: 0,
      metrics: [],
      errors: ['Apple Health requires data push from mobile app'],
    };
  }

  async validateConnection(tokens: OAuthTokens): Promise<boolean> {
    // Connection validity depends on mobile app state
    return !!tokens.accessToken;
  }

  async getUserProfile(tokens: OAuthTokens): Promise<{
    externalUserId: string;
    displayName?: string;
    email?: string;
  }> {
    return {
      externalUserId: tokens.accessToken, // Device identifier
      displayName: 'Apple Health User',
    };
  }

  protected mapToStandardMetric(healthKitType: string): MetricType | null {
    const mapping: Record<string, MetricType> = {
      'HKQuantityTypeIdentifierStepCount': MetricType.STEPS,
      'HKQuantityTypeIdentifierHeartRate': MetricType.HEART_RATE,
      'HKQuantityTypeIdentifierHeartRateVariabilitySDNN': MetricType.HRV,
      'HKCategoryTypeIdentifierSleepAnalysis': MetricType.SLEEP,
      'HKQuantityTypeIdentifierOxygenSaturation': MetricType.BLOOD_OXYGEN,
      'HKQuantityTypeIdentifierBloodPressureSystolic': MetricType.BLOOD_PRESSURE,
      'HKQuantityTypeIdentifierBodyTemperature': MetricType.BODY_TEMPERATURE,
      'HKQuantityTypeIdentifierBodyMass': MetricType.WEIGHT,
      'HKQuantityTypeIdentifierBodyFatPercentage': MetricType.BODY_FAT,
      'HKQuantityTypeIdentifierActiveEnergyBurned': MetricType.CALORIES,
      'HKQuantityTypeIdentifierAppleExerciseTime': MetricType.ACTIVE_MINUTES,
      'HKQuantityTypeIdentifierDistanceWalkingRunning': MetricType.DISTANCE,
      'HKQuantityTypeIdentifierFlightsClimbed': MetricType.FLOORS_CLIMBED,
      'HKQuantityTypeIdentifierRespiratoryRate': MetricType.RESPIRATORY_RATE,
    };
    return mapping[healthKitType] || null;
  }

  /**
   * Process metrics pushed from mobile app
   */
  processIncomingMetrics(rawData: any[]): HealthMetricDto[] {
    const metrics: HealthMetricDto[] = [];

    for (const item of rawData) {
      const metricType = this.mapToStandardMetric(item.type);
      if (!metricType) continue;

      metrics.push({
        metricType,
        value: item.value,
        unit: item.unit,
        recordedAt: item.startDate || item.date,
        metadata: {
          source: 'apple_health',
          sourceType: item.type,
          endDate: item.endDate,
          device: item.device,
        },
      });
    }

    return metrics;
  }
}
