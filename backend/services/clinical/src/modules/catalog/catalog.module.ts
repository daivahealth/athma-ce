/**
 * Catalog Module
 *
 * Provides master catalog management for medications, lab tests,
 * imaging studies, procedures, packages, administrative services, and note templates.
 */

import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { NoteTemplatesController } from './controllers/note-templates.controller';
import { PackageController } from './controllers/package.controller';
import { AdministrativeServiceController } from './controllers/administrative-service.controller';
import { NoteTemplatesService } from './services/note-templates.service';
import { PackageService } from './services/package.service';
import { AdministrativeServiceService } from './services/administrative-service.service';

@Module({
  controllers: [
    CatalogController,
    NoteTemplatesController,
    PackageController,
    AdministrativeServiceController,
  ],
  providers: [
    CatalogService,
    NoteTemplatesService,
    PackageService,
    AdministrativeServiceService,
    PrismaService,
  ],
  exports: [
    CatalogService,
    NoteTemplatesService,
    PackageService,
    AdministrativeServiceService,
  ],
})
export class CatalogModule {}
