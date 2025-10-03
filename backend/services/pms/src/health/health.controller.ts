import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '@zeal/shared-database';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @ApiResponse({ status: 503, description: 'Service is unhealthy' })
  async getHealth(): Promise<any> {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;

      // Get database info
      const dbInfo = await this.prisma.$queryRaw`
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
    } catch (error) {
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

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  @ApiResponse({ status: 503, description: 'Service is not ready' })
  async getReadiness(): Promise<any> {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;

      // Check if essential tables exist
      const tableCount = await this.prisma.$queryRaw`
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
    } catch (error) {
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

  @Get('live')
  @ApiOperation({ summary: 'Liveness check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  async getLiveness(): Promise<any> {
    return {
      status: 'alive',
      service: 'Zeal PMS Service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

