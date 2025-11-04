"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const logger_config_1 = require("./logger.config");
const request_context_1 = require("../context/request-context");
/**
 * Custom Pino-based logger service for NestJS
 * Integrates with AsyncLocalStorage request context
 */
let LoggerService = class LoggerService {
    /**
     * Add request context to log metadata
     */
    enrichWithContext(metadata) {
        const context = request_context_1.RequestContextService.get();
        return {
            ...metadata,
            ...(context && {
                requestId: context.requestId,
                tenantId: context.tenantId,
                userId: context.userId,
                facilityId: context.facilityId,
            }),
        };
    }
    log(message, context, metadata) {
        logger_config_1.logger.info(this.enrichWithContext({ context, ...metadata }), message);
    }
    error(message, trace, context, metadata) {
        logger_config_1.logger.error(this.enrichWithContext({ trace, context, ...metadata }), message);
    }
    warn(message, context, metadata) {
        logger_config_1.logger.warn(this.enrichWithContext({ context, ...metadata }), message);
    }
    debug(message, context, metadata) {
        logger_config_1.logger.debug(this.enrichWithContext({ context, ...metadata }), message);
    }
    verbose(message, context, metadata) {
        logger_config_1.logger.trace(this.enrichWithContext({ context, ...metadata }), message);
    }
    // Additional helper methods
    fatal(message, metadata) {
        logger_config_1.logger.fatal(this.enrichWithContext(metadata), message);
    }
    http(message, metadata) {
        logger_config_1.logger.info(this.enrichWithContext({ type: 'http', ...metadata }), message);
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)()
], LoggerService);
//# sourceMappingURL=logger.service.js.map