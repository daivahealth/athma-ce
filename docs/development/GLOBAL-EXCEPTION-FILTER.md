# Global Exception Filter

## Overview

This document describes the implementation of a centralized error handling mechanism using NestJS Global Exception Filter, which provides consistent error responses, comprehensive logging, and Prisma error mapping.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Controller / Service / Repository                  │
│  - Business logic throws exception                  │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  GlobalExceptionFilter                              │
│  1. Catch ALL exceptions                            │
│  2. Extract error information                       │
│  3. Map Prisma errors → HTTP status                 │
│  4. Build standardized error response               │
│  5. Log with request context                        │
│  6. Send JSON response to client                    │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  HTTP Response                                      │
│  {                                                  │
│    statusCode: 400,                                 │
│    message: "Email already exists",                 │
│    error: "Bad Request",                            │
│    timestamp: "2024-10-31T08:30:00.000Z",           │
│    path: "/api/v1/staff",                           │
│    requestId: "uuid",                               │
│    details: {...}                                   │
│  }                                                  │
└─────────────────────────────────────────────────────┘
```

## Why Global Exception Filter?

### Problems Without Global Filter

1. **Inconsistent Error Responses**: Different controllers return errors in different formats
2. **Unhandled Exceptions**: Runtime errors crash the application
3. **Poor Error Messages**: Raw database errors exposed to clients
4. **No Centralized Logging**: Errors logged inconsistently or not at all
5. **Security Risks**: Stack traces and sensitive info leaked in production

### Benefits With Global Filter

✅ **Consistent API**: All errors follow the same JSON structure
✅ **Automatic Error Mapping**: Prisma errors → meaningful HTTP responses
✅ **Centralized Logging**: All errors logged with request context
✅ **Security**: Sensitive information redacted in production
✅ **Better DX**: Easier debugging with structured error info
✅ **Correlation**: requestId links errors to specific requests

## Implementation

### Step 1: Create Global Exception Filter

**`src/common/filters/global-exception.filter.ts`:**

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { logger } from '../logger/logger.config';
import { RequestContextService } from '../context/request-context';

/**
 * Standardized error response structure
 */
interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  requestId?: string;
  tenantId?: string;
  details?: any;
}

/**
 * Global exception filter to handle all unhandled exceptions
 * Provides consistent error responses and comprehensive logging
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Get request context
    const context = RequestContextService.get();

    // Extract error information
    const { statusCode, message, error, details } = this.extractErrorInfo(exception);

    // Build error response
    const errorResponse: ErrorResponse = {
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Add request context if available
    if (context?.requestId) {
      errorResponse.requestId = context.requestId;
    }
    if (context?.tenantId) {
      errorResponse.tenantId = context.tenantId;
    }

    // Add details in development
    if (process.env.NODE_ENV !== 'production' && details) {
      errorResponse.details = details;
    }

    // Log the error
    this.logError(exception, request, context, statusCode);

    // Send response
    response.status(statusCode).json(errorResponse);
  }

  /**
   * Extract error information from various exception types
   */
  private extractErrorInfo(exception: unknown): {
    statusCode: number;
    message: string;
    error: string;
    details?: any;
  } {
    // NestJS HttpException
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const statusCode = exception.getStatus();

      if (typeof response === 'object' && 'message' in response) {
        return {
          statusCode,
          message: Array.isArray(response.message)
            ? response.message.join(', ')
            : response.message,
          error: exception.name,
          details: response,
        };
      }

      return {
        statusCode,
        message: exception.message,
        error: exception.name,
      };
    }

    // Prisma errors
    if (this.isPrismaError(exception)) {
      return this.handlePrismaError(exception);
    }

    // Generic Error
    if (exception instanceof Error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message || 'Internal server error',
        error: exception.name || 'Error',
        details: {
          stack: process.env.NODE_ENV !== 'production' ? exception.stack : undefined,
        },
      };
    }

    // Unknown error
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred',
      error: 'InternalServerError',
    };
  }

  /**
   * Check if error is a Prisma error
   */
  private isPrismaError(exception: unknown): exception is Prisma.PrismaClientKnownRequestError {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      typeof (exception as any).code === 'string' &&
      (exception as any).code.startsWith('P')
    );
  }

  /**
   * Handle Prisma-specific errors
   */
  private handlePrismaError(error: Prisma.PrismaClientKnownRequestError): {
    statusCode: number;
    message: string;
    error: string;
    details?: any;
  } {
    switch (error.code) {
      // Unique constraint violation
      case 'P2002': {
        const target = (error.meta?.target as string[]) || [];
        return {
          statusCode: HttpStatus.CONFLICT,
          message: `A record with this ${target.join(', ')} already exists`,
          error: 'Conflict',
          details: { code: error.code, target },
        };
      }

      // Foreign key constraint violation
      case 'P2003': {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Related record not found',
          error: 'Bad Request',
          details: { code: error.code },
        };
      }

      // Record not found
      case 'P2025': {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Record not found',
          error: 'Not Found',
          details: { code: error.code },
        };
      }

      // Required field missing
      case 'P2011': {
        const target = error.meta?.target;
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Required field missing: ${target}`,
          error: 'Bad Request',
          details: { code: error.code, target },
        };
      }

      // Invalid data type
      case 'P2006': {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid data type provided',
          error: 'Bad Request',
          details: { code: error.code },
        };
      }

      // Dependent record exists (can't delete)
      case 'P2014': {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'Cannot delete record because dependent records exist',
          error: 'Conflict',
          details: { code: error.code },
        };
      }

      // Database timeout
      case 'P2024': {
        return {
          statusCode: HttpStatus.REQUEST_TIMEOUT,
          message: 'Database operation timed out',
          error: 'Request Timeout',
          details: { code: error.code },
        };
      }

      // Default Prisma error
      default: {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database error occurred',
          error: 'Internal Server Error',
          details: {
            code: error.code,
            meta: error.meta,
          },
        };
      }
    }
  }

  /**
   * Log error with context
   */
  private logError(
    exception: unknown,
    request: Request,
    context: any,
    statusCode: number,
  ): void {
    const errorLog = {
      error: exception instanceof Error ? {
        name: exception.name,
        message: exception.message,
        stack: exception.stack,
      } : exception,
      statusCode,
      method: request.method,
      path: request.url,
      ...(context?.requestId && { requestId: context.requestId }),
      ...(context?.tenantId && { tenantId: context.tenantId }),
      ...(context?.userId && { userId: context.userId }),
    };

    // Log based on severity
    if (statusCode >= 500) {
      logger.error(errorLog, 'Internal server error');
    } else if (statusCode >= 400) {
      logger.warn(errorLog, 'Client error');
    } else {
      logger.info(errorLog, 'Exception handled');
    }
  }
}
```

### Step 2: Register Global Filter

**`src/main.ts`:**

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Register global exception filter (MUST be first)
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ... rest of your configuration

  await app.listen(3010);
}

bootstrap();
```

## Error Response Examples

### 1. Validation Error (400)

**Request:**
```bash
POST /api/v1/staff
{
  "email": "invalid-email"
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": "email must be a valid email",
  "error": "Bad Request",
  "timestamp": "2024-10-31T08:30:00.000Z",
  "path": "/api/v1/staff",
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "tenantId": "223e4567-e89b-12d3-a456-426614174000"
}
```

### 2. Unique Constraint Violation (409)

**Request:**
```bash
POST /api/v1/staff
{
  "email": "existing@example.com"
}
```

**Response:**
```json
{
  "statusCode": 409,
  "message": "A record with this email already exists",
  "error": "Conflict",
  "timestamp": "2024-10-31T08:30:00.000Z",
  "path": "/api/v1/staff",
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "details": {
    "code": "P2002",
    "target": ["email"]
  }
}
```

### 3. Record Not Found (404)

**Request:**
```bash
GET /api/v1/staff/nonexistent-id
```

**Response:**
```json
{
  "statusCode": 404,
  "message": "Record not found",
  "error": "Not Found",
  "timestamp": "2024-10-31T08:30:00.000Z",
  "path": "/api/v1/staff/nonexistent-id",
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

### 4. Foreign Key Violation (400)

**Request:**
```bash
POST /api/v1/patients
{
  "tenantId": "nonexistent-tenant-id"
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": "Related record not found",
  "error": "Bad Request",
  "timestamp": "2024-10-31T08:30:00.000Z",
  "path": "/api/v1/patients",
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "details": {
    "code": "P2003"
  }
}
```

### 5. Internal Server Error (500)

**Response:**
```json
{
  "statusCode": 500,
  "message": "Database error occurred",
  "error": "Internal Server Error",
  "timestamp": "2024-10-31T08:30:00.000Z",
  "path": "/api/v1/patients",
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

## Prisma Error Codes Handled

| Code | HTTP Status | Description | Example |
|------|-------------|-------------|---------|
| P2002 | 409 Conflict | Unique constraint violation | Email already exists |
| P2003 | 400 Bad Request | Foreign key constraint failed | Invalid tenant ID |
| P2025 | 404 Not Found | Record not found | Patient doesn't exist |
| P2011 | 400 Bad Request | Null constraint violation | Required field missing |
| P2006 | 400 Bad Request | Invalid value type | String instead of number |
| P2014 | 409 Conflict | Related records exist | Can't delete (has children) |
| P2024 | 408 Request Timeout | Operation timed out | Database slow |

**Full Prisma Error Reference:** https://www.prisma.io/docs/reference/api-reference/error-reference

## Usage in Controllers

### Throwing Errors

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class StaffService {
  async findOne(id: string) {
    const staff = await this.repository.findUnique({ where: { id } });

    if (!staff) {
      // Will be caught by GlobalExceptionFilter
      throw new NotFoundException(`Staff member with ID ${id} not found`);
    }

    return staff;
  }

  async create(data: CreateStaffDto) {
    // Validation error
    if (!data.email) {
      throw new BadRequestException('Email is required');
    }

    try {
      return await this.repository.create({ data });
    } catch (error) {
      // Prisma errors automatically handled by GlobalExceptionFilter
      throw error;
    }
  }
}
```

### Custom Exceptions

```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

// Custom business exception
export class InsufficientPermissionsException extends HttpException {
  constructor(action: string) {
    super(
      {
        message: `You don't have permission to ${action}`,
        error: 'Forbidden',
        code: 'INSUFFICIENT_PERMISSIONS',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

// Usage
if (!user.canAccessPatient(patientId)) {
  throw new InsufficientPermissionsException('view this patient');
}
```

## Log Output Examples

### Warning Log (4xx errors)

```
[08:30:00 UTC] WARN: Client error
    error: {
      "name": "NotFoundException",
      "message": "Staff member with ID abc123 not found"
    }
    statusCode: 404
    method: "GET"
    path: "/api/v1/staff/abc123"
    requestId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    tenantId: "223e4567-e89b-12d3-a456-426614174000"
```

### Error Log (5xx errors)

```
[08:30:00 UTC] ERROR: Internal server error
    error: {
      "name": "Error",
      "message": "Database connection lost",
      "stack": "Error: Database connection lost\n    at ..."
    }
    statusCode: 500
    method: "POST"
    path: "/api/v1/patients"
    requestId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    tenantId: "223e4567-e89b-12d3-a456-426614174000"
```

## Best Practices

### 1. Use Standard HTTP Exceptions

```typescript
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

// Good
throw new NotFoundException('Patient not found');

// Bad
throw new Error('Patient not found');
```

### 2. Provide Meaningful Messages

```typescript
// Good
throw new NotFoundException(`Staff member with ID ${id} not found`);

// Bad
throw new NotFoundException('Not found');
```

### 3. Let Prisma Errors Bubble Up

```typescript
// Good - Let GlobalExceptionFilter handle Prisma errors
async create(data: CreateStaffDto) {
  return await this.repository.create({ data });
}

// Bad - Don't wrap Prisma errors
async create(data: CreateStaffDto) {
  try {
    return await this.repository.create({ data });
  } catch (error) {
    throw new BadRequestException('Failed to create staff'); // Loses context!
  }
}
```

### 4. Add Context to Errors

```typescript
try {
  await this.performCriticalOperation();
} catch (error) {
  logger.error(
    {
      error,
      operation: 'performCriticalOperation',
      requestId: RequestContextService.getRequestId(),
    },
    'Critical operation failed'
  );
  throw error; // Re-throw for GlobalExceptionFilter
}
```

## Testing

```typescript
import { Test } from '@nestjs/testing';
import { GlobalExceptionFilter } from './global-exception.filter';
import { ArgumentsHost, NotFoundException } from '@nestjs/common';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
  });

  it('should handle NotFoundException', () => {
    const exception = new NotFoundException('Test not found');
    const host = createMockArgumentsHost();

    filter.catch(exception, host);

    const response = host.switchToHttp().getResponse();
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: 'Test not found',
      })
    );
  });

  it('should handle Prisma P2002 error', () => {
    const prismaError = {
      code: 'P2002',
      meta: { target: ['email'] },
    };
    const host = createMockArgumentsHost();

    filter.catch(prismaError, host);

    const response = host.switchToHttp().getResponse();
    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        message: expect.stringContaining('email'),
      })
    );
  });
});
```

## Security Considerations

### 1. Production Mode Safeguards

```typescript
// Never expose stack traces in production
if (process.env.NODE_ENV !== 'production') {
  errorResponse.details = details;
  errorResponse.stack = exception.stack;
}
```

### 2. Sensitive Data Redaction

```typescript
// Already handled by Pino logger configuration
redact: {
  paths: [
    'password',
    'token',
    'authorization',
    'creditCard',
  ],
  remove: true,
}
```

### 3. Rate Limiting on Error Routes

Prevent brute force attacks by rate limiting on authentication errors.

## Monitoring & Alerts

### 1. Set up alerts for 5xx errors

```typescript
if (statusCode >= 500) {
  // Send to monitoring service (Datadog, Sentry, etc.)
  this.monitoringService.trackError(exception);
}
```

### 2. Track error rates

```typescript
// Prometheus metrics
errorCounter.inc({
  statusCode,
  path: request.path,
  method: request.method,
});
```

## Migration from Try-Catch Everywhere

### Before (No Global Filter)

```typescript
@Post()
async create(@Body() dto: CreateStaffDto) {
  try {
    return await this.service.create(dto);
  } catch (error) {
    if (error.code === 'P2002') {
      throw new ConflictException('Email already exists');
    }
    if (error.code === 'P2025') {
      throw new NotFoundException('Tenant not found');
    }
    throw new InternalServerErrorException('Failed to create staff');
  }
}
```

### After (With Global Filter)

```typescript
@Post()
async create(@Body() dto: CreateStaffDto) {
  return await this.service.create(dto);
  // GlobalExceptionFilter handles all errors automatically!
}
```

## References

- [NestJS Exception Filters](https://docs.nestjs.com/exception-filters)
- [Prisma Error Reference](https://www.prisma.io/docs/reference/api-reference/error-reference)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
