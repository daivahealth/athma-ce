import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { RequestContext, type RequestContextStore } from './request-context';

const TENANT_HEADER = 'x-tenant-id';
const USER_HEADER = 'x-user-id';

const toHeaderValue = (value: string | string[] | undefined): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    const userAgentHeader = req.headers['user-agent'];
    const userAgent = Array.isArray(userAgentHeader)
      ? userAgentHeader.join(',')
      : userAgentHeader ?? '';

    const tenantId = toHeaderValue(req.headers[TENANT_HEADER]);
    const userId = toHeaderValue(req.headers[USER_HEADER]);

    const store: RequestContextStore = { userAgent };

    const normalizedTenant = tenantId?.trim();
    if (normalizedTenant) {
      store.tenantId = normalizedTenant;
    }

    const normalizedUser = userId?.trim();
    if (normalizedUser) {
      store.userId = normalizedUser;
    }

    RequestContext.run(store, () => next());
  }
}

export const requestContextHeaders = {
  tenantId: TENANT_HEADER,
  userId: USER_HEADER,
} as const;
