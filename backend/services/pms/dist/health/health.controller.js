var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '@zeal/shared-database';
let HealthController = (() => {
    let _classDecorators = [ApiTags('Health'), Controller('health')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getHealth_decorators;
    let _getReadiness_decorators;
    let _getLiveness_decorators;
    var HealthController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getHealth_decorators = [Get(), ApiOperation({ summary: 'Health check endpoint' }), ApiResponse({ status: 200, description: 'Service is healthy' }), ApiResponse({ status: 503, description: 'Service is unhealthy' })];
            _getReadiness_decorators = [Get('ready'), ApiOperation({ summary: 'Readiness check endpoint' }), ApiResponse({ status: 200, description: 'Service is ready' }), ApiResponse({ status: 503, description: 'Service is not ready' })];
            _getLiveness_decorators = [Get('live'), ApiOperation({ summary: 'Liveness check endpoint' }), ApiResponse({ status: 200, description: 'Service is alive' })];
            __esDecorate(this, null, _getHealth_decorators, { kind: "method", name: "getHealth", static: false, private: false, access: { has: obj => "getHealth" in obj, get: obj => obj.getHealth }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getReadiness_decorators, { kind: "method", name: "getReadiness", static: false, private: false, access: { has: obj => "getReadiness" in obj, get: obj => obj.getReadiness }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getLiveness_decorators, { kind: "method", name: "getLiveness", static: false, private: false, access: { has: obj => "getLiveness" in obj, get: obj => obj.getLiveness }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            HealthController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma = __runInitializers(this, _instanceExtraInitializers);
        constructor(prisma) {
            this.prisma = prisma;
        }
        async getHealth() {
            try {
                // Test database connection
                await this.prisma.$queryRaw `SELECT 1`;
                // Get database info
                const dbInfo = await this.prisma.$queryRaw `
        SELECT 
          current_database() as db_name,
          version() as db_version,
          (NOW() - pg_postmaster_start_time()) as uptime,
          (SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()) as active_connections,
          (SELECT setting::bigint FROM pg_settings WHERE name = 'max_connections') as max_connections
      `;
                return {
                    status: 'healthy',
                    service: 'Zeal PMS Service',
                    timestamp: new Date().toISOString(),
                    version: '1.0.0',
                    environment: process.env.NODE_ENV || 'development',
                    database: {
                        connected: true,
                        info: dbInfo[0],
                    },
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                };
            }
            catch (error) {
                return {
                    status: 'unhealthy',
                    service: 'Zeal PMS Service',
                    timestamp: new Date().toISOString(),
                    version: '1.0.0',
                    environment: process.env.NODE_ENV || 'development',
                    database: {
                        connected: false,
                        error: error.message,
                    },
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                };
            }
        }
        async getReadiness() {
            try {
                // Test database connection
                await this.prisma.$queryRaw `SELECT 1`;
                // Check if essential tables exist
                const tableCount = await this.prisma.$queryRaw `
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('tenants', 'users', 'patients', 'appointments')
      `;
                const isReady = tableCount[0].count >= 4;
                return {
                    status: isReady ? 'ready' : 'not_ready',
                    service: 'Zeal PMS Service',
                    timestamp: new Date().toISOString(),
                    database: {
                        connected: true,
                        tables_ready: isReady,
                    },
                };
            }
            catch (error) {
                return {
                    status: 'not_ready',
                    service: 'Zeal PMS Service',
                    timestamp: new Date().toISOString(),
                    database: {
                        connected: false,
                        error: error.message,
                    },
                };
            }
        }
        async getLiveness() {
            return {
                status: 'alive',
                service: 'Zeal PMS Service',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
            };
        }
    };
    return HealthController = _classThis;
})();
export { HealthController };
//# sourceMappingURL=health.controller.js.map