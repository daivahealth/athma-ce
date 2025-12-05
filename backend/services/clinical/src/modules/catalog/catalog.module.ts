/**
 * Catalog Module
 *
 * Provides master catalog management for medications, lab tests,
 * imaging studies, procedures, packages, administrative services, vital signs templates, and note templates.
 */

import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { NoteTemplatesController } from './controllers/note-templates.controller';
import { PackageController } from './controllers/package.controller';
import { AdministrativeServiceController } from './controllers/administrative-service.controller';
import { VitalSignsTemplateController } from './controllers/vital-signs-template.controller';
import { NoteTemplatesService } from './services/note-templates.service';
import { PackageService } from './services/package.service';
import { AdministrativeServiceService } from './services/administrative-service.service';
import { VitalSignsTemplateService } from './services/vital-signs-template.service';

@Module({
  controllers: [
    CatalogController,
    NoteTemplatesController,
    PackageController,
    AdministrativeServiceController,
    VitalSignsTemplateController,
  ],
  providers: [
    CatalogService,
    NoteTemplatesService,
    PackageService,
    AdministrativeServiceService,
    VitalSignsTemplateService,
    PrismaService,
  ],
  exports: [
    CatalogService,
    NoteTemplatesService,
    PackageService,
    AdministrativeServiceService,
    VitalSignsTemplateService,
  ],
})
export class CatalogModule {}
