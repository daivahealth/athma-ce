var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '@zeal/shared-database';
let HealthController = class HealthController {
    prisma;
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
          (NOW() - pg_postmaster_start_time())::text as uptime,
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
__decorate([
    Get(),
    ApiOperation({ summary: 'Health check endpoint' }),
    ApiResponse({ status: 200, description: 'Service is healthy' }),
    ApiResponse({ status: 503, description: 'Service is unhealthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getHealth", null);
__decorate([
    Get('ready'),
    ApiOperation({ summary: 'Readiness check endpoint' }),
    ApiResponse({ status: 200, description: 'Service is ready' }),
    ApiResponse({ status: 503, description: 'Service is not ready' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getReadiness", null);
__decorate([
    Get('live'),
    ApiOperation({ summary: 'Liveness check endpoint' }),
    ApiResponse({ status: 200, description: 'Service is alive' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getLiveness", null);
HealthController = __decorate([
    ApiTags('Health'),
    Controller('health'),
    __metadata("design:paramtypes", [PrismaService])
], HealthController);
export { HealthController };
//# sourceMappingURL=health.controller.js.map