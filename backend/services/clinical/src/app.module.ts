import { Module } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';
import { RequestContextModule } from '@zeal/shared-utils';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ClinicalDatabaseModule, RequestContextModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
