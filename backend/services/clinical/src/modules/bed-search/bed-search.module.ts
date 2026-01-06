import { Module } from '@nestjs/common';
import { BedSearchController } from './bed-search.controller';
import { BedSearchService } from './bed-search.service';
import { PrismaService } from '@zeal/database-clinical';

@Module({
  controllers: [BedSearchController],
  providers: [BedSearchService, PrismaService],
  exports: [BedSearchService],
})
export class BedSearchModule {}
