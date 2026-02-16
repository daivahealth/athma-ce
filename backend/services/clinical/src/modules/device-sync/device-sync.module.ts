import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '@zeal/database-clinical';

// Connectors
import { AppleHealthConnector } from './connectors/apple-health.connector';
import { FitbitConnector } from './connectors/fitbit.connector';
import { OuraConnector } from './connectors/oura.connector';
import { DexcomConnector, LibreConnector } from './connectors/cgm.connector';

// Services
import { DeviceSyncOrchestratorService } from './services/device-sync-orchestrator.service';

// Controllers
import { DeviceSyncController } from './controllers/device-sync.controller';

@Module({
  imports: [ConfigModule],
  controllers: [DeviceSyncController],
  providers: [
    PrismaService,
    ConfigService,
    // Connectors
    AppleHealthConnector,
    FitbitConnector,
    OuraConnector,
    DexcomConnector,
    LibreConnector,
    // Services
    DeviceSyncOrchestratorService,
  ],
  exports: [
    DeviceSyncOrchestratorService,
    AppleHealthConnector,
    FitbitConnector,
    OuraConnector,
    DexcomConnector,
    LibreConnector,
  ],
})
export class DeviceSyncModule {}
