/**
 * Request Logging Middleware
 *
 * Logs all HTTP requests with timing, status codes, and trace context.
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger';
import { recordHttpRequest, MetricsTimer } from '../metrics';
import { getTraceContext } from '../tracing';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const timer = new MetricsTimer();
    // Extract context from headers
    const tenantId = req.headers['x-tenant-id'] as string | undefined;
    const userId = req.headers['x-user-id'] as string | undefined;
    const facilityId = req.headers['x-facility-id'] as string | undefined;

    // Get trace context
    const traceCtx = getTraceContext();

    // Log request start
    const requestLogger = logger.child({
      type: 'http',
      method: req.method,
      url: req.originalUrl || req.url,
      tenantId,
      userId,
      facilityId,
      traceId: traceCtx?.traceId,
      spanId: traceCtx?.spanId,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.socket.remoteAddress,
    });

    // Log incoming request at debug level
    requestLogger.debug('Incoming request');

    // Capture response
    const originalSend = res.send.bind(res);
    res.send = (body: unknown) => {
      const duration = timer.elapsedMs();
      const statusCode = res.statusCode;

      // Record metrics
      recordHttpRequest(
        req.method,
        this.normalizePath(req.route?.path || req.path),
        statusCode,
        duration
      );

      // Log response
      const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

      requestLogger[logLevel]({
        statusCode,
        duration,
        contentLength: res.get('content-length'),
      }, `${req.method} ${req.originalUrl || req.url} ${statusCode} ${duration}ms`);

      return originalSend(body);
    };

    next();
  }

  /**
   * Normalize path for metrics (replace IDs with placeholders)
   */
  private normalizePath(path: string): string {
    // Replace UUIDs
    let normalized = path.replace(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
      ':id'
    );

    // Replace numeric IDs
    normalized = normalized.replace(/\/\d+/g, '/:id');

    return normalized;
  }
}
