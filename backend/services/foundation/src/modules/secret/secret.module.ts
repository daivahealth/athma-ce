import { Module } from '@nestjs/common';
import { SecretController, SecretInternalController } from './secret.controller';
import { SecretService } from './secret.service';
import { SecretCryptoService } from './secret-crypto.service';
import { FoundationDatabaseModule } from '@zeal/database-foundation';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [FoundationDatabaseModule, AuthModule],
  controllers: [SecretController, SecretInternalController],
  providers: [SecretService, SecretCryptoService],
  exports: [SecretService],
})
export class SecretModule {}
