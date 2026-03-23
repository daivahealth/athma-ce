import { Module } from '@nestjs/common';
import { CatalogPopulationController } from './controllers/catalog-population.controller';
import { CatalogPopulationService } from './services/catalog-population.service';
import { TemplateLoaderService } from './services/template-loader.service';
import { AiCatalogGeneratorService } from './services/ai-catalog-generator.service';
import { CatalogValidatorService } from './services/catalog-validator.service';
import { CatalogWriterService } from './services/catalog-writer.service';
import { CatalogJobTrackerService } from './services/catalog-job-tracker.service';
import { ConfigClientService } from '../../shared/llm-client/config-client.service';

@Module({
  controllers: [CatalogPopulationController],
  providers: [
    ConfigClientService,
    CatalogPopulationService,
    TemplateLoaderService,
    AiCatalogGeneratorService,
    CatalogValidatorService,
    CatalogWriterService,
    CatalogJobTrackerService,
  ],
  exports: [CatalogPopulationService],
})
export class CatalogPopulationModule {}
