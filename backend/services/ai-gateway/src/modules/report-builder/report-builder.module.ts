import { Module } from '@nestjs/common';
import { ReportController } from './controllers/report.controller';
import { QueryPlannerService } from './services/query-planner.service';
import { SqlCompilerService } from './services/sql-compiler.service';
import { QueryExecutorService } from './services/query-executor.service';
import { ExportService } from './services/export.service';
import { CatalogService } from './services/catalog.service';
import { DashboardCacheService } from './services/dashboard-cache.service';
import { DashboardCacheJob } from './jobs/dashboard-cache.job';

@Module({
  controllers: [ReportController],
  providers: [
    QueryPlannerService,
    SqlCompilerService,
    QueryExecutorService,
    ExportService,
    CatalogService,
    DashboardCacheService,
    DashboardCacheJob,
  ],
  exports: [CatalogService, DashboardCacheService],
})
export class ReportBuilderModule {}
