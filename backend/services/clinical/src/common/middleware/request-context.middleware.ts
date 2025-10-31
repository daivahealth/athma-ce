import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContextService } from '../context/request-context';

/**
 * Middleware to initialize AsyncLocalStorage context for each request
 * Extracts multi-tenancy headers and stores them in the request context
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const tenantId = req.headers['x-tenant-id'] as string | undefined;
    const userId = req.headers['x-user-id'] as string | undefined;
    const facilityId = req.headers['x-facility-id'] as string | undefined;
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    RequestContextService.run(
      {
        ...(tenantId && { tenantId }),
        ...(userId && { userId }),
        ...(facilityId && { facilityId }),
        ...(ip && { ip }),
        ...(userAgent && { userAgent }),
        path: req.path,
        method: req.method,
      },
      () => {
        next();
      },
    );
  }
}
