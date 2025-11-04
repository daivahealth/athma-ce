"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const logger_config_1 = require("../logger/logger.config");
const request_context_1 = require("../context/request-context");
/**
 * Global exception filter
 * Catches all exceptions and formats them consistently
 * Integrates with Pino logger and request context
 */
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const context = request_context_1.RequestContextService.get();
        // Determine status code and error details
        const { statusCode, message, error, details } = this.extractErrorInfo(exception);
        // Build error response
        const errorResponse = {
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
    extractErrorInfo(exception) {
        // Handle HttpException (NestJS exceptions)
        if (exception instanceof common_1.HttpException) {
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
                const responseObj = response;
                return {
                    statusCode,
                    message: responseObj.message ||
                        responseObj.error ||
                        'Internal server error',
                    error: responseObj.error || exception.name,
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
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Validation failed',
                error: 'ValidationError',
                details: exception,
            };
        }
        // Handle standard Error objects
        if (exception instanceof Error) {
            return {
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: process.env.NODE_ENV === 'production'
                    ? 'Internal server error'
                    : exception.message,
                error: exception.name,
            };
        }
        // Unknown error type
        return {
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'An unexpected error occurred',
            error: 'UnknownError',
        };
    }
    /**
     * Check if error is a Prisma error
     */
    isPrismaError(exception) {
        return (typeof exception === 'object' &&
            exception !== null &&
            'code' in exception &&
            typeof exception.code === 'string' &&
            exception.code.startsWith('P'));
    }
    /**
     * Handle Prisma-specific errors
     */
    handlePrismaError(exception) {
        const prismaError = exception;
        switch (prismaError.code) {
            case 'P2002':
                return {
                    statusCode: common_1.HttpStatus.CONFLICT,
                    message: 'A record with this unique constraint already exists',
                    error: 'UniqueConstraintViolation',
                };
            case 'P2025':
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Record not found',
                    error: 'RecordNotFound',
                };
            case 'P2003':
                return {
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Foreign key constraint failed',
                    error: 'ForeignKeyViolation',
                };
            case 'P2014':
                return {
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Invalid relation',
                    error: 'InvalidRelation',
                };
            default:
                return {
                    statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: process.env.NODE_ENV === 'production'
                        ? 'Database error'
                        : prismaError.meta?.cause || 'Database operation failed',
                    error: 'DatabaseError',
                };
        }
    }
    /**
     * Check if error is a validation error
     */
    isValidationError(exception) {
        return (typeof exception === 'object' &&
            exception !== null &&
            'isJoi' in exception &&
            exception.isJoi === true);
    }
    /**
     * Log error with appropriate level
     */
    logError(exception, statusCode, request, context, errorResponse) {
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
            logger_config_1.logger.error(logContext, `${statusCode} ${request.method} ${request.url} - ${errorResponse.message}`);
            // Log stack trace for server errors
            if (exception instanceof Error && exception.stack) {
                logger_config_1.logger.error({ stack: exception.stack }, 'Stack trace');
            }
        }
        else if (statusCode >= 400) {
            logger_config_1.logger.warn(logContext, `${statusCode} ${request.method} ${request.url} - ${errorResponse.message}`);
        }
        else {
            logger_config_1.logger.info(logContext, `${statusCode} ${request.method} ${request.url} - ${errorResponse.message}`);
        }
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map