import { DeviceType, MetricType, HealthMetricDto, ConnectionStatus } from '../dto/device-sync.dto';

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  scopes: string[];
  redirectUri: string;
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  tokenType?: string;
  scope?: string;
}

export interface DeviceConnection {
  id: string;
  tenantId: string;
  patientId: string;
  deviceType: DeviceType;
  status: ConnectionStatus;
  credentials: OAuthTokens;
  selectedMetrics?: MetricType[];
}

export interface SyncResult {
  success: boolean;
  recordsProcessed: number;
  metrics: HealthMetricDto[];
  errors?: string[];
  nextSyncToken?: string;
}

export abstract class BaseDeviceConnector {
  abstract readonly deviceType: DeviceType;
  abstract readonly supportedMetrics: MetricType[];

  /**
   * Get the OAuth authorization URL for user consent
   */
  abstract getAuthorizationUrl(state: string, redirectUri?: string): string;

  /**
   * Exchange authorization code for access tokens
   */
  abstract exchangeCodeForTokens(code: string, redirectUri?: string): Promise<OAuthTokens>;

  /**
   * Refresh expired access token
   */
  abstract refreshAccessToken(refreshToken: string): Promise<OAuthTokens>;

  /**
   * Revoke access tokens
   */
  abstract revokeAccess(tokens: OAuthTokens): Promise<void>;

  /**
   * Fetch health metrics from the device/platform
   */
  abstract fetchMetrics(
    connection: DeviceConnection,
    startDate: Date,
    endDate: Date,
    metrics?: MetricType[],
  ): Promise<SyncResult>;

  /**
   * Check if the connection is still valid
   */
  abstract validateConnection(tokens: OAuthTokens): Promise<boolean>;

  /**
   * Get user profile information from the device/platform
   */
  abstract getUserProfile(tokens: OAuthTokens): Promise<{
    externalUserId: string;
    displayName?: string;
    email?: string;
  }>;

  /**
   * Check if tokens need refresh
   */
  protected tokensNeedRefresh(tokens: OAuthTokens): boolean {
    if (!tokens.expiresAt) return false;
    const bufferMinutes = 5;
    const expirationBuffer = new Date(tokens.expiresAt.getTime() - bufferMinutes * 60 * 1000);
    return new Date() >= expirationBuffer;
  }

  /**
   * Convert device-specific metric to standard MetricType
   */
  protected abstract mapToStandardMetric(deviceMetric: string): MetricType | null;

  /**
   * Get the configuration for this connector
   */
  protected getConfig(): OAuthConfig | null {
    // Override in subclasses to return actual config
    // Config should come from environment variables
    return null;
  }
}
