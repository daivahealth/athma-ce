/**
 * Catalog Module
 *
 * Provides master catalog management for medications, lab tests,
 * imaging studies, procedures, and note templates.
 */

import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { NoteTemplatesController } from './controllers/note-templates.controller';
import { NoteTemplatesService } from './services/note-templates.service';

@Module({
  controllers: [
    CatalogController,
    NoteTemplatesController,
  ],
  providers: [
    CatalogService,
    NoteTemplatesService,
    PrismaService,
  ],
  exports: [
    CatalogService,
    NoteTemplatesService,
  ],
})
export class CatalogModule {}
