import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { HealthController } from './modules/health/health.controller';
import { CorrelationService } from './modules/correlation/correlation.service';
import { CorrelationController } from './modules/correlation/correlation.controller';
import { CallbackService } from './modules/callback/callback.service';
import { AbdmCallbackVerifier } from './modules/callback/callback-verifier';
import { CallbackController, QuarantineController } from './modules/callback/callback.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] })],
  controllers: [HealthController, CorrelationController, CallbackController, QuarantineController],
  providers: [PrismaService, CorrelationService, CallbackService, AbdmCallbackVerifier],
})
export class AppModule {}
