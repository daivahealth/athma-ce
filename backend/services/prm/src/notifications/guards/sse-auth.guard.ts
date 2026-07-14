/**
 * SSE Auth Guard
 *
 * The browser `EventSource` API cannot set an Authorization header, so the SSE
 * stream endpoint accepts the JWT via the `access_token` query parameter as a
 * fallback. This guard normalises that into the standard bearer header and then
 * delegates to the shared `JwtAuthGuard`, preserving identical token
 * verification and tenant-context population (request.user).
 */

import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from '@zeal/shared-utils';

@Injectable()
export class SseAuthGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const hasHeader = Boolean(request.headers?.authorization || request.headers?.Authorization);
    const queryToken = request.query?.access_token;

    if (!hasHeader && typeof queryToken === 'string' && queryToken.length > 0) {
      request.headers = request.headers || {};
      request.headers.authorization = `Bearer ${queryToken}`;
    }

    return super.canActivate(context);
  }
}
