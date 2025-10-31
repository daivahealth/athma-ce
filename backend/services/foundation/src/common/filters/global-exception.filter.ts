import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from '../logger/logger.config';
import { RequestContextService } from '../context/request-context';

/**
 * Error response structure
 */
interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
  path: string;
  requestId?: string;
  tenantId?: string;
  details?: unknown;
}

/**
 * Global exception filter
 * Catches all exceptions and formats them consistently
 * Integrates with Pino logger and request context
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const context = RequestContextService.get();

    // Determine status code and error details
    const { statusCode, message, error, details } = this.extractErrorInfo(
      exception,
    );

    // Build error response
    const errorResponse: ErrorResponse = {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Add optional fields if present
    if (context?.requestId) {
      errorResponse.requestId = context.requestId;
    }
    if (context?.tenantId) {
      errorResponse.tenantId = context.tenantId;
    }
    if (error) {
      errorResponse.error = error;
    }
    if (details) {
      errorResponse.details = details;
    }

    // Log the error with appropriate level
    this.logError(exception, statusCode, request, context, errorResponse);

    // Send response
    response.status(statusCode).json(errorResponse);
  }

  /**
   * Extract error information from exception
   */
  private extractErrorInfo(exception: unknown): {
    statusCode: number;
    message: string;
    error?: string;
    details?: unknown;
  } {
    // Handle HttpException (NestJS exceptions)
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const statusCode = exception.getStatus();

      if (typeof response === 'string') {
        return {
          statusCode,
          message: response,
          error: exception.name,
        };
      }

      if (typeof response === 'object' && response !== null) {
        const responseObj = response as Record<string, unknown>;
        return {
          statusCode,
          message:
            (responseObj.message as string) ||
            (responseObj.error as string) ||
            'Internal server error',
          error: (responseObj.error as string) || exception.name,
          details: responseObj.details,
        };
      }
    }

    // Handle Prisma errors
    if (this.isPrismaError(exception)) {
      return this.handlePrismaError(exception);
    }

    // Handle validation errors
    if (this.isValidationError(exception)) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        error: 'ValidationError',
        details: exception,
      };
    }

    // Handle standard Error objects
    if (exception instanceof Error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : exception.message,
        error: exception.name,
      };
    }

    // Unknown error type
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred',
      error: 'UnknownError',
    };
  }

  /**
   * Check if error is a Prisma error
   */
  private isPrismaError(exception: unknown): boolean {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      typeof (exception as { code: unknown }).code === 'string' &&
      (exception as { code: string }).code.startsWith('P')
    );
  }

  /**
   * Handle Prisma-specific errors
   */
  private handlePrismaError(exception: unknown): {
    statusCode: number;
    message: string;
    error: string;
  } {
    const prismaError = exception as { code: string; meta?: { cause?: string } };

    switch (prismaError.code) {
      case 'P2002':
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'A record with this unique constraint already exists',
          error: 'UniqueConstraintViolation',
        };
      case 'P2025':
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Record not found',
          error: 'RecordNotFound',
        };
      case 'P2003':
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Foreign key constraint failed',
          error: 'ForeignKeyViolation',
        };
      case 'P2014':
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid relation',
          error: 'InvalidRelation',
        };
      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            process.env.NODE_ENV === 'production'
              ? 'Database error'
              : prismaError.meta?.cause || 'Database operation failed',
          error: 'DatabaseError',
        };
    }
  }

  /**
   * Check if error is a validation error
   */
  private isValidationError(exception: unknown): boolean {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'isJoi' in exception &&
      (exception as { isJoi: unknown }).isJoi === true
    );
  }

  /**
   * Log error with appropriate level
   */
  private logError(
    exception: unknown,
    statusCode: number,
    request: Request,
    context: ReturnType<typeof RequestContextService.get>,
    errorResponse: ErrorResponse,
  ): void {
    const logContext = {
      requestId: context?.requestId,
      tenantId: context?.tenantId,
      userId: context?.userId,
      facilityId: context?.facilityId,
      method: request.method,
      url: request.url,
      ip: context?.ip,
      userAgent: context?.userAgent,
      statusCode,
      errorResponse,
    };

    // Log as error if 5xx, warn if 4xx
    if (statusCode >= 500) {
      logger.error(
        logContext,
        `${statusCode} ${request.method} ${request.url} - ${errorResponse.message}`,
      );

      // Log stack trace for server errors
      if (exception instanceof Error && exception.stack) {
        logger.error({ stack: exception.stack }, 'Stack trace');
      }
    } else if (statusCode >= 400) {
      logger.warn(
        logContext,
        `${statusCode} ${request.method} ${request.url} - ${errorResponse.message}`,
      );
    } else {
      logger.info(
        logContext,
        `${statusCode} ${request.method} ${request.url} - ${errorResponse.message}`,
      );
    }
  }
}
