import { Module } from '@nestjs/common';
import { CatalogMappingService } from './services/catalog-mapping.service';
import { CatalogMappingController } from './controllers/catalog-mapping.controller';
import { PrismaModule } from '@zeal/database-rcm';

@Module({
  imports: [PrismaModule],
  controllers: [CatalogMappingController],
  providers: [CatalogMappingService],
  exports: [CatalogMappingService],
})
export class CatalogMappingModule {}
