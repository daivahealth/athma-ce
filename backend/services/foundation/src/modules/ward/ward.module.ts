import { Module } from '@nestjs/common';
import { WardService } from './ward.service';
import { WardController, WardStandaloneController } from './ward.controller';
import { WardRepository } from './ward.repository';
import { DatabaseModule } from '@zeal/shared-database';

@Module({
  imports: [DatabaseModule],
  controllers: [WardController, WardStandaloneController],
  providers: [WardService, WardRepository],
  exports: [WardService, WardRepository],
})
export class WardModule {}
