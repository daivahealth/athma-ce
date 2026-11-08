import { Module } from '@nestjs/common';
import { FoundationDatabaseModule } from '@zeal/database-foundation';
import { AuthModule } from '../auth/auth.module';
import { SandboxController } from './sandbox.controller';
import { SandboxService } from './sandbox.service';

@Module({
  imports: [FoundationDatabaseModule, AuthModule],
  controllers: [SandboxController],
  providers: [SandboxService],
})
export class SandboxModule {}
