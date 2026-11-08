import { Module } from '@nestjs/common';
import { TenantSetupController } from './tenant-setup.controller';

@Module({
  controllers: [TenantSetupController],
})
export class TenantSetupModule {}
