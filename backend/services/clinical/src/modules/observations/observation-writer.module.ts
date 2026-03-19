import { Module } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';
import { ObservationWriterService } from './observation-writer.service';
import { PartitionManagerService } from './partition-manager.service';
import { AggregationService } from './aggregation.service';

@Module({
  imports: [ClinicalDatabaseModule],
  providers: [ObservationWriterService, PartitionManagerService, AggregationService],
  exports: [ObservationWriterService, PartitionManagerService, AggregationService],
})
export class ObservationWriterModule {}
