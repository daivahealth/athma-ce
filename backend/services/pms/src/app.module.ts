import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestContextModule } from '@zeal/shared-utils';

@Module({
  imports: [RequestContextModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
