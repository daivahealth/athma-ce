import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController, DepartmentStandaloneController } from './department.controller';
import { DepartmentRepository } from './department.repository';
import { DatabaseModule } from '@zeal/shared-database';

@Module({
  imports: [DatabaseModule],
  controllers: [DepartmentController, DepartmentStandaloneController],
  providers: [DepartmentService, DepartmentRepository],
  exports: [DepartmentService, DepartmentRepository],
})
export class DepartmentModule {}
