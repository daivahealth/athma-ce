/**
 * HTTP Exception Filter
 * Replaces Express error middleware
 * Formats errors consistently
 */

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'InternalServerError';
    let message = 'An unexpected error occurred';
    let details: any = undefined;

    // HTTP exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        error = (exceptionResponse as any).error || exception.name;
        message = (exceptionResponse as any).message || message;
        details = (exceptionResponse as any).details;
      }
    }
    // Prisma errors
    else if (exception && typeof exception === 'object' && 'code' in exception) {
      const prismaError = exception as { code: string; meta?: any; message?: string };
      // Unique constraint violation
      if (prismaError.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        error = 'ConflictError';
        message = 'Resource already exists';
        details = { fields: prismaError.meta?.target };
      }
      // Record not found
      else if (prismaError.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        error = 'NotFoundError';
        message = 'Resource not found';
      }
      // Foreign key constraint violation
      else if (prismaError.code === 'P2003') {
        status = HttpStatus.BAD_REQUEST;
        error = 'ValidationError';
        message = 'Invalid reference';
        details = { field: prismaError.meta?.field_name };
      }
      // Prisma validation errors
      else if ('message' in prismaError && prismaError.message?.includes('validation')) {
        status = HttpStatus.BAD_REQUEST;
        error = 'ValidationError';
        message = 'Invalid data provided';
        details = prismaError.message;
      }
    }
    // Generic errors
    else if (exception instanceof Error) {
      message = exception.message;
      details = process.env.NODE_ENV === 'development' ? exception.stack : undefined;
    }

    // Log error
    this.logger.error(
      {
        error,
        message,
        path: request.path,
        method: request.method,
        status,
      },
      exception instanceof Error ? exception.stack : undefined,
    );

    // Send response
    response.status(status).json({
      error,
      message,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
