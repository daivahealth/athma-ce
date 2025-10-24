import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';
import { RequestContextModule } from '@zeal/shared-utils';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientModule } from './modules/patient/patient.module';
import { ConsentModule } from './modules/consent/consent.module';
import { TenantContextMiddleware } from './common/middleware/tenant-context.middleware';

@Module({
  imports: [
    ClinicalDatabaseModule,
    RequestContextModule,
    PatientModule,
    ConsentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply tenant context middleware to all routes except health check
    consumer
      .apply(TenantContextMiddleware)
      .exclude('/health', '/api/v1/health')
      .forRoutes('*');
  }
}
