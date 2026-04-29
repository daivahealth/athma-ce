import { Module } from '@nestjs/common';
import { PluginController } from './plugin.controller';
import { PluginService } from './plugin.service';
import { FoundationDatabaseModule } from '@zeal/database-foundation';

@Module({
  imports: [FoundationDatabaseModule],
  controllers: [PluginController],
  providers: [PluginService],
  exports: [PluginService],
})
export class PluginModule {}
