import { Module } from '@nestjs/common';
import { RcmDatabaseModule } from '@zeal/database-rcm';
import { RequestContextModule } from '@zeal/shared-utils';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [RcmDatabaseModule, RequestContextModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
