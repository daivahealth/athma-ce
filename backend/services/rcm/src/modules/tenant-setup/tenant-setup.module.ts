import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import { TenantSetupController } from './tenant-setup.controller';

@Module({
  controllers: [TenantSetupController],
  providers: [PrismaService],
})
export class TenantSetupModule {}
