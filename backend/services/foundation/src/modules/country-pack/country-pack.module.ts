import { Module } from '@nestjs/common';
import { CountryPackController } from './country-pack.controller';
import { CountryPackService } from './country-pack.service';
import { FoundationDatabaseModule } from '@zeal/database-foundation';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule as AppConfigModule } from '../config/config.module';

@Module({
  imports: [FoundationDatabaseModule, AuthModule, AppConfigModule],
  controllers: [CountryPackController],
  providers: [CountryPackService],
})
export class CountryPackModule {}
