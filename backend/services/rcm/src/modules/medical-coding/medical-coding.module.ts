import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '@zeal/database-rcm';
import { MedicalCodingService } from './services/medical-coding.service';
import { MedicalCodingController } from './controllers/medical-coding.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  controllers: [MedicalCodingController],
  providers: [PrismaService, MedicalCodingService],
  exports: [MedicalCodingService],
})
export class MedicalCodingModule {}
