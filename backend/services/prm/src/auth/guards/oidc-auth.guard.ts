/**
 * OIDC Auth Guard
 * Replaces Express requireAuth middleware
 */

import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OidcAuthGuard extends AuthGuard('oidc') {
  private readonly logger = new Logger(OidcAuthGuard.name);

  constructor(private configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // Development mode: Allow simple bearer token format (tenantId:userId)
    if (this.configService.get<string>('env') === 'development') {
      const authHeader = request.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const tenantClaim = this.configService.get<string>('oidc.tenantClaim') || 'tid';
        const userClaim = this.configService.get<string>('oidc.userClaim') || 'sub';

        // Simple format: tenantId:userId
        if (token.includes(':')) {
          const [tenantId, userId] = token.split(':');

          request.user = {
            [tenantClaim]: tenantId,
            [userClaim]: userId,
            sub: userId,
            tid: tenantId,
          };

          this.logger.debug(`Dev mode: Simple auth token for tenant ${tenantId}, user ${userId}`);
          return true;
        }

        // Dev fallback: accept a JWT-like token without session (base64 payload decode)
        if (token.split('.').length === 3) {
          try {
            const payloadSegment = token.split('.')[1];
            const normalized = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
            const decoded = Buffer.from(normalized, 'base64').toString('utf8');
            const payload = JSON.parse(decoded);
            const tenantId = payload[tenantClaim] || payload.tenantId || payload.tid;
            const userId = payload[userClaim] || payload.userId || payload.sub;

            if (tenantId && userId) {
              request.user = {
                [tenantClaim]: tenantId,
                [userClaim]: userId,
                sub: userId,
                tid: tenantId,
                tenantId,
                userId,
                facilityId: payload.facilityId,
                facilityIds: payload.facilityIds || [],
                roles: payload.roles || [],
                permissions: payload.permissions || [],
              };

              this.logger.debug(`Dev mode: JWT payload auth for tenant ${tenantId}, user ${userId}`);
              return true;
            }
          } catch (error) {
            this.logger.warn(`Dev mode: Failed to parse JWT payload: ${error}`);
          }
        }
      }
    }

    // Production: Use Passport OIDC
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required');
    }
    return user;
  }
}
