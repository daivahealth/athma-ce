import { Module } from '@nestjs/common';
import { FoundationDatabaseModule } from '@zeal/database-foundation';
import { AccessRequestController } from './access-request.controller';
import { AccessRequestService } from './access-request.service';

@Module({
  imports: [FoundationDatabaseModule],
  controllers: [AccessRequestController],
  providers: [AccessRequestService],
})
export class AccessRequestModule {}
