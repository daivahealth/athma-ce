import { Module } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';
import { ObservationWriterService } from './observation-writer.service';
import { PartitionManagerService } from './partition-manager.service';
import { AggregationService } from './aggregation.service';
import { ObservationQueryService } from './observation-query.service';
import { CohortQueryService } from './cohort-query.service';
import { ObservationQueryController } from './observation-query.controller';
import { ObservationCatalogController } from './observation-catalog.controller';
import { CohortQueryController } from './cohort-query.controller';

@Module({
  imports: [ClinicalDatabaseModule],
  controllers: [
    ObservationQueryController,
    ObservationCatalogController,
    CohortQueryController,
  ],
  providers: [
    ObservationWriterService,
    PartitionManagerService,
    AggregationService,
    ObservationQueryService,
    CohortQueryService,
  ],
  exports: [
    ObservationWriterService,
    PartitionManagerService,
    AggregationService,
    ObservationQueryService,
    CohortQueryService,
  ],
})
export class ObservationsModule {}
