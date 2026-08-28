import { Module } from '@nestjs/common';
import { PluginController, PluginInternalController } from './plugin.controller';
import { PluginService } from './plugin.service';
import { FoundationDatabaseModule } from '@zeal/database-foundation';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [FoundationDatabaseModule, AuthModule],
  controllers: [PluginController, PluginInternalController],
  providers: [PluginService],
  exports: [PluginService],
})
export class PluginModule {}
