/**
 * Catalog Module
 *
 * Provides master catalog management for medications, lab tests,
 * imaging studies, and procedures.
 */

import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

@Module({
  controllers: [CatalogController],
  providers: [CatalogService, PrismaService],
  exports: [CatalogService],
})
export class CatalogModule {}
