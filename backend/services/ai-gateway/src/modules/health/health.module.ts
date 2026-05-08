import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { ConfigClientService } from '../../shared/llm-client/config-client.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService, ConfigClientService],
})
export class HealthModule {}
