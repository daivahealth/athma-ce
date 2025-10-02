import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { SharedDatabaseModule } from '../shared/database.module';

@Module({
  imports: [SharedDatabaseModule],
  controllers: [HealthController],
})
export class HealthModule {}
