/**
 * Tenant Service
 * Manages tenant context extraction and validation
 */

import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TenantService {

  private readonly logger = new Logger(TenantService.name);
  constructor(private configService: ConfigService) {}

  /**
   * Extract tenant ID from user object (token claims)
   */
  extractTenantId(user: any): string {
    const tenantClaim = this.configService.get<string>('oidc.tenantClaim') || 'tid';
    const tenantId = user?.[tenantClaim];

    if (!tenantId) {
      this.logger.error(`Tenant ID not found in token claim: ${tenantClaim}`, { user });
      throw new ForbiddenException('Tenant context not available');
    }

    return tenantId;
  }

  /**
   * Extract user ID from user object (token claims)
   */
  extractUserId(user: any): string {
    const userClaim = this.configService.get<string>('oidc.userClaim') || 'sub';
    const userId = user?.[userClaim];

    if (!userId) {
      this.logger.error(`User ID not found in token claim: ${userClaim}`, { user });
      throw new ForbiddenException('User context not available');
    }

    return userId;
  }

  /**
   * Validate that tenant_id is not in request body
   */
  validateNoTenantIdInBody(body: any): void {
    if (body && body.tenantId) {
      throw new ForbiddenException(
        'tenantId must not be provided in request body - it is derived from authentication token',
      );
    }
  }
}
