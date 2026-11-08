import { Module } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';
import { TenantSetupController } from './tenant-setup.controller';

@Module({
  imports: [ClinicalDatabaseModule],
  controllers: [TenantSetupController],
})
export class TenantSetupModule {}
