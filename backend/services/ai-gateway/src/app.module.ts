import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { FoundationDatabaseModule } from '@zeal/database-foundation';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';
import { RcmDatabaseModule } from '@zeal/database-rcm';
import { AnalyticsDatabaseModule } from '@zeal/database-analytics';
import { RequestContextModule } from '@zeal/shared-utils';
import { ObservabilityModule } from '@zeal/observability';
import { HealthModule } from './modules/health/health.module';
import { ReportBuilderModule } from './modules/report-builder/report-builder.module';
import { SemanticSearchModule } from './modules/semantic-search/semantic-search.module';
import { LLMClientModule } from './shared/llm-client/llm-client.module';
import { RedisModule } from './shared/redis/redis.module';
import { TenantContextMiddleware } from './common/middleware/tenant-context.middleware';
import { LoggerService } from './common/logger/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ScheduleModule.forRoot(),
    // Observability module for metrics and tracing
    ObservabilityModule.forRoot({
      excludePaths: ['/health', '/api/v1/health', '/metrics'],
    }),
    // Database modules for all domains
    FoundationDatabaseModule,
    ClinicalDatabaseModule,
    RcmDatabaseModule,
    AnalyticsDatabaseModule,
    // Core modules
    RequestContextModule,
    LLMClientModule,
    RedisModule,
    HealthModule,
    // Feature modules
    ReportBuilderModule,
    SemanticSearchModule,
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply tenant context middleware to all routes except health checks
    consumer
      .apply(TenantContextMiddleware)
      .exclude('health', 'health/(.*)', 'api/v1/health', 'api/v1/health/(.*)')
      .forRoutes('*');
  }
}
