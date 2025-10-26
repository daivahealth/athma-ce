import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { FoundationDatabaseModule } from '@zeal/database-foundation';

@Module({
  imports: [FoundationDatabaseModule],
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
