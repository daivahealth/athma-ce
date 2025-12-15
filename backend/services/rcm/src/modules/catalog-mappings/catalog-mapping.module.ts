import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import { CatalogMappingService } from './services/catalog-mapping.service';
import { CatalogMappingController } from './controllers/catalog-mapping.controller';

@Module({
  controllers: [CatalogMappingController],
  providers: [PrismaService, CatalogMappingService],
  exports: [CatalogMappingService],
})
export class CatalogMappingModule {}
