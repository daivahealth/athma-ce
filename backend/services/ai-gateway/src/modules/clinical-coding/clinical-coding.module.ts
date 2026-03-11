import { Module } from '@nestjs/common';
import { ClinicalCodingController } from './controllers/clinical-coding.controller';
import { ClinicalCodingService } from './services/clinical-coding.service';
import { PhiSanitizerService } from './services/phi-sanitizer.service';
import { CodingCacheService } from './services/coding-cache.service';

@Module({
  controllers: [ClinicalCodingController],
  providers: [ClinicalCodingService, PhiSanitizerService, CodingCacheService],
  exports: [ClinicalCodingService],
})
export class ClinicalCodingModule {}
