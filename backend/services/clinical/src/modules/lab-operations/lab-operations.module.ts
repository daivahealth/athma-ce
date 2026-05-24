import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { ReportingModule } from '../reporting/reporting.module';
import { LabOperationsController } from './controllers/lab-operations.controller';
import { LabOperationsService } from './services/lab-operations.service';

@Module({
  imports: [ReportingModule],
  controllers: [LabOperationsController],
  providers: [PrismaService, LabOperationsService],
  exports: [LabOperationsService],
})
export class LabOperationsModule {}
