import { Module } from '@nestjs/common';
import { FoundationDatabaseModule } from '@zeal/database-foundation';
import { MailModule } from '../../common/mail/mail.module';
import { AccessRequestController } from './access-request.controller';
import { AccessRequestService } from './access-request.service';

@Module({
  imports: [FoundationDatabaseModule, MailModule],
  controllers: [AccessRequestController],
  providers: [AccessRequestService],
})
export class AccessRequestModule {}
