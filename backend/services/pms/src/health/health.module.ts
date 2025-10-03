import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { DatabaseModule } from '@zeal/shared-database';

@Module({
  imports: [DatabaseModule],
  controllers: [HealthController],
})
export class HealthModule {}

