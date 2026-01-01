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

        // Simple format: tenantId:userId
        if (token.includes(':')) {
          const [tenantId, userId] = token.split(':');
          const tenantClaim = this.configService.get<string>('oidc.tenantClaim') || 'tid';
          const userClaim = this.configService.get<string>('oidc.userClaim') || 'sub';

          request.user = {
            [tenantClaim]: tenantId,
            [userClaim]: userId,
            sub: userId,
            tid: tenantId,
          };

          this.logger.debug(`Dev mode: Simple auth token for tenant ${tenantId}, user ${userId}`);
          return true;
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
