import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { Observable } from 'rxjs';
import type { JwtClaims } from '@zeal/contracts';
import { RequestContext, type RequestContextStore } from './request-context';

const getClaimUserId = (claims: Partial<JwtClaims> & { sub?: string } | undefined): string | undefined => {
  if (!claims) {
    return undefined;
  }
  return claims.userId ?? claims.sub;
};

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() === 'http') {
      const store = RequestContext.getStore();
      if (store) {
        const req = context.switchToHttp().getRequest<Request>();
        const claims = req.user as (Partial<JwtClaims> & { sub?: string }) | undefined;

        if (claims) {
          const tenantId = claims.tenantId?.trim();
          const userId = getClaimUserId(claims)?.trim();

          const updates: Partial<RequestContextStore> = {};
          if (tenantId) {
            updates.tenantId = tenantId;
          }
          if (userId) {
            updates.userId = userId;
          }

          if (Object.keys(updates).length > 0) {
            RequestContext.set(updates);
          }
        }
      }
    }

    return next.handle();
  }
}
